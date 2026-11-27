# ADR-0004: Node.js 26 Active LTS and GitHub security automation

- **Status:** Accepted
- **Date:** 2026-11-27
- **Decision owner:** Repository owner
- **Authors:** Platform engineering
- **Related tasks:** PKG-010, GOV-013, GOV-011, PKG-003
- **Supersedes / superseded by:** Supersedes ADR-0002 Node.js 24 runtime selection only. ADR-0002's pnpm 12.24.0 and non-overlapping release/security automation ownership remain in force unless this ADR explicitly updates them.

## Context and problem

ADR-0002 correctly established pnpm 12.24.0 and distinct GitHub automation responsibilities, but its Node 24.22.3 choice is no longer the selected runtime. The repository owner explicitly instructed that the platform use Node.js 26 because it is Active LTS. The runtime selection must be changed coherently across local version files, package engines, CI, add-on compatibility, tests, blueprints, tasks and contributor guidance.

The official Node.js Release Working Group schedule lists Node 26 (Lithium) as Active LTS beginning 2026-10-28 and scheduled through 2029-04-30. Node 24 is now Maintenance LTS; Node 27 is Alpha. The latest Node 26 LTS patch verified for this decision is v26.13.0, released 2026-10-28. Sources: [Node.js release schedule](https://github.com/nodejs/Release), [Node.js v26.13.0 LTS release](https://nodejs.org/en/blog/release/v26.13.0/), [Node.js releases](https://nodejs.org/en/about/previous-releases/).

The repository already has CodeQL, Dependency Review, Dependabot and Release Please. The automation policy should be completed with secret leak detection and workflow-security lint, while keeping each responsibility separate and changelog ownership singular.

## Decision drivers

- Owner explicitly selected Node.js 26 Active LTS.
- Exact, reproducible runtime patch and explicit package engine range.
- The same runtime contract must govern root CI and add-on package compatibility.
- Retain pnpm 12.24.0 and its generated lockfile unless a separate compatibility test requires a reviewed update.
- No obsolete Node 20 GitHub Action runtime.
- Security automations must not duplicate source SAST, dependency deltas, secret scanning, workflow lint or release responsibilities.
- No automatic merge, package publishing, production deployment or privilege expansion.

## Options considered

### Option A — Keep Node 24.22.3 Maintenance LTS

- Benefits: no runtime migration.
- Costs: contradicts the owner's explicit Active LTS preference.
- Assessment: rejected.

### Option B — Pin Node 26.13.0 Active LTS

- Benefits: current Active LTS line with support scheduled through April 2029; aligns with the explicit owner request.
- Costs: updates root/package/add-on compatibility and requires frozen-install and CI proof on the new runtime.
- Assessment: accepted.

### Option C — Track Node 27 Alpha or a floating current version

- Benefits: earliest access to upcoming changes.
- Costs: Alpha is not an LTS production baseline; floating versions are not reproducible.
- Assessment: rejected for the production/development baseline. Future-version compatibility can be tested in a separate non-blocking canary workflow after an owner-approved task.

## Decision

1. Pin `.nvmrc` and `.node-version` to `26.13.0`.
2. Set root `engines.node` to `>=26.13.0 <27`; keep exact runtime pin files aligned.
3. Set add-on package engines to `>=26.13.0 <27` and manifest compatibility to `>=26.13.0 <27.0.0`. Reject add-ons declaring incompatible Node ranges.
4. Retain `packageManager: "pnpm@12.24.0"` and `engines.pnpm: "12.24.0"`. Do not rewrite the lockfile solely for a Node patch change. CI must prove `pnpm install --frozen-lockfile` under Node 26.
5. Update repository checks, add-on linter, schema/example manifests, tests, README, automation policy and active blueprints to Node 26. Preserve ADR-0002 as historical reasoning and mark its runtime selection superseded.
6. Keep CI as the single deterministic quality gate.
7. Keep CodeQL v4 for source-code analysis.
8. Run Dependency Review v5 on every eligible pull request; remove the repository variable feature flag. Dependency Graph and plan availability remain administrator prerequisites.
9. Keep Dependabot as the only scheduled dependency-update PR writer.
10. Keep Release Please v5 as the only automated version/changelog/release writer. Do not add semantic-release, Changesets, Release Drafter or another changelog updater.
11. Add Gitleaks Action v3 for full Git history secret scanning on PR/main push and a daily scheduled rescan.
12. Add Zizmor 1.32.0 workflow security lint on workflow changes and a weekly scheduled audit. Use GitHub annotations, not SARIF upload, so this check does not depend on Code Scanning availability.
13. Keep Actions permissions least-privilege. Do not enable automatic dependency merging, package publishing or deployment.
14. GitHub repository security settings and required branch checks remain explicit owner actions; workflow files do not prove those settings are enabled.

## Automation ownership and separation

| Concern | Owner | Why it is distinct |
|---|---|---|
| Build, lint, format, typecheck, tests | Repository CI | Deterministic implementation quality |
| JS/TS vulnerability analysis | CodeQL | Source-code dataflow/static analysis |
| Secret detection in Git history | Gitleaks | Credential patterns and historical exposure |
| GitHub Actions security | Zizmor | Workflow permissions, untrusted expressions, unsafe actions and supply-chain patterns |
| Dependency delta risk | Dependency Review | Newly introduced dependency vulnerabilities |
| Dependency update proposals | Dependabot | Routine version update PRs |
| Changelog/version/tag/release | Release Please | One authoritative release metadata writer |

No automation is allowed to silently assume another's responsibility. A scan finding does not rotate a secret, approve a deployment or repair historical Git exposure.

## Scope and boundaries

- **In scope:** Node 26 pins and package compatibility, repository checks, tests, CI runtime, Gitleaks, Zizmor, always-on Dependency Review, automation documentation and owner-settings checklist.
- **Out of scope:** app-specific runtime implementation before app packages exist, local workstation installation, private registry publishing, production deployment, automatic merging, secrets creation, branch-protection mutation and any database/network infrastructure changes.
- **Owning domain:** repository foundation / platform engineering.
- **Source of truth:** `package.json`, `.nvmrc`, `.node-version`, add-on manifest schema, `pnpm-lock.yaml`, `.github/**`, `docs/engineering/GITHUB-AUTOMATION.md`, ADR register and this ADR.
- **Trust boundary:** GitHub Actions run only declared tasks with least privilege; no fork-controlled code receives write permission.

## Consequences

### Positive

- Root code and add-on compatibility share a supported Active LTS baseline.
- Dependency review is no longer silently skipped behind an unset repository variable.
- Secret detection and workflow-security checks add coverage without duplicating CodeQL or Release Please.
- Changelog ownership remains singular and reviewable.

### Negative / trade-offs

- Node 26 has a distinct native/ABI baseline; future native packages must be tested on the exact Node 26 runtime.
- Official Node Linux binaries may require `libatomic` on distributions where it is not installed by default; Linux host prerequisites must be verified before local rollout.
- Dependency Review and CodeQL capabilities depend on repository visibility/plan and repository settings.
- Gitleaks Action licensing must be reviewed if the repository is moved from a personal account into an Organization.
- GitHub branch protections and secret-scanning push protection cannot be completed through repository-file commits alone.

## Migration and rollback

- Update the exact Node version and engine contract atomically.
- Retain pnpm 12.24.0 and the existing lockfile unless CI proves a regenerated lockfile is required.
- Run frozen install, lint, format, type policy, repository checks, add-on lint, task registry validation and every test under Node 26.
- Run CodeQL, Dependency Review, Gitleaks and Zizmor on the PR; record unavailable features as owner actions.
- Roll back only through a reviewed revert and an explicit superseding runtime ADR. Do not silently downgrade to Node 24 in an individual package.
- This change does not deploy any application or mutate production systems.

## Verification and evidence

- Exact Node 26.13.0 pin files and `>=26.13.0 <27` package engine.
- Add-on schema/linter and package fixture use `>=26.13.0 <27.0.0`.
- Repository consistency tests reject version drift.
- GitHub Actions proves frozen install and `pnpm check` on Node 26.13.0.
- Security automation runs are inspected individually; an absent/unsupported run is not called successful.
- Owner settings remain a separate tracked action.

## Review and approval

The repository owner explicitly instructed on 2026-11-27: use Node.js 26 so the platform baseline follows Active LTS. This is the approval for the exact Node 26.13.0 runtime migration and the additive, non-overlapping repository automation described above. It does not approve local machine installation, privileged host operations, automatic merge, package publishing, deployment or external side effects.
