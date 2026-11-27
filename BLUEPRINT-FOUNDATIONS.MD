# BLUEPRINT-FOUNDATIONS — PLATFORM FOUNDATION, BUILD ORDER & ACCEPTANCE GATES

**Document ID:** MW-BP-FND-001 · **Version:** 1.0.0 · **Status:** Proposed execution blueprint  
**Parent:** BLUEPRINT.md · **Related:** BLUEPRINT-APPLICATIONS.MD, BLUEPRINT-PACKAGE.MD, BLUEPRINT-PACKAGE-ADDON.MD, BLUEPRINT-RULES-GOVERN-CONTRACT.MD  
**Canonical execution ledger:** tasks.json · **Runtime baseline:** Node.js 24.22.3 · **Package manager:** pnpm 12.24.0

## 1. Mission

This blueprint makes the foundational work explicit before application development accelerates. It defines what must exist, why it exists, the correct sequence, who owns each decision, and the evidence required before the next layer can safely depend on it.

The target is a coordinated modular platform, not fourteen independent microservices and not a collection of empty app folders. The fourteen application surfaces are product/runtime boundaries; packages define reusable contracts and capabilities; API owns authoritative business operations; ID supplies identity; Agent and DX execute only approved capabilities.

This document does not replace tasks.json. It explains the architecture and entry/exit gates. tasks.json remains the only source for immutable task IDs, status, dependencies, owner role, path ownership, approval requirement and evidence.

## 2. Current foundation boundary

The repository baseline has established a Node.js/pnpm workspace, versioned documentation, contributor rules, read-only task registry validator, quality gate and GitHub automation. The target application directories, domain packages, API runtime, ORM kernel, identity service, Agent runtime, DX daemon and deployment plane must not be claimed as implemented until source code and CI evidence exist.

The approved runtime baseline is Node.js 24.22.3 and pnpm 12.24.0. It is exact and must be changed only through a reviewed runtime ADR and a frozen-install CI result. GitHub Actions automation has one owner per concern as described in docs/engineering/GITHUB-AUTOMATION.md.

The root quality gate is an early foundation gate, not the final application linter. ESLint, TypeScript compilation, framework lint, CSS lint, package build, generated API contract validation and E2E suites must become real checks as the corresponding source stacks are introduced. A skipped check must remain visibly skipped; it must never be reported as passed.

## 3. Authority and document hierarchy

Resolve conflicts using this authority order:

1. Applicable law, security restrictions and explicit owner decisions.
2. Governance contract and Accepted ADRs.
3. Master blueprint and specialist blueprints.
4. tasks.json for execution identity, dependency, ownership, status, approval and evidence.
5. Implementation code, tests, CI and operational observations for actual behavior.
6. Audit reports and working notes as dated observations, not authority.

A Proposed ADR or unapproved blueprint clause is not implementation authorization. An ADR records a decision; it does not prove that implementation is complete. A task record cannot silently approve a decision that requires human approval. A GitHub merge does not prove runtime/deployment behavior.

## 4. Foundation domains

### 4.1 Repository, runtime and contributor safety

Purpose: every contributor and local AI worker uses a reproducible, reviewable workflow.

Canonical elements:
- Node.js/pnpm pins, workspace configuration and one lockfile.
- AGENTS.md plus task-scoped agent skills.
- One canonical pnpm check command mirrored in CI.
- Read-only task registry validation and truthful readiness.
- Branch/PR workflow, ownership path isolation and evidence reporting.
- GitHub source/dependency security and one release/changelog owner.

Tasks: PKG-001, PKG-002, PKG-003, GOV-001, GOV-002, GOV-007, GOV-008, GOV-011, DX-001.

Exit gate:
- Frozen install succeeds from a clean clone.
- All repository gates and tests pass.
- Task registry/dependency graph is valid.
- Local execution environment and coding-agent capabilities are explicitly verified before a host agent is invoked.
- GitHub admin settings that cannot be changed in code are recorded as owner actions.

### 4.2 Application ownership and domain authority

Purpose: prevent the same business entity, workflow or policy from being implemented by multiple apps.

Required outputs:
- One bounded-context map per domain.
- One authoritative owner for each record/entity.
- Explicit API and event contracts for every cross-app handoff.
- Explicit trust/deployment zones and process boundaries.
- System-of-record map for Odoo, network systems, platform records, corpus sources and task/documentation records.
- No direct database sharing between app frontends or agents.
- No assumption that each app requires its own microservice or database.

