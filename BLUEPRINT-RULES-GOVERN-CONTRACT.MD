# BLUEPRINT-RULES-GOVERN-CONTRACT — PLATFORM CONSTITUTION & EXECUTION CONTRACT

**Document ID:** MW-BP-GOV-001 · **Version:** 2.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Audience:** Human owners, local AI agents, CI systems, add-on authors and operators.

## 1. Purpose and authority

Precedence:
1. applicable safety/legal restrictions and explicit human decisions;
2. this governance contract and approved ADRs;
3. BLUEPRINT.md;
4. specialized blueprint for the relevant domain;
5. tasks.json for executable state, ownership and dependencies;
6. implementation notes.

A lower-level document cannot silently override a higher-level rule. A conflict becomes a task/ADR, not a guess.

## 2. Non-negotiable platform laws

1. Exactly sixteen named applications are defined in BLUEPRINT-APPLICATIONS.MD. This does not require sixteen microservices.
2. Node.js LTS + pnpm + pnpm Workspaces + Turborepo. No Bun.
3. API is business authority and only business-data write boundary.
4. Agent calls approved API capabilities; no direct business DB access.
5. Web uses API contracts; no direct DB access.
6. Odoo-inspired model/record architecture is platform-owned; MikroORM is private persistence adapter.
7. Add-ons extend through SDK/manifests; they do not bypass Base, ORM or security.
8. Existing Odoo-owned data remains Odoo-owned; no big-bang migration.
9. Every model, schema object, package, capability and asset has explicit owner.
10. Disabling an add-on preserves data.
11. Security defaults to deny.
12. Human authority remains in control of canon, sensitive actions and production releases.

## 3. Repository and implementation truth

Blueprints describe target state, not current implementation. Every AI agent inspects actual code, manifests, tests and runtime behavior before making claims.

Never mark work complete because a file/folder exists; weaken tests to claim success; create fake APIs/health checks; fabricate output/data/deployment status; hide failures; rewrite source/data without backup and approval; introduce frameworks/databases without ADR; or change public contracts without compatibility review.

Record behavior baseline, proposed change, tests, unresolved limitations and rollback path.

## 4. Data and ORM contract

MikroORM is only behind API adapter. Model registry, fields, relations, extensions, domains and record operations belong to platform ORM. All access/serialization passes through model/record/field policies. Request and job contexts are isolated. Queries are parameterized/bounded. Transactions own related writes/outbox. Audit material changes. Schema ownership is explicit. Existing Odoo tables are never written by MikroORM. Migrations are explicit, versioned, reviewed and reversible where possible. Production startup never performs destructive schema sync.

## 5. Identity, security and authorization

Verified actor context includes actor ID, authentication method, applicable tenant/company scope, credential type, session/request ID, permission source and expiry. Untrusted request fields or model arguments cannot establish identity.

Enforce authentication at trust boundaries; endpoint/capability permission; model rights; record rules; field read/write; tenant/company scope where applicable; safe relation traversal; redaction; rate/payload/timeout/concurrency limits; secure session/secrets; and audit for sensitive operations.

Fail closed when policy metadata is absent/invalid. Admin bypass is explicit, narrow, auditable and not exposed to Agent by default.

## 6. Cross-realm contracts

Every app-to-app interaction uses typed, versioned contracts. Changes declare compatibility, owner, consumers and migration plan.

### 6.1 HTTP contract
A route defines method, path/version, operation ID, auth, capability, request/response schema, stable errors, idempotency, pagination, rate/timeout, classification, audit side effects and deprecation.

### 6.2 Event contract
Envelope fields: eventId, type, schemaVersion, occurredAt, producer/version, correlationId, optional causationId, safe actor/execution attribution, applicable tenant/company context and typed payload.

Events are immutable facts, not commands or replacements for authoritative state. Consumers are idempotent and schema-version aware.

### 6.3 Agent capability contract
Tool defines typed input/output, capability ID, risk, permission, API operation, timeout, retry/idempotency, data classification, approval and audit behavior. Agent context cannot grant itself permission.

### 6.4 Web contribution contract
Contribution defines stable ID, route/navigation, required capability, theme/asset references and component entrypoint. API enforces all access.

## 7. Asset and canon contract

Production asset requires source, owner, usage rights, version, status and metadata. Generated output is not automatically canon or approved deliverable. AI relationship suggestions remain proposals. Exact original wording is preserved. Creative restrictions cover prompts, assets, exports, metadata and UI previews.

