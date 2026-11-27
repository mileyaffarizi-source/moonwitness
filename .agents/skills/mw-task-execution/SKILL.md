---
name: mw-task-execution
description: Execute MoonWitness tasks from the central task ledger with dependency, ownership, concurrency and evidence discipline.
---

# Task execution

## Use when
Implementing, claiming, splitting, reviewing or updating a task in tasks.json.

## Read first
Read AGENTS.md, the exact task object, its acceptance criteria, dependency IDs and owning blueprint. Consult governance only for the relevant rule.

## Procedure
1. Confirm branch, clean/dirty state, task status, dependencies and owned paths.
2. Do not start blocked work or remove dependencies to manufacture parallelism.
3. Agree on interfaces and exclusive paths before parallel workers start. Use separate branches/worktrees for independent changes.
4. Treat tasks.json as a shared critical resource. Update only the target task through a serialized writer or compare-and-swap; preserve all other records.
5. Make a bounded implementation plan, then implement the smallest end-to-end slice.
6. Run pnpm check after the final change. Run focused tests for affected behavior as needed; report explicitly when a gate is intentionally skipped.
7. Inspect the final diff for scope, security, data ownership, accidental generated output and policy violations.
8. Change status to done only when every acceptance criterion has evidence. Otherwise retain in-progress/blocked and name the unmet criterion.

## Worker report
Return only: task ID/status, changed paths, commit, verification commands and observed results, security/data impact, remaining gaps and blockers. Never invent leases, approvals or test/CI results.
