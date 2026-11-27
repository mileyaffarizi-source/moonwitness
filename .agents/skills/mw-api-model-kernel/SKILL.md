---
name: mw-api-model-kernel
description: Build MoonWitness Fastify API domains and the Odoo-oriented model/record kernel over MikroORM without leaking persistence internals.
---

# API and model kernel

## Use when
Changing `apps/api`, domain use cases, model/field/relation descriptors, record operations, transactions or Odoo adapters.

## Read first
[API blueprint](../../../BLUEPRINT-API.MD), then the relevant domain blueprint and task acceptance criteria.

## Rules
- Fastify is transport/composition, not the domain model. Keep routes thin: parse/validate → authenticate/context → authorize → call use case → safe DTO.
- The platform ORM/model kernel is the application contract; MikroORM is the private persistence engine. Never expose EntityManager, entities or DB connections to add-ons, Agent or frontends.
- Register declarative models/fields/relations at startup; validate ownership, collisions and dependencies before readiness. Avoid runtime mutation of the registry.
- Compile a validated, bounded query AST to parameterized queries. Validate field/operator/relation access, pagination, projection and query cost.
- Enforce model access, record rules and field permissions in API/domain paths, including relation traversal. UI visibility is never authorization.
- Use request/job-scoped persistence contexts. Keep transactions, audit and outbox atomic where required. Make retryable writes idempotent.
- Odoo-owned tables remain Odoo-owned. Use a version-aware supported adapter; never write legacy tables through MikroORM or trigger a big-bang migration.
- Return schema-validated DTOs, stable errors and explicit side-effect contracts. Keep sensitive payloads out of logs.

## Verification
Test real DB metadata composition from independent modules, access isolation, query parameterization, transaction rollback/outbox, idempotency and Odoo mapping with fixtures. A mocked repository alone is not integration proof.
