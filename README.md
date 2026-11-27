# MoonWitness

**When The Moon Witness, We Share A Message.**

MoonWitness is a multi-application ecosystem. Its target architecture is documented in the [blueprints](./BLUEPRINT.md); the current implementation state is tracked separately and must be supported by source code and verification evidence.

## Repository status

This repository is being transitioned from an architecture/planning repository into an executable Node.js monorepo. The initial foundation establishes workspace conventions and automated repository checks. It does not claim that the fourteen planned applications are implemented.

- [Application architecture](./BLUEPRINT-APPLICATIONS.MD)
- [Developer Experience blueprint](./BLUEPRINT-DX.MD)
- [Task registry](./tasks.json)
- [Latest repository baseline audit](./AUDIT-REPOSITORY-BASELINE-2026-11-27.MD)

## Requirements

- Node.js 22.14.x (see `.nvmrc`)
- pnpm 10.8.1 (managed through Corepack)

## Setup

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check:repo
pnpm test
```

## Workspace conventions

- `apps/*`: deployable application surfaces; applications are not automatically separate microservices.
- `packages/*`: shared libraries and platform capabilities.
- `scripts/*`: repository validation and maintenance scripts.
- `docs/*`: engineering decisions and implementation documentation.

Use Node.js and pnpm. Do not introduce Bun as the package manager. Keep secrets out of Git; commit only safe example configuration.

## Available commands

| Command | Purpose |
| --- | --- |
| `pnpm check:repo` | Validate required repository files and task registry structure |
| `pnpm test` | Run Node.js built-in test runner |
| `pnpm check` | Run repository validation and tests |

## AI contributor contract

Read [AGENTS.md](./AGENTS.md) before making changes. The focused [skill pack](./.agents/skills/README.md) provides task-specific guidance; load only the skill needed for the current task.

## Implementation truth

A blueprint is a target-state design, not proof of implementation. A task is complete only when its acceptance criteria are met and its verification evidence is recorded. See [the repository rules](./BLUEPRINT-RULES-GOVERN-CONTRACT.MD).
