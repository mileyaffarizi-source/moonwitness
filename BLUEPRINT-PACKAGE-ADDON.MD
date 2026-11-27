# BLUEPRINT-PACKAGE-ADDON — DOMAIN ADD-ON PLATFORM CONTRACT

**Document ID:** MW-BP-ADD-001 · **Version:** 2.0.0 · **Status:** Proposed target contract pending ADR-0003 owner approval  
**Parent:** BLUEPRINT-PACKAGE.MD · **Master:** BLUEPRINT.md · **Task registry:** tasks.json  
**Owning workstream:** ADDON · **Decision record:** docs/adr/ADR-0003-addon-manifest-trust-and-lifecycle.md

## 1. Purpose and terminology

An add-on is a versioned, independently owned domain capability package composed by the platform. Its modular philosophy is inspired by Odoo's add-on model: packages may declare models, additive extensions, permissions, routes, event handlers, Agent tools, Web contributions, configuration, assets and lifecycle requirements.

This is a TypeScript/Node.js package system. It is not a native Odoo Python module, not a second application, not a separate service by default, and not a claim that MikroORM is equivalent to Odoo ORM.

The words below have distinct meanings:

- **Application:** a product/operator/developer experience or selected runtime boundary, such as apps/OSS or apps/BSS.
- **Package:** a versioned workspace unit with a public export contract.
- **Add-on:** a domain-capability package which declares approved contributions to one or more platform realms.
- **Capability:** one named operation or contribution which can be independently authorized and disabled.
- **Extension:** an additive declaration against an existing platform-owned model or extension point.
- **Artifact:** the immutable built package output whose source revision, digest and provenance can be verified.

An add-on is not allowed to create a competing source of truth. One entity has one authoritative owner and one governed write path.

## 2. Non-negotiable architecture laws

1. Base owns stable platform primitives and SDK contracts. Base never imports, discovers or executes a business add-on implementation.
2. Add-ons depend on public Base/ORM/client contracts only. An add-on cannot import another add-on's private implementation, private repository or private persistence adapter.
3. API is the authority for business use cases, authorization, transactions, record mutation and audit. Agent tools call approved API capabilities; they never receive ORM objects or direct database access.
4. Web contributions are browser-safe and declarative. A browser bundle cannot contain server entrypoints, database drivers, secrets, filesystem/process access or private Agent code.
5. Model/field ownership is explicit and unique. An extension cannot silently take ownership of another package's model or field.
6. Existing Odoo-owned tables, fields and records remain Odoo-owned until an entity-specific migration/cutover is separately reviewed and approved. MikroORM is not permission to write Odoo tables.
7. Discovery and validation never execute add-on code, migrations, build scripts or network requests.
8. Production never installs arbitrary packages from an upload, public registry or mutable branch at runtime. The approved artifact is built, reviewed and pinned before deployment.
9. Disabled means no new capability can be invoked. Disable does not delete data. Uninstall and decommission are separate, reviewed operations.
10. Capability authorization is enforced server-side by API on every request. Hiding a Web menu or removing an Agent tool is not authorization.
11. Add-on contributions are versioned and independently observable. A partially failed capability must not make the rest of the platform report a false ready state.
12. Privileged infrastructure, network provisioning, payments/refunds, secret access, production deployment and security-lab operations are not generic add-on hooks. They require separately approved capability IDs, actor identity, resource scope, risk classification, exact-scope approval and audit.

## 3. Package layout and ownership

Canonical workspace package path:

~~~text
packages/addons/<addon-slug>/
  package.json
  addon.manifest.json
  README.md
  CHANGELOG.md
  LICENSE
  src/
    contract/
    api/
    agent/
    web/
    migrations/
  tests/
    unit/
    contract/
    security/
    integration/
  docs/
    architecture.md
    operations.md
~~~

Only folders actually needed by the add-on are created. The layout above is a contract, not a requirement to generate empty folders. If a realm contribution is absent, its entrypoint and files are absent.

Package naming rules:

