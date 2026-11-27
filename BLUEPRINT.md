# THE LIVING PLATFORM
## Master Blueprint — Universe Narrative, Enterprise Architecture & Implementation Standard

**Version:** 4.0  
**Status:** Architecture baseline; implementation not yet verified  
**Target repository:** `mileyaffarizi-source/moonwitness`  
**Runtime:** Node.js LTS · pnpm Workspaces · Turborepo  
**Applications:** Mastra Agent · Fastify API · Next.js Web  
**Persistence:** Odoo-inspired Platform ORM backed by MikroORM  
**Operating principle:** Preserve existing data; no big-bang migration.

---

# 0. How to use this blueprint

This document is the canonical target blueprint for the repository. It combines product narrative, creative canon, application boundaries, data models, ORM philosophy, add-on architecture, user experience, security, deployment, governance, and an implementation checklist.

It is **not** evidence that any capability already exists. Implementation status must be established from source code, automated tests, CI results, and deployment evidence.

Before implementation:

1. Read this blueprint and inspect the actual repository, branches, Git history, documents, assets, dependencies, and deployment configuration.
2. Preserve existing code, source documents, creative assets, and data.
3. Record conflicts between repository reality and this target as Architecture Decision Records (ADRs).
4. Never rewrite creative canon or business data merely to fit a new technical model.
5. Update this blueprint only when an architectural or creative decision is explicitly accepted and recorded.
6. Mark checklist items complete only when their acceptance criteria have evidence.
7. Do not create empty packages just to match a proposed directory tree.

## Initial repository baseline

The initial architecture baseline was committed to the repository before this expanded application topology. This document records the target architecture as of version 4.0. It is not evidence that the fourteen apps or their capabilities are already implemented. Re-inspect the current repository, source files and runtime behavior before beginning implementation phases.

---

# PART I — THE UNIVERSE

# 1. Opening narrative — The Living Universe

We are not building another software dashboard.

We are building a living digital universe.

A universe where technology does not merely respond to commands, but creates an environment in which humans, intelligence, knowledge, creativity, and systems can interact. A universe where every component has a purpose, every capability has an identity, every story has a place, and every experience contributes to something larger.

Not everything has to look like software.

Some things should feel like exploration. Some things should feel like discovery. Some things should feel like a mission. Some things should feel like a story. Some things should feel alive.

This platform brings together two forces that must reinforce one another.

**THE ENGINEERING UNIVERSE** is disciplined: modular architecture, reliable data ownership, explicit contracts, security, automation, intelligence, observability, and production operations.

**THE CREATIVE UNIVERSE** is expressive: emotion, mystery, visual discovery, cinematic transitions, anime-inspired game language, story worlds, evidence, identity, conflict, and transformation.

The engineering must be strong enough to support the creative ambition. The creative experience must be meaningful enough to give the technology an identity.

The platform has three architectural planes and fourteen named applications. The planes remain Intelligence, Authority and Experience; the application topology is defined in BLUEPRINT-APPLICATIONS.MD.

- **THE INTELLIGENCE — AGENT:** the ability to reason, understand context, coordinate capabilities, and execute authorized missions.
- **THE AUTHORITY — API:** the ability to define business truth, protect data, govern models, and coordinate the platform.
- **THE EXPERIENCE — WEB:** the ability to turn the system into a world that humans can enter, understand, explore, and control.

Underneath them lies **THE FOUNDATION — THE LAWS OF THE UNIVERSE**.

Above it exists **THE ADD-ON ECOSYSTEM — WORLDS WITHIN WORLDS**.

The platform must grow without losing its identity.

**One Universe. Fourteen Applications. One Foundation. Independent Capabilities. Multiple Creative Worlds. One Coherent Experience.**

# 2. Product identity and creative canon

The concepts below are part of the project's creative history. They are not interchangeable product names, generic design references, or permission to invent missing story details. Audit original material and preserve exact wording, capitalization, version, authorship, source, and provenance.

## 2.1 THE LIVING PLATFORM — the technical universe

The Living Platform is the technical and operational foundation connecting applications, add-ons, data, agents, and worlds. It is not a replacement name for RockSoul or MoonWitness. It is the common platform that allows their experiences to coexist while retaining distinct identities.

Core ideas:

- One platform identity and three independently deployable applications.
- A shared Base Platform and Odoo-inspired modular add-ons.
- Explicit model, domain, package, and data ownership.
- Controlled AI capabilities and shared contracts.
- Multiple creative worlds with distinct themes.
- Independent releases where compatibility permits.

## 2.2 ROCKSOUL — THE LIVING UNIVERSE

**ROCKSOUL — THE LIVING UNIVERSE**

ROCKSOUL is an immersive digital experience. It is not a conventional application with a game-inspired theme. It should feel like an actual universe in which the interface becomes an environment and navigation becomes exploration.

Its central entrance is **THE THRESHOLD**: the first crossing, the moment a user moves from an ordinary interface into a living digital world. It must not feel like a normal login page or generic SaaS landing page.

ROCKSOUL principles:

- A living application environment and world exploration.
- Cinematic entry and transition sequences.
- Atmospheric backgrounds, layered depth, light, and motion.
- Original symbols, iconography, and interaction language.
- Interactive portals and contextual navigation.
- Mission-like interactions where they add meaning.
- Persistent identity and user context.
- Dynamic environmental states and responsive visual storytelling.

ROCKSOUL establishes a shared visual grammar for the platform, but individual worlds must retain their own artistic identity. Its direction is futuristic, emotionally expressive, cinematic, anime-inspired, game-like, experimental, and intentionally distinct from generic enterprise dashboards.

## 2.3 MOONWITNESS — WHEN THE MOON WITNESS, WE SHARE A MESSAGE

**MOONWITNESS**  
**WHEN THE MOON WITNESS, WE SHARE A MESSAGE**

MOONWITNESS is a distinct narrative, research, evidence, knowledge, and discovery universe. Its central ideas are witnessing, examining, discovering, preserving, questioning, connecting, and exposing information.

It must not be reduced to a normal blog, static CMS, or generic knowledge base.

Known experience concepts:

### StoryTelling

A structured narrative environment for works, editions, chapters, scenes, timelines, perspectives, sources, and connected stories.

### Exposure / Fact Exposure

An evidence-aware environment for presenting claims, examining information, connecting sources, showing context, recording disagreement, and making provenance transparent. A claim, source, interpretation, hypothesis, and verified finding are different things and must be represented explicitly.

### Change Advisory Board

A review and decision experience for proposed changes, context, affected material, evidence, impact, reviewers, and recorded outcomes. Recover its exact original meaning and workflow from source material before final implementation.

### Mission Board

An environment for organizing research objectives, missions, tasks, responsibilities, dependencies, agent execution, human review, progress, and deliverables.

Important factual claims must be distinguishable from source material, direct quotation, interpretation, hypothesis, inference, supported evidence, unverified information, disputed information, and editorial conclusion. Truth must never be represented as a decorative effect. Important claims need traceable sources, authorship, context, revision history, and review status.

## 2.4 STORY WORLDS — the stories we carry

Preserve and organize these known creative references:

- Lines — Visual Effect mansa.
- Chasing Heart.
- Lovestruck.
- Breath Electric.
- StoryTelling.
- 0. THE SHADOW.
- Sebelum ada Cahaya.

Treat each title as an independent creative work until source documents establish its exact relationship to other works or worlds. Support original title/text/source, works and editions, chapters and scenes, characters and aliases, relationships, timelines, narrative perspectives, visual references, art direction, motion/effect references, sound/multimedia, canon status, drafts, revision history, authorship, and alternate interpretations.

For the archive of **0. THE SHADOW**, preserve the recorded alias references:

**Isa / Ys / R / 163 / Dancer / Runaway / Not Untouched.**

Preserve the phrase:

**SEBELUM ADA CAHAYA.**

Do not infer a definitive historical, religious, or personal identity from the alias list alone. An alias is authored metadata, not proof of identity.

## 2.5 A-L-L-A-H.COM — EMPIRE OF THE LIGHT

Preserve this as a distinct creative archive and world concept.

**A-L-L-A-H.COM — EMPIRE OF THE LIGHT**

Exact recorded taglines:

