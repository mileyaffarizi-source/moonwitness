# BLUEPRINT-PACKAGE-ADDON — ODOO-STYLE ADD-ON SDK & LIFECYCLE

**Document ID:** MW-BP-ADD-001 · **Version:** 2.0.0  
**Parent:** [BLUEPRINT-PACKAGE.MD](./BLUEPRINT-PACKAGE.MD) · **Task registry:** [tasks.json](./tasks.json)  
**Engineering standard:** [ADDON-ENGINEERING-STANDARD.md](./docs/engineering/ADDON-ENGINEERING-STANDARD.md) · **Manifest schema:** [addon.manifest.schema.json](./docs/architecture/addons/addon.manifest.schema.json)

## 1. Purpose

Add-ons are independent domain capabilities composed by the platform. The philosophy is inspired by Odoo's modular application model: modules declare models, extend existing models, contribute views/actions/capabilities, define dependencies and participate in controlled install/enable/upgrade lifecycle.

This is a TypeScript/Node.js package system, not a native Odoo Python module and not a claim that MikroORM equals Odoo ORM.

## 2. Base + add-on principle

Base provides stable laws and extension points. Add-ons own domain capabilities. One add-on may contribute to API, Agent and Web, but each contribution lives in its correct runtime and communicates through contracts.

Base must not import business add-ons. An add-on must not fork the platform kernel to bypass constraints.

## 3. Manifest contract

Every add-on manifest declares:
- stable ID, name, description and version;
- platform/API compatibility ranges and contract versions;
- required and optional dependencies with version ranges;
- capabilities;
- models, model extensions, fields and relations;
- permissions, model access rights, record rules and field access;
- storage ownership and versioned migrations;
- separate API, Agent and Web entrypoints;
- events produced/consumed and schema versions;
- configuration schema;
- assets with manifest IDs and rights status;
- health checks and lifecycle policy;
- owner, license/provenance, test and documentation entrypoints.

Validate manifest schema before loading code or registering capabilities. Do not accept arbitrary executable packages from uploads or public registries.

## 4. Model declarations and extensions

Add-ons define models using the platform ORM SDK. An extension declares target model, owner and additive fields/relations/methods/hooks/views through supported extension points.

Reject duplicate model IDs, field collisions, incompatible field type changes, missing/disabled relation targets, circular required dependencies, unsupported order, attempts to weaken required access policies, direct persistence adapter access and undeclared mutation of other models.

Compose runtime metadata deterministically before API readiness. No uncontrolled metadata mutation after startup.

## 5. Persistence and data ownership

Every model/table/schema object has one owner. An add-on may own new tables or declared additive storage. It must never claim existing Odoo tables or write to them using MikroORM.

No big-bang migration. Add-on installation does not trigger global schema synchronization. Schema changes are versioned, additive where possible, reviewed and backed up. Destructive migrations require explicit human approval, migration plan, restore test and decommission policy.

Disabling stops routes, tools, jobs, menus and capability contributions but preserves data. Uninstall/decommission is separately approved and never silently deletes data.

## 6. Lifecycle

States: discovered, validated, installed, enabled, initializing, ready, degraded, failed, disabled, upgrading, decommission_pending and uninstalled.

Install/enable sequence:
1. resolve immutable package artifact and integrity;
2. validate manifest/schema/source trust;
3. check platform and contract compatibility;
4. resolve required dependencies and cycles;
5. validate capabilities and permissions;
6. compose model metadata and extension order;
7. validate storage ownership and migrations;
8. register routes/tools/events/Web contributions;
9. initialize services;
10. health check;
11. mark ready only after required capabilities pass.

Disable sequence deactivates new work, drains/pauses jobs, unregisters capabilities, preserves data, records reason and state. Upgrade uses compatibility checks, backup, versioned migrations, smoke tests and rollback/degraded plan.

## 7. Capability registration

**API:** routes, use cases, models, policies, event handlers and jobs.  
**Agent:** typed tools/workflows bound to approved API capabilities; no ORM objects.  
**Web:** declarative navigation, routes, components, themes and asset references; no secrets/persistence code.  
**Shared contracts:** types/schemas only, no cross-runtime implementation leakage.

Every capability is tied to add-on ID/version. API enforces access even if Web hides a menu or Agent refuses a tool.

## 8. Dependency and conflict rules

