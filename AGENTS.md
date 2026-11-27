# MoonWitness — Agent Operating Contract

This file is the short, repository-wide contract for every human or AI contributor. Follow it before using specialist skills. Blueprints describe target architecture; source code and verification establish implementation truth.

## Non-negotiable rules

1. **Inspect before changing.** Check the current branch, working tree, relevant files, task, tests and existing conventions. Never overwrite uncommitted work or assume a blueprint feature exists.
2. **Use the task ledger.** tasks.json is the canonical execution plan. Read only the target task and its direct dependencies. Respect dependency order, ownership paths and acceptance criteria.
3. **Implement, do not simulate.** No fake data presented as live, placeholder success, empty scaffolds claimed as features, invented test output or status changes without evidence.
4. **Keep scope narrow.** Make the smallest coherent change that solves the task. Reuse existing code and dependencies. Avoid speculative abstractions, gratuitous refactors and unrelated cleanup.
5. **Preserve boundaries.** There are fourteen named app surfaces, not a mandate for fourteen microservices. Domain authority and data ownership stay explicit. Frontends do not own business rules or persistence.
6. **Protect shared files.** Root manifests, lockfile, tasks.json, API composition, ORM registry, shared exports and global design tokens are serialized integration surfaces. Coordinate before editing; never perform stale full-file replacement.
7. **Security by default.** No secrets in Git, prompts, task context, logs or browser storage. No unrestricted SQL, shell, filesystem, Docker socket or production credentials exposed to an Agent. Authorization is enforced by the owning API, not the UI or model.
8. **Verify actual behavior.** Run the narrowest relevant checks, then broader checks when practical. Report command, result, commit and limitations accurately.
9. **Keep changes readable.** Prefer direct names, explicit control flow and small modules. Comments explain non-obvious decisions, not the code line by line.
10. **Respect creative policy.** Never visually depict Allah, Prophet Muhammad or Isa/Jesus in any asset, UI, avatar, silhouette or derivative. Textual references remain subject to the approved context.

## Anti-slop engineering and product craft

- Do not generate boilerplate just to make a folder look complete.
- No generic AI filler: “robust, scalable, seamless, cutting-edge” without a measurable design or implementation consequence.
- No speculative feature lists, redundant wrappers, unnecessary config layers, fake service abstractions or decorative comments.
- Do not reproduce generic AI-generated interface patterns: interchangeable dashboard cards, arbitrary gradients, purple glow, indiscriminate glassmorphism, random particles, oversized empty hero sections or icons used as decoration.
- Make visual decisions from the product's actual purpose, user workflow, content hierarchy and world identity. Distinctive does not mean noisy; operational clarity and accessibility always win.
- Preserve the repository's authored language, naming, canon and design decisions. Do not replace original product identity with a template.

## Token and context budget

- Start from the task ID, not a repository-wide summary.
- Read this file, then at most two relevant skills. Open only the blueprint sections and source files needed for the task.
- For large files such as tasks.json or the master blueprint, search by exact task ID or heading; do not dump the whole file into context.
- Inspect targeted paths and call sites before expanding scope. Prefer one focused search/read pass over repeated broad scans.
- Do not restate source documents in prompts or completion reports. Carry forward only decisions, constraints, interfaces and evidence.
- Ask one question only when a missing decision blocks safe progress. Otherwise use the documented default and record the assumption.
- Keep responses compact: changed paths, behavior, verification, evidence, unresolved risk. No long progress narration.

## Default execution loop

locate task → read acceptance/dependencies → select skills → inspect owned paths → implement → test → review diff/security/data impact → record evidence → update task atomically → report

A task is done only when its acceptance criteria pass and verifiable evidence exists. A commit alone is not proof. If blocked, preserve the truthful status and state the exact blocker.

## Mandatory quality gate

Before handing work to a human or opening a pull request, run pnpm check from the repository root after the final code change. This is the same gate CI runs. Never report a gate as passed unless the command actually completed successfully.

The canonical gate runs repository lint, format hygiene, the TypeScript gate, repository/task-registry validation and the Node test suite. A gate that is explicitly reported as skipped is not a pass. TypeScript checks become mandatory when TypeScript source is introduced; the gate fails closed until a pinned compiler and root project config are provided.

Do not bypass a failing check with continue-on-error, || true, broad lint suppressions or fabricated output. Fix the cause, or report the exact failure and leave the task incomplete. See the quality-gate contract in docs/engineering/QUALITY-GATES.md.

## Architecture quick map

- apps/api: shared modular authority, domain use cases, model/record/field access and persistence composition.
- apps/id: identity, OIDC/SSO and workload identity integration; not a business authorization bypass or secret-value store.
- apps/agent: model/agent/workflow runtime; business writes only through approved API capabilities.
- apps/dx: developer workbench, task control tower, safe local orchestration and evidence review.
- apps/web, apps/OSS, apps/BSS, apps/docs, apps/desktop, apps/mobile, apps/cloud, apps/isp, apps/A-L-L-A-H, apps/riot: separate product/operational surfaces as defined in their blueprints.
- Existing Odoo-owned records remain Odoo-owned until an entity-level migration/cutover is explicitly approved. MikroORM is a persistence engine beneath the platform model kernel, not permission to write Odoo tables.

## Specialist instructions

Use the skill index at .agents/skills/README.md. Skills are task-scoped references, not a reason to load every instruction file.
