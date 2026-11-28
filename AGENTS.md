# MoonWitness — Agent Operating Contract

This file is the short, repository-wide contract for every human or AI contributor. Follow it before using specialist skills. Blueprints describe target architecture; source code and verification establish implementation truth.

## Non-negotiable rules

1. **Inspect before changing.** Check the current branch, working tree, relevant files, task, tests and existing conventions. Never overwrite uncommitted work or assume a blueprint feature exists.
2. **Use the task ledger.** tasks.json is the canonical execution plan. Read only the target task and its direct dependencies. Respect dependency order, ownership paths and acceptance criteria.
3. **Implement, do not simulate.** No fake data presented as live, placeholder success, empty scaffolds claimed as features, invented test output or status changes without evidence.
4. **Keep scope narrow.** Make the smallest coherent change that solves the task. Reuse existing code and dependencies. Avoid speculative abstractions, gratuitous refactors and unrelated cleanup.
5. **Preserve boundaries.** There are sixteen named app surfaces, not a mandate for sixteen microservices. Domain authority and data ownership stay explicit. Frontends do not own business rules or persistence.
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

## Commit and release conventions

- Use Conventional Commit titles for pull requests and squash commits: `feat(scope):`, `fix(scope):`, `docs(scope):`, `refactor(scope):`, `test(scope):`, `build(scope):`, `ci(scope):` or `chore(scope):`.
- Mark breaking changes with `!` and a `BREAKING CHANGE:` footer.
- Release Please is the only automated CHANGELOG/release writer. Do not add a second changelog or release bot without an ADR.
- Dependabot proposes dependency updates; do not enable auto-merge. Every bot PR must pass `pnpm check` and the applicable security gates.
- Follow [GitHub automation ownership](./docs/engineering/GITHUB-AUTOMATION.md).

## Add-on engineering boundary

Before creating or changing an add-on, read [BLUEPRINT-PACKAGE-ADDON.MD](./BLUEPRINT-PACKAGE-ADDON.MD) and the [Add-on Engineering Standard](./docs/engineering/ADDON-ENGINEERING-STANDARD.md). Validate manifest/package changes with `pnpm lint:addons` and always run `pnpm check`.

- Add-ons live under `packages/addons/<slug>`; each uses the canonical `addon.manifest.json`, stable ID `moonwitness.addon.<slug>` and package name `@moonwitness/addon-<slug>`.
- Do not create empty add-on folders, duplicate manifests, undocumented registries or placeholder capabilities.
- The API owns business persistence, authorization, transactions and audit. Add-ons must not import DB drivers, MikroORM internals, EntityManager, API private repositories or another add-on's private source.
- Agent tools call approved API capabilities only. Web contributions are browser-safe; no server runtime, database drivers, secrets or Node-only implementation enters browser bundles.
- Manifests declare requested permissions; they never grant themselves authority. Unknown capabilities/permissions, wildcard scopes and understated risk/approval fail closed.
- New models must be add-on-owned and namespaced. Extensions are additive only. Existing Odoo/domain-owned records are not add-on-owned by assumption.
- No runtime package installation, arbitrary remote code, shell/eval, ambient secret access or automatic install lifecycle scripts.
- Disable withdraws contributions but preserves data. Decommission is a separately approved, recoverable operation.
- Third-party add-on execution remains disabled while [ADR-0003](./docs/adr/ADR-0003-addon-runtime-and-trust-boundary.md) is Proposed. A valid manifest is not a sandbox.

## Architecture quick map

- apps/api: shared modular authority, domain use cases, model/record/field access and persistence composition.
- apps/id: identity, OIDC/SSO and workload identity integration; not a business authorization bypass or secret-value store.
- apps/agent: model/agent/workflow runtime; business writes only through approved API capabilities.
- apps/astronauts: Go host fleet controller and outbound Edge Agent; no unrestricted shell or ambient machine credentials.
- apps/arsy: Rust telecom protocol runtime for RADIUS AAA, TR-069 ACS and Syslog; not subscriber/billing/NMS authority.
- apps/dx: developer workbench, task control tower, safe local orchestration and evidence review.
- apps/web, apps/OSS, apps/BSS, apps/docs, apps/desktop, apps/mobile, apps/cloud, apps/isp, apps/A-L-L-A-H, apps/riot: separate product/operational surfaces as defined in their blueprints.
- Existing Odoo-owned records remain Odoo-owned until an entity-level migration/cutover is explicitly approved. MikroORM is a persistence engine beneath the platform model kernel, not permission to write Odoo tables.

## Specialist instructions

Use the skill index at .agents/skills/README.md. Skills are task-scoped references, not a reason to load every instruction file.


## Atomic task and integration-parent rules

- The canonical task registry classifies work as `task`, `subtask` or `integration`. Prefer the smallest claimable `task`/`subtask` that has complete prerequisites and one independently verifiable output.
- Do not claim an `integration` parent for source implementation. First complete its children; then claim the parent only for cross-child verification, failure/recovery checks and the final evidence report.
- A child must never depend on its parent. The integration parent must depend on every child. Parent and child file ownership must not overlap.
- Two children may run in parallel only when their dependency sets are ready and their normalized ownership paths are disjoint. Shared root manifests, tasks.json, lockfiles, global registries, ORM/API composition and design tokens remain serialized integration surfaces.
- Do not add `XL` tasks. Split independently testable outputs into XS/S/M/L tasks with exact path ownership, acceptance criteria and verification.
- Do not update a parent to done when its children finish; the parent requires its own integration evidence and review.