Tasks: APP-001, APP-002 through APP-008; GOV-003 through GOV-006; API-001; domain source audits such as BSS-001 and OSS-001.

Human decision points:
- Identity and actor-context trust roots.
- Odoo/database ownership and any transition/cutover.
- Domain ownership disputes.
- Public/internal contract and authorization rules.
- Production and privileged deployment classes.

Exit gate:
- Each domain has an accountable owner and source-of-truth record.
- Every cross-domain mutation uses an owning API operation.
- Each event has a producer, consumer, schema version and idempotency contract.
- Trust zones and privileged execution boundaries are reviewed and approved.

### 4.3 Base platform contracts

Purpose: define stable shared primitives before app packages invent incompatible IDs, errors, contexts, events and extension interfaces.

Canonical outputs:
- Stable ID format and collision rules.
- Typed error envelope and error taxonomy.
- Trusted request/actor/tenant/workload context contracts.
- API/client contract versioning, pagination, filtering, idempotency and correlation.
- Event envelope, schema evolution, replay and deduplication.
- Capability descriptors and policy references.
- Explicit public export maps and runtime compatibility.
- No Base dependency on an app or domain add-on.

Tasks: GOV-004, GOV-005, PKG-003, PKG-004, APP-003.

Exit gate:
- Contracts are typed, versioned, validated and documented.
- Consumer/provider compatibility tests exist.
- Base dependency direction is automatically checked.
- The owner-approved identity/capability context is available to API and Agent.

### 4.4 API, identity and persistence foundation

Purpose: provide one authoritative application boundary for business operations while preserving Odoo-owned records.

Canonical outputs:
- API runtime and composition lifecycle.
- Authentication and trusted actor context from ID.
- Model/field/relation registry with single-owner declarations.
- Scoped persistence adapter, tenant/transaction boundaries and audit.
- Domain AST/record operations and authorization policy.
- Version-aware Odoo integration through supported APIs only.
- Migration governance and source-of-truth/transition matrix.
- OpenAPI and operational contracts.

Tasks: API-001 through API-013; ID-001 through ID-009; GOV-003, GOV-004, GOV-006 and GOV-010; APP-005.

Human decision points:
- API/database ownership audit (API-001).
- OIDC provider architecture, client registry, secret references and trust root.
- Exact Odoo versions/endpoints/ownership and migration boundaries.
- Security threat model and high-risk approval matrix.

Exit gate:
- Read/write operations are use-case and policy controlled.
- No direct Odoo database writes or unscoped ORM access exist.
- API resource servers validate issuer, audience, signature, expiry, scopes and actor context.
- Migrations are versioned, owner-bound and recoverable.
- API contracts are published and consumer tests pass.

### 4.5 Package and Add-on foundation

Purpose: let domain capabilities be installed/composed as governed packages without bypassing shared contracts, API authority or data ownership.

Canonical outputs:
- Strict add-on manifest schema and typed SDK.
- Immutable stable add-on/package IDs and SemVer compatibility.
- Dependency graph and conflict validation.
- Model/field extension registry and deterministic composition.
- Capability and permission registry.
- Immutable artifact integrity/provenance validation.
- API/Agent/Web/Docs realm-specific entrypoints.
- Lifecycle, migration, upgrade, disable and decommission rules.
- One reference add-on after the required API/ORM interfaces exist.

Tasks: PKG-004, PKG-005 through PKG-009, ADD-001 through ADD-011, GOV-006, GOV-009, GOV-010, GOV-011.

Decision gate:
- ADR-0003 remains Proposed until the repository owner/security reviewers approve its trust, permission and destructive-operation decisions.
- No production package download, arbitrary code loading, signer trust or destructive migration is authorized by a manifest.
- Initial package artifacts come from reviewed workspace code and immutable build outputs.

Exit gate:
- Every manifest is validated before code execution or capability registration.
- Dependency/ownership/permission conflicts fail closed.
- API re-checks permissions at runtime.
- Disabled add-ons expose no routes/tools/jobs/events/navigation.
- Data remains available when an add-on is disabled.
- Artifact source, digest and provenance are traceable.

### 4.6 Agent and DX execution foundation

Purpose: give humans and coding agents a bounded, observable workbench without turning a model into a privileged host administrator.

