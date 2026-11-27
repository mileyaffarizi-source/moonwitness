import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "tsconfig.base.json",
  ".nvmrc",
  ".npmrc",
];

for (const file of requiredFiles) {
  await access(resolve(file));
}

const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (pkg.packageManager !== "pnpm@10.8.1") {
  throw new Error("packageManager must remain pinned to pnpm@10.8.1");
}
if (pkg.engines?.node !== ">=22.14.0 <23") {
  throw new Error("Node.js engine range does not match the repository baseline");
}

const tasks = JSON.parse(await readFile("tasks.json", "utf8"));
if (!Array.isArray(tasks.tasks)) {
  throw new Error("tasks.json must expose a top-level tasks array");
}

const ids = new Set();
for (const task of tasks.tasks) {
  if (!task.id || typeof task.id !== "string") {
    throw new Error("Every task must have a non-empty string id");
  }
  if (ids.has(task.id)) {
    throw new Error(`Duplicate task id: ${task.id}`);
  }
  ids.add(task.id);
}

console.log(`Repository baseline valid; ${ids.size} task IDs checked.`);