- SUNSHINE BELONG
- FIND LIGHT IN DARKNESS
- HOW U REMIND ME

Recorded world names:

- MOONWITNESS
- ARSY
- HUMAN-PEN
- SIDRA
- ROCKSOUL DX
- CRAYON
- SIN CAN
- ANGEL WITH SHOTGUN

The source concept refers to NINE WORLDS, while the currently recorded list contains eight names. Audit the source material for the complete original list. Do not invent a ninth world. Preserve exact spelling, capitalization, authorship, artwork, source, and context.

## 2.6 Creative restrictions and canon safety

- Do not create visual depictions of Allah, Prophet Muhammad, or Isa/Jesus.
- Preserve relevant names and textual references only in their authored context.
- Do not turn textual references into characters or visual representations.
- Do not infer sensitive identities from aliases, symbols, or ambiguous references.
- Do not invent relationships between people, characters, events, traditions, or works.
- Do not silently replace original wording with AI-generated interpretation.

## 2.7 Creative Canon Registry

Create a structured registry for original creative material. Each item should support a stable canon ID, original title and exact text, item type, original source/location, author/origin when known, version and revision history, creation date when known, editorial status, related worlds/works/characters/events/assets, relationship evidence, confidence or verification status where relevant, and usage/publication rights where known.

Suggested statuses: Original, Draft, In Review, Approved, Published, Archived, Superseded, Disputed, Unverified.

Never destroy a prior version when a creative item is revised. AI may organize, summarize, index, and propose relationships, but it must not silently become the author or final authority of the creative canon.

---

# PART II — FINAL APPLICATION TOPOLOGY

# 3. Fourteen applications, one platform

The platform has exactly fourteen named application surfaces/runtimes. This replaces the previous three-application constraint. An application directory is a product/runtime boundary, not automatically a separate microservice or database. See [BLUEPRINT-APPLICATIONS.MD](./BLUEPRINT-APPLICATIONS.MD) for the authoritative app map.

| # | Application | Technology / Role | Primary authority |
|---:|---|---|---|
| 1 | apps/agent | Mastra + Node.js | AI orchestration and agent workflows |
| 2 | apps/api | Fastify + platform ORM + MikroORM | Shared business/API authority |
| 3 | apps/web | Next.js | MoonWitness public front page and Community; CSS meaning pending confirmation |
| 4 | apps/OSS | Operations Support System | Network/resource operations and service assurance |
| 5 | apps/BSS | Business Support System | Customer, offer, order, contract and commercial lifecycle |
| 6 | apps/id | Identity Center / OIDC | Login, identity, SSO, sessions and federation |
| 7 | apps/docs | Documentation/Wiki/DX Progress | Documentation sources and read-only progress projection |
| 8 | apps/desktop | Desktop client | General desktop user/operator experience |
| 9 | apps/mobile | React Native / Expo candidate | Native mobile experience |
| 10 | apps/cloud | Cloud and Infrastructure Control Plane | Resource, deployment, quota, metering and vault integration |
| 11 | apps/isp | ISP/Telco vertical | Subscriber service lifecycle and BSS/OSS orchestration |
| 12 | apps/dx | Developer Experience Workbench | Local AI orchestration, repository/task/worktree/test/review workflows |
| 13 | apps/A-L-L-A-H | Flagship landing and knowledge experience | Divine Corpus, ontology, law and government knowledge |
| 14 | apps/riot | Creative/media and isolated security lab | Studio, media, authorized red/blue-team research lab |

Use the requested directory spelling where practical. Use lowercase stable package IDs, service IDs and import aliases for portability. Application paths do not imply that each app must be independently deployed from the first release.

## 3.1 apps/agent — Intelligence Runtime

Mastra is the canonical AI orchestration framework. It owns agent definitions, tools, workflows, memory configuration, context construction, model routing, evaluations/scorers, processors, human approval checkpoints, run history and Agent-specific persistence.

Rules:
1. Each agent has one documented responsibility.
2. Each tool has typed input/output schemas and an explicit capability mapping.
3. Privileged tools require an authorization policy.
4. Tools call approved API capabilities.
5. Agents never directly access business repositories or write business records.
6. Agent memory is not authoritative business data.
7. Long-running workflows need durable execution state.
8. Retries are idempotent.
9. Sensitive actions require scoped approval or an explicitly reviewed policy.
10. Every execution is traceable.
11. External content is untrusted input.
12. No unrestricted SQL, shell, Docker, filesystem or infrastructure access.
13. Public clients never get unrestricted access to the internal Mastra runtime.

See [BLUEPRINT-AGENT.MD](./BLUEPRINT-AGENT.MD). apps/dx is the developer orchestration workbench; it may invoke approved Agent adapters but does not change Agent/API authority boundaries.

## 3.2 apps/api — Shared Authority Runtime

Fastify is the platform API and composition root. It owns shared HTTP capabilities, application use cases, domain modules, model/field registry, record operations, security, transactions, add-on lifecycle, integration adapters, transactional outbox, audit, health and readiness.

The API is a modular domain-oriented platform, not an unbounded monolith. Initial domain modules should have strict ownership and dependency contracts for identity integration, OSS, BSS, ISP, Cloud, corpus/knowledge, creative assets and platform operations.

Every business write passes through an authorized API-owned use case and model operation. Apps do not connect directly to each other's databases. Extract a domain into an independently deployed service only when security isolation, scaling, availability or ownership requires it and an ADR approves the change.

See [BLUEPRINT-API.MD](./BLUEPRINT-API.MD).

## 3.3 apps/web — MoonWitness Public Experience

Next.js App Router owns the MoonWitness public front page, its narrative/research discovery and Community experience. The phrase **Community (CSS)** is provisional: do not expand or implement the CSS acronym as a confirmed feature name until source material/owner confirms its meaning.

Web owns human interaction, presentation, responsive layout, theming, FX, content composition and typed API clients. It does not own business rules, permissions or persistence. It has no direct DB/MikroORM access and no private Agent/runtime credentials.

See [BLUEPRINT-WEB.MD](./BLUEPRINT-WEB.MD).

## 3.4 Additional application responsibilities

- **apps/OSS:** technical/network operational truth; not billing or CRM.
- **apps/BSS:** commercial truth; not network device configuration.
- **apps/id:** centralized login/identity/OIDC and service identity. It does not hold arbitrary application secret values.
- **apps/docs:** version-controlled documentation and read-only projections of tasks/CI evidence. It is not a second task ledger.
- **apps/desktop:** general end-user desktop client; not a coding IDE.
- **apps/mobile:** native mobile client; shares contracts, not server runtime.
- **apps/cloud:** infrastructure control plane with isolated execution runners and vault integration.
- **apps/isp:** subscriber/ISP vertical lifecycle coordinating BSS commercial orders and OSS technical execution.
- **apps/dx:** highest-priority engineering workbench to coordinate local AI agents, task registry, Git worktrees, tests, diffs and approvals.
- **apps/A-L-L-A-H:** flagship landing and source-aware knowledge experience; separates Divine Corpus, translations, commentary, ontology, human law and government sources.
- **apps/riot:** creative/media studio and isolated, explicitly authorized red-team/blue-team lab; never a production backdoor.

Detailed ownership, source-of-truth and dependency boundaries are in [BLUEPRINT-APPLICATIONS.MD](./BLUEPRINT-APPLICATIONS.MD) and each app-specific blueprint.

# 4. Application communication and execution flows

## 4.1 Interactive product request

User → appropriate client app (Web / A-L-L-A-H / OSS / BSS / ISP / Desktop / Mobile / Docs / RIOT) → apps/id when authentication is required → apps/api resource server → endpoint/capability authorization → domain use case/add-on → platform ORM → transaction → authoritative store → structured result → calling app.

Public corpus pages may allow anonymous access by explicit policy. Protected operations still require central identity and resource-owned authorization.

## 4.2 AI-assisted business request

Client app → API → verified identity/actor context → Mastra Agent → bounded reasoning/workflow → allowlisted tool → protected API capability → model/record/field rules → API-owned use case → ORM transaction → structured result → Agent → API → client app.

The Agent is never an alternative business authority. Agent tools never receive database credentials or private repositories. The internal capability interface must not recursively call the same AI orchestration entrypoint.

## 4.3 Developer execution flow — apps/dx

