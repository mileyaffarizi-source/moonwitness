# BLUEPRINT-API — FASTIFY AUTHORITY REALM

**Document ID:** MW-BP-API-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS + pnpm · **Framework:** Fastify · **Persistence:** Odoo-oriented Model Kernel backed by MikroORM

## 1. Mission

**apps/api** is the shared modular authority for business operations and platform-owned records across fourteen application surfaces. It remains one API runtime initially, not an excuse to merge all domains into shared unowned logic. It composes Base Platform, model registry, ORM, security, add-on capabilities, domain use cases, integrations, events and API contracts.

The API is not a bag of route handlers. It is the composition root for an explicit application architecture.

## 2. Responsibility boundaries

API owns HTTP transport, validation/versioning/OpenAPI, authentication integration and authorization, application use cases/domain services, model/field/relation registry, add-on extension composition, record APIs/domain queries/access policies, MikroORM lifecycle and transactions, protected capability endpoints, Odoo adapter, transactional outbox/events/jobs, audit, health/readiness and diagnostics.

API does not own AI reasoning, visual rendering or native Odoo database internals.

## 3. Runtime and startup lifecycle

Use a feature/domain-based dependency direction. Startup is deterministic:

**load config → initialize telemetry/logging → initialize persistence adapter → discover trusted add-on manifests → validate dependencies → compose model metadata → validate policies → initialize domain services → register routes/jobs/events → readiness**

Do not accept traffic until composition and required dependencies are valid. Startup failure must be observable. Shutdown stops new work, drains requests/jobs, closes queue/database resources and flushes telemetry within a deadline.

## 4. Odoo-oriented model kernel

**MikroORM is the persistence engine; the platform ORM is the application model system.**

Add-ons use a declarative, platform-owned SDK. They do not receive unrestricted EntityManager.

Required kernel capabilities:
1. stable model ID and explicit owner;
2. typed field descriptors with validation, nullability, defaults and exposure metadata;
3. relation descriptors with cardinality, inverse, ownership, deletion policy and target validation;
4. deterministic extension composition with collision detection;
5. model registry and immutable runtime metadata after startup;
6. typed domain/query AST compiled to parameterized persistence queries;
7. record operations equivalent to create/read/write/unlink;
8. bounded pagination, projection and safe DTO serialization;
9. computed/derived fields with explicit dependency/write semantics where implemented;
10. request/job-scoped actor, company, tenant, locale and permission context where applicable;
11. model access rights, record rules and field security;
12. audit and transaction boundaries.

This is an Odoo-inspired subset, not compatibility with native Odoo Python ORM.

## 5. MikroORM adapter rules

Initialize business persistence once through API composition root. Register explicit entity metadata from validated add-on declarations. Use request-scoped EntityManager/RequestContext and independent background-job context. Keep EntityManager, metadata storage and connections inside the adapter. Route persistence through approved repositories/record operations.

Never use a global EntityManager; let add-ons open a competing ORM; mutate undocumented MikroORM internals; expose DB connections to Agent/Web; write Odoo-owned tables; or run unrestricted production schema synchronization.

A proof of concept must compose models from at least two independent add-ons, persist/query through the model API, enforce access rules and use a real integration database.

## 6. Domain query and record behavior

Define a validated AST for AND/OR/NOT, comparisons, membership, null checks and approved relation traversal. Validate field names/operators against registry. Compile values as bound parameters. Restrict relation traversal, sortable fields, projections, page size and query cost.

Record operations enforce model access, record rules and field policy; validate relation visibility; run business validation/hooks in defined order; execute required transactions; write audit/outbox atomically where needed; and return safe DTOs, never MikroORM entities.

## 7. Security model

Authentication establishes identity; authorization decides the action. Support RBAC/capabilities, model access, record rules, field permissions and tenant/company separation where required.

Security invariants:
- deny by default and fail closed if policy metadata is invalid;
- do not trust roles or IDs from request payloads;
- UI visibility is not a security boundary;
- prevent IDOR and relation traversal leaks;
- redact before serialization;
- test create/read/update/delete separately;
- audit privileged/sensitive actions;
- rate-limit public and expensive operations;
- use CSRF/session defenses appropriate to chosen auth;
- secrets are never source-controlled.

## 8. Add-on composition

