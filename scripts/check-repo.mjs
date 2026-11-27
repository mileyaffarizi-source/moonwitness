import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const requiredFiles = [
  "package.json", "pnpm-workspace.yaml", "pnpm-lock.yaml",
  "tsconfig.base.json", ".nvmrc", ".node-version", ".npmrc", "AGENTS.md",
  ".agents/skills/README.md",
];
for (const file of requiredFiles) await access(resolve(file));

const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (pkg.packageManager !== "pnpm@12.24.0") throw new Error("packageManager must remain pinned to pnpm@10.8.1");
if (pkg.engines?.node !== ">=24.22.3 <25") throw new Error("Node.js engine range does not match the repository baseline");

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
if (nodeVersion.trim() !== "24.22.3") {
  throw new Error("Node.js must remain pinned to the audited 22.14.0 baseline");
}

const npmConfig = new Set((await readFile(".npmrc", "utf8")).split("\n").map((line) => line.trim()));
for (const setting of ["engine-strict=true", "save-exact=true"]) {
  if (!npmConfig.has(setting)) throw new Error(".npmrc must include " + setting);
}

const workspaceLines = (await readFile("pnpm-workspace.yaml", "utf8")).split("\n").map((line) => line.trim());
for (const pattern of ['- "apps/*"', '- "packages/*"']) {
  if (!workspaceLines.includes(pattern)) throw new Error("pnpm-workspace.yaml must include " + pattern);
}

const lockfile = await readFile("pnpm-lock.yaml", "utf8");
if (lockfile.split("\n")[0].trim() !== "lockfileVersion: '9.0'" || !lockfile.includes("importers:")) {
  throw new Error("pnpm-lock.yaml must be a valid pnpm v9/v10-compatible workspace lockfile");
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
