# BLUEPRINT-PACKAGE — MONOREPO PACKAGE ARCHITECTURE

**Document ID:** MW-BP-PKG-001 · **Version:** 2.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js 24.22.3 · **Package manager:** pnpm 12.24.0 · **Task graph:** Turborepo

## 1. Purpose

Define how the repository is divided into reusable, independently testable workspace packages. This architecture enables local AI parallel work without circular dependencies, shared-file collisions, duplicated business logic or accidental runtime coupling.

The workspace contains exactly fourteen named applications as defined in BLUEPRINT-APPLICATIONS.MD: agent, api, web, OSS, BSS, id, docs, desktop, mobile, cloud, isp, dx, A-L-L-A-H and riot. An app directory is not automatically a separately deployed microservice; deployment boundaries are chosen by trust, scale, availability and lifecycle needs. No fifteenth app may be introduced without an ADR and a coordinated update to the application inventory.

## 2. Toolchain rules

Pin Node.js LTS and pnpm; use pnpm Workspaces for linking and Turborepo for task orchestration/cache. Use strict TypeScript and explicit package exports. No Bun runtime, Bun lockfile or Bun package scripts. Do not mix package managers. Commit pnpm-lock.yaml and validate frozen-lockfile installation in CI.

## 3. Package classes

**Base Platform:** stable contracts, IDs, errors, context primitives, add-on SDK, lifecycle interfaces, capability descriptors, event envelopes and policy abstractions.

**ORM Kernel:** model descriptors, fields, relations, extensions, domain AST, record interfaces, security hooks and persistence adapter contracts. Runtime composition is in API.

**Domain Add-ons:** independent capabilities with explicit ownership and strict manifests. The normative add-on contract is [BLUEPRINT-PACKAGE-ADDON.MD](./BLUEPRINT-PACKAGE-ADDON.MD); add-on-specific trust decisions are tracked in ADR-0003.

**Clients:** browser-safe API client, service-to-service client and event contract clients; no server-only leakage.

**UI:** tokens, themes, primitives, compositions, accessibility and FX engines.

**Narrative:** canon contracts, source/provenance schemas, timeline and relationship primitives independent of UI.

**Testing:** fixtures, factories and harnesses; no production business logic.

**Integrations:** versioned external adapters such as Odoo. Native Odoo Python modules remain separate from TypeScript packages.

## 4. Dependency direction

Allowed: Base → platform-neutral dependencies; ORM → Base; Add-on → Base SDK/ORM descriptors/shared contracts; API → Base/ORM/domain add-ons/server integrations; Agent → Agent contracts/approved clients and calls API; DX → task contracts plus isolated local execution adapters; each frontend app → browser/native-safe contracts and approved API clients; ID → identity-provider integration and identity contracts; Cloud/OSS/RIOT privileged runners → isolated capability interfaces; UI → tokens/primitives only; Narrative/Knowledge → platform-neutral source-aware schemas.

Forbidden:
- Base importing add-ons;
- add-ons importing another add-on's private implementation;
- any frontend importing MikroORM/Fastify/Agent runtime;
- Agent or DX importing API internal repositories or persistence adapters;
- add-ons creating competing registries/database connections;
- circular package dependencies;
- deep imports outside declared exports.

## 5. Package contract

Each package defines unique name/ID, version/compatibility, purpose/owner, public export map, runtime target and Node/browser boundary, declared dependencies/peers, build/lint/typecheck/test scripts, README, changelog for public contract changes, license/source metadata and security review.

Do not create abstraction packages for trivial code without a meaningful ownership boundary.

## 6. Build and task graph

Turbo tasks encode dependency order. Build consumes upstream outputs; typecheck sees dependent declarations; tests declare prerequisites; lint avoids unnecessary services; integration tests declare DB/Redis dependencies. Cache only deterministic outputs. Never cache secrets, personal data, mutable DB snapshots or release signing material.

## 7. Versioning and compatibility

Choose workspace or independent versioning after audit. Version public contracts and add-on manifests. Define compatibility ranges and reject unsupported combinations. Breaking changes require migration notes, affected package list, compatibility decision and tests. Avoid premature independent releases if coordinated monorepo releases are simpler.

## 8. Local AI execution rules

A worker claims a task in tasks.json; reads blueprints/dependencies; inspects actual files; stays within ownership paths; uses public exports; adds tests/docs; records evidence; avoids concurrent lockfile edits; reserves shared composition files for serialized integration; updates central registry atomically.

Root manifests, lockfile, Turbo config, shared exports, ORM registry, API composition and global design tokens are serialized integration surfaces. Isolated worktrees/branches are preferred.

## 9. Candidate organization

Candidate areas: packages/base, packages/orm, packages/addons, packages/clients, packages/ui, packages/narrative, packages/testing, integrations/odoo and integrations/odoo-addons for native Python modules only.

Do not create a package solely because it appears in this list. Create it when a real capability and ownership boundary exist.

## 10. Deliverables and ownership

Deliver package inventory, dependency graph, public export map, naming policy, pnpm/Turbo configuration, architecture-boundary checks, version policy, local-agent ownership protocol and one working example package.

Tasks **PKG-001 through PKG-009** and **ADD-001 through ADD-011** in [tasks.json](./tasks.json). Add-on manifest, trust, model ownership, capability and lifecycle requirements are specified in [BLUEPRINT-PACKAGE-ADDON.MD](./BLUEPRINT-PACKAGE-ADDON.MD).

## 11. Definition of done

Clean Node.js/pnpm install builds reproducibly; package boundaries are explicit and checked; all fourteen named app surfaces are inventoried and bounded (without requiring fourteen microservices); public exports are stable; no cycles/realm leaks exist; local AI workers can operate on non-overlapping packages under a shared task contract.

## 12. Application and package separation

Apps are user/operator/developer experiences and selected runtime boundaries. Packages own reusable technical contracts and domain capabilities. Do not put all domain implementation inside app-specific folders, and do not create one database per app by default.

Recommended domain package families (subject to source audit):
- identity contracts/client and provider adapters;
- OSS network inventory/telemetry/provisioning domain;
- BSS commercial/customer/order domain;
- ISP subscriber-service orchestration domain;
- cloud resource/IaC/vault adapters;
- corpus/ontology/citation/narrative domain;
- RIOT media/lab metadata and isolated adapter contracts;
- DX task registry, worker adapter and worktree orchestration packages.

The API composes authoritative business capabilities. Frontends consume contracts. Privileged workers use separate service identities and narrowly scoped adapters.
