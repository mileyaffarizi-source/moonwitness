---
name: mw-architecture-boundaries
description: Keep MoonWitness application, package, domain ownership and runtime boundaries consistent with its fourteen-surface architecture.
---

# Architecture boundaries

## Use when
Creating or moving an app/package, splitting a domain, defining an integration or reviewing imports/deployment boundaries.

## Read first
[Application inventory](../../../BLUEPRINT-APPLICATIONS.MD) and [package architecture](../../../BLUEPRINT-PACKAGE.MD). Then read only the affected app blueprint.

## Invariants
- Exactly fourteen named application surfaces are in the current target inventory: agent, api, web, OSS, BSS, id, docs, desktop, mobile, cloud, isp, dx, A-L-L-A-H and riot.
- App folders express product/runtime ownership; they do not automatically imply separate microservices, databases or deployment units.
- API is the shared authority for business use cases, authorization, model/record/field access and durable writes.
- ID authenticates principals; each resource-owning API/domain authorizes access. Vault/KMS owns secret values.
- Agent reasons and invokes allowlisted API capabilities; DX coordinates engineering work and bounded local execution. Neither bypasses API policy.
- Frontend apps consume public/browser-safe contracts. They never import Fastify, MikroORM or server-only adapters.
- Add-ons depend on public platform contracts, not another add-on's private internals. No cycles or deep imports outside exports.
- Existing systems retain source-of-truth ownership until explicit migration decisions are approved.

## Decision test
Before adding an abstraction or service, identify its owner, consumer, data authority, trust boundary, deployment reason and failure mode. If these are unclear, do not add the layer. Record material changes in an ADR and update the affected inventory/task together.
