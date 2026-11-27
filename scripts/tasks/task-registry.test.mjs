import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  calculateReadiness,
  pathsOverlap,
  validateTaskRegistry,
} from "./task-registry.mjs";

const timestamp = "2026-11-27T10:00:00.000Z";

function makeTask(id, overrides = {}) {
  return {
    id,
    title: `Task ${id}`,
    workstream: "TEST",
    blueprint: "TEST.md",
    phase: "PHASE-00",
    priority: "P0",
    status: "pending",
    owner_role: "test_owner",
    assigned_agent: null,
    claim: {
      agent_id: null,
      claimed_at: null,
      lease_expires_at: null,
      worktree: null,
      branch: null,
      owned_paths: [],
    },
    objective: "Verify the task registry validator.",
    scope_in: ["Validate task input."],
    scope_out: ["Do not modify unrelated data."],
    dependencies: [],
    inputs: ["tasks.json"],
    implementation_steps: ["Validate input.", "Return diagnostics."],
    deliverables: ["validator"],
    acceptance_criteria: ["Invalid registries are rejected."],
    verification: ["Unit tests"],
    file_ownership: [`scripts/tasks/${id}/**`],
    estimate: "S",
    parallel_group: "TEST",
    human_approval_required: false,
    evidence: [],
    blocker: null,
    notes: [],
    created_at: null,
    updated_at: null,
    completed_at: null,
    ...overrides,
  };
}

function makeRegistry(tasks) {
  return {
    schema_version: "1.0.0",
    registry_id: "TEST-REGISTRY",
    project: {},
    execution_policy: {},
    global_gates: [],
    workstreams: [],
    tasks,
  };
}

function errorCodes(result) {
  return result.errors.map((error) => error.code);
}

test("validates a minimal dependency graph and calculates readiness", () => {
  const completed = makeTask("A", {
    status: "done",
    evidence: ["commit:abc123"],
    completed_at: timestamp,
  });
  const pending = makeTask("B", { dependencies: ["A"] });
  const registry = makeRegistry([completed, pending]);

  const result = validateTaskRegistry(registry);

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.task_count, 2);
  assert.equal(result.summary.ready_count, 1);
  assert.equal(calculateReadiness(registry).find((item) => item.id === "B").status, "ready");
});

test("rejects duplicate task IDs", () => {
  const result = validateTaskRegistry(makeRegistry([makeTask("A"), makeTask("A")]));
  assert.ok(errorCodes(result).includes("DUPLICATE_ID"));
});

test("rejects missing dependencies", () => {
  const result = validateTaskRegistry(makeRegistry([makeTask("A", { dependencies: ["MISSING"] })]));
  assert.ok(errorCodes(result).includes("MISSING_DEPENDENCY"));
});

test("rejects duplicate dependency edges", () => {
  const result = validateTaskRegistry(makeRegistry([makeTask("A", { dependencies: ["B", "B"] }), makeTask("B")]));
  assert.ok(errorCodes(result).includes("DUPLICATE_DEPENDENCY"));
});

test("rejects self dependencies and dependency cycles", () => {
  const self = validateTaskRegistry(makeRegistry([makeTask("A", { dependencies: ["A"] })]));
  assert.ok(errorCodes(self).includes("SELF_DEPENDENCY"));

  const cycle = validateTaskRegistry(makeRegistry([
    makeTask("A", { dependencies: ["B"] }),
    makeTask("B", { dependencies: ["C"] }),
    makeTask("C", { dependencies: ["A"] }),
  ]));
  assert.ok(errorCodes(cycle).includes("DEPENDENCY_CYCLE"));
});

test("rejects invalid task statuses", () => {
  const result = validateTaskRegistry(makeRegistry([makeTask("A", { status: "completed" })]));
  assert.ok(errorCodes(result).includes("INVALID_STATUS"));
});

test("done requires completion time, evidence and required approval", () => {
  const result = validateTaskRegistry(makeRegistry([makeTask("A", {
    status: "done",
    human_approval_required: true,
  })]));
  assert.ok(errorCodes(result).includes("DONE_WITHOUT_EVIDENCE"));
  assert.ok(errorCodes(result).includes("DONE_WITHOUT_COMPLETION_TIME"));
  assert.ok(errorCodes(result).includes("DONE_WITHOUT_APPROVAL"));
});

test("approval-gated pending tasks are not claim-ready without recorded approval", () => {
  const registry = makeRegistry([makeTask("A", { human_approval_required: true })]);
  const result = validateTaskRegistry(registry);
  assert.equal(result.valid, true);
  assert.equal(calculateReadiness(registry)[0].status, "approval_required");
});

test("approval record unlocks a dependency-ready task", () => {
  const registry = makeRegistry([makeTask("A", {
    human_approval_required: true,
    approval: {
      approved_by: "repository_owner",
      approved_at: timestamp,
      scope: "Implement the bounded read-only task validator.",
      evidence: "Explicit owner approval recorded for this exact task scope.",
    },
  })]);
  const result = validateTaskRegistry(registry);
  assert.equal(result.valid, true);
  assert.equal(calculateReadiness(registry)[0].status, "ready");
});

test("rejects active claim path collisions", () => {
  const active = makeTask("A", {
    status: "claimed",
    claim: {
      agent_id: "worker-a",
      claimed_at: timestamp,
      lease_expires_at: "2026-11-27T11:00:00.000Z",
      worktree: "../worktrees/a",
      branch: "worker/a",
      owned_paths: ["apps/api/src/**"],
    },
  });
  const pending = makeTask("B", { file_ownership: ["apps/api/src/routes/**"] });
  const result = validateTaskRegistry(makeRegistry([active, pending]));

  assert.ok(errorCodes(result).includes("ACTIVE_PATH_COLLISION"));
  assert.equal(calculateReadiness(makeRegistry([active, pending])).find((item) => item.id === "B").status, "claimed_path_conflict");
});

test("path overlap is conservative for parent, child and wildcard scopes", () => {
  assert.equal(pathsOverlap("apps/**", "apps/api/src/**"), true);
  assert.equal(pathsOverlap("apps/api/src", "apps/api/src/routes/**"), true);
  assert.equal(pathsOverlap("docs/architecture/**", "docs/security/**"), false);
});

test("validates the repository's canonical 234-task registry", async () => {
  const registry = JSON.parse(await readFile(new URL("../../tasks.json", import.meta.url), "utf8"));
  const result = validateTaskRegistry(registry);
  assert.equal(result.valid, true, result.errors.map((error) => `${error.code} ${error.path}: ${error.message}`).join("\n"));
  assert.equal(result.summary.task_count, 234);
});

test("schema document is valid JSON and declares forward-compatible task fields", async () => {
  const schema = JSON.parse(await readFile(new URL("./task-registry.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$defs.task.properties.approval.$ref, "#/$defs/approval");
  assert.equal(schema.$defs.task.additionalProperties, true);
});