- Package name: @moonwitness/addon-<slug>.
- Add-on ID: stable, lowercase, immutable identifier using mw.addon.<domain>.<capability> segments.
- Slug: lowercase kebab-case and aligned to the final ID segment.
- Add-on ID is never reused after retirement. Renames create a successor ID and an explicit migration/alias record.
- package.json name/version and addon.manifest.json package.name/package.version must match exactly.
- Every package has one owner role, one accountable team/person, one license/provenance declaration and one support classification.
- A package owns only its declared package paths and data namespace. It cannot widen ownership at runtime.

The package can contribute to API, Agent, Web, Docs or another approved realm without becoming a separate deployed microservice. App-level composition remains owned by that application's architect.

## 4. Manifest file and compatibility contract

Each add-on has exactly one root addon.manifest.json. It is the machine-readable declaration of intended contributions; it is not executable code and cannot grant itself approval.

The manifest must declare:

| Group | Required information |
|---|---|
| Schema | JSON Schema URI, manifest format version and platform add-on contract version |
| Identity | Stable add-on ID, exact package name, version, display name and description |
| Ownership | Owner role/team, maintainer contact, license and source repository/revision |
| Compatibility | Platform range, API contract range and explicit supported Node runtime range |
| Dependencies | Required and optional add-on IDs with SemVer ranges |
| Realm contributions | Separate public entrypoint and contribution declarations per realm |
| Capabilities | Stable capability IDs, descriptions, risk classes and owning realm |
| Authorization | Permissions, resource scope, model/field access and rationale |
| Data | Owned models/storage namespace, relations and additive migration declarations |
| Events | Produced/consumed event IDs, schema versions and idempotency expectations |
| Configuration | Versioned config schema, defaults and whether values are sensitive |
| Assets | Stable asset IDs, source/derivative lineage, checksum and rights/review state |
| Operations | Health checks, readiness requirements, startup/shutdown behavior and diagnostics |
| Verification | Test, security and documentation entrypoints plus minimum conformance level |

Required identity and package example (illustrative only; it creates no runtime package):

~~~json
{
  "$schema": "https://schemas.moonwitness.invalid/addon-manifest/v1.json",
  "manifestVersion": "1.0.0",
  "contractVersion": "1.0.0",
  "id": "mw.addon.oss.network-inventory",
  "package": {
    "name": "@moonwitness/addon-network-inventory",
    "version": "1.0.0"
  },
  "display": {
    "name": "Network Inventory",
    "description": "Owns the network inventory capability for the OSS domain."
  },
  "owner": {
    "role": "oss_domain_owner",
    "team": "platform-oss",
    "contact": "maintained through repository ownership metadata"
  },
  "license": "UNLICENSED",
  "source": {
    "repository": "mileyaffarizi-source/moonwitness",
    "revision": "immutable-commit-sha"
  },
  "compatibility": {
    "platform": ">=0.1.0 <1.0.0",
    "apiContract": "^1.0.0",
    "node": ">=24.22.3 <25"
  },
  "dependencies": {
    "required": [],
    "optional": []
  },
  "contributions": {
    "api": {
      "entrypoint": "./dist/api/index.js",
      "capabilities": ["mw.oss.inventory.read"]
    },
    "agent": null,
    "web": {
      "entrypoint": "./dist/web/index.js",
      "contributions": ["mw.web.oss.inventory.navigation"]
    }
  },
  "permissions": [
    {
      "id": "mw.oss.inventory.read",
      "resource": "oss.network-resource",
      "actions": ["read"],
      "scope": "tenant",
      "risk": "low",
      "reason": "Operators need authorized inventory visibility."
    }
  ],
  "storage": {
    "namespace": "oss_network_inventory",
    "ownedModels": ["oss.network-resource"],
    "migrations": []
  },
  "events": {
    "produces": [],
    "consumes": []
  },
  "configuration": {
    "schema": "./config.schema.json",
    "sensitiveFields": []
  },
  "assets": [],
  "health": {
    "readinessEntrypoint": "./dist/api/health.js",
    "requiredCapabilities": ["mw.oss.inventory.read"]
  },
  "verification": {
    "tests": ["pnpm --filter @moonwitness/addon-network-inventory test"],
    "securityReview": "required",
    "docs": "./docs/architecture.md"
  }
}
~~~

