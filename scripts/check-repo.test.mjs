import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

test("workspace package manager is pinned", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.packageManager, "pnpm@12.24.0");
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