Missing required dependency or incompatible version blocks readiness. Missing optional dependency is explicitly degraded. Circular required dependencies fail. Model/field conflicts fail unless a deterministic approved conflict contract exists. Two add-ons cannot own the same model storage. No implicit runtime package installation or arbitrary remote code execution in production.

## 9. Add-on data API

Add-ons use model/record APIs, domain services and repository ports defined by SDK. They must not import private ORM adapter modules, obtain global EntityManager, construct unrestricted SQL, write another add-on's records without a documented use case/permission or use ambient administrator context for background jobs.

## 10. Reference add-on

Prove manifest validation; one owned model; one host-model extension; one relation; one read and one authorized write; one Agent tool calling API; one Web contribution; one versioned event; enable/disable; data preservation; automated integration/security tests.

This is the minimum vertical proof. Do not scaffold dozens of empty add-ons before it works.

## 11. Distribution, upgrades and rollback

Initially use reviewed workspace packages and immutable build artifacts. Install from lockfile/build output. Do not support hot-loading arbitrary npm packages in production before sandboxing, signing, permission review, compatibility and rollback are designed and tested.

Maintain package checksum, source revision, build provenance and deployment record. Code rollback does not imply safe rollback of irreversible data migrations.

## 12. Deliverables and ownership

Deliver manifest schema/types, SDK, registry, dependency resolver, model-composition validator, realm capability registries, lifecycle manager, migration/ownership policy, reference add-on, compatibility tests and decommission runbook.

Tasks **ADD-001 through ADD-011** in [tasks.json](./tasks.json).

## 13. Definition of done

An independent add-on can be validated, installed, enabled, composed, secured, observed, disabled and upgraded without duplicating Base logic, bypassing API authority or damaging another add-on's or legacy Odoo's data.

## 15. Application vs add-on boundary

An application is a product experience/runtime boundary; an add-on is a domain capability package. One app may consume several add-ons, and one add-on may contribute API/Agent/UI contracts to multiple apps. This does not permit duplicated ownership.

Examples:
- OSS app consumes network inventory, telemetry, alarm, incident and provisioning add-ons.
- BSS app consumes party/customer, catalogue, order, subscription and finance add-ons.
- ISP app orchestrates contracts between BSS and OSS; it does not own either domain's records.
- A-L-L-A-H app consumes corpus, translation, ontology, citation and legal-source add-ons.
- DX app consumes task-registry, agent-adapter, Git/worktree and evidence contracts.
- RIOT app consumes creative-media and isolated-lab capabilities through separate trust boundaries.

Every add-on has one model owner and one authoritative write path. Cross-add-on references use public record/service contracts; never reach into private tables or repositories.

## 16. High-risk add-on constraints

Network configuration, cloud apply, secret access, production deploy and security-lab operations are privileged capabilities. They must not be exposed as ordinary generic add-on hooks. Each requires separate capability ID, service identity, exact resource scope, risk class, audit and human approval according to policy.


## 17. Canonical workspace layout

Each TypeScript add-on lives under packages/addons/<slug>. The canonical descriptor is addon.manifest.json; the npm workspace package is named @moonwitness/addon-<slug>; the immutable add-on ID is moonwitness.addon.<slug>.

~~~text
packages/addons/<slug>/
├── addon.manifest.json
├── package.json
├── README.md
├── CHANGELOG.md
├── config.schema.json
├── src/
│   ├── index.ts
│   ├── api/
│   ├── agent/
│   └── web/
├── tests/
│   ├── unit/
│   ├── contract/
│   └── integration/
└── migrations/
~~~

Do not create empty realm directories. Each add-on declares only the entrypoints it actually provides. Native Odoo Python add-ons stay outside the Node workspace.

## 18. Manifest v1 exact contract

The machine-readable JSON Schema is docs/architecture/addons/addon.manifest.schema.json. Schema version 1.0.0 is strict and rejects unknown fields. It requires:

- manifestVersion, stable id, display name, SemVer version and description;
- owner team, SPDX/license identifier and provenance;
- bounded platformApi/addonSdk compatibility ranges and Node >=24.22.3 <25.0.0;
- required and optional dependency IDs with explicit bounded SemVer ranges;
- allowlisted capability contributions and separately declared permission requests;
- unique contributions with type, safe package-relative entrypoint, capabilities and permissions;
- namespaced add-on-owned model declarations and additive model extensions;
- storage ownership, model IDs, migration references and approval for domain/external storage;
- optional configuration schema and health declaration.