The example is not approval for this specific add-on, not a real network model and not permission to access network systems. The final schema and exact required fields are owned by ADD-001 and ADR-0003.

### 4.1 Manifest validation laws

A manifest fails closed when any of these is true:

- Invalid JSON, schema version, missing required field, unknown unsupported contract major or duplicate/unstable identifier.
- package.json name/version differs from the manifest.
- Owner, source revision, license or compatibility range is absent.
- Required dependency is missing, disabled, incompatible or part of a cycle.
- Optional dependency is absent; this does not fail validation but must produce an explicit degraded/feature-disabled result if a contribution depends on it.
- Entrypoint is absolute, escapes the package root, resolves outside declared exports or has an unsafe realm.
- Capability is not declared, permission rationale is empty, risk is unknown or a privileged operation has no approved policy binding.
- Model/field/storage owner collides with another add-on or attempts to claim a protected legacy Odoo object.
- Event contract lacks schema version, ownership or idempotency behavior.
- An asset has unknown source/rights where the asset policy requires approval.
- Runtime build/test/security/documentation verification is missing or falsely marked passed.
- The package uses unsupported Node/pnpm/runtime compatibility.

Schema validation is static. Manifest content must never be evaluated as JavaScript, shell, SQL, templates or arbitrary URLs.

## 5. Dependency and composition model

Required and optional dependencies use explicit add-on IDs and SemVer ranges. The resolver builds a directed graph and validates:

- Unique IDs and a single active version for each selected add-on.
- Required dependencies exist and match their declared compatibility range.
- Required dependency graph is acyclic.
- Optional dependency absence is surfaced as degraded capability state, never silently treated as installed.
- A disabled dependency blocks the dependent capability unless an approved fallback is declared.
- Upgrade compatibility is checked before selecting the candidate graph.
- Conflicting ownership, routes, event subscriptions, model IDs, field IDs and capability IDs fail unless a specific versioned conflict policy exists and is approved.
- Composition order is deterministic from dependency edges and explicit priority rules; alphabetical order alone is not a hidden business rule.

No dependency is downloaded or installed as a side effect of resolving the manifest. Workspace packages use the reviewed lockfile; production artifacts use an immutable, verified build.

## 6. Model, field and relation declarations

An add-on may own a new model or extend an existing model through the public ORM SDK. It may not directly mutate the runtime registry or persistence adapter.

A model declaration identifies:

- Stable model ID and technical name.
- Owning add-on ID and package version.
- Domain owner and record authority.
- Storage strategy and namespace/schema ownership.
- Public fields, relations, indexes and lifecycle policy.
- Access policy reference and audit classification.
- Migration lineage and supported compatibility interval.

An extension declaration identifies:

- Target model ID and its owner.
- Extension owner and stable extension ID.
- Additive fields/relations/hooks/contributions.
- Declared ordering constraints and before/after references.
- Permission impact and schema migration reference.
- Collision behavior and rollback/recovery path.

Allowed changes are additive unless an accepted ADR and migration review authorize otherwise. Reject duplicate field IDs, collisions with inherited fields, type changes that narrow/widen stored values unsafely, removal/rename without a compatibility migration, circular required relations, unauthorized policy weakening or undocumented cross-owner writes.

Every record mutation calls an API-owned use case or model/record capability. There is no global EntityManager, raw SQL, direct Odoo connection, arbitrary repository import or ambient administrator context available to add-on code.

## 7. Capability and permission model

Capabilities are stable IDs, not booleans or menu labels. Each capability is bound to add-on ID, version, realm, owning model/domain, permission requirement, risk class and lifecycle state.

Permission declarations include:

- Capability ID and owning add-on.
- Resource type and resource identifier.
- Actions allowed (read/create/update/delete/approve/execute or a specific domain action).
- Tenant/account/project/resource scope.
- Field-level visibility/write policy where relevant.
- Risk class: read_only, reversible, consequential, destructive_or_external or privileged_infrastructure.
- Human-readable purpose/rationale.
- Approval policy reference for elevated operations.
- Audit/retention requirements.

