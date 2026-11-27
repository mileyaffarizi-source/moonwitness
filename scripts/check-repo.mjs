import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml",
  "tsconfig.base.json", ".nvmrc", ".node-version", "AGENTS.md",
  ".agents/skills/README.md",
  ".github/dependabot.yml",
  "docs/engineering/GITHUB-AUTOMATION.md",
  "docs/engineering/TASK-DECOMPOSITION-STANDARD.md",
  "docs/architecture/BLUEPRINT-AUDIT-2026-11-28.md",
  ".github/workflows/codeql.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/secrets.yml",
  ".github/workflows/workflow-security.yml",
  ".github/workflows/release-please.yml",
  "release-please-config.json",
  ".release-please-manifest.json",
  "BLUEPRINT-PACKAGE-ADDON.MD",
  "docs/engineering/ADDON-ENGINEERING-STANDARD.md",
  "docs/architecture/addons/addon.manifest.schema.json",
  "docs/architecture/addons/addon.manifest.example.json",
  "docs/adr/ADR-0003-addon-runtime-and-trust-boundary.md",
  "docs/adr/ADR-0004-node26-lts-and-github-automation.md",
  "docs/adr/ADR-0005-node26-patch-refresh.md",
  "docs/adr/ADR-0006-astronauts-arsy-architecture.md",
  "BLUEPRINT-ASTRONAUTS.MD",
  "BLUEPRINT-ARSY.MD",
  "scripts/architecture/addon-lint.mjs",
  "scripts/architecture/addon-lint.test.mjs",
  "scripts/architecture/workflow-lint.mjs",
  "scripts/architecture/workflow-lint.test.mjs",
];
for (const file of requiredFiles) await access(resolve(file));

const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (pkg.packageManager !== "pnpm@12.24.0") throw new Error("packageManager must remain pinned to pnpm@12.24.0");
if (pkg.engines?.node !== ">=26.13.1 <27") throw new Error("Node.js engine range does not match the repository baseline");
if (pkg.engines?.pnpm !== "12.24.0") throw new Error("pnpm engine range must remain pinned to 12.24.0");

const [nvmVersion, nodeVersion] = await Promise.all([
  readFile(".nvmrc", "utf8"),
  readFile(".node-version", "utf8"),
]);
const versionParts = nodeVersion.trim().split(".");
if (versionParts.length !== 3 || versionParts.some((part) => !/^[0-9]+$/.test(part))) {
  throw new Error(".node-version must contain one exact Node.js version");
}
if (nvmVersion.trim() !== nodeVersion.trim()) {
  throw new Error(".nvmrc and .node-version must pin the same Node.js version");
}
if (nodeVersion.trim() !== "26.13.1") {
  throw new Error("Node.js must remain pinned to the current 26.13.1 baseline");
}

const workspaceLines = new Set((await readFile("pnpm-workspace.yaml", "utf8"))
  .split("\n")
  .map((line) => line.trim()));
for (const setting of [
  '- "apps/*"',
  '- "packages/*"',
  "engineStrict: true",
  "saveExact: true",
  "minimumReleaseAge: 1440",
  "blockExoticSubdeps: true",
  "strictDepBuilds: true",
]) {
  if (!workspaceLines.has(setting)) {
    throw new Error("pnpm-workspace.yaml must include " + setting);
  }
}

