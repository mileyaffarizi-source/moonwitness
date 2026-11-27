import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectFormat,
  inspectMarkdownFences,
  validateRootContracts,
  validateTypeScriptGate,
} from "./quality-gate.mjs";

test("format gate accepts UTF-8 LF source with final newline", () => {
  assert.deepEqual(inspectFormat("src/example.mjs", "const value = 1;\n"), []);
});

test("format gate rejects BOM, CRLF and trailing whitespace", () => {
  const issues = inspectFormat("src/example.mjs", "\uFEFFconst value = 1;  \r\n");
  const codes = issues.map((issue) => issue.code);
  assert.ok(codes.includes("UTF8_BOM"));
  assert.ok(codes.includes("LINE_ENDING"));
  assert.ok(codes.includes("TRAILING_WHITESPACE"));
});

test("format gate preserves intentional Markdown hard breaks", () => {
  assert.deepEqual(inspectFormat("docs/example.md", "First line.  \nSecond line.\n"), []);
});

test("Markdown fence checker supports backticks and tildes", () => {
  const fence = String.fromCharCode(96).repeat(3);
  assert.deepEqual(inspectMarkdownFences(fence + "js\nconst x = 1;\n" + fence + "\n\n~~~sh\ntrue\n~~~\n"), []);
});

test("Markdown fence checker reports an unclosed fence at its opening line", () => {
  assert.deepEqual(inspectMarkdownFences("# Guide\n\n~~~js\nconst x = 1;\n"), [{
    code: "UNCLOSED_CODE_FENCE",
    line: 3,
    message: "An opened Markdown code fence is not closed.",
  }]);
});

test("TypeScript gate skips explicitly when no implementation exists", () => {
  const result = validateTypeScriptGate({ files: ["scripts/example.mjs"], packageJson: {}, hasRootTsconfig: false });
  assert.equal(result.skipped, true);
  assert.deepEqual(result.errors, []);
});

test("TypeScript gate fails closed when source is added without compiler and config", () => {
  const result = validateTypeScriptGate({ files: ["apps/web/src/page.tsx"], packageJson: {}, hasRootTsconfig: false });
  assert.equal(result.skipped, false);
  assert.equal(result.errors.length, 2);
});

test("TypeScript gate requires both a pinned compiler and root config", () => {
  const result = validateTypeScriptGate({
    files: ["apps/web/src/page.tsx"],
    packageJson: { devDependencies: { typescript: "5.8.3" } },
    hasRootTsconfig: true,
  });
  assert.equal(result.skipped, false);
  assert.deepEqual(result.errors, []);
});

test("root contract rejects package-manager drift and missing CI gate", () => {
  const errors = validateRootContracts({
    packageJson: { packageManager: "npm@latest", engines: { node: ">=20" }, scripts: { check: "node --test" } },
    editorConfig: "",
    agents: "",
    ci: "",
  });
  assert.ok(errors.length >= 10);
});

test("root contract accepts canonical repository rules", () => {
  const errors = validateRootContracts({
    packageJson: {
      packageManager: "pnpm@12.24.0",
      engines: { node: ">=26.13.0 <27" },
      scripts: { "lint:addons": "node scripts/architecture/addon-lint.mjs", "lint:workflows": "node scripts/architecture/workflow-lint.mjs", check: "pnpm lint && pnpm lint:addons && pnpm lint:workflows && pnpm test" },
    },
    editorConfig: "root = true\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\n",
    agents: "Inspect before changing. Use the task ledger. Security by default. Anti-slop engineering and product craft Token and context budget Mandatory quality gate",
    ci: "uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1\nuses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413\nuses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1\nrun: pnpm install --frozen-lockfile\nrun: pnpm check\n",
  });
  assert.deepEqual(errors, []);
});
