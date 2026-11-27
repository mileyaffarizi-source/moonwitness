# BLUEPRINT-PACKAGE — MONOREPO PACKAGE ARCHITECTURE

**Document ID:** MW-BP-PKG-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS · **Package manager:** pnpm · **Task graph:** Turborepo

## 1. Purpose

Define how the repository is divided into reusable, independently testable workspace packages. This architecture enables local AI parallel work without circular dependencies, shared-file collisions, duplicated business logic or accidental runtime coupling.

Exactly three primary application runtimes:
- **apps/agent** — Mastra;
- **apps/api** — Fastify and authoritative ORM composition;
- **apps/web** — Next.js.

Other directories are libraries, integrations, content, infrastructure or tooling, not hidden fourth applications.

## 2. Toolchain rules

Pin Node.js LTS and pnpm; use pnpm Workspaces for linking and Turborepo for task orchestration/cache. Use strict TypeScript and explicit package exports. No Bun runtime, Bun lockfile or Bun package scripts. Do not mix package managers. Commit pnpm-lock.yaml and validate frozen-lockfile installation in CI.

## 3. Package classes

**Base Platform:** stable contracts, IDs, errors, context primitives, add-on SDK, lifecycle interfaces, capability descriptors, event envelopes and policy abstractions.

**ORM Kernel:** model descriptors, fields, relations, extensions, domain AST, record interfaces, security hooks and persistence adapter contracts. Runtime composition is in API.

**Domain Add-ons:** independent capabilities with explicit ownership and manifests.

**Clients:** browser-safe API client, service-to-service client and event contract clients; no server-only leakage.

**UI:** tokens, themes, primitives, compositions, accessibility and FX engines.

**Narrative:** canon contracts, source/provenance schemas, timeline and relationship primitives independent of UI.

**Testing:** fixtures, factories and harnesses; no production business logic.

**Integrations:** versioned external adapters such as Odoo. Native Odoo Python modules remain separate from TypeScript packages.

## 4. Dependency direction

Allowed: Base → platform-neutral dependencies; ORM → Base; Add-on → Base SDK/ORM descriptors/shared contracts; API → Base/ORM/add-ons/server integrations; Agent → Agent contracts/approved clients and calls API; Web → browser-safe contracts/UI/API client; UI → tokens/primitives only; Narrative → platform-neutral schemas.

Forbidden:
- Base importing add-ons;
- add-ons importing another add-on's private implementation;
- Web importing MikroORM/Fastify/Agent runtime;
- Agent importing API internal repositories or persistence adapters;
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

Tasks **PKG-001 through PKG-009** in [tasks.json](./tasks.json).

## 11. Definition of done

Clean Node.js/pnpm install builds reproducibly; package boundaries are explicit and checked; exactly three app runtimes exist; public exports are stable; no cycles/realm leaks exist; local AI workers can operate on non-overlapping packages under a shared task contract.