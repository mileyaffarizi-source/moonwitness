import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  calculateReadiness,
  pathsOverlap,
  validateTaskRegistry,
} from "./task-registry.mjs";

const timestamp = "2026-11-27T10:00:00.000Z";

function makeTask(id, overrides = {}) {
  return {
    id,
    task_type: "task",
    parent_task: null,
    child_tasks: [],
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
    project: { task_count: tasks.length, application_count: 0, applications: [] },
    execution_policy: {},
    global_gates: [],
    workstreams: [{ id: "TEST", name: "TEST", task_ids: tasks.map((task) => task.id) }],
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
  const secondActive = makeTask("C", {
    status: "in_progress",
    claim: {
      agent_id: "worker-c",
      claimed_at: timestamp,
      lease_expires_at: "2026-11-27T11:00:00.000Z",
      worktree: "../worktrees/c",
      branch: "worker/c",
      owned_paths: ["apps/api/src/routes/**"],
    },
  });
  const pending = makeTask("B", { file_ownership: ["apps/api/src/routes/**"] });
  const registry = makeRegistry([active, secondActive, pending]);
  const result = validateTaskRegistry(registry);

  assert.ok(errorCodes(result).includes("ACTIVE_PATH_COLLISION"));
  assert.equal(calculateReadiness(registry).find((item) => item.id === "B").status, "claimed_path_conflict");
});

test("path overlap is conservative for parent, child and wildcard scopes", () => {
  assert.equal(pathsOverlap("apps/**", "apps/api/src/**"), true);
  assert.equal(pathsOverlap("apps/api/src", "apps/api/src/routes/**"), true);
  assert.equal(pathsOverlap("docs/architecture/**", "docs/security/**"), false);
});


test("rejects project task and application count drift", () => {
  const taskCountRegistry = makeRegistry([makeTask("A")]);
  taskCountRegistry.project.task_count = 2;
  assert.ok(errorCodes(validateTaskRegistry(taskCountRegistry)).includes("PROJECT_TASK_COUNT_MISMATCH"));

  const appCountRegistry = makeRegistry([makeTask("A")]);
  appCountRegistry.project.application_count = 1;
  assert.ok(errorCodes(validateTaskRegistry(appCountRegistry)).includes("PROJECT_APPLICATION_COUNT_MISMATCH"));
});

test("rejects missing, duplicate and mismatched workstream membership", () => {
  const missing = makeRegistry([makeTask("A"), makeTask("B")]);
  missing.workstreams[0].task_ids = ["A"];
  assert.ok(errorCodes(validateTaskRegistry(missing)).includes("TASK_WORKSTREAM_MEMBERSHIP"));

  const duplicate = makeRegistry([makeTask("A")]);
  duplicate.workstreams[0].task_ids.push("A");
  assert.ok(errorCodes(validateTaskRegistry(duplicate)).includes("DUPLICATE_WORKSTREAM_MEMBERSHIP"));

  const mismatch = makeRegistry([makeTask("A", { workstream: "OTHER" })]);
  assert.ok(errorCodes(validateTaskRegistry(mismatch)).includes("UNKNOWN_TASK_WORKSTREAM"));
});

test("accepts a symmetric integration parent and independent child tasks", () => {
  const parent = makeTask("P", {
    task_type: "integration",
    child_tasks: ["C1", "C2"],
    dependencies: ["C1", "C2"],
    file_ownership: ["artifacts/task-evidence/P/**"],
  });
  const child1 = makeTask("C1", {
    task_type: "subtask",
    parent_task: "P",
    file_ownership: ["apps/example/contracts/**"],
  });
  const child2 = makeTask("C2", {
    task_type: "subtask",
    parent_task: "P",
    file_ownership: ["apps/example/implementation/**"],
  });
  const result = validateTaskRegistry(makeRegistry([parent, child1, child2]));
  assert.equal(result.valid, true, result.errors.map((error) => error.code).join(", "));
});

test("rejects child-to-parent dependency and missing integration child edge", () => {
  const parent = makeTask("P", { task_type: "integration", child_tasks: ["C"], dependencies: [] });
  const child = makeTask("C", { task_type: "subtask", parent_task: "P", dependencies: ["P"] });
  const codes = errorCodes(validateTaskRegistry(makeRegistry([parent, child])));
  assert.ok(codes.includes("CHILD_DEPENDS_ON_PARENT"));
  assert.ok(codes.includes("INTEGRATION_MISSING_CHILD_DEPENDENCY"));
});

test("rejects non-atomic XL task estimates and parent-child path collisions", () => {
  const large = makeTask("XL", { estimate: "XL" });
  assert.ok(errorCodes(validateTaskRegistry(makeRegistry([large]))).includes("INVALID_ESTIMATE"));

  const parent = makeTask("P", {
    task_type: "integration",
    child_tasks: ["C"],
    dependencies: ["C"],
    file_ownership: ["apps/**"],
  });
  const child = makeTask("C", {
    task_type: "subtask",
    parent_task: "P",
    file_ownership: ["apps/example/**"],
  });
  assert.ok(errorCodes(validateTaskRegistry(makeRegistry([parent, child]))).includes("PARENT_CHILD_PATH_COLLISION"));
});

test("validates the repository's canonical task registry", async () => {
  const registry = JSON.parse(await readFile(new URL("../../tasks.json", import.meta.url), "utf8"));
  const result = validateTaskRegistry(registry);
  assert.equal(result.valid, true, result.errors.map((error) => `${error.code} ${error.path}: ${error.message}`).join("\n"));
  assert.equal(result.summary.task_count, registry.project.task_count);
  assert.equal(registry.project.application_count, 16);
});

test("CLI validates the canonical registry from the repository root", async () => {
  const registry = JSON.parse(await readFile(new URL("../../tasks.json", import.meta.url), "utf8"));
  const script = fileURLToPath(new URL("./task-registry.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [script, "tasks.json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp("Valid task registry: " + registry.project.task_count + " tasks"));
});

test("schema document is valid JSON and declares forward-compatible task fields", async () => {
  const schema = JSON.parse(await readFile(new URL("./task-registry.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.$defs.task.properties.approval.$ref, "#/$defs/approval");
  assert.equal(schema.$defs.task.properties.task_type.enum.join(","), "task,subtask,integration");
  assert.deepEqual(schema.$defs.task.properties.estimate.enum, ["XS", "S", "M", "L"]);
  assert.equal(schema.$defs.task.additionalProperties, true);
});
