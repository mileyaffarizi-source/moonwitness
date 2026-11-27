# MoonWitness

**When The Moon Witness, We Share A Message.**

MoonWitness is a multi-application ecosystem. Its target architecture is documented in the blueprints; the current implementation state is tracked separately and must be supported by source code and verification evidence.

## Repository status

This repository is being transitioned from an architecture/planning repository into an executable Node.js monorepo. The initial foundation establishes workspace conventions and automated repository checks. It does not claim that the fourteen planned applications are implemented.

- Application architecture: BLUEPRINT-APPLICATIONS.MD
- Developer Experience blueprint: BLUEPRINT-DX.MD
- Task registry: tasks.json
- Latest repository baseline audit: AUDIT-REPOSITORY-BASELINE-2026-11-27.MD
- Quality gates for humans and local AI agents: docs/engineering/QUALITY-GATES.md

## Requirements

- Node.js 22.14.x (see .nvmrc)
- pnpm 10.8.1 (managed through Corepack)

## Setup

~~~sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
~~~

## Workspace conventions

- apps/*: deployable application surfaces; applications are not automatically separate microservices.
- packages/*: shared libraries and platform capabilities.
- scripts/*: repository validation and maintenance scripts.
- docs/*: engineering decisions and implementation documentation.

Use Node.js and pnpm. Do not introduce Bun as the package manager. Keep secrets out of Git; commit only safe example configuration.

## Available commands

| Command | Purpose |
| --- | --- |
| pnpm lint | Repository consistency, JSON, JavaScript syntax, Markdown fence and agent-contract checks |
| pnpm format:check | Enforce UTF-8/LF/final-newline and source whitespace rules without rewriting files |
| pnpm typecheck | Run TypeScript compiler when a TypeScript project exists; fail closed if source is added without config |
| pnpm check:repo | Validate required repository files, skills and task registry structure |
| pnpm check:tasks | Run the read-only task dependency/claim/evidence validator |
| pnpm test | Run Node.js built-in tests |
| pnpm check | Run every gate above; required before hand-off and pull requests |

## AI contributor contract

Read AGENTS.md before making changes. The focused skill pack in .agents/skills/README.md provides task-specific guidance; load only the skill needed for the task. Every human and AI change must pass the quality-gate contract in docs/engineering/QUALITY-GATES.md.

## Implementation truth

A blueprint is a target-state design, not proof of implementation. A task is complete only when its acceptance criteria are met and verifiable evidence is recorded. See BLUEPRINT-RULES-GOVERN-CONTRACT.MD.
