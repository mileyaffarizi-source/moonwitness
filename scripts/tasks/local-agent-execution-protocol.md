# Local AI task execution protocol — proposal

**Task:** GOV-007  
**Status:** Accepted by repository owner on 2026-11-27 for the bounded local task-execution policy  
**Canonical ledger:** [`tasks.json`](../../tasks.json)

## 1. Authority and scope

- `tasks.json` is the only canonical execution ledger.
- A task prompt is work intent, not authorization.
- A worker may operate only within declared task paths, approved tools and the assigned worktree.
- This document proposes claim/lease/ownership semantics. It is not yet an authorization to run autonomous or privileged workers.

## 2. Claim eligibility

A task may be claimed only when all conditions hold:

1. Its status is `pending`.
2. Every dependency exists and has status `done`.
3. The task is not blocked by policy, approval, an unresolved conflict or an explicit blocker.
4. The worker has a unique stable agent ID and a supported capability profile.
5. Its owned paths are known and can be reserved without collision.
6. The repo/ref and task record version have just been refreshed.

Tasks in `claimed`, `in_progress`, `in_review`, `blocked`, `blocked_policy`, `done`, `deferred` or `cancelled` are not claimable.

A missing dependency, duplicate ID, malformed status or cycle makes the registry invalid. A validator must fail closed; it must not silently repair task meaning.

## 3. Claim record

A claim reserves exactly one task and records:

- `agent_id`: stable worker identity, not a free-form name from task content;
- `claimed_at`: UTC timestamp from the coordinator;
- `lease_expires_at`: UTC expiry bounded by coordinator policy;
- `worktree`: canonical isolated worktree identifier/path;
- `branch`: exact branch/ref assigned to the worker;
- `owned_paths`: normalized task-specific path reservations.

The task status moves `pending → claimed` atomically with the claim record. The worker moves it to `in_progress` only after the isolated environment is ready.

## 4. Lease, heartbeat and release

- A worker renews a lease before expiry; renewal is a compare-and-swap update against the current task/registry revision.
- Lease duration and heartbeat interval are coordinator configuration, not model-generated values.
- An expired lease does not immediately make a task claimable.
- Before reclaiming an expired task, inspect the branch, worktree, uncommitted diff, commits, artifacts and latest heartbeat.
- If work exists, preserve it and return to review/reconciliation; never discard it automatically.
- Release clears claim fields only after verifying worker termination and preserving outputs.
- A cancelled worker must not continue writing after release.

## 5. Path ownership and collision prevention

Normalize paths to repository-relative POSIX paths. Reject absolute paths, parent traversal, empty paths and paths outside the task's declared ownership.

Two claims conflict when:
- they target the same task;
- one owned path equals or is a parent of the other;
- ownership globs may intersect;
- either claim touches a declared global shared surface.

Treat uncertainty as a collision. Do not assume two glob patterns are disjoint because their text differs.

Global serialized surfaces include root package/lock/workspace manifests, `tasks.json`, shared package export maps, API composition roots, ORM/model registries, global route registries and global design tokens. A single named integrator owns edits to these surfaces. Other work can proceed in isolated files/branches but must not mutate the shared file.

A path reservation is advisory only until the coordinator atomically records it. Local file locks do not coordinate separate machines; remote registry CAS and branch/worktree isolation remain mandatory.

## 6. Atomic registry writer

Every mutation follows this loop:

1. Fetch the latest target branch/ref and `tasks.json` blob SHA.
2. Parse and validate the entire registry (schema, IDs, dependency DAG, statuses and existing claims).
3. Recompute eligibility/collisions from the latest state.
4. Patch only the target task fields; preserve every unrelated task and metadata field.
5. Serialize deterministically and create the new blob/tree/commit.
6. Update the branch ref using the previously fetched expected SHA (compare-and-swap).
7. If the expected SHA changed, discard the stale write, refetch and recompute. Never force-push or retry the stale whole-file content.
8. Verify the committed target record and unrelated-record preservation.

Only one logical registry writer may commit a mutation at a time. The Git ref CAS is the final cross-machine race guard; an in-memory mutex alone is insufficient.

## 7. Worker isolation and command policy

Each task gets a dedicated worktree/branch, explicit read/write paths, allowed commands and network policy. No ambient production credentials, unrestricted host shell, Docker socket, host root, arbitrary DB access or unrestricted filesystem are inherited by default.

Limit CPU/RAM/time/output/concurrency. Capture exit codes, cancellation, process-tree termination and redacted logs. Human approval is required for destructive Git actions, production deployment, schema/data changes, external side effects and sensitive operations.

## 8. Evidence and completion

Workers submit proposals; the coordinator validates structure and evidence references. Evidence includes commit SHA, exact command and exit code, CI/test link, environment/version, changed paths and unresolved limitations.

A task moves to `done` only after:
- all acceptance criteria pass;
- verification evidence exists and is attributable;
- the required human reviewer has approved where the task says so;
- no blocking dependency, test or policy issue remains.

A model self-report, commit existing, PR merged or test skipped is not sufficient evidence.

## 9. Concurrency and recovery tests required

- Two workers claim the same pending task at once: exactly one CAS succeeds.
- Two tasks with identical/parent-child/overlapping glob paths: second claim is rejected.
- Disjoint paths: claims may coexist.
- Dependency changes between eligibility check and CAS: stale claim rejected.
- Lease expires with dirty worktree: data is preserved and task is not silently reset.
- Ref changes between read and write: writer refetches and reapplies only its target patch.
- Worker is cancelled during a command: process tree is terminated before release.
- Malformed registry/cycle/missing dependency: all claims fail closed.

## 10. Approval requested

This is a proposed execution contract. It needs owner/platform-security approval before it becomes an active worker authorization policy. Approval should cover claim eligibility, path collision semantics, lease recovery, CAS behavior, shared-file ownership and human-approval gates as one bounded version.