Policy rules:

1. No permission is inferred from an installed or enabled add-on.
2. No broad wildcard permission by default.
3. No cross-tenant access without a separate capability and explicit policy.
4. API checks the authenticated actor, workload identity, tenant, resource, action, current add-on state and current policy on every operation.
5. Background jobs use explicit service identity and bounded scope. They cannot inherit a user's administrator session.
6. Web visibility is presentation only; the API must reject unauthorized direct requests.
7. Agent tools are explicit capability wrappers calling approved API operations. They do not receive DB, shell, filesystem, Docker or secret-manager handles.
8. An add-on cannot grant itself a higher risk class or approve its own execution.
9. Disabled, failed, untrusted or incompatible add-ons contribute no callable capabilities.
10. Approval binds to exact operation, target, actor, payload/hash, expiry and policy version. A changed payload invalidates approval.

High-risk capabilities (network config, payment/refund, secret retrieval, cloud apply, production deploy, destructive migration and security-lab operations) are separately registered; they do not inherit generic add-on privileges.

## 8. Realm entrypoints and isolation

Each realm has a separate entrypoint, export map and runtime boundary:

| Realm | Allowed contribution | Forbidden contribution |
|---|---|---|
| API | Routes through API composition, use cases, validators, model descriptors, policies, event handlers and jobs | Direct DB connection, global ORM adapter, arbitrary process execution or bypass routes |
| Agent | Typed tool/workflow definition that calls authorized API contracts | ORM objects, raw DB, shell/filesystem, arbitrary browser credentials or hidden model-provider secrets |
| Web | Browser-safe React components, route metadata, navigation, themes, styles, public assets and typed API client adapters | Fastify, MikroORM, Node fs/process, provider credentials, secret configuration or private Agent code |
| Docs | MDX/content contribution metadata and links to canonical engineering sources | A duplicate task status ledger, unrestricted publish permission or private content snippet leak |
| Shared contract | Types, JSON schemas and versioned event/API contracts | Runtime implementation, secret handling, persistence adapters or cross-realm bundling |

Server and browser packages must expose distinct public exports. Tests assert that server-only modules cannot enter browser bundles and that no add-on imports deep internal paths outside declared exports.

A manifest may declare null/absent realm entrypoints. It must not create empty placeholder contributions simply to claim support for every realm.

## 9. Storage, migrations and legacy ownership

Every persisted model, table, schema, object store prefix and event stream has one authoritative owner.

Add-ons may own new additive storage if the API/data governance approves the namespace and lifecycle. The manifest declares owned model IDs, storage namespace and migration sequence. It does not grant a database connection.

Migration rules:

- Versioned, immutable migration IDs; checksum and exact source revision.
- Explicit preconditions, expected postconditions and supported source/target versions.
- Additive or expand/contract change preferred.
- No global schema synchronization at startup.
- No destructive migration on discovery, package install or normal enable.
- No migration against an Odoo-owned object without approved entity transition and version-aware integration contract.
- Backup/restore readiness and a tested recovery plan for data-impacting changes.
- Separate code rollback from data rollback; irreversible data migrations must have forward recovery.
- Destructive changes need exact human approval and a maintenance/impact plan.

Disabling an add-on stops new routes/tools/jobs/events/navigation but preserves data. Decommission is a separately approved state transition. Physical deletion of persisted data requires explicit retention/legal/owner authorization, backup/recovery evidence and a separate recorded operation.

## 10. Artifact trust, build and distribution

The manifest is not proof that its code is trusted. Trust is established against an immutable artifact and independently verifiable provenance.

Required artifact evidence:

- Immutable source commit and reviewed pull request.
- Frozen dependency lockfile and reproducible build inputs.
- Build workflow/run identity and build timestamp.
- Artifact digest (SHA-256 or stronger approved algorithm).
- Provenance attestation and approved signing identity, once the platform signing architecture is accepted.
- Dependency/SBOM and vulnerability scan result.
- Approval state and allowed deployment environment.
- Runtime compatibility and manifest contract version.

