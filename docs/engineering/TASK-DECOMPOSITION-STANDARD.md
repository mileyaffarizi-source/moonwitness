# Atomic Task Decomposition Standard

**Version:** 1.0.0  
**Status:** Required engineering standard  
**Canonical ledger:** `tasks.json`  
**Enforcement:** `scripts/tasks/task-registry.mjs` + `pnpm check:tasks`

## 1. Purpose

The task registry is an executable work plan, not a list of broad aspirations. A worker must be able to claim one task, understand its boundary, produce one independently reviewable result, verify it and attach evidence without guessing what adjacent workers own.

A task is atomic when it has one accountable owner, one bounded outcome, explicit prerequisites, exact paths, clear non-goals and observable acceptance. A task is not atomic merely because it has one title.

## 2. Three task types

| Type | Purpose | Claim rule |
|---|---|---|
| `task` | Standalone bounded unit | Claim when dependencies, approval and paths are ready |
| `subtask` | One independently testable child of an integration parent | Claim when its upstream dependencies are ready; never depend on its own parent |
| `integration` | Parent that composes children and verifies the full capability | Claim only after every child is done with evidence; owns integration paths only |

Hierarchy is symmetric: parent `child_tasks` contains the child ID; child `parent_task` contains the parent ID. Every integration parent also depends on all of its child IDs. A child does not depend on the parent.

Do not automatically set a parent to done when children finish. The parent still needs integration/E2E checks and review.

## 3. Atomicity and estimate guide

| Estimate | Meaning | Typical work |
|---|---|---|
| XS | One mechanical change | One metadata field, one small fixture or one narrowly scoped rename |
| S | One small contract or behavior | One schema, state transition, adapter method or focused test suite |
| M | One cohesive capability slice | One bounded vertical module or an integration/verification task |
| L | One substantial but indivisible unit | One review boundary with one owner and one output; split further when it has independent outcomes |

**XL is forbidden as a claimable task size.** If a proposed task has multiple independently testable outputs, separate trust boundaries, independent owners, separate failure modes or more than one deliverable that can land independently, decompose it.

## 4. Required task record

Every record must contain:

- Stable unique ID, type, workstream, owning blueprint, phase and priority.
- Owner role and current status.
- One-sentence objective and positive scope.
- Explicit non-goals, forbidden side effects and out-of-scope paths.
- Dependencies, inputs and approval requirements.
- Exact file ownership (no broad application root unless it is a deliberately serialized integration surface).
- Deliverables, acceptance criteria and verification commands/tests.
- Estimate and parallel group.
- Evidence, blocker and lifecycle timestamps.

Acceptance criteria should be observable. Prefer “unknown NAS is rejected and recorded with a stable reason” over “RADIUS security works”.

## 5. Path ownership and parallelism

1. Normalize separators and wildcard scopes before comparing paths.
2. Parent and child paths must not overlap.
3. Sibling child paths must be disjoint if they may run in parallel.
4. Ancestor/descendant and uncertain glob overlaps are treated as conflicts.
5. Shared integration surfaces (for example `tasks.json`, root manifests, lockfiles, API composition, ORM registry, global tokens and workflow files) have one serialized integrator/owner.
6. A task with a broad legacy path cannot be assumed parallel-safe. Narrow it before simultaneous claims.
7. A task claim reserves all owned paths; a lease expiry does not release dirty work automatically.

A task may be parallelized with a sibling only if both dependency sets are satisfied and no active claim conflicts.

## 6. Dependency design

- Use dependencies for real prerequisites, not for general ordering preference.
- Keep the dependency graph acyclic.
- A contract/schema child normally precedes implementation that consumes it.
- Verification tasks depend on every behavior they verify.
- Integration parents depend on all children and preserve any original external prerequisites.
- A child must never depend on its parent.
- Cross-domain integration should use versioned contracts/events rather than a database dependency.

Do not encode a parent/child relationship only in the title or notes; use the canonical hierarchy fields.

## 7. Status and evidence policy

A commit, open PR, successful build or worker self-report is not enough to mark a task done. Completion evidence binds to the exact commit and includes the relevant command, environment/toolchain, exit code, test/CI run and acceptance result. Evidence from an older commit does not prove a later change.

Statuses represent the task itself, not the PR. Children and parent maintain separate statuses. A parent remains pending/in_review until its child evidence and parent integration tests pass.

## 8. Workstream consistency

Every task names the workstream by its canonical display name. Each workstream has a unique short ID and unique name. The registry must enforce a one-to-one mapping: every task ID appears exactly once in one matching `workstreams[].task_ids` array and no unknown ID is listed.

Project task count equals `tasks.length`; application count equals the application inventory array length. These are validated, not hand-maintained estimates.

## 9. Safe split procedure

When splitting an existing task:
1. Preserve the original task ID as a parent/integration ID if downstream tasks depend on it.
2. Record its original external dependencies.
3. Create child tasks with narrow outcomes and disjoint paths.
4. Give independent children the original upstream prerequisites; give integration tests dependencies on the children they verify.
5. Change the parent to an integration task; keep its original prerequisites and add every child ID.
6. Move parent file ownership to an integration evidence/report path, never the whole source tree.
7. Preserve original acceptance criteria in the parent and distribute them to children as appropriate.
8. Do not infer completion/status from the split.
9. Run the registry validator and inspect dependency cycles and path overlaps.
10. Add tests whenever the task schema or execution rules change.

## 10. Cross-language task expectations

- Node/TypeScript: exact Node pin and pnpm lockfile; use package-level lint/typecheck/test/build.
- Go: `go.mod`/`go.sum`, pinned toolchain, `gofmt`, `go vet`, `go test` and race/security checks.
- Rust: `Cargo.toml`/`Cargo.lock`/toolchain pin, `cargo fmt`, `cargo clippy`, `cargo test`, audit/fuzz/interop checks as appropriate.

The root gate reports each language as passed, failed, blocked or not-applicable. A missing implementation or toolchain is never reported as passed.

## 11. Validator contract

The canonical validator rejects:
- Count drift and application inventory mismatch.
- Missing/duplicate/wrong workstream membership.
- Duplicate IDs, missing dependencies and dependency cycles.
- Unknown task types, estimates or statuses.
- Missing/asymmetric parent-child references.
- Integration parents that do not depend on every child.
- Children that depend on their own parent.
- Parent-child file ownership collisions and active claim collisions.
- Completion without evidence, completion time and required approval.

The validator is read-only. It must never repair a malformed registry silently.
