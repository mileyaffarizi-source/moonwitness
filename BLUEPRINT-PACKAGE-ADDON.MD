# BLUEPRINT-PACKAGE-ADDON — ODOO-STYLE ADD-ON SDK & LIFECYCLE

**Document ID:** MW-BP-ADD-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT-PACKAGE.MD](./BLUEPRINT-PACKAGE.MD) · **Task registry:** [tasks.json](./tasks.json)

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