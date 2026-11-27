import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TASK_STATUSES = Object.freeze([
  "pending",
  "claimed",
  "in_progress",
  "blocked",
  "blocked_policy",
  "in_review",
  "done",
  "deferred",
  "cancelled",
]);

const PRIORITIES = new Set(["P0", "P1", "P2"]);
const ACTIVE_STATUSES = new Set(["claimed", "in_progress"]);
const STRING_ARRAY_FIELDS = [
  "scope_in",
  "scope_out",
  "dependencies",
  "inputs",
  "implementation_steps",
  "deliverables",
  "acceptance_criteria",
  "verification",
  "file_ownership",
  "evidence",
  "notes",
];
const REQUIRED_STRING_FIELDS = [
  "id",
  "title",
  "workstream",
  "blueprint",
  "phase",
  "priority",
  "status",
  "owner_role",
  "objective",
  "estimate",
  "parallel_group",
];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isUtcTimestamp(value) {
  return typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) &&
    !Number.isNaN(Date.parse(value));
}

function validateNullableString(value, path, addError) {
  if (value !== null && !isNonEmptyString(value)) {
    addError("INVALID_VALUE", path, "must be a non-empty string or null");
  }
}

function validateNullableTimestamp(value, path, addError) {
  if (value !== null && !isUtcTimestamp(value)) {
    addError("INVALID_TIMESTAMP", path, "must be a UTC ISO-8601 timestamp or null");
  }
}

function validateApproval(approval, path, addError) {
  if (!isRecord(approval)) {
    addError("INVALID_APPROVAL", path, "must be an object");
    return false;
  }

  let valid = true;
  for (const field of ["approved_by", "scope", "evidence"]) {
    if (!isNonEmptyString(approval[field])) {
      addError("INVALID_APPROVAL", `${path}.${field}`, "must be a non-empty string");
      valid = false;
    }
  }
  if (!isUtcTimestamp(approval.approved_at)) {
    addError("INVALID_APPROVAL", `${path}.approved_at`, "must be a UTC ISO-8601 timestamp");
    valid = false;
  }
  return valid;
}

function normalizePath(path) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/+/g, "/").replace(/\/$/, "");
}