tasks.json → DX schema/DAG validator → atomic task claim/lease → isolated Git worktree → bounded local agent adapter → approved commands/tests → diff/evidence collection → human review → commit/PR/CI → atomic task status update.

DX has local filesystem/process capability only through its protected daemon and task policy. It must not grant a coding agent ambient production secrets, host admin, unrestricted Docker or arbitrary network access.

## 4.4 Telecom commercial-to-technical flow

BSS accepted commercial order → ISP service orchestration → OSS qualification/resource reservation/provisioning → activation verification/RFS evidence → ISP service state → BSS commercial milestone/billing event.

BSS owns the commercial order and financial state. OSS owns the technical resource and observed network state. ISP owns the subscriber-service orchestration and correlation across both.

## 4.5 Infrastructure control flow — apps/cloud

Cloud control-plane request → identity/workload verification → scoped resource policy → immutable plan → policy/cost/impact review → human approval where required → isolated execution runner → cloud/provider API → observed-state verification → audit/event/result.

No public request worker, generic Agent or Web component directly controls host Docker, production cloud credentials or infrastructure runner.

## 4.6 Long-running events and jobs

API transaction → business record + outbox record → outbox dispatcher → queue → domain worker or Mastra workflow → checkpoint/retry/approval → result event → API status update → subscribing app.

Use idempotency keys, correlation IDs, causation IDs, versioned schemas, timeouts, dead-letter handling, cancellation, persistent job status and audit history. Use transactional outbox and Redis/BullMQ where appropriate. Do not introduce a heavyweight event broker without evidence. SSE/WebSocket is an API-owned client contract, not a direct database subscription.

---

# PART III — TECHNOLOGY STANDARD

# 5. Approved technology choices

| Layer | Standard |
|---|---|
| Runtime | Node.js Active LTS, pinned |
| Package manager | pnpm |
| Workspace | pnpm Workspaces |
| Task orchestration | Turborepo |
| Language | TypeScript |
| AI | Mastra |
| API | Fastify |
| Web | Next.js App Router |
| Platform ORM | Odoo-inspired TypeScript Model/Record Kernel |
| Persistence | MikroORM adapter |
| Validation | Zod |
| API contract | OpenAPI |
| New relational storage | PostgreSQL where approved |
| Legacy ERP | Existing Odoo database and supported APIs |
| Queue | Redis + BullMQ |
| Unit/integration testing | Vitest |
| Browser E2E | Playwright |
| Lint | ESLint flat config |
| Formatting | Prettier |
| Styling | Centralized design tokens + Tailwind CSS |
| Motion | Shared, approved motion layer |
| Containers | Docker |
| Local orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Tracing | OpenTelemetry-compatible instrumentation |

## 5.1 Runtime and dependency policy

- Pin the selected Node.js LTS version.
- Pin pnpm in the root package manifest and commit `pnpm-lock.yaml`.
- Use pnpm Workspaces for package linking and Turborepo for task orchestration/cache.
- Do not mix npm, Yarn, Bun, and pnpm as competing workspace managers.
- Declare dependencies explicitly and minimize overlapping frameworks.
- Verify compatibility across Mastra, Fastify, Next.js, MikroORM, and Node.js before locking versions.
- Keep a compatibility test for the preceding supported Node.js LTS where dependencies permit.

---

# PART IV — ODOO-ORIENTED ORM FOUNDATION

# 6. The most important engineering decision

**MikroORM is the persistence engine. The Odoo-inspired ORM is the application model system.**

Do not build a normal Node.js application where each add-on directly defines MikroORM entities and manipulates EntityManager. Build a platform-owned ORM kernel with explicit model registry, field metadata, relations, extension rules, record operations, domain queries, security, context, and lifecycle. Use MikroORM behind a controlled persistence adapter.

This is an Odoo-oriented architecture, not a claim that MikroORM is the native Python Odoo ORM or a drop-in replacement. Do not recreate all of Odoo's internals unnecessarily. Implement the capabilities the platform needs with explicit contracts and tests.

## 6.1 Required ORM layers

1. Add-on model definitions.
2. Model registry.
3. Field registry.
4. Model extension and composition.
5. Relation registry.
6. Computed-field dependency engine.
7. Domain query AST and compiler.
8. Request-scoped model environment.
9. Record operations and batch collections.
10. Model-level access rights.
11. Record-level rules.
12. Field-level access.
13. Validation and constraints.
14. Audit and revision support.
15. MikroORM metadata composition.
16. EntityManager and Unit of Work adapter.
17. Transaction boundaries.
18. Database-specific migration and schema ownership.

## 6.2 Odoo concept mapping

| Odoo concept | Platform equivalent |
|---|---|
| Module manifest | `addon.manifest.ts` |
| `depends` | Add-on dependency graph |
| `models.Model` | Registered model definition |
| `_name` | Stable model ID |
| `_inherit` | Explicit model extension |
| `_inherits` | Delegated composition |
| `fields.Char` | Typed field descriptor |
| Many2one | Many-to-one relation |
| One2many | One-to-many relation |
| Many2many | Many-to-many relation |
| `compute` | Computed field engine |
| `api.depends` | Dependency/invalidation graph |
| `related` | Related-field resolver |
| `inverse` | Controlled inverse-write handler |
| `api.constrains` | Model and persistence constraints |
| `default` | Model and context defaults |
| `env` | Request-scoped model context |
| Recordsets | Typed record collections |
| `search` | Domain query |
| create/read/write/unlink | Permission-aware record operations |
| `ir.model.access` | Model access rights |
| `ir.rule` | Record rules |
| External IDs | Add-on-scoped stable external identifiers |
| Module install/upgrade | Controlled add-on lifecycle |
| XML views/actions/menus | Declarative UI contribution registry |

These are conceptual mappings, not claims of identical internal implementation.

## 6.3 ORM package boundaries

Potential package family:

- `packages/orm/core`
- `packages/orm/model-registry`
- `packages/orm/field-registry`
- `packages/orm/model-extension`
- `packages/orm/model-context`
- `packages/orm/relations`
- `packages/orm/computed-fields`
- `packages/orm/records`
- `packages/orm/domain`
- `packages/orm/security`
- `packages/orm/persistence`
- `packages/orm/mikroorm-adapter`
- `packages/orm/testing`

Create these as workspace packages only when they have independent ownership and useful public contracts. Do not create empty packages just to mirror the list.

## 6.4 Model registry

Every model has a globally unique stable identifier within a platform instance. Examples:

- `base.user`
- `base.company`
- `base.attachment`
- `rocksoul.world`
- `rocksoul.mission`
- `moonwitness.work`
- `moonwitness.claim`
- `moonwitness.source`
- `moonwitness.evidence`
- `moonwitness.person`
- `moonwitness.event`
- `story.character`
- `story.chapter`
- `story.scene`
- `story.timeline`

A model definition declares model ID, owner add-on, table/schema ownership, fields, relations, defaults, constraints, computed/related field metadata, application capabilities, access rights, record rules, audit policy, search configuration, lifecycle hooks, and external identifiers where needed.

The registry detects duplicate model IDs/fields, invalid relations, missing targets, invalid field types, extension conflicts, missing permissions, circular dependencies, and ownership violations. Registration is deterministic.

## 6.5 Model extension

Support three explicit patterns:

**New model:** an add-on declares a new model under its namespace.

**In-place extension:** an add-on adds approved fields, constraints, metadata, or methods to another model, conceptually similar to Odoo `_inherit`.

**Delegated composition:** a model exposes selected information or capabilities from a related model, conceptually similar to Odoo `_inherits`.

Extension rules:

- Additive by default.
- Explicit target model, extension ID, and dependency.
- Deterministic composition priority.
- Conflict detection and provenance for every extension.
- No uncontrolled monkey-patching or silent field/method replacement.
- Overrides require an explicit reviewed policy.
- No cross-package private imports.
- Compose metadata before MikroORM initialization and freeze it for that runtime lifecycle.
- Do not mutate MikroORM internal metadata while requests are running.

## 6.6 Field system

Typed primitive fields: Char, Text, Boolean, Integer, BigInteger, Float, Decimal, Date, DateTime, UUID, JSON, and Selection/enum.

Relational fields: Many-to-one, One-to-many, Many-to-many, delegated relations, and controlled references.

