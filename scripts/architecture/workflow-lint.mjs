import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(".");
const WORKFLOW_ROOT = resolve(ROOT, ".github/workflows");
const REMOTE_ACTION = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*@[a-f0-9]{40}$/;
const LOCAL_ACTION = /^\.\//;
const DOCKER_ACTION = /^docker:\/\/[^@\s]+@sha256:[a-f0-9]{64}$/;

export function validateWorkflowFile(path, content) {
  const errors = [];
  const normalized = content.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  const lines = normalized.split("\n");
  const hasExplicitPermissions = /^permissions:\s*(?:\{\s*\})?\s*$/m.test(normalized);
  const hasConcurrency = /^concurrency:\s*$/m.test(normalized);

  if (!hasExplicitPermissions) {
    errors.push({ code: "MISSING_PERMISSIONS", path, line: 1, message: "Declare least-privilege workflow-level permissions, including permissions: {} when no token is needed." });
  }
  if (!hasConcurrency) {
    errors.push({ code: "MISSING_CONCURRENCY", path, line: 1, message: "Declare a concurrency group to prevent duplicate or stale runs." });
  }
  if (/^\s*pull_request_target\s*:/m.test(normalized)) {
    errors.push({ code: "UNSAFE_PULL_REQUEST_TARGET", path, line: 1, message: "pull_request_target is prohibited; use pull_request with read-only permissions." });
  }
  if (/^\s*continue-on-error:\s*true\b/m.test(normalized)) {
    errors.push({ code: "MASKED_WORKFLOW_FAILURE", path, line: 1, message: "Security and quality jobs must not mask failures with continue-on-error." });
  }

  lines.forEach((line, index) => {
    const match = line.match(/^\s*uses:\s*([^\s#]+)/);
    if (!match) return;
    const reference = match[1];
    if (LOCAL_ACTION.test(reference)) return;
    if (DOCKER_ACTION.test(reference)) return;
    if (!REMOTE_ACTION.test(reference)) {
      errors.push({
        code: "UNPINNED_ACTION",
        path,
        line: index + 1,
        message: "Pin remote action to an immutable 40-character commit SHA, not a mutable tag/branch: " + reference,
      });
    }
  });

  const secretReferences = [...normalized.matchAll(/\$\{\{\s*secrets\.([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g)]
    .map((match) => match[1]);
  const unapprovedSecrets = [...new Set(secretReferences.filter((name) => name !== "GITHUB_TOKEN"))];
  if (unapprovedSecrets.length > 0) {
    errors.push({
      code: "UNDECLARED_SECRET_DEPENDENCY",
      path,
      line: 1,
      message: "Workflow references repository secrets outside the approved GITHUB_TOKEN contract: " + unapprovedSecrets.join(", "),
    });
  }

  const pullRequestTriggered = /^\s*pull_request\s*:/m.test(normalized);
  if (pullRequestTriggered && /^\s*permissions:\s*\n(?:[ \t]+[^\s#][^\n]*\n)*?[ \t]+(?:contents|pull-requests|issues):\s*write\b/m.test(normalized)) {
    const isGitleaksCommentOnlyException =
      normalized.includes("REVIEWED_EXCEPTION_GITLEAKS_COMMENT_ONLY") &&
      normalized.includes("gitleaks/gitleaks-action@") &&
      !/^\s*run:/m.test(normalized);
    if (!isGitleaksCommentOnlyException) {
      errors.push({
        code: "PULL_REQUEST_WRITE_PERMISSION_REVIEW",
        path,
        line: 1,
        message: "Pull-request workflows with write permissions need an explicit reviewed trust-boundary exception; do not execute fork-controlled code with write access.",
      });
    }
  }

  return errors;
}

async function collectWorkflowFiles() {
  const entries = await readdir(WORKFLOW_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.(?:yml|yaml)$/i.test(entry.name))
    .map((entry) => join(WORKFLOW_ROOT, entry.name))
    .sort();
}

export async function validateWorkflowDirectory() {
  const files = await collectWorkflowFiles();
  const errors = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    errors.push(...validateWorkflowFile(relative(ROOT, file).replaceAll("\\", "/"), content));
  }
  return { files: files.length, errors };
}

async function main() {
  const result = await validateWorkflowDirectory();
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      process.stderr.write(error.path + ":" + error.line + ": " + error.code + ": " + error.message + "\n");
    }
    process.stderr.write("Workflow policy failed: " + result.errors.length + " issue(s) across " + result.files + " workflow(s).\n");
    process.exitCode = 1;
    return;
  }
  process.stdout.write("Workflow policy passed: " + result.files + " workflow(s); all remote actions are SHA-pinned and trust/permission checks passed.\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write("Workflow policy could not run: " + error.message + "\n");
    process.exitCode = 2;
  });
}