function staticPathPrefix(pattern) {
  const normalized = normalizePath(pattern);
  const wildcardIndex = normalized.search(/[?*[{]/);
  return (wildcardIndex < 0 ? normalized : normalized.slice(0, wildcardIndex)).replace(/\/$/, "");
}

export function pathsOverlap(left, right) {
  const a = staticPathPrefix(left);
  const b = staticPathPrefix(right);
  if (!a || !b) return true;
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

function validateTask(task, index, addError) {
  const path = `tasks[${index}]`;
  if (!isRecord(task)) {
    addError("INVALID_TASK", path, "must be an object");
    return;
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!isNonEmptyString(task[field])) {
      addError("REQUIRED_STRING", `${path}.${field}`, "must be a non-empty string");
    }
  }

  if (!TASK_STATUSES.includes(task.status)) {
    addError("INVALID_STATUS", `${path}.status`, `unsupported status: ${String(task.status)}`);
  }
  if (!PRIORITIES.has(task.priority)) {
    addError("INVALID_PRIORITY", `${path}.priority`, `unsupported priority: ${String(task.priority)}`);
  }

  for (const field of STRING_ARRAY_FIELDS) {
    if (!Array.isArray(task[field])) {
      addError("INVALID_ARRAY", `${path}.${field}`, "must be an array of non-empty strings");
      continue;
    }
    task[field].forEach((value, itemIndex) => {
      if (!isNonEmptyString(value)) {
        addError("INVALID_ARRAY_ITEM", `${path}.${field}[${itemIndex}]`, "must be a non-empty string");
      }
    });
  }

  if (Array.isArray(task.dependencies)) {
    const seen = new Set();
    task.dependencies.forEach((dependency, dependencyIndex) => {
      if (seen.has(dependency)) {
        addError("DUPLICATE_DEPENDENCY", `${path}.dependencies[${dependencyIndex}]`, `duplicate dependency: ${dependency}`);
      }
      seen.add(dependency);
    });
  }

  if (typeof task.human_approval_required !== "boolean") {
    addError("INVALID_VALUE", `${path}.human_approval_required`, "must be a boolean");
  }
  validateNullableString(task.assigned_agent, `${path}.assigned_agent`, addError);
  validateNullableString(task.blocker, `${path}.blocker`, addError);

  for (const field of ["created_at", "updated_at", "completed_at"]) {
    validateNullableTimestamp(task[field], `${path}.${field}`, addError);
  }

  if (!isRecord(task.claim)) {
    addError("INVALID_CLAIM", `${path}.claim`, "must be an object");
  } else {
    const claim = task.claim;
    validateNullableString(claim.agent_id, `${path}.claim.agent_id`, addError);
    validateNullableString(claim.worktree, `${path}.claim.worktree`, addError);
    validateNullableString(claim.branch, `${path}.claim.branch`, addError);
    validateNullableTimestamp(claim.claimed_at, `${path}.claim.claimed_at`, addError);
    validateNullableTimestamp(claim.lease_expires_at, `${path}.claim.lease_expires_at`, addError);
    if (!Array.isArray(claim.owned_paths) ||
        claim.owned_paths.some((item) => !isNonEmptyString(item))) {
      addError("INVALID_CLAIM", `${path}.claim.owned_paths`, "must be an array of non-empty repository-relative paths");
    } else {
      claim.owned_paths.forEach((ownedPath, ownedIndex) => {
        const normalized = normalizePath(ownedPath);
        if (ownedPath.startsWith("/") || /^[A-Za-z]:\//.test(ownedPath) ||
            normalized.split("/").includes("..") || normalized.length === 0) {
          addError("INVALID_CLAIM_PATH", `${path}.claim.owned_paths[${ownedIndex}]`, "must be a safe repository-relative path");
        }
      });
    }

    if (ACTIVE_STATUSES.has(task.status)) {
      for (const field of ["agent_id", "claimed_at", "lease_expires_at", "worktree", "branch"]) {
        if (claim[field] === null || claim[field] === undefined) {
          addError("INCOMPLETE_CLAIM", `${path}.claim.${field}`, "is required while task is claimed or in progress");
        }
      }
      if (Array.isArray(claim.owned_paths) && claim.owned_paths.length === 0) {
        addError("INCOMPLETE_CLAIM", `${path}.claim.owned_paths`, "at least one owned path is required while active");
      }
    } else if (claim.agent_id !== null) {
      addError("STALE_CLAIM", `${path}.claim.agent_id`, "must be cleared when task is not claimed or in progress");
    }
  }

  if (task.approval !== undefined && task.approval !== null) {
    validateApproval(task.approval, `${path}.approval`, addError);
  }

  if (task.status === "done") {
    if (!Array.isArray(task.evidence) || task.evidence.length === 0) {
      addError("DONE_WITHOUT_EVIDENCE", `${path}.evidence`, "done tasks require at least one evidence reference");
    }
    if (!isUtcTimestamp(task.completed_at)) {
      addError("DONE_WITHOUT_COMPLETION_TIME", `${path}.completed_at`, "done tasks require a completion timestamp");
    }
    if (task.blocker !== null) {
      addError("DONE_WITH_BLOCKER", `${path}.blocker`, "done tasks cannot retain an active blocker");
    }
    if (task.human_approval_required === true && task.approval == null) {
      addError("DONE_WITHOUT_APPROVAL", `${path}.approval`, "approval-gated tasks require an explicit approval record");
    }
  }

  if (ACTIVE_STATUSES.has(task.status) && task.human_approval_required === true && task.approval == null) {
    addError("CLAIM_WITHOUT_APPROVAL", `${path}.approval`, "approval-gated tasks cannot be claimed before approval is recorded");
  }
}

function findCycles(tasksById) {
  const state = new Map();
  const stack = [];
  const cycles = [];

  function visit(id) {
    const current = state.get(id) ?? 0;
    if (current === 2) return;
    if (current === 1) {
      const start = stack.indexOf(id);
      cycles.push([...stack.slice(start), id]);
      return;
    }

    state.set(id, 1);
    stack.push(id);
    const task = tasksById.get(id);
    for (const dependency of task?.dependencies ?? []) {
      if (tasksById.has(dependency)) visit(dependency);
    }
    stack.pop();
    state.set(id, 2);
  }

  for (const id of tasksById.keys()) visit(id);
  return cycles;
}

function activeClaimPaths(task) {
  const paths = task.claim?.owned_paths ?? [];
  return paths.length > 0 ? paths : (task.file_ownership ?? []);
}

function hasValidApproval(task) {
  const approval = task.approval;
  return isRecord(approval) &&
    isNonEmptyString(approval.approved_by) &&
    isNonEmptyString(approval.scope) &&
    isNonEmptyString(approval.evidence) &&
    isUtcTimestamp(approval.approved_at);
}

export function calculateReadiness(registry) {
  const tasks = Array.isArray(registry?.tasks) ? registry.tasks : [];
  const tasksById = new Map(tasks.filter((task) => isRecord(task) && isNonEmptyString(task.id)).map((task) => [task.id, task]));
  const activeTasks = tasks.filter((task) => isRecord(task) && ACTIVE_STATUSES.has(task.status));
  const readiness = [];

  for (const task of tasks) {
    if (!isRecord(task) || !isNonEmptyString(task.id)) continue;

    let state = "not_pending";
    const reasons = [];

    if (task.status === "pending") {
      if (task.blocker !== null && task.blocker !== undefined) reasons.push("task_has_blocker");
      const dependencies = Array.isArray(task.dependencies) ? task.dependencies : [];
      const incomplete = dependencies.filter((id) => tasksById.get(id)?.status !== "done");
      if (incomplete.length > 0) reasons.push("dependencies_not_done");
      if (task.human_approval_required === true && !hasValidApproval(task)) reasons.push("human_approval_required");

      const candidatePaths = Array.isArray(task.file_ownership) ? task.file_ownership : [];
      const conflictingClaims = activeTasks
        .filter((active) => active.id !== task.id)
        .filter((active) => activeClaimPaths(active).some((claimedPath) =>
          candidatePaths.some((candidatePath) => pathsOverlap(claimedPath, candidatePath))))
        .map((active) => active.id);

      if (conflictingClaims.length > 0) reasons.push("claimed_path_conflict");

      if (reasons.length === 0) state = "ready";
      else if (reasons.includes("task_has_blocker")) state = "blocked";
      else if (reasons.includes("dependencies_not_done")) state = "blocked_by_dependency";
      else if (reasons.includes("human_approval_required")) state = "approval_required";
      else state = "claimed_path_conflict";

      readiness.push({
        id: task.id,
        status: state,
        reasons,
        incomplete_dependencies: incomplete,
        conflicting_claims: conflictingClaims,
      });
      continue;
    }

    if (task.status === "blocked" || task.status === "blocked_policy") state = task.status;
    readiness.push({ id: task.id, status: state, reasons, incomplete_dependencies: [], conflicting_claims: [] });
  }

  return readiness;
}

export function validateTaskRegistry(registry) {
  const errors = [];
  const addError = (code, path, message) => errors.push({ code, path, message });

  if (!isRecord(registry)) {
    addError("INVALID_ROOT", "$", "registry root must be an object");
    return { valid: false, errors, summary: { task_count: 0, ready_count: 0, status_counts: {} }, readiness: [] };
  }

  if (!isNonEmptyString(registry.schema_version)) addError("INVALID_ROOT", "$.schema_version", "must be a non-empty string");
  if (!isNonEmptyString(registry.registry_id)) addError("INVALID_ROOT", "$.registry_id", "must be a non-empty string");
  if (!isRecord(registry.project)) addError("INVALID_ROOT", "$.project", "must be an object");
  if (!isRecord(registry.execution_policy)) addError("INVALID_ROOT", "$.execution_policy", "must be an object");
  if (!Array.isArray(registry.global_gates)) addError("INVALID_ROOT", "$.global_gates", "must be an array");
  if (!Array.isArray(registry.workstreams)) addError("INVALID_ROOT", "$.workstreams", "must be an array");
  if (!Array.isArray(registry.tasks) || registry.tasks.length === 0) {
    addError("INVALID_ROOT", "$.tasks", "must be a non-empty array");
    return { valid: false, errors, summary: { task_count: 0, ready_count: 0, status_counts: {} }, readiness: [] };
  }

  const tasksById = new Map();
  registry.tasks.forEach((task, index) => {
    validateTask(task, index, addError);
    if (!isRecord(task) || !isNonEmptyString(task.id)) return;
    if (tasksById.has(task.id)) {
      addError("DUPLICATE_ID", `tasks[${index}].id`, `duplicate task ID: ${task.id}`);
    } else {
      tasksById.set(task.id, task);
    }
  });

  for (const [index, task] of registry.tasks.entries()) {
    if (!isRecord(task) || !Array.isArray(task.dependencies)) continue;
    for (const [dependencyIndex, dependency] of task.dependencies.entries()) {
      if (!tasksById.has(dependency)) {
        addError("MISSING_DEPENDENCY", `tasks[${index}].dependencies[${dependencyIndex}]`, `unknown task ID: ${dependency}`);
      } else if (dependency === task.id) {
        addError("SELF_DEPENDENCY", `tasks[${index}].dependencies[${dependencyIndex}]`, "a task cannot depend on itself");
      }
    }
  }

  for (const cycle of findCycles(tasksById)) {
    addError("DEPENDENCY_CYCLE", "$.tasks", cycle.join(" -> "));
  }

  const active = registry.tasks.filter((task) => isRecord(task) && ACTIVE_STATUSES.has(task.status));
  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      const left = active[i];
      const right = active[j];
      const collision = activeClaimPaths(left).some((leftPath) =>
        activeClaimPaths(right).some((rightPath) => pathsOverlap(leftPath, rightPath)));
      if (collision) {
        addError("ACTIVE_PATH_COLLISION", "$.tasks", `active tasks ${left.id} and ${right.id} have overlapping owned paths`);
      }
    }
  }

  const readiness = calculateReadiness(registry);
  const statusCounts = {};
  for (const task of registry.tasks) {
    if (isRecord(task) && typeof task.status === "string") {
      statusCounts[task.status] = (statusCounts[task.status] ?? 0) + 1;
    }
  }
  const readyCount = readiness.filter((item) => item.status === "ready").length;

  return {
    valid: errors.length === 0,
    errors,
    readiness,
    summary: {
      task_count: registry.tasks.length,
      ready_count: readyCount,
      status_counts: Object.fromEntries(Object.entries(statusCounts).sort(([a], [b]) => a.localeCompare(b))),
    },
  };
}