Validate manifests before registering capabilities. Sequence:

**discover → validate manifest → verify source/trust → resolve dependencies → validate compatibility → compose model declarations → validate fields/relations/rules → register API contributions → initialize → health check → ready**

Disabled add-ons register no routes, jobs, tools, scheduled work or Web metadata. Disabling preserves data. Upgrades need migration and backup plan. Uninstall is explicit decommissioning, never implicit cleanup.

See [BLUEPRINT-PACKAGE-ADDON.MD](./BLUEPRINT-PACKAGE-ADDON.MD).

## 9. Transactions, events and jobs

Keep business invariants in API-owned use cases. Use explicit transactions and transactional outbox for durable events. Version event payloads and validate producers/consumers. Use idempotency for retryable writes. Use BullMQ for workloads that need queue semantics. Define retryable/permanent failures, timeout, cancellation, dead-letter handling and operator recovery. Do not add Kafka/microservices without measured need.

## 10. Odoo legacy integration and zero migration

Existing Odoo records remain Odoo-owned. Use supported version-aware APIs through a dedicated adapter. Never write Odoo-owned tables with MikroORM. No bulk migration at startup or add-on installation. Preserve external IDs, source model/version, mapping version and sync cursor where needed.

Verify existing Odoo 17 environment independently. Do not assume protocols documented for a newer Odoo release exist on Odoo 17.

## 11. API contract

Every route declares method, path/version, operation ID, authentication, permission, request/response schema, stable error code, pagination/idempotency, classification, rate/timeout budget, side effects, owner and deprecation plan.

Use Zod/shared schema as source of truth where possible, then generate and validate OpenAPI. Internal Agent endpoints are separately authenticated and narrowly scoped.

## 12. Observability

Log request/trace ID, actor stable reference, add-on ID/version, model ID, operation, job ID and outcome. Never log secrets or raw sensitive payloads. Distinguish liveness from readiness. Provide DB, queue, outbox, add-on registry and migration diagnostics.

## 13. Required tests

Model composition/conflicts; real MikroORM metadata composition; domain AST validation/parameterization; context isolation; model/record/field access and relation traversal; rollback/outbox atomicity; idempotency/concurrent updates; add-on lifecycle/compatibility; Odoo fixtures; OpenAPI; rate/payload limits; shutdown/failure behavior.

## 14. Delivery sequence

Audit → Fastify bootstrap → composition root → ORM proof of concept → model kernel → security → add-on registry → domain use cases → API contracts → events/jobs → Odoo connector → integration tests → production readiness.

## 15. Task ownership

Tasks **API-001 through API-013** in [tasks.json](./tasks.json).

## 16. Definition of done

Every business write is an authorized API-owned use case; model composition is deterministic; add-ons cannot bypass persistence/security; real DB and security tests pass; legacy Odoo tables remain untouched by MikroORM; side effects are attributable, observable and recoverable.

## 17. Fourteen-app domain composition

Compose domain capabilities behind explicit API modules and add-on ownership:
- Identity integration and token validation consume apps/id issuer/client contracts; API remains the resource authorization point.
- OSS owns network inventory, telemetry, alarms, provisioning and assurance through network adapters.
- BSS owns commercial customer/order/subscription/invoice/payment data, subject to legacy Odoo transition rules.
- ISP owns subscriber service orchestration between BSS and OSS.
- Cloud owns resource/deployment control-plane records; privileged applies run outside request workers.
- A-L-L-A-H and MoonWitness content domains use source-aware corpus/claim/provenance models.
- RIOT lab records and operations remain isolated from production modules.
- DX task/agent execution records do not grant business or infrastructure authority.

Do not let each app create its own database copy of shared identities, customers, network resources or canonical corpus. Reference the authoritative domain through approved API contracts and external IDs.

## 18. Trust zones and API deployment policy

Treat identity, network management, infrastructure control and security labs as distinct trust zones. The common API may compose domain routes, but credentials, policy and execution workers remain separately scoped. Consider separate API deployment pools only where a threat model or availability requirement justifies it; record the boundary in an ADR.

DX, Cloud, OSS and RIOT privileged operations must use dedicated capability endpoints, service identities, scoped approvals, command allowlists and audit. Public Web/API routes cannot invoke privileged runners directly.