Do not visually depict Allah, Prophet Muhammad or Isa/Jesus. Preserve permitted textual references only in authored context.

## 8. Central task registry

**tasks.json is the only canonical execution ledger.** Markdown checklists explain work; they do not maintain separate progress states.

Each task records immutable ID, title/workstream, phase/priority/status, bounded scope, dependencies, owner/claim, inputs, output paths, steps, acceptance, verification, ownership paths, risk/human approval, evidence and timestamps/blocker.

### 8.1 Status model

Allowed statuses: pending, claimed, in_progress, blocked, blocked_policy, in_review, done, deferred, cancelled.

Only mark done when every acceptance criterion passes and verification evidence is recorded. Partial implementation remains in_progress or in_review. Missing dependency is blocked. Creative-boundary stop is blocked_policy.

### 8.2 Claiming and concurrency

A worker claims tasks atomically with agent ID, claim time, lease expiry, worktree/branch and owned paths. Another agent cannot take an unexpired claim. Expired claims return to pending only after checking working tree, uncommitted changes and recent commits.

No two agents edit the same exclusive path concurrently. Shared files (root manifests, lockfile, task registry, composition root, shared exports, ORM registry, tokens and global route registry) require serialized integration ownership.

Prefer isolated worktrees/branches. Never overwrite another worker's uncommitted work. tasks.json updates must be atomic, schema-valid and preserve unrelated entries.

### 8.3 Dependencies and parallelism

Dependencies form a directed acyclic graph. A task starts only when required dependencies are done, or a human-approved exception is recorded. Parallel work is allowed only after interfaces/ownership are stable. Do not remove a dependency to make the queue look parallel.

### 8.4 Completion evidence

Allowed evidence: commit SHA, test report, CI URL, command output, review record, asset checksum, migration report, deployment ID, screenshot/recording where relevant or manual check. Evidence names what was verified and environment/version. Redact sensitive data.

## 9. Local AI execution protocol

For each claimed task:
1. Read this contract, parent blueprint, specialist blueprint and dependencies.
2. Inspect actual repository and working tree.
3. Confirm ownership paths are not being changed by another worker.
4. Write a bounded implementation plan.
5. Make the smallest coherent change satisfying task.
6. Add/update tests alongside implementation.
7. Run verification in actual Node.js/pnpm environment; never fabricate success.
8. Review compatibility, security, data impact and rollback.
9. Record outputs, changed paths, evidence and limitations.
10. Update task status atomically.
11. Commit only intended scope.
12. Report blockers without claiming completion.

If repository contradicts blueprint, stop conflicting portion and create ADR proposal. Do not blindly rewrite production code.

## 10. Human approval gates

Approval required for destructive/irreversible data/schema changes; Odoo write/migration outside approved adapter use; production deployment/rollback with data implications; security/privilege escalation; publishing canon; resolving ambiguous identities/relationships; external communications/financial commitments; unclear asset rights; content near creative restrictions; changing governance or non-negotiable architecture law.

Approval is bounded to exact action, not an unspecified future class.

## 11. Quality gates

Applicable checks: install, lint, format, typecheck, build; unit/integration/contract/browser tests; architecture dependency checks; security/dependency/secrets scans; migration/preservation tests; accessibility/reduced-motion; asset provenance/format; Docker health/shutdown/recovery.

A mock is not production integration proof. A green test suite does not prove coverage of intended risk.

## 12. ADR and change management

Material decisions require ADR ID, context, options, decision, consequences, affected docs/packages, compatibility, security/data impact, validation and owner. Blueprint changes update affected specialist docs and task references together. Keep version/date/history.

## 13. Release and rollback

Build immutable artifacts, pin lockfile, scan dependencies/images, deploy staging, verify health and real smoke behavior, require configured human approval for production, deploy incrementally, observe, retain rollback. Database migration is a separate reviewed plan; code rollback does not guarantee data rollback.

## 14. Task ownership

Tasks **GOV-001 through GOV-012** in [tasks.json](./tasks.json).

## 15. Definition of done

Repository has a verifiable task DAG, claims do not collide, dependencies/approvals are enforced, contracts are versioned, security/ownership boundaries hold, evidence is attached to completion and no worker can turn a proposal into an authoritative result.

## 16. Sixteen-app governance addendum