export async function readTaskRegistry(path = "tasks.json") {
  const sourcePath = resolve(process.cwd(), path);
  const content = await readFile(sourcePath, "utf8");
  return JSON.parse(content);
}

function printCliResult(result) {
  if (!result.valid) {
    for (const error of result.errors) {
      process.stderr.write(`ERROR ${error.code} ${error.path}: ${error.message}\n`);
    }
    process.stderr.write(`Invalid task registry: ${result.summary.task_count} tasks; ${result.errors.length} errors.\n`);
    process.exitCode = 1;
    return;
  }

  const { task_count, ready_count, status_counts } = result.summary;
  const counts = Object.entries(status_counts).map(([status, count]) => `${status}=${count}`).join(" ");
  process.stdout.write(`Valid task registry: ${task_count} tasks; ready=${ready_count}; ${counts}\n`);
  const ready = result.readiness.filter((item) => item.status === "ready").map((item) => item.id);
  if (ready.length > 0) process.stdout.write(`Ready task IDs: ${ready.slice(0, 40).join(", ")}${ready.length > 40 ? ", …" : ""}\n`);
}

async function runCli() {
  const input = process.argv[2] ?? "tasks.json";
  try {
    const registry = await readTaskRegistry(input);
    printCliResult(validateTaskRegistry(registry));
  } catch (error) {
    process.stderr.write(`Unable to read task registry: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runCli();
}
