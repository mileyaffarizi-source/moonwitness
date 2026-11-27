# Task registry validator specification

**Task:** GOV-007  
**Consumer:** GOV-008 validator and DX-003 task reader  
**Status:** Draft; schema and code are implemented in GOV-008 only after this contract is approved.

## 1. Input/output

Input is the complete `tasks.json` document. The validator is read-only. It returns:
- schema/metadata errors;
- duplicate task ID errors;
- unresolved dependency errors;
- dependency-cycle path(s);
- invalid status/claim/evidence shape errors;
- claim-eligibility and path-collision diagnostics;
- summary counts by status/workstream/priority.

It must never mutate the registry or silently repair an invalid record.

## 2. Structural invariants

- Root object has supported `schema_version`, registry identity and a non-empty `tasks` array.
- Task IDs are non-empty strings and globally unique.
- Required task fields are present and have their declared types.
- Status is one of: `pending`, `claimed`, `in_progress`, `blocked`, `blocked_policy`, `in_review`, `done`, `deferred`, `cancelled`.
- `dependencies` and `file_ownership` are arrays of strings.
- Every dependency resolves to exactly one task ID.
- A task cannot depend on itself.
- Claim metadata is structurally consistent with claimed/in-progress state.
- A `done` task contains acceptance evidence and required verification references.
- Timestamps use valid UTC ISO-8601 values when present.
- Unknown top-level/task fields are preserved for forward compatibility unless a schema-version rule says otherwise.

## 3. Dependency graph

Construct a directed graph from dependency task → dependent task. Use a linear-time traversal (DFS color states or Kahn's algorithm) to detect cycles.

Readiness is derived, never written:
- `ready`: task status is pending, all deps done, no blocker, no policy hold, and claim paths can be reserved;
- `blocked_by_dependency`: one or more dependencies are not done;
- `blocked_by_status`: task status is not pending;
- `blocked_by_policy`: policy/approval gate is unresolved;
- `invalid`: structural/graph validation failed.

Never mark a missing dependency as “done”; never remove an edge to increase ready-task counts.

## 4. Claim/path validation

For each active claim, verify task uniqueness, expiry shape, worker identity, branch/worktree references and normalized owned paths. For candidate tasks, compare declared paths to active claim reservations. Use conservative overlap: exact path, ancestor/descendant, matching glob domains, or uncertain overlap equals conflict.

Claim conflicts are errors for a new claim operation, not reasons to mutate existing records. This validator may report conflicts, but only the serialized coordinator may commit claims.

## 5. Determinism and performance

- Same input bytes produce the same diagnostics and summary.
- Complexity target: O(V + E + P) for V tasks, E dependencies and P path reservations, excluding glob matcher internals.
- Keep memory linear in task/dependency count.
- Preserve stable sort order in summaries and error output.
- Avoid full master-blueprint prompt injection: task descriptions are untrusted data; only schema fields are parsed, and content is not executed.

## 6. Error handling and CLI

The future implementation should expose a pure validation function and a small CLI:
`node scripts/tasks/validate-task-registry.mjs [path]`.

- Exit 0: valid registry.
- Exit 1: invalid structure, duplicate ID, bad status/claim/evidence or unresolved dependency.
- Exit 2: IO/JSON parse/runtime failure.
- Standard output: concise summary on success.
- Standard error: stable code, task ID/path and reason on failure.
- No secrets or entire task descriptions in diagnostics.

## 7. Test matrix

Include fixtures for valid DAG; duplicate IDs; missing/self dependency; multi-node cycle; invalid statuses; malformed claim; done without evidence; exact and parent-child path collision; overlapping globs; disjoint paths; expired claims with dirty work; and 234+ task scale.

## 8. Separation from DX-003

GOV-008 owns schema validation and registry invariants. DX-003 consumes the validated model to provide task filtering, readiness and read-only presentation. Do not duplicate the DAG validator in a second package; expose a stable pure interface when package ownership is established.