Canonical outputs:
- Provider-neutral Agent capability client and trusted context.
- Explicit tool manifests, policy and approval matrix.
- Durable workflow/cancellation/evaluation and safe diagnostics.
- DX task reader, atomic claims, leases and worktree lifecycle.
- Isolated command runner, resource limits, path allowlists and kill switch.
- Diff review, acceptance evidence and CI/GitHub status integration.
- Local adapter inventory on the target workstation.

Tasks: AGT-001 through AGT-010; DX-001 through DX-014; GOV-010, GOV-011; API-013.

Human decision points:
- DX-001 local host inventory and agent CLI capability verification.
- GOV-010 privileged daemon/security threat-model approval.
- Any local command/network/provider permission beyond safe read-only inspection.
- Production secrets or Docker/infra privileges remain out of ordinary agent capabilities.

Exit gate:
- An agent cannot mutate tasks or claim paths outside the serialized coordinator.
- Each worker runs in an isolated worktree with bounded commands and a kill switch.
- Business writes occur through the API with actor identity and audit.
- Test/build results, diffs and task evidence are independently recorded.
- First end-to-end task-to-commit vertical slice passes before multi-agent parallel execution is enabled.

### 4.7 Experience and domain applications

Only build a product app when the shared interfaces and owner-specific source evidence are adequate. Prefer one vertical slice over broad scaffolding.

- Web: public MoonWitness landing and research/Community after WEB-001 and Community CSS scope is confirmed.
- OSS/BSS/ISP: domain ownership and Odoo/source-system audit first; no guessed live integrations.
- ID: select identity protocol/provider and client contracts before login implementation.
- Docs: docs sources/access classification exists; portal and progress view must remain projections.
- Mobile/Desktop: validate native/runtime compatibility and identity/deep-link/security contracts first.
- Cloud/RIOT: privileged runners, scopes, egress, teardown and human approval before any runtime action.
- A-L-L-A-H: source/corpus/legal provenance and creative boundaries before public knowledge publishing.
- UI/Assets/Narrative: source and rights inventory, tokens and canon approval before building reusable creative catalogs.

Tasks remain the primary app/domain workstreams in tasks.json. Do not create app folders merely to make the tree appear complete.

## 5. Dependency gates and recommended implementation sequence

This sequence describes prerequisites, not a new status ledger. The exact dependencies in tasks.json are authoritative and may impose additional gates.

| Gate | Required foundation | Canonical task families | Exit evidence |
|---|---|---|---|
| F0 — Repository control | Runtime, package manager, CI, agent policy and task validation | PKG-001/002/003; GOV-001/002/007/008; DX-001 | Frozen install, quality/test run, local environment status |
| F1 — Domain authority | Actor context, source ownership, bounded contexts and trust zones | APP-002; API-001; GOV-003/004/006/010 | Owner-reviewed ownership, capability and trust maps |
| F2 — Shared contracts | IDs/errors/context/events/API conventions | PKG-004; GOV-004/005; APP-003 | Schema and consumer/provider tests |
| F3 — Core API/identity | API bootstrap, identity, model registry, authorization, persistence and Odoo boundary | API-002 through API-013; ID-001 through ID-009 | Runtime, security, migration and OpenAPI evidence |
| F4 — Extension platform | Add-on manifest, resolver, trust, permissions, lifecycle and storage | ADD-000 proposal, ADD-001 through ADD-007 | Manifest/compatibility/security gates and approved ADR |
| F5 — Runtime contributions | Agent/Web/Docs adapters and first reference add-on | ADD-008/009; AGT-005; WEB-005; API-011 | End-to-end add-on with API/Agent/Web tests |
| F6 — Operational maturity | Upgrade/rollback/decommission, security diagnostics, CI release policy | ADD-010/011; GOV-011; PKG-008/009 | Recovery/rollback and release gate evidence |
| F7 — Product expansion | App-specific user journeys after domain prerequisites | WEB, OSS, BSS, ISP, ID, DOCS, MOB, DESK, CLOUD, RIOT, ALLAH, UI and asset tasks | Real API-integrated slice and app-specific release evidence |

No gate can be skipped by changing a dependency edge merely to increase ready-task counts. A blocked or approval-gated dependency remains blocked until its owner-approved exit evidence exists.

## 6. Parallel execution and file ownership

Parallel work is permitted only when all of the following hold:

1. Dependencies are complete and required approvals are present.
2. The workers have non-overlapping declared file ownership.
3. Shared interfaces are agreed before separate implementations begin.
4. Every worker uses a branch/worktree and reports exact commands/evidence.
5. Shared critical files use a serialized owner/CAS update, never a stale whole-file replacement.