Development may link reviewed workspace packages from the monorepo. Production consumes immutable artifacts, not mutable branches, unverified tarballs or public URLs. No runtime npm install, arbitrary plugin upload, remote code download, hot reload or self-asserted signer is permitted by this blueprint.

Exact signing identity, key custody, trust roots, attestation verification and promotion policy remain Proposed in ADR-0003 and require owner/security approval before production enforcement.

## 11. Lifecycle state machine

Lifecycle states:

- discovered
- schema_validated
- trust_verified
- compatible
- dependencies_resolved
- installed
- enabling
- initializing
- ready
- degraded
- failed
- disabling
- disabled
- upgrading
- decommission_pending
- decommissioned

Only explicit transitions are valid. Invalid transitions are rejected and audited. Readiness is not equivalent to installed or enabled.

### 11.1 Install and enable

1. Resolve an immutable artifact/source revision.
2. Parse and schema-validate the manifest without executing package code.
3. Verify artifact digest, provenance and trust policy.
4. Check platform, Node runtime, API contract and manifest compatibility.
5. Resolve required/optional dependency graph and collisions.
6. Validate capability IDs, permission policy and actor approval.
7. Validate model/field composition and data ownership.
8. Prepare reviewed, versioned migrations; do not apply destructive changes automatically.
9. Register only approved routes/tools/events/navigation contributions.
10. Initialize the add-on in its owning runtime boundary with scoped dependencies.
11. Run readiness and health checks.
12. Mark ready only when required capabilities are registered and independently verified.

### 11.2 Disable

Stop new invocations, prevent new jobs/events, drain or pause work, unregister capabilities, retain owned data, preserve diagnostic/audit state and mark disabled. Disable must be idempotent and safe to retry.

### 11.3 Upgrade and failure recovery

Validate compatibility and dependency changes; acquire the required lock; backup affected owned data; run the migration plan; register the new artifact; execute smoke/contract tests; then mark ready. If failure occurs, stop new work and enter failed/degraded. Revert compatible code where safe, otherwise use forward-recovery or manual owner action. Never report success before authoritative health and data checks.

### 11.4 Decommission

Requires a separate approval, impact summary, retention review, backup/restore evidence, dependency check and capability revocation. Keep data by default. Any deletion is a distinct explicit operation.

## 12. Configuration, assets, events and observability

Configuration is declared through a versioned schema. Each field identifies sensitivity, source (safe default, tenant setting, secret reference), validation, reload semantics and audit behavior. Secret values never enter addon.manifest.json, source code, tasks.json, build logs or browser bundles. Manifests reference secret capabilities; they do not store keys.

Assets have stable IDs, source/derivative lineage, SHA-256 digest, creator/source, rights/license, review state, dimensions/format and permitted usage. Unlicensed or restricted assets cannot be promoted by an add-on manifest.

Events declare stable event ID, schema version, owner, producer/consumer, correlation/causation IDs, idempotency key and delivery/retry policy. Event payloads do not replace the owning API's record state.

Diagnostics include add-on ID/version, artifact digest, lifecycle state, readiness, dependency status, registered capability count, last error category, correlation ID and timestamps. Do not expose stack traces, secrets, tenant data or private dependency URLs to public responses.

## 13. Authoring standards and automated quality gate

Every add-on PR must pass:

1. package and manifest name/version/ID consistency.
2. JSON Schema and domain-manifest validation.
3. stable identifier uniqueness and SemVer range validation.
4. dependency graph resolution, cycle and compatibility checks.
5. contribution entrypoint existence and package-relative path containment.
6. capability/permission completeness, least privilege and risk-class validation.
7. model/field ownership and extension collision checks.
8. storage namespace and migration policy validation, including no Odoo ownership violation.
9. realm boundary rules and public export restrictions.
10. tests for manifest schema, API contract, capability policy, lifecycle and disabled-state behavior.
11. dependency and source security scanning; SBOM/provenance for production artifacts.
12. documentation, changelog and owner metadata.

