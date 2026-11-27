import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(".");
const TEXT_EXTENSIONS = new Set([".cjs", ".css", ".html", ".js", ".json", ".md", ".mdx", ".mjs", ".ps1", ".sh", ".sql", ".toml", ".ts", ".tsx", ".txt", ".xml", ".yaml", ".yml"]);
const FORMAT_EXTENSIONS = new Set([".cjs", ".css", ".html", ".js", ".json", ".md", ".mdx", ".mjs", ".ps1", ".sh", ".sql", ".toml", ".ts", ".tsx", ".txt", ".xml", ".yaml", ".yml"]);
const JS_EXTENSIONS = new Set([".cjs", ".js", ".mjs"]);
const MD_EXTENSIONS = new Set([".md", ".mdx"]);

export function inspectFormat(path, content) {
  const ext = extname(path).toLowerCase();
  if (!FORMAT_EXTENSIONS.has(ext)) return [];
  const issues = [];
  if (content.startsWith("\uFEFF")) issues.push({ code: "UTF8_BOM", line: 1 });
  if (/\r/.test(content)) issues.push({ code: "LINE_ENDING", line: 1 });
  if (content.length > 0 && !content.endsWith("\n")) {
    issues.push({ code: "FINAL_NEWLINE", line: content.split("\n").length });
  }
  if (!MD_EXTENSIONS.has(ext)) {
    content.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n").forEach((line, index) => {
      if (/[ \t]+$/.test(line)) issues.push({ code: "TRAILING_WHITESPACE", line: index + 1 });
      if (/^\t+/.test(line)) issues.push({ code: "TAB_INDENT", line: index + 1 });
    });
  }
  return issues;
}

export function inspectMarkdownFences(content) {
  const lines = content.split(/\r?\n/);
  let opening = null;
  const issues = [];
  lines.forEach((line, index) => {
    const match = line.match(/^ {0,3}(\x60{3,}|~{3,})(.*)$/);
    if (!match) return;
    const marker = match[1][0];
    const length = match[1].length;
    if (opening === null) {
      opening = { marker, length, line: index + 1 };
      return;
    }
    if (marker === opening.marker && length >= opening.length && match[2].trim() === "") {
      opening = null;
    }
  });
  if (opening !== null) {
    issues.push({ code: "UNCLOSED_CODE_FENCE", line: opening.line, message: "An opened Markdown code fence is not closed." });
  }
  return issues;
}

export function validateTypeScriptGate({ files, packageJson, hasRootTsconfig }) {
  const tsFiles = files.filter((file) => /\.(ts|tsx)$/.test(file) && !file.endsWith(".d.ts"));
  if (tsFiles.length === 0) return { skipped: true, errors: [] };
  const errors = [];
  if (!packageJson.devDependencies?.typescript && !packageJson.dependencies?.typescript) {
    errors.push("TypeScript source exists but TypeScript is not pinned in package.json.");
  }
  if (!hasRootTsconfig) errors.push("TypeScript source exists but root tsconfig.json is missing.");
  return { skipped: false, errors };
}

export function validateRootContracts({ packageJson, editorConfig, agents, ci }) {
  const errors = [];
  if (packageJson.packageManager !== "pnpm@12.24.0") errors.push("packageManager must remain pnpm@12.24.0.");
  if (packageJson.engines?.node !== ">=26.13.0 <27") errors.push("Node engine range must remain >=26.13.0 <27.");
  const checkScript = String(packageJson.scripts?.check ?? "");
  if (!checkScript.includes("pnpm lint") || !checkScript.includes("pnpm lint:addons") || !checkScript.includes("pnpm lint:workflows") || !checkScript.includes("pnpm test")) {
    errors.push("The canonical check script must include repository lint, add-on lint and tests.");
  }
  if (packageJson.scripts?.["lint:addons"] !== "node scripts/architecture/addon-lint.mjs") {
    errors.push("The root lint:addons script must invoke the canonical add-on policy linter.");
  }
  if (packageJson.scripts?.["lint:workflows"] !== "node scripts/architecture/workflow-lint.mjs") {
    errors.push("The root lint:workflows script must invoke the immutable GitHub Actions policy linter.");
  }
  if (/\bbun\b/i.test(JSON.stringify(packageJson.scripts ?? {}))) errors.push("Do not add Bun commands; pnpm is canonical.");

  for (const rule of [/^root\s*=\s*true$/m, /^charset\s*=\s*utf-8$/m, /^end_of_line\s*=\s*lf$/m, /^insert_final_newline\s*=\s*true$/m]) {
    if (!rule.test(editorConfig)) errors.push("Missing required EditorConfig rule: " + rule.source);
  }
  for (const rule of ["Inspect before changing.", "Use the task ledger.", "Security by default.", "Anti-slop engineering and product craft", "Token and context budget", "Mandatory quality gate"]) {
    if (!agents.includes(rule)) errors.push("AGENTS.md is missing rule: " + rule);
  }
  if (!ci.includes("pnpm install --frozen-lockfile")) errors.push("CI must use a frozen lockfile install.");
  for (const action of ["actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1", "pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413", "actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1"]) {
    if (!ci.includes(action)) errors.push("CI must use the Node 26-compatible action baseline: " + action);
  }
  if (!/run:\s*pnpm check\b/.test(ci)) errors.push("CI must run the canonical pnpm check command.");
  return errors;
}