Computed fields: stored computed, non-stored computed, related, inverse, and searchable computed where implemented.

System metadata may include created at/by, updated at/by, active/archive, company/tenant ownership, revision/version, and audit metadata.

Relevant field metadata includes name, label, type, help, required, readonly, default, unique, indexed, store, relation, deletion policy, compute, dependencies, related path, inverse, validation, access, and tracking policy.

## 6.7 Computed fields

Implement declared dependencies, dependency graph, circular dependency detection, change invalidation, stored/non-stored computation, batch computation, transaction-aware persistence, recompute policy, diagnostics, and search support where applicable.

Computed fields must not automatically bypass record security. Any privileged computation must declare its execution identity and be audited.

## 6.8 Domain query engine

Implement a typed domain AST inspired by Odoo search domains. Support validated equivalents of equals/not equals, comparisons, in/not in, contains/case-insensitive contains, null checks, AND/OR/NOT, and explicitly supported relation traversal.

Hierarchical operators such as `child_of` and `parent_of` may be implemented only after choosing and documenting a storage strategy such as a materialized path or recursive query.

Requirements:

- Type-safe field references and validated operators.
- Parameterized SQL only.
- No arbitrary client-generated SQL or unsafe expression evaluation.
- Query depth and complexity limits.
- Pagination, sorting, and aggregation.
- Index-aware query planning.
- Security rules composed into every applicable query.

## 6.9 Record/model API

Provide consistent operations: `create`, `browse`, `read`, `write`, `unlink`, `search`, `searchRead`, `searchCount`, `nameSearch`, `groupBy`, `aggregate`, and `exists`.

Operations must support explicit context, permission checks, record rules, field-level checks, validation, transaction boundaries, audit, and batch execution where applicable.

Use typed batch-friendly record collections. Do not imitate Python recordsets through fragile JavaScript proxies without a demonstrated benefit.

Provide controlled context APIs such as `withContext` and `withUser`. Elevated execution must be explicit and audited. Never expose an unrestricted `sudo` equivalent to browser clients or agents.

## 6.10 Model context

Each request or independent background job receives an isolated model execution context containing trusted server-side actor identity, tenant/company scope where applicable, locale, timezone, correlation ID, permission context, and transaction context.

Context is immutable after trusted server construction. Never trust browser-supplied authorization claims.

## 6.11 Odoo-inspired security

Enforce security at model operations, not only in routes. Evaluation order:

1. Authenticate actor.
2. Build trusted actor and tenant/company context.
3. Check model access rights.
4. Apply record rules.
5. Check field access.
6. Evaluate business policies.
7. Execute operation.
8. Write audit record.

Test cross-tenant reads/writes, unauthorized relation traversal, field leakage through serialization, unauthorized deletes, agent privilege escalation, disabled add-on endpoints, and record-rule bypass attempts.

## 6.12 MikroORM adapter

MikroORM remains behind the platform ORM. Use supported EntityManager, Unit of Work, Identity Map, RequestContext, transactions, repository patterns, metadata mechanisms, and database constraints.

Rules:

- One controlled ORM initialization strategy in the API runtime.
- Approved add-on metadata collected before initialization.
- Explicit entity/EntitySchema registration.
- No global mutable EntityManager.
- Request-scoped EntityManager for each HTTP request.
- Separate context for each background job.
- Explicit transaction boundaries.
- No add-on independently initializes a second business ORM.
- No add-on bypasses model security through direct EntityManager access.
- No undocumented mutation of MikroORM internals.
- Real database tests must prove metadata composition.

The first technical milestone is a proof of concept showing that model definitions from two independent add-on packages can be composed safely into MikroORM metadata, queried through the platform model API, and isolated by model ownership and security.

---

# PART V — DATABASE AND ODOO INTEGRATION

# 7. Zero big-bang data migration

**Do not migrate, reset, replace, or restructure the entire existing dataset to fit the new platform.**

There are distinct ownership paths.

## 7.1 Platform-owned data

New platform data is owned by the TypeScript platform. Use the platform ORM and MikroORM adapter with explicit model and table ownership.

## 7.2 Existing Odoo-owned data

Existing Odoo data remains owned by its Odoo installation. Use a dedicated Odoo integration adapter, supported APIs, dedicated credentials, explicit model/field mapping, version-aware protocol selection, and auditable operations.

Do not write directly into Odoo-owned tables using MikroORM. Do not bypass Odoo business logic.

For the known existing Odoo 17 environment, inspect the deployed version and available integration mechanism. Do not assume an Odoo 19 protocol is available in Odoo 17. For Odoo 19, evaluate External JSON-2 where enabled and applicable. Verify the target version documentation before protocol decisions.

Native Odoo add-ons are Python modules using Odoo's native ORM, `__manifest__.py`, and native security/data/model conventions. Keep them separate from TypeScript workspace add-ons. A TypeScript add-on is not a native Odoo module.

## 7.3 Data preservation rules

- No bulk migration or database reset.
- No DROP/TRUNCATE as normal deployment operations.
- No unrestricted schema synchronization.
- No automatic production migration at application startup.
- No legacy field/table renaming.
- No bulk transformation without explicit approval.
- No writes to Odoo-owned tables through MikroORM.
- No automatic data deletion on add-on disable/uninstall.
- Every physical schema object has an owner.

Additive schema changes for newly owned add-on storage are permitted only through reviewed, versioned, backed-up, controlled operations with rollback plans. MikroORM SchemaGenerator must never be used as unrestricted production synchronization.

## 7.4 Database topology decision

During repository audit, choose and document one of:

- Dedicated database for new platform-owned data.
- Dedicated schema with strict ownership, if supported safely by the driver and deployment.
- Existing platform database with explicit table ownership and restricted permissions.

Do not assume a shared legacy Odoo database is the correct location for all new platform tables.

---

# PART VI — ADD-ON ECOSYSTEM

# 8. Odoo-style independent packages

Every domain capability is an independent workspace package.

Potential domain families:

- Identity, Users, Roles, Permissions, Audit, Notifications.
- Integrations, Monitoring.
- RockSoul, MoonWitness, Storytelling, Creative Canon.

This is a candidate catalogue, not a requirement to generate empty modules.

Each add-on must have a package manifest, typed add-on manifest, stable ID, version, compatibility range, dependencies, owned models, model extensions, fields and relations, permissions, record rules, API entrypoint when required, Agent tools/workflows when required, Web contributions when required, events, data resources, configuration schema, tests, documentation, and upgrade/decommission policy.

## 8.1 Cross-realm package design

One domain add-on may contribute to API, Agent, and Web without duplicating business logic:

- Models and application services are owned by the API/domain layer.
- Agent entrypoints provide tools and workflow adapters that call approved API capabilities.
- Web entrypoints provide declarative navigation, UI components, forms, and views that call API contracts.
- Shared types are exported through explicit contract entrypoints.
- Browser bundles never include database drivers, secrets, Fastify, or Node-only implementation.

## 8.2 Manifest and lifecycle

The manifest declares identity, version, description, compatibility, dependencies, capabilities, permissions, model declarations, extension declarations, storage ownership, configuration schema, realm entrypoints, data resources, event handlers, health checks, and upgrade policy.

Lifecycle:

DISCOVER → VALIDATE → TRUST CHECK → COMPATIBILITY → DEPENDENCY RESOLUTION → MODEL COMPOSITION → FIELD/RELATION VALIDATION → METADATA COLLECTION → CAPABILITY REGISTRATION → SERVICE INITIALIZATION → HEALTH CHECK → READY.

States: Installed, Enabled, Disabled, Initializing, Ready, Degraded, Failed, Upgrading, Uninstalling, Uninstalled.

Disabling an add-on must not delete data. Uninstall requires explicit decommissioning. Production package availability comes from reviewed build artifacts and lockfiles, not arbitrary runtime npm installation. For initial releases, controlled restart/redeployment is preferable to unsafe hot-code loading.

---

# PART VII — PRODUCT DOMAINS AND CREATIVE DATA

# 9. MOONWITNESS domain

MOONWITNESS needs an evidence-aware narrative and research model.

Candidate model identifiers:

- `moonwitness.work`
- `moonwitness.edition`
- `moonwitness.chapter`
- `moonwitness.story`
- `moonwitness.claim`
- `moonwitness.source`
- `moonwitness.evidence`
- `moonwitness.person`
- `moonwitness.organization`
- `moonwitness.event`
- `moonwitness.language`
- `moonwitness.tradition`
- `moonwitness.artifact`
- `moonwitness.location`
- `moonwitness.relationship`
- `moonwitness.revision`
- `moonwitness.exposure`
- `moonwitness.mission`
- `moonwitness.review`

Validate candidates against source materials before implementing them.

## 9.1 Knowledge relationships

Support traceable relationships such as:

- Person participated in Event.
- Work references Source.
- Claim is supported by Evidence.
- Claim is disputed by Evidence.
- Event occurred during Period.
- Work was created by Person.
- Person is associated with Organization.
- Work exists in Language.
- Translation derives from Edition.
- Story references Artifact.
- Exposure examines Claim.
- Mission investigates Event.

Every relationship records source and target, type, provenance, attribution, temporal context where applicable, confidence where justified, and revision history. Do not invent relationships to fill graph gaps. Implement orphan detection and relationship validation.

## 9.2 Fact Exposure lifecycle

UNREVIEWED → SOURCE COLLECTION → CLAIM EXTRACTION → EVIDENCE MAPPING → CONTEXT REVIEW → FACT CHECK → EDITORIAL REVIEW → PUBLISHED / DISPUTED / UNVERIFIED.

Every transition preserves actor, timestamp, source, reason, prior state, and decision history.

## 9.3 Change Advisory Board

Support proposal, reason, affected records, evidence, impact analysis, reviewer assignment, review status, approval/rejection, revision, and decision history. This must be a functioning review workflow, not a decorative status board.

## 9.4 Mission Board

Support mission, objectives, tasks, owner, assigned agent, human reviewer, dependencies, evidence requirements, progress, completion criteria, deliverables, and audit history. Agent execution identity is recorded separately from the human mission owner.

# 10. STORYTELLING domain

Candidate models:

- `story.universe`
- `story.world`
- `story.work`
- `story.edition`
- `story.chapter`
- `story.scene`
- `story.character`
- `story.alias`
- `story.relationship`
- `story.timeline`
- `story.event`
- `story.motif`
- `story.location`
- `story.media`
- `story.visual_reference`
- `story.effect`
- `story.canon_entry`
- `story.revision`

Support alternate editions/timelines, character aliases, narrative perspectives, original source, scene-level media, visual effects, draft/canon states, attribution, and multilingual content.

Preserve original wording. Record every revision. Support uncertain or disputed relationships. Do not automatically resolve ambiguous character identities.

Audit the meaning and hierarchy of Lines — Visual Effect mansa, Chasing Heart, Lovestruck, Breath Electric, 0. THE SHADOW, and Sebelum ada Cahaya. Do not assume they are all the same content type.

## 10.1 Creative Asset Library

Support artwork, character references, posters, UI references, motion boards, sound references, typography, palettes, storyboards, original prompts, versions, provenance, and usage rights. Every asset carries source and usage metadata. Do not treat an external image as an owned asset without provenance.

# 11. ROCKSOUL domain and experience

Candidate models:

- `rocksoul.world`
- `rocksoul.realm`
- `rocksoul.portal`
- `rocksoul.experience`
- `rocksoul.environment`
- `rocksoul.mission`
- `rocksoul.interaction`
- `rocksoul.theme`
- `rocksoul.visual_asset`
- `rocksoul.navigation`
- `rocksoul.session`

The Threshold is the primary entry experience. The world selector is registry-driven and permission-aware. Do not hardcode every future world into application navigation.

Suggested journey:

THE THRESHOLD → UNIVERSE ENTRY → WORLD SELECTOR → WORLD EXPERIENCE → MISSIONS / CONTENT / TOOLS / OPERATIONS.

ROCKSOUL owns the experience language, not the entire platform's business data.

---

# PART VIII — VISUAL DNA

# 12. Anime game FX — original visual identity

**Creative direction: premium futuristic anime-game universe.** Do not create a generic admin dashboard. Do not simply apply dark mode and purple gradients to a template. Build an original visual identity with a consistent visual grammar.

## 12.1 Shared visual foundation

- Obsidian, midnight blue, cosmic black.
- Electric violet, spectral cyan, luminous white.
- Magenta and controlled amber.
- Layered gradients, atmospheric lighting, depth, spatial composition.
- Clear typography and information hierarchy.

Colors must be centralized as semantic design tokens.

## 12.2 World-specific identity

**ROCKSOUL:** bold game-universe language, cinematic portals, strong geometry, animated energy, futuristic navigation, immersive exploration.

**MOONWITNESS:** lunar atmosphere, mystery and discovery, evidence-centered visual storytelling, editorial typography, research environments, timeline and knowledge-graph interaction, restrained celestial FX.

**STORY WORLDS:** emotion-specific themes, narrative typography, chapter transitions, character and scene presentation, cinematic effects, distinct identity per work.

Do not force every world into one identical skin.

## 12.3 Shared UI packages

Candidate family: `packages/ui/tokens`, `themes`, `primitives`, `components`, `layouts`, `icons`, `fx`, `motion`, `environments`, and `accessibility`.

## 12.4 Visual engines

- **Atmosphere Engine:** environments, particles, lighting, depth, ambient states, transitions.
- **Motion Engine:** page transitions, reveal effects, hover feedback, loading states, progress, cinematic sequences.
- **FX Engine:** energy borders, holographic layers, glow, particles, motion trails, controlled distortion.
- **Theme Engine:** platform theme, world theme, product theme, user preference, accessibility mode.

## 12.5 Motion and performance rules

- Use transform and opacity for efficient animation where possible.
- Avoid layout thrashing and excessive blur/GPU-intensive effects.
- Respect `prefers-reduced-motion`.
- Support ordinary desktop hardware.
- Lazy-load heavy assets.
- Avoid unnecessary continuous render loops.
- Support adaptive visual fidelity.
- Preserve readable typography and contrast.
- Keep critical information accessible when animation is disabled.
- FX must communicate state, hierarchy, or feedback—not merely decorate.

## 12.6 Required screens

1. The Threshold.
2. Universe Home.
3. Realm Navigation.
4. Command Center.
5. Agent Control Room.
6. Mission Board.
7. Workflow Execution.
8. Add-on Directory.
9. Model Explorer.
10. ORM Registry Inspector.
11. MoonWitness StoryTelling.
12. Fact Exposure.
13. Evidence Explorer.
14. Knowledge Graph.
15. Change Advisory Board.
16. Story Archive.
17. Character Explorer.
18. Timeline Explorer.
19. Creative Asset Library.
20. Monitoring and Operations.
21. User and Permission Management.
22. Configuration.
23. Audit and Activity History.

Every screen needs real functionality, meaningful empty/loading/error states, responsive behavior, and production data integration.

---

# PART IX — MONOREPO AND PACKAGE STRUCTURE

# 13. Target monorepo

Use Node.js, pnpm Workspaces, and Turborepo.

Recommended top-level organization:

```text
living-platform/
├── apps/
│   ├── agent/              # Mastra AI orchestration
│   ├── api/                # Fastify shared authority / ORM composition
│   ├── web/                # MoonWitness landing + Community
│   ├── OSS/                # Operational Support System
│   ├── BSS/                # Business Support System
│   ├── id/                 # Central Identity / OIDC
│   ├── docs/               # Documentation / Wiki / progress projection
│   ├── desktop/            # General desktop experience
│   ├── mobile/             # Native mobile experience
│   ├── cloud/              # Cloud / infrastructure control plane
│   ├── isp/                # ISP subscriber service lifecycle
│   ├── dx/                 # Developer Experience Workbench (P0)
│   ├── A-L-L-A-H/          # Flagship landing + corpus/knowledge
│   └── riot/               # Creative/media + isolated security lab
├── packages/
│   ├── base/
│   ├── orm/
│   ├── addons/
│   ├── clients/
│   ├── ui/
│   ├── narrative/
│   ├── identity-contracts/
│   ├── network-contracts/
│   ├── knowledge/
│   └── testing/
├── integrations/
│   ├── odoo/
│   ├── identity-providers/
│   ├── network-equipment/
│   ├── cloud-providers/
│   └── odoo-addons/
├── assets/
├── content/
├── configs/
├── infra/
├── docs/
├── scripts/
├── .github/workflows/
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
├── turbo.json
├── tsconfig.json
└── README.md

```


