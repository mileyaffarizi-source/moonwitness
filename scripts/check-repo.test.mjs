import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";

test("workspace package manager is pinned", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.packageManager, "pnpm@12.24.0");
});

test("pnpm 12 project settings live in pnpm-workspace.yaml", async () => {
  const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
  for (const setting of [
    "engineStrict: true",
    "saveExact: true",
    "minimumReleaseAge: 1440",
    "blockExoticSubdeps: true",
    "strictDepBuilds: true",
  ]) {
    assert.ok(workspace.includes(setting), "missing pnpm workspace setting: " + setting);
  }
  await assert.rejects(access(new URL("../.npmrc", import.meta.url)));
});

test("workspace patterns include apps and packages", async () => {
  const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
  assert.ok(workspace.includes("apps/*"));
  assert.ok(workspace.includes("packages/*"));
});

test("task registry is valid JSON with unique task IDs", async () => {
  const registry = JSON.parse(await readFile(new URL("../tasks.json", import.meta.url), "utf8"));
  assert.ok(Array.isArray(registry.tasks));
  const ids = registry.tasks.map((task) => task.id);
  assert.ok(ids.every((id) => typeof id === "string" && id.length > 0));
  assert.equal(new Set(ids).size, ids.length);
});

test("add-on standard and task sequence are part of the repository baseline", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.scripts["lint:addons"], "node scripts/architecture/addon-lint.mjs");
  assert.ok(pkg.scripts.check.includes("pnpm lint:addons"));
  assert.equal(pkg.scripts["lint:workflows"], "node scripts/architecture/workflow-lint.mjs");
  assert.ok(pkg.scripts.check.includes("pnpm lint:workflows"));

  const registry = JSON.parse(await readFile(new URL("../tasks.json", import.meta.url), "utf8"));
  assert.equal(registry.project.task_count, registry.tasks.length);
  const tasks = new Map(registry.tasks.map((task) => [task.id, task]));
  assert.ok(tasks.get("ADD-001").dependencies.includes("ADD-012"));
  assert.ok(tasks.get("ADD-002").dependencies.includes("GOV-010"));

  const adr = await readFile(new URL("../docs/adr/ADR-0003-addon-runtime-and-trust-boundary.md", import.meta.url), "utf8");
  assert.match(adr, /Status:\*\* Proposed/);
  assert.match(adr, /Third-party add-ons remain disabled/);
});

test("agent contract and focused skills are present", async () => {
  const agent = await readFile(new URL("../AGENTS.md", import.meta.url), "utf8");
  assert.match(agent, /Token and context budget/);
  assert.match(agent, /Anti-slop engineering/);

  const root = new URL("../.agents/skills/", import.meta.url);
  const entries = await readdir(root, { withFileTypes: true });
  const skills = entries.filter((entry) => entry.isDirectory());
  assert.ok(skills.length >= 8);
  for (const skill of skills) {
    const content = await readFile(new URL(`../.agents/skills/${skill.name}/SKILL.md`, import.meta.url), "utf8");
    const lines = content.split(/\r?\n/);
    assert.equal(lines[0], "---");
    assert.ok(lines.includes("---", 1));
    assert.ok(lines.some((line) => /^name:\s*\S+/.test(line)));
    assert.ok(lines.some((line) => /^description:\s*\S+/.test(line)));
  }
});

test("Node runtime pins are aligned to Node.js 26 Active LTS", async () => {
  const [pkg, nvm, nodeVersion] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.nvmrc", import.meta.url), "utf8"),
    readFile(new URL("../.node-version", import.meta.url), "utf8"),
  ]);
  const manifest = JSON.parse(pkg);
  assert.equal(nvm.trim(), "26.13.0");
  assert.equal(nodeVersion.trim(), "26.13.0");
  assert.equal(manifest.engines.node, ">=26.13.0 <27");
});

test("GitHub security and release automation have non-overlapping active owners", async () => {
  const [dependencyReview, secrets, workflowSecurity, releaseWorkflow, releaseFiles, adr] = await Promise.all([
    readFile(new URL("../.github/workflows/dependency-review.yml", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/secrets.yml", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/workflow-security.yml", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/release-please.yml", import.meta.url), "utf8"),
    readdir(new URL("../.github/workflows/", import.meta.url)),
    readFile(new URL("../docs/adr/ADR-0004-node26-lts-and-github-automation.md", import.meta.url), "utf8"),
  ]);

  assert.ok(dependencyReview.includes("actions/dependency-review-action@a1d282b36b6f3519aa1f3fc636f609c47dddb294"));
  assert.ok(dependencyReview.includes("fail-on-severity: high"));
  assert.ok(dependencyReview.includes("a1d282b36b6f3519aa1f3fc636f609c47dddb294"));
  assert.ok(!dependencyReview.includes("DEPENDENCY_REVIEW_ENABLED"));
  assert.ok(secrets.includes("gitleaks/gitleaks-action@e0c47f4f8be36e29cdc102c57e68cb5cbf0e8d1e"));
  assert.ok(secrets.includes("fetch-depth: 0"));
  assert.ok(secrets.includes("3d3c42e5aac5ba805825da76410c181273ba90b1"));
  assert.ok(workflowSecurity.includes('ZIZMOR_VERSION: "1.32.0"'));
  assert.ok(workflowSecurity.includes("68559e99cc807c1eb7e9238fd43a15bba460eec2"));
  assert.ok(workflowSecurity.includes('uvx "zizmor@${ZIZMOR_VERSION}"') && workflowSecurity.includes("--format=github"));
  assert.ok(workflowSecurity.includes("3d3c42e5aac5ba805825da76410c181273ba90b1"));
  assert.ok(secrets.includes("REVIEWED_EXCEPTION_GITLEAKS_COMMENT_ONLY"));
  assert.ok(releaseWorkflow.includes("googleapis/release-please-action@45996ed1f6d02564a971a2fa1b5860e934307cf7"));

  const changelogWorkflows = releaseFiles.filter((name) => /(?:release|changelog)/i.test(name) && name.endsWith(".yml"));
  assert.deepEqual(changelogWorkflows, ["release-please.yml"]);
  assert.match(adr, /Status:\*\* Accepted/);
  assert.match(adr, /Node.js 26 Active LTS/);
});

test("Dependabot update groups enforce a seven-day version-update cooldown", async () => {
  const config = await readFile(new URL("../.github/dependabot.yml", import.meta.url), "utf8");
  assert.equal((config.match(/default-days: 7/g) ?? []).length, 2);
});