Serialized surfaces include package.json, pnpm-lock.yaml, pnpm-workspace.yaml, turbo.json, root TypeScript/ESLint/Prettier configuration, tasks.json, Base exports, model registry, API composition, identity client registry and global design tokens.

Do not assign parallel agents to multiple changes of the same root config, manifest, package registry, ADR register or task ledger. A reviewer/integrator owns merging shared-surface changes.

## 7. Approval and owner-action register

The following cannot be concluded from repository-only access and must remain owner-controlled:

| Owner action | Related tasks | Why an owner is required |
|---|---|---|
| Provide safe local workstation inventory and inspect installed agent CLIs | DX-001 | The connected GitHub integration cannot inspect the user's OS, local Git/worktrees, agent binaries or local model endpoints |
| Approve the privileged DX daemon threat model and command/egress boundary | DX-002, GOV-010 | Local host commands and infrastructure capabilities cross a privileged trust boundary |
| Approve API/database ownership and Odoo system-of-record map | API-001, GOV-006, APP-005 | Production schema, customer data and legacy write paths require authorized read-only inspection and ownership confirmation |
| Approve trusted identity/actor and service identity architecture | GOV-003, GOV-010, ID tasks | Issuer, audience, trust roots, workload identities and session ownership affect platform security |
| Approve cross-app capability and HTTP contract policy | GOV-004, APP-003 | Public/internal APIs and event authority are platform-wide contracts |
| Approve add-on signing/trust roots and elevated permission policy | ADR-0003, ADD tasks, GOV-010 | This defines which executable code can obtain privileged platform capabilities |
| Approve destructive migrations, removal of legacy data or external publication | API, ADD, DOCS, domain tasks | These actions can irreversibly affect data, rights, privacy or public communication |
| Enable supported GitHub repository security settings and required checks | GOV-011 | These are repository administrator settings, not file-level workflow declarations |
| Confirm Community CSS meaning and social/community product scope | WEB-001, WEB-012, WEB-013 | The existing source explicitly leaves the meaning unresolved |

An owner action is not a blocker to unrelated documentation, schema fixtures or read-only validation that stays inside approved scope. It is a hard stop for the dependent privileged implementation.

## 8. ADR discipline

An ADR is required for material changes to:
- application/package boundaries or dependency direction;
- model/record ownership, schema or migration policy;
- identity, authorization, capability and trust roots;
- add-on manifest, artifact trust, lifecycle or permission inheritance;
- cross-app API/event contracts and versioning;
- production execution, CI/release/rollback or deployment topology;
- canon, publication, rights or restricted-content handling.

Each ADR records the problem, options including defer, decision owner, exact approval scope, consequences, security/data effects, migration/rollback, verification and related tasks. Proposed ADRs guide investigation only. Accepted ADRs do not replace implementation evidence. Superseding decisions create a new ADR and preserve historical reasoning.

## 9. Repository quality and automation contract

The canonical quality gate is pnpm check. CI must execute the same command after pnpm install --frozen-lockfile. No agent or workflow may bypass failures using warning-only checks, continue-on-error or fake success evidence.

GitHub automation ownership remains non-overlapping:
- CI owns deterministic lint/format/type/test result.
- CodeQL owns source-code security scanning.
- Dependency Review owns the changed dependency risk on PRs.
- Dependabot proposes dependency updates.
- Release Please owns automatic version/changelog/release metadata.
- Repository admins own enabling code scanning/dependency graph, secret scanning, Actions PR permissions and main-branch rulesets.

Do not add another changelog writer, dependency updater or quality workflow with overlapping authority. See docs/engineering/GITHUB-AUTOMATION.md.

## 10. Definition of done

Foundation is complete only when:
- Required domain and actor authorities are explicit and accepted.
- Shared IDs/errors/context/contracts/events are typed, versioned and validated.
- API and persistence respect record ownership and legacy Odoo boundaries.
- Add-on trust, manifest, dependency, permission, extension and lifecycle rules are automated.
- Agent/DX work is safely isolated with durable claims, evidence and recovery.
- Each app's first vertical slice uses real authorized API contracts and truthful operational states.
- Quality, security, release and rollback checks are executable and required.
- All remaining owner decisions are visible in ADRs/tasks with explicit scope and no AI-generated approval.

An architecture document, directory scaffold, successful install or merged PR is not, by itself, proof of a completed platform capability.