The app inventory in BLUEPRINT-APPLICATIONS.MD is authoritative. The sixteen apps are:
apps/agent, apps/api, apps/web, apps/OSS, apps/BSS, apps/id, apps/docs, apps/desktop, apps/mobile, apps/cloud, apps/isp, apps/dx, apps/A-L-L-A-H, apps/riot, apps/astronauts and apps/arsy.

Do not reintroduce the superseded exactly-three-app constraint. Do not interpret the sixteen directories as an automatic mandate for sixteen separately deployed microservices.

### 16.1 Mandatory ownership distinctions

- BSS owns commercial records; OSS owns technical/network operational records; ISP owns subscriber service orchestration.
- ID owns identity/authentication integration; API/domain owners enforce record/resource authorization.
- Vault/KMS owns secret values; apps/id and other apps use scoped identities/references.
- DX owns developer orchestration, not business data authority.
- Docs renders canonical documentation/task status; it does not create a parallel task ledger.
- Web owns MoonWitness landing/community. A-L-L-A-H owns its separate flagship landing/corpus experience.
- Cloud, OSS and RIOT privileged runners are isolated from public request workers and from each other.

### 16.2 DX-first engineering rule

DX is the first priority for building the implementation factory. Begin with a safe task reader/validator, dependency graph, atomic task lease, isolated Git worktree and one approved agent adapter. Do not start autonomous multi-agent production execution before file ownership, command sandbox, approval gates and evidence validation exist.

### 16.3 Identity and secrets rule

Use standards-compliant OIDC/OAuth provider integration. Do not invent an identity protocol. Public/native clients use the appropriate Authorization Code + PKCE flow and secure platform-specific session handling. Never place secret values in ID tokens, task files, source code, prompts or logs. Secret values belong to a dedicated vault/KMS with workload identity, narrow policies, audit and rotation.

### 16.4 Cloud/OSS/RIOT privileged operation rule

Infrastructure apply, network configuration, production deployment and security-lab execution require scoped identities, exact resource scope, command/tool allowlists, policy checks, immutable audit and human approval when risky. Public frontends and generic Agents cannot directly access host shell, Docker sockets, network devices or cloud admin credentials.

### 16.5 Corpus and legal knowledge rule

Divine/primary corpus, translations, commentary, human law, government documents and AI analysis remain separate source classes with version/provenance. Legal status is jurisdiction/date-dependent. AI-generated ontology edges and interpretations remain proposals until reviewed. No restricted visual depiction is generated.

### 16.6 Community and content rule

User-generated community content is not editorial canon. Define moderation, reporting, privacy, content rights and abuse handling before public rollout. The meaning of the label CSS remains unconfirmed until verified from source/owner.

### 16.7 Astronauts machine-control authorization

- Astronauts is the only fleet controller for enrolled host/remote Edge Agents; it does not provision cloud resources or own developer worktrees.
- Every operation is a typed, versioned capability with exact host scope, expiry, nonce/idempotency and a signed grant from the API authority.
- Edge Agents initiate outbound mutually authenticated connections. No general inbound SSH, shell, Docker socket, arbitrary filesystem, script/eval or model-supplied command execution is exposed.
- Enrollment, certificate rotation/revocation, anti-replay, agent update signature, job cancellation, kill switch and immutable execution evidence are required before production use.
- Human approval is required for production/destructive/high-impact operations and is bound to the exact target and action payload.

### 16.8 Arsy telecom protocol boundary

- Arsy implements telecom wire protocols and protocol-session handling only. ISP owns subscriber service lifecycle and entitlements; BSS owns commercial/billing truth; OSS owns network inventory, incident and provisioning workflows.
- RADIUS secrets and device credentials are delivered from a dedicated vault just in time. No plaintext credential storage, task-file secrets, UI secrets or AI context secrets.
- RADIUS accounting/session events, ACS outcomes and normalized Syslog are exported with versioned contracts, correlation IDs, source identity and bounded retention; no direct database sharing.
- Production PPPoE AAA, CoA/Disconnect, ACS configuration RPC and trusted Syslog ingestion require replay/DoS, source-authentication, failover and load testing.
- TR-369/USP remains a separately evaluated future compatibility track; it is not a requirement for the initial TR-069 ACS slice.

### 16.9 RIOT safety and authorization

War-equipment archive work is limited to historical, journalistic, fictional or non-operational metadata/media. Do not create instructions for weapon construction, acquisition, modification, targeting or operational deployment. Red-team work defaults to isolated synthetic labs with written authorization, fixed scope, expiry, egress controls, kill switch and audit.