async function collectFiles() {
  const result = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: ROOT, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status === 0) {
    return [...new Set(result.stdout.split("\0").filter(Boolean))]
      .filter((path) => TEXT_EXTENSIONS.has(extname(path).toLowerCase())).sort();
  }

  async function walk(directory) {
    const output = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if ([".git", "node_modules", ".next", "dist", "build", "coverage", "target"].includes(entry.name)) continue;
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) output.push(...await walk(absolute));
      else if (entry.isFile() && TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
        output.push(relative(ROOT, absolute).replaceAll("\\", "/"));
      }
    }
    return output;
  }
  return (await walk(ROOT)).sort();
}

async function required(path) {
  return readFile(resolve(ROOT, path), "utf8");
}

async function runFormat(files) {
  let count = 0;
  for (const path of files) {
    const content = await readFile(resolve(ROOT, path), "utf8");
    for (const issue of inspectFormat(path, content)) {
      process.stderr.write(path + ":" + issue.line + ": " + issue.code + "\n");
      count += 1;
    }
  }
  if (count) process.stderr.write("Format gate failed with " + count + " issue(s).\n");
  else process.stdout.write("Format gate passed: UTF-8, LF, final newline and whitespace checks.\n");
  return count ? 1 : 0;
}

async function runLint(files) {
  const errors = [];
  let jsonCount = 0;
  let jsCount = 0;
  let markdownCount = 0;
  for (const path of files) {
    const ext = extname(path).toLowerCase();
    const absolute = resolve(ROOT, path);
    const content = await readFile(absolute, "utf8");
    if (ext === ".json") {
      jsonCount += 1;
      try { JSON.parse(content); } catch (error) { errors.push(path + ": INVALID_JSON: " + error.message); }
    }
    if (JS_EXTENSIONS.has(ext)) {
      jsCount += 1;
      const check = spawnSync(process.execPath, ["--check", absolute], { cwd: ROOT, encoding: "utf8" });
      if (check.status !== 0) errors.push(path + ": JAVASCRIPT_SYNTAX: " + (check.stderr || check.stdout || "node --check failed").trim());
    }
    if (MD_EXTENSIONS.has(ext)) {
      markdownCount += 1;
      for (const issue of inspectMarkdownFences(content)) errors.push(path + ":" + issue.line + ": " + issue.code);
    }
  }

  const [packageText, editorConfig, agents, ci] = await Promise.all([
    required("package.json"), required(".editorconfig"), required("AGENTS.md"), required(".github/workflows/ci.yml"),
  ]);
  let packageJson = {};
  try { packageJson = JSON.parse(packageText); } catch (error) { errors.push("package.json: " + error.message); }
  errors.push(...validateRootContracts({ packageJson, editorConfig, agents, ci }));

  if (errors.length) {
    for (const error of errors) process.stderr.write("LINT: " + error + "\n");
    process.stderr.write("Repository lint failed with " + errors.length + " issue(s).\n");
    return 1;
  }
  process.stdout.write("Repository lint passed: " + files.length + " text files, " + jsonCount + " JSON, " + jsCount + " JavaScript, " + markdownCount + " Markdown.\n");
  return 0;
}

async function runTypecheck(files) {
  const packageJson = JSON.parse(await required("package.json"));
  const result = validateTypeScriptGate({
    files,
    packageJson,
    hasRootTsconfig: existsSync(resolve(ROOT, "tsconfig.json")),
  });
  if (result.errors.length) {
    for (const error of result.errors) process.stderr.write("TYPECHECK: " + error + "\n");
    return 1;
  }
  if (result.skipped) {
    process.stdout.write("Typecheck SKIPPED: no TypeScript implementation exists. This becomes mandatory when .ts/.tsx source is added.\n");
    return 0;
  }

  const compiler = resolve(ROOT, "node_modules/typescript/bin/tsc");
  if (!existsSync(compiler)) {
    process.stderr.write("TYPECHECK: TypeScript is declared but compiler is not installed.\n");
    return 1;
  }
  const check = spawnSync(process.execPath, [compiler, "--noEmit", "-p", "tsconfig.json"], {
    cwd: ROOT, encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  });
  if (check.stdout) process.stdout.write(check.stdout);
  if (check.stderr) process.stderr.write(check.stderr);
  if (check.status !== 0) return 1;
  process.stdout.write("TypeScript check passed.\n");
  return 0;
}

async function main() {
  const mode = process.argv[2] ?? "all";
  if (!["lint", "format", "typecheck", "all"].includes(mode)) {
    process.stderr.write("Usage: node scripts/quality/quality-gate.mjs [lint|format|typecheck|all]\n");
    process.exitCode = 2;
    return;
  }
  const files = await collectFiles();
  const results = [];
  if (mode === "lint" || mode === "all") results.push(await runLint(files));
  if (mode === "format" || mode === "all") results.push(await runFormat(files));
  if (mode === "typecheck" || mode === "all") results.push(await runTypecheck(files));
  process.exitCode = results.some((code) => code !== 0) ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write("Quality gate could not run: " + error.message + "\n");
    process.exitCode = 2;
  });
}