The detailed directory tree must be finalized after audit. Do not create empty folders simply to match a diagram.

## 13.1 Dependency direction

- Base packages do not depend on business add-ons.
- ORM kernel depends on approved abstractions, not application-specific code.
- Add-on model declarations depend on the ORM SDK and shared contracts.
- API composes add-on model metadata and application services.
- Agent consumes approved contracts and API capabilities.
- DX consumes task contracts and uses scoped local execution adapters.
- All application frontends consume browser-safe API contracts; only explicitly privileged local/control-plane workers receive scoped execution capabilities.
- OSS/BSS/ISP domain logic is owned by domain add-ons composed by API; apps are distinct experiences, not duplicate database owners.
- ID owns authentication identity; resource APIs own authorization; vault infrastructure owns secret values.
- UI packages are independent of business persistence.
- Native Odoo Python add-ons remain outside the TypeScript runtime graph.

No circular dependencies, deep imports, or undeclared dependencies.

---

# PART X — SECURITY, EVENTS, OBSERVABILITY

# 14. Security

Implement authentication, RBAC and fine-grained permissions, model access rights, record rules, field-level security, tenant isolation where applicable, company-level access where applicable, session protection, rate limiting, request validation, safe serialization, secrets management, audit records, dependency security, container security, agent tool authorization, and human approval for sensitive operations.

AI-specific protections:

- Tool allowlists.
- Trusted input boundaries and prompt-injection defenses.
- External-content provenance.
- Restricted tool execution and explicit action scope.
- Approval for sensitive actions.
- Output validation and token/execution limits.
- Audited execution.
- No unrestricted administrative context.

# 15. Event system

Events have versioned schemas and support event ID, type, version, timestamp, producer, correlation ID, causation ID, tenant context where applicable, and payload.

Examples:

- `addon.installed`, `addon.enabled`, `addon.disabled`
- `identity.user.created`, `identity.permission.changed`
- `moonwitness.claim.created`, `moonwitness.evidence.attached`, `moonwitness.exposure.published`
- `story.work.created`, `story.chapter.revised`, `story.canon.updated`
- `rocksoul.world.entered`, `rocksoul.mission.started`, `rocksoul.mission.completed`
- `agent.run.started`, `agent.tool.executed`, `agent.approval.requested`, `agent.run.completed`

Events do not replace authoritative records.

# 16. Observability

Provide structured logs, metrics, distributed traces, correlation IDs, agent run IDs, workflow IDs, queue job IDs, add-on lifecycle events, API latency/error rates, database connection/query health, queue depth/processing times, and Web rendering/interaction performance.

A user operation must be traceable across:

Web → API → Agent → Tool → Internal API → ORM → Database → Event → Web.

Do not log secrets, private source material, sensitive prompts, credentials, or unrestricted payloads.

---

# PART XI — INFRASTRUCTURE AND RELEASE

# 17. Three independently deployable runtimes

Build separate production artifacts:

- `living-platform-agent`
- `living-platform-api`
- `living-platform-web`

Docker requirements: multi-stage builds, minimal runtime dependencies, non-root user, reproducible builds, environment validation, secure secrets, health/readiness checks, graceful shutdown, image scanning, immutable image tags, and rollback capability.

Docker Compose development includes Agent, API, Web, database, Redis, and required supporting services. Use managed/external infrastructure where appropriate.

Kubernetes is an expansion path, not a mandatory first deployment. Do not introduce unnecessary operational complexity.

Each application must be independently buildable and deployable. A change in one application must not force a release of unrelated applications when contracts and dependencies have not changed.

# 18. CI/CD

CI sequence:

1. Checkout.
2. Validate Node.js and pnpm.
3. Validate lockfile.
4. Install.
5. Format check.
6. ESLint.
7. Typecheck.
8. Unit tests.
9. Integration tests.
10. Contract tests.
11. Architecture checks.
12. Security scanning.
13. Build affected packages.
14. Build affected applications.
15. Build Docker images.
16. Scan images.
17. Publish immutable artifacts.

CD sequence:

1. Merge to protected branch.
2. Build immutable images.
3. Deploy staging.
4. Verify health.
5. Run smoke tests.
6. Run integration checks.
7. Require production approval where configured.
8. Roll out production.
9. Verify post-deployment behavior.
10. Monitor and retain rollback path.

Base and ORM changes require expanded downstream compatibility tests.

---

# PART XII — TESTING AND QUALITY

# 19. Test strategy

Use Vitest for unit/integration tests and Playwright for browser E2E.

## Unit tests

- Model definitions and fields.
- Relations.
- Domain AST/compiler.
- Model registry and extension composition.
- Computed-field dependency engine.
- Security policies.
- Add-on manifests and lifecycle.
- Agent tool schemas and workflow utilities.
- UI primitives.

## Integration tests

- MikroORM metadata composition.
- EntityManager and RequestContext isolation.
- Transactions.
- Record rules and field security.
- Repository behavior.
- Add-on lifecycle.
- Fastify plugin registration.
- Mastra tool/API integration.
- Queue execution.
- Odoo adapters.
- Legacy data preservation.

## Contract tests

- Package public APIs.
- Add-on compatibility.
- Agent/API capability contracts.
- Web/API contracts.
- Event versioning.
- Model extension compatibility.

## E2E tests

- User login and universe entry.
- Direct business workflow.
- Agent-assisted workflow.
- Approval workflow.
- Mission Board.
- Story archive and revision.
- Fact Exposure.
- Knowledge Graph.
- Add-on activation/deactivation.
- Cross-realm behavior.
- Database preservation.
- Deployment health.

A successful typecheck is not proof of runtime correctness. A mocked API is not proof of real integration. A generated directory is not proof of a working module.

---

# PART XIII — IMPLEMENTATION ROADMAP

# 20. Master task checklist

Work in dependency order. Parallel work is allowed only after package ownership, contracts, and integration responsibilities are clear.

## PHASE 00 — Repository and source discovery

- [ ] Inspect complete repository and Git history.
- [ ] Inspect package manifests and application entrypoints.
- [ ] Inspect runtime/dependency versions.
- [ ] Inspect build, test, CI, and deployment setup.
- [ ] Identify current databases and owners.
- [ ] Identify actual Odoo versions and endpoints.
- [ ] Identify native Odoo custom modules if present.
- [ ] Discover RockSoul documents/assets.
- [ ] Discover MoonWitness documents/assets.
- [ ] Discover original story files and prompts.
- [ ] Discover titles, exact wording, and visual references.
- [ ] Catalogue characters, aliases, events, and relationships.
- [ ] Identify canon conflicts and unresolved references.
- [ ] Preserve original sources and versions.
- [ ] Build source inventory and provenance map.
- [ ] Draw current and target architecture.
- [ ] Create dependency and ownership graphs.
- [ ] Create product responsibility matrix.
- [ ] Create database risk register.
- [ ] Create initial ADRs.

**Deliverables:** repository audit, product audit, creative canon inventory, database ownership report, risk register, and target architecture.

## PHASE 01 — Monorepo foundation

- [ ] Pin Node.js.
- [ ] Configure pnpm Workspaces.
- [ ] Configure Turborepo.
- [ ] Establish package naming and exports.
- [ ] Configure strict TypeScript.
- [ ] Configure ESLint and Prettier.
- [ ] Configure environment validation.
- [ ] Configure shared test setup.
- [ ] Configure dependency boundaries.
- [ ] Configure caching and task graph.
- [ ] Validate clean installation and build.

**Acceptance:** clean, reproducible workspace installation and build.

## PHASE 02 — ORM proof of concept and kernel

- [ ] Define Odoo concept mapping and explicit non-goals.
- [ ] Implement model IDs and owner declarations.
- [ ] Implement manifest-to-model registration.
- [ ] Implement field descriptors.
- [ ] Implement relation descriptors.
- [ ] Implement model extension/composition.
- [ ] Detect model and field conflicts.
- [ ] Implement metadata collection.
- [ ] Prove safe MikroORM metadata composition.
- [ ] Implement request-scoped model context.
- [ ] Implement basic record API.
- [ ] Implement domain AST and parameterized compiler.
- [ ] Implement access rights and record-rule hook.
- [ ] Implement real database integration test.
- [ ] Document limitations and future compatibility.

