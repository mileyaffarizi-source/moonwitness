# BLUEPRINT-API — FASTIFY AUTHORITY REALM

**Document ID:** MW-BP-API-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS + pnpm · **Framework:** Fastify · **Persistence:** Odoo-oriented Model Kernel backed by MikroORM

## 1. Mission

**apps/api** is the shared modular authority for business operations and platform-owned records across sixteen application surfaces. It remains one API runtime initially, not an excuse to merge all domains into shared unowned logic. It composes Base Platform, model registry, ORM, security, add-on capabilities, domain use cases, integrations, events and API contracts.

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

## 17. Sixteen-app domain composition

Compose domain capabilities behind explicit API modules and add-on ownership:
- Identity integration and token validation consume apps/id issuer/client contracts; API remains the resource authorization point.
- OSS owns network inventory, telemetry, alarms, provisioning and assurance through network adapters.
- BSS owns commercial customer/order/subscription/invoice/payment data, subject to legacy Odoo transition rules.
- ISP owns subscriber service orchestration and entitlement state between BSS and OSS.
- Astronauts owns enrolled host identity, fleet heartbeat, host inventory and signed job execution evidence; the API authorizes every privileged capability.
- Arsy owns RADIUS/ACS/Syslog protocol-session runtime and normalized protocol events; it is not a subscriber, billing or network inventory master.
- Cloud owns resource/deployment control-plane records; privileged applies run outside request workers.
- A-L-L-A-H and MoonWitness content domains use source-aware corpus/claim/provenance models.
- RIOT lab records and operations remain isolated from production modules.
- DX task/agent execution records do not grant business or infrastructure authority.

Do not let each app create its own database copy of shared identities, customers, network resources or canonical corpus. Reference the authoritative domain through approved API contracts and external IDs.

## 18. Trust zones and API deployment policy

Treat identity, network management, infrastructure control and security labs as distinct trust zones. The common API may compose domain routes, but credentials, policy and execution workers remain separately scoped. Consider separate API deployment pools only where a threat model or availability requirement justifies it; record the boundary in an ADR.

DX, Cloud, OSS, Astronauts, Arsy and RIOT privileged operations must use dedicated capability endpoints, service identities, scoped approvals, command/protocol allowlists and audit. Public Web/API routes cannot invoke privileged runners directly.


## 19. Astronauts and Arsy capability boundaries

- The API is the authority that authenticates the requesting actor, evaluates domain/resource authorization, records approval and issues exact-scope short-lived execution grants for machine operations. Astronauts verifies and enforces those grants at the machine-fleet boundary; it does not invent business permission.
- Agent and DX call only documented API capabilities. They never connect directly to an Astronauts Edge Agent, RADIUS listener, ACS endpoint or Syslog listener to bypass policy.
- Arsy consumes versioned, time-bounded policy projections from API/ISP/BSS and sends protocol events/results through approved contracts/outbox. It never writes subscriber, invoice, service lifecycle or OSS inventory tables directly.
- Astronauts and Arsy may own isolated operational stores for their respective machine/protocol runtime state. They do not share databases or become shadow copies of API-owned business records.


## 20. API resource, error and versioning contract

Every route is owned by a named domain capability and specifies method/path/version, request/response schema, authentication audience, authorization rule, tenant/resource scope, idempotency requirement, rate/size limit, timeout, expected side effects, audit event, data classification and deprecation policy.

Use stable machine-readable error codes with HTTP status and safe user-facing message. Distinguish validation, authentication, authorization, conflict, stale version, rate-limit, dependency-unavailable, timeout, partial outcome and unknown outcome. Never return stack traces, SQL, secret references with resolved values or raw provider error payloads to clients.

Mutations that can be retried accept an idempotency key bound to principal, operation and canonical request hash. Reuse of the same key with a different request returns conflict. ETags/record versions or equivalent optimistic concurrency prevent lost updates.

## 21. Model kernel and Odoo semantic contract

Each model descriptor defines stable technical ID, owning domain/add-on, persistence owner, display name, lifecycle, fields, relations, indexes/constraints, access policy hooks and version. Field descriptors define type, required/nullability, default, stored/computed, readonly, sensitive classification, relation target, validation, serialization and migration compatibility.

The domain query language is a parsed/typed AST, never interpolated SQL or arbitrary JavaScript. Validate field/model/operator access before query compilation. Parameterize all values; bound query depth, list size, joins, sorting and pagination. Record access is evaluated after model/field policy and before data is returned.

Odoo-oriented APIs (create, read, write, unlink, search, search_count, context/defaults, computed fields and relations) are compatibility semantics, not permission to reproduce unsafe legacy behavior. Unsupported semantics must be documented and tested rather than silently approximated.

## 22. Authorization decision pipeline

For every operation:
1. Validate token signature, issuer, audience, expiry and token type.
2. Resolve initiating human, workload identity, tenant and delegated grant separately.
3. Resolve canonical resource/model ownership and requested capability.
4. Evaluate endpoint, domain, record, field and relation policy; default deny.
5. Check approval, environment, resource version, data classification and policy version.
6. Apply row/field filtering before read serialization; prevent count/search side-channel leakage.
7. Persist mutation and audit atomically or through a transactional outbox.
8. Return a correlation ID and stable outcome state.

API authorization remains the policy authority for Astronauts signed grants, Arsy policy projections, OSS provisioning and BSS financial operations. A service adapter may enforce a grant locally but may not issue itself broader business permission.

## 23. Transaction, event and job reliability

Business transaction + outbox record commit atomically in one owning store. Dispatcher publishes at-least-once; consumers deduplicate by stable event ID and idempotency key. Event envelopes include schema version, producer, aggregate/resource ID, tenant where appropriate, occurred/recorded time, correlation/causation ID and safe references.

Define ordering per aggregate, retry class, backoff, max attempts, dead-letter policy, replay authorization, retention and schema-compatibility tests. Long-running operations use durable job state and report accepted/queued/running/partial/unknown/completed separately. No cross-domain database transaction is assumed.

## 24. Query, persistence and Odoo integration safety

MikroORM EntityManager, metadata and RequestContext remain private to the API adapter. Domain/application ports expose only required operations. Every DB connection selects an explicit owner/schema; prohibit app/add-on raw connections and implicit cross-tenant query context.

Legacy Odoo connector uses a versioned supported API adapter with external IDs, source-of-truth, sync direction, conflict policy, deletion semantics, backfill and reconciliation. No direct write to Odoo-owned tables, no dual master, and no cutover without backup, reconciliation and owner sign-off.

## 25. API readiness and operational acceptance

Readiness checks verify configuration, DB connectivity/migrations, required signing/JWKS state, event outbox, critical dependencies and schema version; liveness remains independent. Graceful shutdown drains requests/workers within a deadline. Metrics cover request rate/latency/error by route, auth denials, DB pool/query latency, transaction rollback, outbox age, queue lag, dead letters, stale policy projections and audit delivery.

Integration tests must prove deny-by-default, tenant isolation, field masking, idempotent replay, optimistic concurrency, event duplicate handling, Odoo API-version behavior, transaction/outbox recovery and cross-app capability grants.

**Acceptance:** a domain mutation is attributable, authorized, versioned, idempotent where required, persisted by its sole owner and observable through API response plus durable audit/event evidence.