Manifests are declarative data only. Inline code, shell commands, raw SQL, secret values, arbitrary URLs as executable handlers, wildcard grants and unknown extension fields are invalid.

## 19. Public capabilities and permission policy

Capability types v1:

- API: api.route, api.usecase, api.model, api.model-extension.
- Agent: agent.tool, agent.workflow.
- Experience: web.navigation, web.component.
- Async/event: event.publisher, event.subscriber, job.worker.
- Vertical: oss.contribution, bss.contribution.

Permission IDs v1:

- records.read, records.write;
- events.publish, events.subscribe;
- jobs.schedule;
- agent.invoke-api;
- web.navigation;
- storage.addon-owned;
- external.side-effect.

The linter enforces a minimum risk/approval class. Read-only permissions may request no approval; reversible writes require per-operation authorization; external side effects require human approval. Privileged infrastructure, secret retrieval, direct network egress, shell, cloud apply and production deploy are not granted by this v1 manifest contract.

Permission declarations are requests only. Runtime authorization is owned by apps/api and bound to the trusted actor, tenant, add-on/version, resource and exact operation. Client-side hiding is never authorization.

## 20. Package and source restrictions

Add-on packages are private ESM workspace packages targeting the repository Node major. They must expose explicit package exports and build/lint/typecheck/test scripts. Automatic lifecycle hooks (preinstall/install/postinstall/prepare) are forbidden.

Add-on dependencies and source may not create a parallel database/ORM or HTTP server. Block direct imports of MikroORM, Prisma, Sequelize, TypeORM, Drizzle, raw DB drivers, Fastify, Express, child_process, vm and direct secret reads via process.env. Direct outbound HTTP/fetch is prohibited unless a future reviewed capability adapter explicitly owns it.

Add-ons import public SDK/contracts and call approved API use cases. They never import another add-on's private implementation, API internal repository, persistence adapter or global EntityManager.

## 21. Storage, extensions and migration ownership

An add-on-owned model ID is namespaced with its slug. An extension explicitly names a target model and is additive only in v1. Changes to field type/nullability, primary key, storage owner, deletion behavior or business validation require a new approved ADR and migration plan.

Storage defaults to addon-owned. domain-owned or external storage must declare a data owner and approval reference. Existing Odoo-owned records/tables cannot be claimed. No add-on may run global schema synchronization or destructive DDL at startup.

Disable withdraws routes/tools/jobs/navigation and preserves data. Decommission is a separate approved operation with backup/recovery plan; it must never be implemented as an implicit delete.

## 22. Dependency resolver contract

- Required dependencies missing or incompatible block readiness.
- Optional dependencies may be absent; affected contributions remain unavailable.
- Self-dependencies, duplicates, missing required IDs and cycles fail.
- The resolver returns a deterministic topological order.
- Required dependency ranges must be explicit bounded ranges; no wildcards or latest tags.
- Cross-add-on model extensions require a declared required dependency on the target owner add-on, except for platform-owned core models.

## 23. Lint, test and merge contract

Run pnpm lint:addons and the root pnpm check. The add-on gate validates JSON/schema shape, ID/package agreement, versions, compatibility, dependencies, cycles, capabilities, permission minimums, contribution IDs/entrypoints, model ownership and forbidden dependency/import patterns. No add-ons present is an explicit baseline result, not proof that a runtime exists.

A new add-on must also pass the owning package's build, lint, typecheck, unit/contract/integration tests, API authorization tests, migration/restore tests and cross-realm tests as applicable. It cannot be marked done because its manifest merely parses.

## 24. Trust boundary remains a separate decision

This contract blocks arbitrary runtime installs and unreviewed artifacts. It does not by itself provide process isolation, artifact signing, key management or egress sandboxing. The third-party trust model is Proposed in ADR-0003; until approved and tested, third-party add-ons remain disabled. A manifest is not a sandbox.

## 25. Ownership and sequencing

ADD-012 establishes the static engineering contract and lint gate. ADD-001 implements the Base SDK and schema types only after PKG-004/API-004. ADD-002 performs API discovery/trust checks only after ADD-001/PKG-008 and the required governance approval. The remaining ADD-001 through ADD-011 dependencies remain authoritative; no task may bypass them.
