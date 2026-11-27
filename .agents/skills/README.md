# MoonWitness Skill Pack

Load only the skill that matches the current task; use a second only when the task crosses a real boundary. Keep `AGENTS.md` as the global contract. Skills add task-specific procedures and point to the canonical blueprint instead of copying it.

| Skill | Use when |
|---|---|
| [mw-task-execution](./mw-task-execution/SKILL.md) | Claiming, implementing or updating a task from `tasks.json`; parallel work and evidence |
| [mw-architecture-boundaries](./mw-architecture-boundaries/SKILL.md) | Choosing app/package ownership, dependencies or service boundaries |
| [mw-api-model-kernel](./mw-api-model-kernel/SKILL.md) | Fastify API, domain use cases, ORM/model registry, record APIs or Odoo integration |
| [mw-agent-dx-systems](./mw-agent-dx-systems/SKILL.md) | Agent runtime, coding-agent workers, DX orchestration, tools, worktrees or task coordination |
| [mw-identity-secrets-security](./mw-identity-secrets-security/SKILL.md) | OIDC, SSO, sessions, workload identity, authorization or secret-manager integration |
| [mw-ui-creative-craft](./mw-ui-creative-craft/SKILL.md) | Product UI, interaction design, visual systems, motion or creative assets |
| [mw-telecom-domain-workflows](./mw-telecom-domain-workflows/SKILL.md) | OSS, BSS, ISP subscriber lifecycle, network inventory or provisioning |
| [mw-cloud-deployment-ops](./mw-cloud-deployment-ops/SKILL.md) | Cloud control plane, Docker/runtime operations, IaC, deploy or recovery |
| [mw-evidence-quality-governance](./mw-evidence-quality-governance/SKILL.md) | Tests, docs/wiki, progress, claims/evidence, canon or release readiness |

## Context discipline

Do not load all skills at task start. Select by task ownership. For cross-domain changes, read the API/security skill only if a real API/security boundary is touched. If a skill conflicts with source code or an approved ADR, stop and resolve the conflict rather than silently choosing one.