**Acceptance:** models from two independent add-ons can be composed, queried, secured, and persisted through the platform ORM without direct add-on access to MikroORM internals.

## PHASE 03 — Database governance

- [ ] Inventory current database.
- [ ] Identify table/schema ownership.
- [ ] Separate legacy and platform-owned records.
- [ ] Decide new storage topology.
- [ ] Configure MikroORM.
- [ ] Implement EntityManager lifecycle and RequestContext.
- [ ] Implement transaction boundaries and repository adapters.
- [ ] Implement schema ownership checks.
- [ ] Implement additive schema policy.
- [ ] Implement backup/restore process.
- [ ] Test data preservation.
- [ ] Implement version-aware Odoo connector.
- [ ] Test Odoo integration without bulk migration.

**Acceptance:** existing data remains intact; new platform models operate only on explicitly owned storage.

## PHASE 04 — Base and add-on lifecycle

- [ ] Implement Base Kernel and Add-on SDK.
- [ ] Implement typed manifest and package registry.
- [ ] Implement dependency resolution.
- [ ] Detect circular/missing dependencies.
- [ ] Validate compatibility.
- [ ] Compose model extensions.
- [ ] Register permissions and record rules.
- [ ] Register API, Agent, and Web capabilities.
- [ ] Implement installed/enabled/disabled states.
- [ ] Implement upgrade/decommission controls.
- [ ] Implement health and diagnostics.
- [ ] Implement a complete example add-on.

**Acceptance:** a new add-on contributes verified capabilities through explicit entrypoints and does not require changes to unrelated modules.

## PHASE 05 — API authority

- [ ] Bootstrap Fastify.
- [ ] Implement dependency injection.
- [ ] Initialize ORM and registry in correct order.
- [ ] Implement public API and protected internal capability API.
- [ ] Implement authentication and authorization.
- [ ] Enforce model, record, and field permissions.
- [ ] Implement application use cases.
- [ ] Implement OpenAPI contracts.
- [ ] Implement events and outbox.
- [ ] Integrate BullMQ where needed.
- [ ] Implement audit records.
- [ ] Implement health/readiness and graceful shutdown.

**Acceptance:** all business writes are authorized and executed by API-owned use cases.

## PHASE 06 — Mastra intelligence

- [ ] Bootstrap Mastra.
- [ ] Implement agent, tool, and workflow registries.
- [ ] Integrate scoped API client.
- [ ] Implement trusted context construction.
- [ ] Define memory and storage ownership.
- [ ] Implement evaluations and approvals.
- [ ] Implement tool allowlists and authorization.
- [ ] Implement persistent workflow recovery.
- [ ] Implement retry and idempotency.
- [ ] Implement structured outputs.
- [ ] Implement tracing and execution audit.
- [ ] Build one working agent.
- [ ] Verify Agent/API end-to-end workflow.

**Acceptance:** the Agent executes an authorized real workflow without direct business database writes.

## PHASE 07 — Creative canon and domain models

- [ ] Implement Creative Canon Registry.
- [ ] Store original works and editions.
- [ ] Store chapters and scenes.
- [ ] Store characters and aliases.
- [ ] Store timelines and relationships.
- [ ] Store sources and provenance.
- [ ] Store visual assets and versions.
- [ ] Implement revision history and canon validation.
- [ ] Implement MoonWitness source/claim/evidence models.
- [ ] Implement evidence relationships.
- [ ] Implement Fact Exposure lifecycle.
- [ ] Implement Change Advisory Board workflow.
- [ ] Implement Mission Board.
- [ ] Implement RockSoul worlds and portals.
- [ ] Verify known story titles and exact wording against source archive.

**Acceptance:** original creative materials are preserved in versioned, traceable, queryable records.

## PHASE 08 — Experience and design system

- [ ] Define visual principles and design tokens.
- [ ] Define platform and world themes.
- [ ] Implement shared primitives.
- [ ] Implement Atmosphere, Motion, and FX engines.
- [ ] Build The Threshold and RockSoul navigation.
- [ ] Build MoonWitness research/story interfaces.
- [ ] Build Story World experiences.
- [ ] Build Agent Control Room and Mission Board.
- [ ] Build evidence and graph explorers.
- [ ] Build creative asset library and operational screens.
- [ ] Implement responsive layouts, accessibility, and reduced motion.
- [ ] Validate performance on ordinary desktop hardware.

**Acceptance:** the Web application has an original, cohesive anime-game visual identity while remaining readable and operationally useful.

## PHASE 09 — Three-realm integration

- [ ] Validate shared contracts.
- [ ] Integrate Web/API and Agent/API.
- [ ] Integrate add-on capability discovery.
- [ ] Propagate identity and permissions safely.
- [ ] Propagate correlation IDs.
- [ ] Validate event contracts.
- [ ] Validate streaming and async job status.
- [ ] Run complete vertical slice.
- [ ] Test partial failures and recovery.

**Acceptance:** one real user workflow crosses the required realms with consistent identity, authorization, data, and status.

## PHASE 10 — Security and observability

- [ ] Validate authentication, record rules, field access, and tenant/company isolation where applicable.
- [ ] Validate Agent tool authorization and human approval.
- [ ] Implement audit, structured logs, metrics, and traces.
- [ ] Implement queue and database monitoring.
- [ ] Implement vulnerability and secrets scanning.
- [ ] Review sensitive-data exposure.

**Acceptance:** important platform operations are protected and traceable.

## PHASE 11 — Infrastructure and deployment

- [ ] Build Agent, API, and Web images.
- [ ] Build development Compose and integration test environments.
- [ ] Define production configuration.
- [ ] Implement CI and independent application build pipelines.
- [ ] Implement staging deployment and health validation.
- [ ] Implement production rollout and rollback.
- [ ] Verify inter-service networking.
- [ ] Verify persistence and restart recovery.
- [ ] Document operations.

**Acceptance:** all fourteen application surfaces build, validate, and release according to their deployment class; only justified trust/scaling boundaries become independent services.

## PHASE 12 — Final verification

- [ ] Clean install.
- [ ] Full lint and typecheck.
- [ ] Full unit, integration, contract, and browser E2E tests.
- [ ] ORM security and model extension tests.
- [ ] Odoo adapter and legacy data preservation tests.
- [ ] Add-on lifecycle and Agent workflow tests.
- [ ] Creative canon validation.
- [ ] Accessibility checks.
- [ ] Production builds and container verification.
- [ ] CI/CD verification.
- [ ] Security and operational reviews.
- [ ] Documentation audit and final architecture report.

**Acceptance:** production readiness is supported by reproducible evidence, not by the number of files or packages created.

---

# PART XIV — PARALLEL EXECUTION AND GOVERNANCE

# 21. Coordinated engineering workstreams

Independent work may proceed in parallel only after interfaces, ownership, and dependency order are established.

**A — Architecture and governance:** repository/source audit, ADRs, package boundaries, product responsibility map, documentation.

**B — ORM and database:** model/field registry, extension engine, domain compiler, record API, MikroORM adapter, database ownership, legacy integration.

**C — API and add-on engine:** Fastify runtime, composition root, DI, model registry integration, add-on lifecycle, domain services, events/jobs.

**D — Agent intelligence:** Mastra agents, tools, workflows, memory, evaluations, approvals, API integration.

**E — Web and creative experience:** Next.js, design tokens, RockSoul, MoonWitness, Story Worlds, motion and FX.

**F — Infrastructure and quality:** pnpm/Turbo, Docker, CI/CD, security, tests, observability.

Every task records task ID, owner, scope, dependencies, package/file ownership, input contracts, expected output, acceptance criteria, test evidence, blockers, and status. The lead architect owns integration and consistency. Do not allow parallel workers to implement conflicting registries, ORM abstractions, domain models, or visual systems.

---

# PART XV — DOCUMENTATION AND ARCHITECTURE RECORDS

# 22. Required documentation