try {
  const npmrc = await readFile(".npmrc", "utf8");
  const unsupported = npmrc.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("=")[0].trim().toLowerCase())
    .filter((key) => !(
      key === "registry" || key.endsWith(":registry") ||
      ["strict-ssl", "cafile", "ca", "certfile", "keyfile", "proxy", "https-proxy", "local-address"].includes(key) ||
      key.includes("_auth") || key.includes("username") || key.includes("_password") || key.includes("email")
    ));
  if (unsupported.length > 0) {
    throw new Error("pnpm 12 reads non-auth/registry settings from pnpm-workspace.yaml, not .npmrc: " + unsupported.join(", "));
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const ciWorkflow = await readFile(".github/workflows/ci.yml", "utf8");
for (const action of [
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
  "pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413",
  "actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1",
]) {
  if (!ciWorkflow.includes(action)) throw new Error("CI must use the reviewed, immutable Node 26-compatible action pin: " + action);
}

const [codeqlWorkflow, dependencyReviewWorkflow, secretWorkflow, workflowSecurity, releaseWorkflow, dependabotConfig, releaseConfigText, releaseManifestText] = await Promise.all([
  readFile(".github/workflows/codeql.yml", "utf8"),
  readFile(".github/workflows/dependency-review.yml", "utf8"),
  readFile(".github/workflows/secrets.yml", "utf8"),
  readFile(".github/workflows/workflow-security.yml", "utf8"),
  readFile(".github/workflows/release-please.yml", "utf8"),
  readFile(".github/dependabot.yml", "utf8"),
  readFile("release-please-config.json", "utf8"),
  readFile(".release-please-manifest.json", "utf8"),
]);
if (!codeqlWorkflow.includes("github/codeql-action/init@915412ff23e8b7659517e607487dbeae018f2934") ||
    !codeqlWorkflow.includes("github/codeql-action/analyze@915412ff23e8b7659517e607487dbeae018f2934") ||
    !codeqlWorkflow.includes("security-events: write")) {
  throw new Error("CodeQL must use the official v4 analysis actions with the security-events permission");
}
if (!dependencyReviewWorkflow.includes("actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294") ||
    !dependencyReviewWorkflow.includes("fail-on-severity: high") ||
    dependencyReviewWorkflow.includes("DEPENDENCY_REVIEW_ENABLED")) {
  throw new Error("Dependency Review must run on eligible PRs with v5 and fail on high severity; no opt-in flag is permitted");
}
if (!secretWorkflow.includes("gitleaks/gitleaks-action@e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e") ||
    !secretWorkflow.includes("fetch-depth: 0") ||
    !secretWorkflow.includes("GITHUB_TOKEN")) {
  throw new Error("Secret scanning must use Gitleaks v3 with full Git history and the GitHub token");
}
if (!workflowSecurity.includes("astral-sh/setup-uv@68559e99cc807c1eb7e9238fd43a15bba460eec2") ||
    !workflowSecurity.includes('ZIZMOR_VERSION: "1.32.0"') ||
    !workflowSecurity.includes('uvx "zizmor@${ZIZMOR_VERSION}"') ||
    !workflowSecurity.includes("--format=github")) {
  throw new Error("Workflow Security must run the pinned Zizmor version with GitHub annotations");
}

if (!releaseWorkflow.includes("googleapis/release-please-action@45996ed1f6d02564a971a2fa1b5860e934307cf7") ||
    !releaseWorkflow.includes("config-file: release-please-config.json")) {
  throw new Error("Release Please v5 must be the sole changelog/release workflow");
}
if (!dependabotConfig.includes("package-ecosystem: github-actions") ||
    !dependabotConfig.includes("package-ecosystem: npm")) {
  throw new Error("Dependabot must update GitHub Actions and npm/pnpm dependencies");
}
if ((dependabotConfig.match(/default-days: 7/g) ?? []).length !== 2) {
  throw new Error("Both Dependabot update groups must define an explicit seven-day version-update cooldown");
}
const releaseConfig = JSON.parse(releaseConfigText);
const releaseManifest = JSON.parse(releaseManifestText);
if (releaseConfig.packages?.["."]?.["release-type"] !== "node" ||
    releaseManifest["."] !== pkg.version) {
  throw new Error("Release Please root package config/manifest must match package.json version");
}
const automationWorkflows = (await readdir(".github/workflows"))
  .filter((name) => /(?:release|changelog)/i.test(name) && name.endsWith(".yml"));
if (automationWorkflows.length !== 1 || automationWorkflows[0] !== "release-please.yml") {
  throw new Error("Release Please must remain the only changelog/release workflow to prevent duplicate writers");
}

const lockfile = await readFile("pnpm-lock.yaml", "utf8");
const lockfileDocuments = (lockfile.startsWith("---\n") ? lockfile.slice(4) : lockfile).split("\n---\n").map((document) => document.trim()).filter(Boolean);
if (lockfileDocuments.length !== 2 ||
    lockfileDocuments.some((document) => !document.startsWith("lockfileVersion: '9.0'"))) {
  throw new Error("pnpm-lock.yaml must contain valid pnpm v9 two-document boot/project lockfile data");
}
const bootImporter = lockfileDocuments[0];
if (!bootImporter.includes("packageManagerDependencies:") ||
    !bootImporter.includes("specifier: 12.24.0") ||
    !bootImporter.includes("version: 12.24.0")) {
  throw new Error("pnpm-lock.yaml boot document must pin pnpm 12.24.0");
}
const projectLockfile = lockfileDocuments[1];
if (!projectLockfile.includes("settings:") || !projectLockfile.includes("importers:")) {
  throw new Error("pnpm-lock.yaml project document must preserve workspace settings and importers");
}

const rootEntries = new Set(await readdir("."));
const competingLockfiles = ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"]
  .filter((file) => rootEntries.has(file));
if (competingLockfiles.length > 0) {
  throw new Error("Remove competing package-manager lockfiles: " + competingLockfiles.join(", "));
}

const tasks = JSON.parse(await readFile("tasks.json", "utf8"));
if (!Array.isArray(tasks.tasks)) throw new Error("tasks.json must expose a top-level tasks array");
const ids = new Set();
for (const task of tasks.tasks) {
  if (!task.id || typeof task.id !== "string") throw new Error("Every task must have a non-empty string id");
  if (ids.has(task.id)) throw new Error("Duplicate task id: " + task.id);
  ids.add(task.id);
}

if (tasks.project?.task_count !== tasks.tasks.length) {
  throw new Error("tasks.json project.task_count must match the canonical task array length");
}
const addonTasks = new Map(tasks.tasks.filter((task) => task.id.startsWith("ADD-")).map((task) => [task.id, task]));
for (const taskId of ["ADD-001", "ADD-002", "ADD-003", "ADD-004", "ADD-005", "ADD-006", "ADD-007", "ADD-008", "ADD-009", "ADD-010", "ADD-011", "ADD-012"]) {
  if (!addonTasks.has(taskId)) throw new Error("Add-on task missing from the canonical registry: " + taskId);
}
if (!addonTasks.get("ADD-001").dependencies.includes("ADD-012")) {
  throw new Error("ADD-001 must depend on the add-on engineering standard/lint gate ADD-012");
}
if (!addonTasks.get("ADD-002").dependencies.includes("GOV-010")) {
  throw new Error("ADD-002 must remain gated by the identity/trust governance review GOV-010");
}
const addonSchema = JSON.parse(await readFile("docs/architecture/addons/addon.manifest.schema.json", "utf8"));
if (addonSchema.$schema !== "https://json-schema.org/draft/2020-12/schema" || addonSchema.additionalProperties !== false) {
  throw new Error("Add-on manifest schema must be strict JSON Schema draft 2020-12");
}
const addonAdr = await readFile("docs/adr/ADR-0003-addon-runtime-and-trust-boundary.md", "utf8");
const runtimeAdr = await readFile("docs/adr/ADR-0004-node26-lts-and-github-automation.md", "utf8");
if (!addonAdr.includes("Status:** Proposed") || !addonAdr.includes("Third-party add-ons remain disabled")) {
  throw new Error("ADR-0003 must keep unapproved third-party add-on execution disabled");
}
if (!runtimeAdr.includes("Node.js 26 Active LTS") || !runtimeAdr.includes("26.13.0")) {
  throw new Error("ADR-0004 must record the accepted Node.js 26 Active LTS baseline");
}
if (addonSchema.$defs?.compatibility?.properties?.node?.const !== ">=26.13.1 <27.0.0") {
  throw new Error("Add-on manifest schema must enforce the current Node 26 compatibility baseline");
}
if (!pkg.scripts?.["lint:addons"] || !String(pkg.scripts?.check ?? "").includes("pnpm lint:addons")) {
  throw new Error("Root quality gate must execute pnpm lint:addons");
}
if (pkg.scripts?.["lint:workflows"] !== "node scripts/architecture/workflow-lint.mjs" ||
    !String(pkg.scripts?.check ?? "").includes("pnpm lint:workflows")) {
  throw new Error("Root quality gate must execute the immutable GitHub workflow policy lint");
}

const skillRoot = resolve(".agents/skills");
const entries = await readdir(skillRoot, { withFileTypes: true });
const skillNames = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const path = resolve(skillRoot, entry.name, "SKILL.md");
  await access(path);
  const content = await readFile(path, "utf8");
  const lines = content.split("\n").map((line) => line.endsWith("\r") ? line.slice(0, -1) : line);
  const closing = lines.indexOf("---", 1);
  const frontmatter = lines.slice(1, closing);
  if (lines[0] !== "---" || closing < 0 ||
      !frontmatter.some((line) => line.startsWith("name:") && line.slice(5).trim().length > 0) ||
      !frontmatter.some((line) => line.startsWith("description:") && line.slice(12).trim().length > 0)) {
    throw new Error("Invalid skill metadata: " + entry.name + "/SKILL.md");
  }
  skillNames.push(entry.name);
}
if (skillNames.length < 8) throw new Error("Skill pack is incomplete (expected at least 8 focused skills)");

const index = await readFile(resolve(skillRoot, "README.md"), "utf8");
for (const name of skillNames) {
  if (!index.includes("./" + name + "/SKILL.md")) throw new Error("Skill missing from index: " + name);
}
console.log("Repository valid; " + ids.size + " task IDs and " + skillNames.length + " skills checked.");
