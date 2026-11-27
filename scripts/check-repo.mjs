import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "tsconfig.base.json",
  ".nvmrc",
  ".npmrc",
  "AGENTS.md",
  ".agents/skills/README.md",
];

for (const file of requiredFiles) await access(resolve(file));

const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (pkg.packageManager !== "pnpm@10.8.1") {
  throw new Error("packageManager must remain pinned to pnpm@10.8.1");
}
if (pkg.engines?.node !== ">=22.14.0 <23") {
  throw new Error("Node.js engine range does not match the repository baseline");
}

const tasks = JSON.parse(await readFile("tasks.json", "utf8"));
if (!Array.isArray(tasks.tasks)) throw new Error("tasks.json must expose a top-level tasks array");

const ids = new Set();
for (const task of tasks.tasks) {
  if (!task.id || typeof task.id !== "string") throw new Error("Every task must have a non-empty string id");
  if (ids.has(task.id)) throw new Error(`Duplicate task id: ${task.id}`);
  ids.add(task.id);
}

const skillRoot = resolve(".agents/skills");
const entries = await readdir(skillRoot, { withFileTypes: true });
const skillNames = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const path = resolve(skillRoot, entry.name, "SKILL.md");
  await access(path);
  const content = await readFile(path, "utf8");
  const frontmatter = content.match(/^---\\r?\\n([\\s\\S]*?)\\r?\\n---/);
  if (!frontmatter || !/^name:\\s*\\S+/m.test(frontmatter[1]) || !/^description:\\s*\\S+/m.test(frontmatter[1])) {
    throw new Error(`Invalid skill metadata: ${entry.name}/SKILL.md`);
  }
  skillNames.push(entry.name);
}
if (skillNames.length < 8) throw new Error("Skill pack is incomplete (expected at least 8 focused skills)");

const index = await readFile(resolve(skillRoot, "README.md"), "utf8");
for (const name of skillNames) {
  if (!index.includes(`./${name}/SKILL.md`)) throw new Error(`Skill missing from index: ${name}`);
}

console.log(`Repository valid; ${ids.size} task IDs and ${skillNames.length} skills checked.`);
