# ADR-0002: Node.js 24 runtime, pnpm 12 and GitHub automation baseline

- **Status:** Accepted
- **Date:** 2026-11-27
- **Decision owner:** Repository owner
- **Authors:** Platform engineering
- **Related tasks:** PKG-002, PKG-003, GOV-011
- **Supersedes / superseded by:** Supersedes the Node.js 22.14.0 / pnpm 10.8.1 baseline in ADR-0001 for the runtime/package-manager versions only.

## Context and problem

The repository originally pinned Node.js 22.14.0 and pnpm 10.8.1. The owner explicitly requested Node.js 24 and contemporary tooling, and asked for standard GitHub security and release automation. The previous GitHub Actions workflow used checkout/setup-node/pnpm setup major versions that emitted a Node 20 runtime deprecation warning. A root quality gate now exists, but platform runtime and release-security automations must use a current supported baseline and have distinct responsibilities.

This ADR records the exact version selection as of 2026-11-27. Node.js 24.22.3 is the latest 24.x release observed in the official release list on 11 November 2026. Node 24 remains a supported LTS line, though it is in Maintenance LTS rather than the newer 26.x Active LTS line; this project uses Node 24 because the repository owner explicitly requested it. pnpm 12.24.0 is the latest published pnpm release observed on 26 November 2026. Sources: [Node.js releases](https://nodejs.org/en/about/previous-releases/), [Node.js v24.22.3 release](https://github.com/nodejs/node/releases), [pnpm v12.24.0 release](https://github.com/pnpm/pnpm/releases).

The owner instruction in this conversation (2026-11-27) is the approval for this exact runtime and automation scope: use Node 24, avoid obsolete tooling, add non-overlapping GitHub security and changelog automation. It does not approve production deployment, publishing, broad credential access or unrelated application decisions.

## Decision drivers

- Owner explicitly selected the Node.js 24 major.
- Reproducible local and CI installs with an exact patch and package-manager version.
- GitHub Actions must execute on supported Node 24 action runtimes.
- Security and release automation must have one owner per responsibility.
- Do not add dependency/tooling layers that the repository cannot yet justify.
- Preserve the existing CI quality gate as the only merge-quality workflow.

## Options considered

### Option A — Keep Node 22 / pnpm 10 and add automations

- Benefits: smallest migration.
- Costs/risks: directly conflicts with the owner request and retains a maintenance baseline that the owner asked to modernize.
- Operational consequences: existing CI action majors would continue generating runtime-deprecation warnings.

### Option B — Pin Node 24.22.3 and pnpm 12.24.0; update action majors

- Benefits: exact, contemporary baseline; consistent toolchain and current action runtimes.
- Costs/risks: major-version migration must prove that the existing lockfile remains frozen-install compatible.
- Operational consequences: one serialized package/runtime change with CI proof.

### Option C — Move to Node 26 Active LTS immediately

- Benefits: newest Active LTS line as of this audit.
- Costs/risks: owner explicitly requested Node 24; this would silently change the chosen major.
- Exit criteria for revisiting: a future owner-approved runtime ADR after Node 24 support policy or compatibility needs change.

## Decision

1. Pin `.nvmrc` and `.node-version` to Node.js `24.22.3`; require `engines.node: ">=24.22.3 <25"`.
2. Pin `packageManager: "pnpm@12.24.0"` and `engines.pnpm: "12.24.0"`.
3. Keep `pnpm-lock.yaml` as the only JavaScript workspace lockfile and require `pnpm install --frozen-lockfile`.
4. Use `actions/checkout@v7`, `actions/setup-node@v7` and `pnpm/action-setup@v6`.
5. Add CodeQL Action v4 for JS/TS source analysis; Dependency Review Action v5 for PR dependency deltas; Dependabot for scheduled GitHub Actions and npm/pnpm updates; Release Please Action v5 as the only automatic changelog/release mechanism.
6. Keep CI, source security, dependency delta, version proposals and releases as separate workflows. Dependabot PRs and Release Please PRs still pass the canonical CI gate and require human review.
7. Do not enable automatic merge, package publishing or deployment in these workflows.

## Scope and boundaries

- **In scope:** repository runtime pins, repository checks, CI action versions, CodeQL, Dependency Review, Dependabot, Release Please and their contributor/administrator instructions.
- **Out of scope:** app-specific runtime versions before app packages exist, private registry publishing, production deployment, signing credentials, privileged infrastructure, automatic dependency merge and GitHub repository-level settings that require owner access.
- **Owning app/package/domain:** repository foundation / platform engineering.
- **Source of truth:** `package.json`, `.nvmrc`, `.node-version`, `pnpm-lock.yaml`, `.github/**`, `release-please-config.json` and this ADR.
- **Trust boundary:** workflows use least-privilege tokens; untrusted fork code is never run with write privileges.

## Consequences

### Positive

- Local agents and CI use one explicitly pinned modern runtime/toolchain.
- GitHub security analysis, dependency review, dependency updates and release notes no longer duplicate each other's write responsibilities.
- Changelog and release PRs remain reviewable and gated by CI.

### Negative / trade-offs

- Node 24 is in Maintenance LTS as of this ADR; the owner preference takes precedence over selecting a newer Node major by default.
- Exact patch pins need an explicit reviewed patch-bump process.
- CodeQL/Dependency Review capabilities depend on repository visibility and GitHub plan/settings.
- Release Please needs Conventional Commit history and the repository setting allowing Actions to create PRs.

### Follow-up work

- **PKG-003:** implement the actual shared TypeScript/ESLint/Prettier/env-config stack when package source exists.
- **GOV-011:** formalize release/rollback controls and administrator branch rules.
- **PKG-008:** add architecture and workspace task-graph checks after real packages exist.

## Security, privacy and data impact

No credentials, customer data, production network or external service secrets are added. CodeQL writes security findings; Dependency Review reads dependency metadata; Dependabot proposes changes; Release Please modifies only version/changelog/release metadata through a reviewed PR. No workflow runs arbitrary repository tasks with elevated write permissions from untrusted fork events.

## Compatibility and migration

The migration is limited to root runtime/package manager and CI action majors. The frozen lockfile test is mandatory; if pnpm 12 changes the lockfile format, the lockfile must be deliberately updated by pnpm 12 and committed in this same PR. No application runtime exists to migrate.

Rollback is a reviewed revert of this repository change and its lockfile. It does not roll back any deployed service because this change does not deploy.

## Verification and evidence

- Node 24.22.3 and pnpm 12.24.0 are pinned in root files.
- `scripts/check-repo.mjs` checks version alignment, workspace, lockfile, and action baselines.
- GitHub Actions must show successful frozen install and `pnpm check` before merge.
- CodeQL and Dependency Review capability must be verified against the repository's settings/plan after first runs.
- No production or external publishing test is claimed.

## Review and approval

The repository owner explicitly requested Node 24 and non-overlapping current GitHub automation in this conversation on 2026-11-27. This ADR records that approval for the exact scope above. Repository settings, production releases, publishing and deployment remain owner-controlled follow-ups.
