import test from "node:test";
import assert from "node:assert/strict";
import { validateWorkflowFile, validateWorkflowDirectory } from "./workflow-lint.mjs";

const SHA = "a".repeat(40);
const base = (step) => [
  "name: Example",
  "on:",
  "  pull_request:",
  "permissions:",
  "  contents: read",
  "concurrency:",
  "  group: example-\${{ github.ref }}",
  "  cancel-in-progress: true",
  "jobs:",
  "  check:",
  "    runs-on: ubuntu-latest",
  "    steps:",
  step,
  "",
].join("\n");

test("accepts SHA-pinned actions and explicit least-privilege policy", () => {
  assert.deepEqual(validateWorkflowFile(".github/workflows/example.yml", base("      uses: owner/action@" + SHA)), []);
});

test("rejects mutable action tags and branch refs", () => {
  const errors = validateWorkflowFile(".github/workflows/example.yml", base("      uses: actions/checkout@v7"));
  assert.ok(errors.some((error) => error.code === "UNPINNED_ACTION"));
});

test("rejects missing explicit permissions and concurrency", () => {
  const content = "name: Example\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n";
  const codes = validateWorkflowFile(".github/workflows/example.yml", content).map((error) => error.code);
  assert.ok(codes.includes("MISSING_PERMISSIONS"));
  assert.ok(codes.includes("MISSING_CONCURRENCY"));
});

test("rejects pull_request_target and masked failures", () => {
  const content = base("      run: echo test") + "\npull_request_target:\n";
  const normalized = content.replace("      run: echo test", "      continue-on-error: true\n      run: echo test");
  const codes = validateWorkflowFile(".github/workflows/example.yml", normalized).map((error) => error.code);
  assert.ok(codes.includes("UNSAFE_PULL_REQUEST_TARGET"));
  assert.ok(codes.includes("MASKED_WORKFLOW_FAILURE"));
});

test("permits local actions and immutable Docker digests", () => {
  assert.deepEqual(validateWorkflowFile(".github/workflows/example.yml", base("      uses: ./\\.github/actions/local")), []);
  assert.deepEqual(
    validateWorkflowFile(".github/workflows/example.yml", base("      uses: docker://ghcr.io/example/tool@sha256:" + "b".repeat(64))),
    [],
  );
});

test("only the GitHub token is permitted as a workflow secret reference", () => {
  const content = base("      env:\n        TOKEN: \${{ secrets.PROVIDER_TOKEN }}");
  const errors = validateWorkflowFile(".github/workflows/example.yml", content);
  assert.ok(errors.some((error) => error.code === "UNDECLARED_SECRET_DEPENDENCY"));
});

test("the current repository workflow directory satisfies the policy", async () => {
  const result = await validateWorkflowDirectory();
  assert.equal(result.errors.length, 0, result.errors.map((error) => error.path + ":" + error.line + " " + error.code + " " + error.message).join("\n"));
  assert.ok(result.files >= 6);
});