No add-on can be published/enabled merely because its manifest parses. Validation stages are static schema, dependency/collision analysis, security policy checks, build/test checks, signed artifact verification and runtime readiness. Their outputs are separate evidence fields.

A repository with no add-on packages may legitimately report zero add-ons discovered. It must not invent a fake reference add-on to make the gate green. The reference add-on is created only when ADD-009 dependencies and its real vertical-slice interfaces exist.

## 14. Testing and conformance matrix

| Level | Required cases |
|---|---|
| Manifest schema | Valid fixture; missing owner; invalid ID/name/version; unknown contract major; unsupported fields; invalid JSON |
| Dependency graph | Missing required dependency; absent optional dependency; incompatible version; disabled dependency; cycles; deterministic order |
| Ownership | Duplicate add-on/model/field/capability/event IDs; cross-owner field collision; Odoo protected object claim |
| Permissions | No permission by default; tenant mismatch; field deny; disabled add-on; approval missing/expired/payload changed; privileged operation |
| Realm isolation | Agent cannot import DB/ORM; Web cannot import Node/server modules; add-on cannot deep-import private package internals |
| Lifecycle | Invalid transition; install/enable idempotency; partial failure; disable stops contributions; data retained; retry/recovery |
| Migration | Wrong source version; duplicate ID; checksum mismatch; destructive migration approval missing; backup/restore; forward recovery |
| Artifact trust | Digest mismatch; missing provenance; unknown signer; revoked key; mutable branch/artifact rejected |
| Operations | Health false, degraded dependency, job drain, audit correlation, safe diagnostics and rollback status |

CI must run deterministic tests with no production credentials or live data. Integration tests declare and isolate required services. Security tests use synthetic fixtures and explicitly bounded local environments.

## 15. Reference add-on acceptance

The first reference add-on must prove one complete, genuinely useful domain capability:

- Reviewed manifest and immutable build artifact.
- One add-on-owned model with stable ID and authority.
- One additive extension of an existing platform-owned model through SDK.
- One relation and field-level access contract.
- One authorized API read and one authorized API write.
- One Agent tool that calls the API, without database access.
- One browser-safe Web contribution and bundle-boundary test.
- One versioned event with idempotency behavior.
- Install, enable, ready, disable, preserve-data and recovery behavior.
- Manifest/dependency/permission/lifecycle/security/integration test suite.

Do not scaffold many empty add-ons before this reference proves the package model. Do not call a mocked API result a production integration.

## 16. Ownership, sequencing and definition of done

Tasks ADD-001 through ADD-011 in tasks.json remain the canonical execution sequence. ADR-0003 must be accepted for the decisions it owns before trusted artifact distribution, production enablement, destructive migrations or privileged add-on capabilities are implemented.

Definition of done requires:

- An independent add-on can be described by a versioned strict manifest and validated before execution.
- Unique ownership and public contract boundaries are enforced automatically.
- Dependencies/collisions are deterministic and fail closed.
- Capabilities are independently authorized by API and bound to add-on version/state.
- Server, Agent and browser contributions are isolated.
- Data ownership, migrations, disable and decommission preserve protected/legacy data.
- Immutable artifacts have verifiable provenance under an owner-approved trust model.
- Runtime readiness, failure recovery, diagnostics and audit are observable.
- CI proves the rules through fixtures and integration tests, not only documentation.

## 17. Application vs add-on boundary

An application is a product experience/runtime boundary. An add-on is a domain capability package. One application consumes several add-ons, and one add-on may contribute to multiple approved app realms without duplicating domain ownership.

Examples:

- OSS consumes network inventory, telemetry, alarm, incident and provisioning capabilities.
- BSS consumes party/customer, catalogue, order, subscription and finance capabilities.
- ISP orchestrates BSS and OSS contracts; it does not own either domain's records.
- A-L-L-A-H consumes corpus, translation, ontology, citation and legal-source capabilities.
- DX consumes task-registry, agent-adapter, Git/worktree and evidence capabilities.
- RIOT consumes creative-media and isolated-lab capabilities under different trust boundaries.

Cross-add-on relationships use public records/services and API capabilities. They never reach into private tables or repositories.
