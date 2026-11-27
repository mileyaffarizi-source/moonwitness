import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("workspace package manager is pinned", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.packageManager, "pnpm@10.8.1");
});

test("workspace patterns include apps and packages", async () => {
  const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");
  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);
});

test("task registry is valid JSON with unique task IDs", async () => {
  const registry = JSON.parse(await readFile(new URL("../tasks.json", import.meta.url), "utf8"));
  assert.ok(Array.isArray(registry.tasks));
  const ids = registry.tasks.map((task) => task.id);
  assert.ok(ids.every((id) => typeof id === "string" && id.length > 0));
  assert.equal(new Set(ids).size, ids.length);
});
