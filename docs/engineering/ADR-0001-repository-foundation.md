# ADR-0001: Repository foundation

- Status: Accepted for the initial implementation baseline
- Date: 2026-11-27

## Context

The repository previously contained architecture and planning documents but no executable application workspace, package manifest, lockfile, or CI workflow.

## Decision

1. Use Node.js 22.14.x and pnpm 10.8.1, pinned in repository metadata.
2. Use a pnpm workspace with `apps/*` and `packages/*`.
3. Keep the initial root scripts dependency-light and use Node.js built-in test runner.
4. Establish strict shared TypeScript compiler defaults for application/package configs to extend.
5. Validate task registry JSON and unique task IDs in local checks and CI.
6. Require frozen-lockfile installation in CI.
7. Preserve the fourteen-application target architecture without creating fourteen microservices by default.

## Consequences

- The repository has a reproducible package-manager contract.
- App and package directories can be introduced incrementally.
- Application frameworks, ORM, database, and deployment topology remain decisions for subsequent implementation ADRs.
- The initial CI validates repository integrity; it is not an application build pipeline yet.

## Verification boundary

This ADR records the intended baseline. CI execution status must be checked in GitHub Actions; creating the workflow file alone is not evidence that a run passed.