Maintain architecture overview, three-realm architecture, dependency graph, package boundaries, Odoo-inspired ORM specification, model/field conventions, extension/inheritance specification, domain query specification, security/record-rule specification, MikroORM adapter specification, database ownership policy, legacy Odoo integration guide, add-on development guide, Agent tool/workflow guide, API contract guide, Web design system, RockSoul experience guide, MoonWitness research/evidence guide, creative canon governance, deployment guide, security guide, and operations/recovery guide.

Every major technical decision requires an ADR containing context, options, decision, consequences, compatibility impact, and validation evidence. Creative decisions also require provenance and revision history. Technical ADRs must not replace or overwrite the creative canon.

---

# PART XVI — NON-NEGOTIABLE RULES

# 23. Rules that must never be violated

## Platform

1. One platform, exactly fourteen named applications; app count does not force fourteen microservices.
2. Mastra owns AI orchestration.
3. Fastify API owns business execution and data authority.
4. Next.js owns human experience.
5. Base owns common infrastructure and contracts.
6. Add-ons own their capabilities.
7. No duplicated business logic across realms.
8. No unrestricted cross-application imports.

## ORM

9. Odoo-inspired module/model architecture is mandatory.
10. Every model has explicit ownership.
11. Every field is typed.
12. Every extension is registered and validated.
13. Conflicts are detected before runtime.
14. Record operations enforce access policies.
15. Important operations are auditable.
16. MikroORM internals remain behind the persistence adapter.
17. No global EntityManager.
18. No arbitrary client or Agent SQL.
19. No unrestricted schema synchronization.
20. No uncontrolled model mutation after initialization.

## Data

21. No big-bang migration.
22. No destructive legacy data changes.
23. Native Odoo databases remain under Odoo ownership.
24. Add-on disable does not delete data.
25. Every schema object has an owner.
26. Every external data source has provenance.

## Creative identity

27. Preserve original story text.
28. Preserve titles and exact authored wording.
29. Preserve provenance and revision history.
30. Never silently invent canon.
31. Never automatically resolve ambiguous identities.
32. Preserve distinct world identities.
33. Respect visual restrictions.
34. Do not reduce RockSoul to a SaaS skin.
35. Do not reduce MoonWitness to a blog.
36. Do not reduce storytelling to static CRUD.

## Engineering

37. No fake completion.
38. No placeholder implementation marked complete.
39. No fake tests or health checks.
40. No duplicate abstractions.
41. No unnecessary microservices.
42. No unreviewed production deployment.
43. No secrets in source control.
44. No documentation that contradicts implementation.

---

# PART XVII — FINAL DEFINITION OF DONE

# 24. What completion means

**FOUNDATION**
- pnpm workspace is reproducible.
- Turborepo task graph works.
- Strict TypeScript and lint are enforced.
- Package boundaries are checked.
- ADRs and ownership are documented.

**FOURTEEN-APP ECOSYSTEM**
- Mastra Agent starts and executes real authorized workflows.
- Fastify API owns business operations.
- Next.js Web communicates through API contracts.
- Shared contracts are tested.
- Applications can be deployed independently.

**ODOO-ORIENTED ORM**
- Model registry and field registry work.
- Relations are validated.
- Extensions are composed deterministically.
- Domain queries are parameterized and typed.
- Record APIs work.
- Model access rights, record rules, and field-level access work.
- Request context is isolated.
- MikroORM metadata composition is tested with a real database.
- Add-ons cannot bypass ORM security through direct persistence access.

**DATABASE**
- Ownership is clear.
- Existing data is preserved.
- No big-bang migration occurred.
- No unauthorized destructive schema changes occurred.
- New add-on storage is controlled and versioned.
- Odoo integration is version-aware.

**ADD-ONS**
- Manifest validation and dependency resolution work.
- Lifecycle works.
- API/Agent/Web contributions register correctly.
- Disabled add-ons are inactive.
- Existing data survives disable/decommission.

**CREATIVE UNIVERSE**
- Original creative materials are inventoried.
- Original wording and source provenance are preserved.
- RockSoul has a distinct Threshold and universe experience.
- MoonWitness supports traceable claims, sources, and evidence.
- Story Worlds support versions, characters, scenes, and timelines.
- No unverified story relationship is presented as fact.
- Visual restrictions are respected.

**EXPERIENCE**
- Shared design tokens work.
- Worlds retain their own themes.
- Animation is performant and reduced motion works.
- Information remains readable.
- The experience is original and not a generic dashboard template.

**OPERATIONS**
- All images build.
- Services communicate.
- CI and deployment pass.
- Health checks are real.
- Rollback is tested.
- Observability is functional.
- Documentation matches implementation.

Never declare the platform complete based on scaffolding, folder count, line count, or screenshots alone.

# 25. Official technical references

Verify current official documentation and selected versions before implementation:

- Node.js: https://nodejs.org/docs/latest/api/
- pnpm Workspaces: https://pnpm.io/workspaces
- Turborepo: https://turbo.build/repo/docs
- Mastra: https://mastra.ai/docs
- Mastra Monorepo: https://mastra.ai/docs/deployment/monorepo
- Fastify Plugins: https://fastify.dev/docs/latest/Reference/Plugins/
- Next.js App Router: https://nextjs.org/docs/app
- MikroORM: https://mikro-orm.io/docs
- MikroORM Unit of Work: https://mikro-orm.io/docs/unit-of-work
- MikroORM Migrations: https://mikro-orm.io/docs/migrations
- Odoo ORM: https://www.odoo.com/documentation/19.0/developer/reference/backend/orm.html
- Odoo Module Manifest: https://www.odoo.com/documentation/19.0/developer/reference/backend/module.html
- Odoo External API: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html

Do not assume Odoo 19 documentation describes an Odoo 17 deployment. Verify the actual target version.

---

# FINAL PRODUCT STATEMENT

THE LIVING PLATFORM is the technical universe.

ROCKSOUL provides the living experience.

MOONWITNESS provides the witness, research, evidence, and knowledge universe.

STORY WORLDS preserve and connect original creative works.

Mastra gives the universe intelligence.

Fastify gives it authority.

The Odoo-inspired ORM gives it a coherent model and add-on philosophy.

MikroORM provides disciplined persistence.

Next.js gives it a human experience.

Independent add-ons allow it to evolve.

Events connect its parts. Security defines its boundaries. Observability makes its activity visible. Infrastructure keeps it alive.

The human remains in control.

**THE PLATFORM IS THE FOUNDATION.  
THE WORLDS ARE THE EXPERIENCE.  
THE ADD-ONS ARE THE CAPABILITIES.  
THE STORIES ARE THE MEMORY.  
THE AGENTS ARE THE INTELLIGENCE.  
THE HUMAN REMAINS IN CONTROL.**

**ONE UNIVERSE. FOURTEEN APPLICATIONS. INFINITE CAPABILITIES.**

**BUILD THE FOUNDATION.  
PRESERVE THE STORIES.  
CONNECT THE WORLDS.  
BRING THE UNIVERSE TO LIFE.**

# 26. Expanded application topology

The authoritative application topology, trust boundaries, source-of-truth map and deployment classes are maintained in [BLUEPRINT-APPLICATIONS.MD](./BLUEPRINT-APPLICATIONS.MD).

Specialist contracts:
- [DX Workbench](./BLUEPRINT-DX.MD) — implementation factory and first priority.
- [Central Identity](./BLUEPRINT-ID.MD) — OIDC/SSO and service identity; secrets remain in a dedicated vault.
- [OSS](./BLUEPRINT-OSS.MD), [BSS](./BLUEPRINT-BSS.MD), [ISP](./BLUEPRINT-ISP.MD) — separated operational, commercial and subscriber-service responsibilities.
- [Cloud](./BLUEPRINT-CLOUD.MD) — infrastructure control plane and isolated execution.
- [Docs](./BLUEPRINT-DOCS.MD), [Desktop](./BLUEPRINT-DESKTOP.MD), [Mobile](./BLUEPRINT-MOBILE.MD) — dedicated client/documentation experiences.
- [A-L-L-A-H](./BLUEPRINT-A-L-L-A-H.MD) — flagship corpus/ontology/legal/government knowledge.
- [RIOT](./BLUEPRINT-RIOT.MD) — creative studio and isolated authorized security lab.

**Do not interpret fourteen app directories as an obligation to deploy fourteen microservices.**
