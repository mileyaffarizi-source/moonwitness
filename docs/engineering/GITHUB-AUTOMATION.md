# GitHub automation policy

**Owner:** Platform Engineering  
**Runtime baseline:** Node.js 24.22.3 · pnpm 12.24.0  
**Scope:** repository-level CI, supply-chain security and release metadata.

## Automation ownership — no overlapping writers

| Capability | Canonical mechanism | Trigger | Owns | Explicitly does not own |
|---|---|---|---|---|
| Build, repository lint, format, type gate and tests | `.github/workflows/ci.yml` | PR, push to main/foundation/dx, manual | Merge-quality result | Security alerts, releases or publishing |
| Source static analysis | CodeQL `.github/workflows/codeql.yml` | PR, main push, weekly schedule | Code vulnerabilities in detected JS/TS source | Dependency update PRs or unit tests |
| Changed dependency risk | Dependency Review `.github/workflows/dependency-review.yml` | PR only | New/changed vulnerable dependencies; blocks high severity | Routine dependency bumping |
| Dependency update proposals | Dependabot `.github/dependabot.yml` | Weekly | GitHub Actions and npm/pnpm update PRs | Changelog/release PRs |
| Changelog, version PR and GitHub Release | Release Please `.github/workflows/release-please.yml` | Main push/manual | One root release stream, CHANGELOG.md and GitHub tag/release | Package publishing, deployment or app-specific releases |

Do not add Changesets, semantic-release, Release Drafter, Changelogithub or another changelog generator alongside Release Please. Reconsider a multi-package release strategy only when independently versioned packages actually exist and an ADR approves the change.

## Supported toolchain

- Node.js: exact repository pin in `.nvmrc` and `.node-version`: `24.22.3`.
- Node engine contract: `>=24.22.3 <25`.
- pnpm: exact `packageManager` and `engines.pnpm`: `12.24.0`.
- GitHub actions: checkout v7, setup-node v7, pnpm/action-setup v6.
- CodeQL Action v4, Dependency Review Action v5 and Release Please Action v5.
- Dependabot updates workflow actions and the pnpm/npm workspace manifest/lockfile.

The pinned Node patch is intentionally reproducible. Upgrade it through a reviewed runtime PR: update both version files, engine policy, quality-gate contract, CI and this document/ADR together, then prove a frozen install and all checks.

## Release and changelog contract

Release Please is the only automatic changelog writer. It reads Conventional Commit history and creates or updates a release PR. The release PR is the review point: version bump and CHANGELOG changes must pass CI before a human merges it. The merge creates a GitHub tag/release. It does not publish the private root package to a registry or deploy applications.

Use Conventional Commit titles and squash commit messages:

- `feat(scope): ...` — user-visible capability, minor release.
- `fix(scope): ...` — bug fix, patch release.
- `docs(scope): ...`, `refactor(scope): ...`, `test(scope): ...`, `build(scope): ...`, `ci(scope): ...`, `chore(scope): ...` — maintenance/documentation; no version bump unless the release policy explicitly changes.
- Append `!` for a breaking change and include a `BREAKING CHANGE:` footer.

Do not create a manual CHANGELOG entry for changes already captured by Release Please. Human-written operational migration guides remain separate documentation.

## Permissions and safe defaults

Each workflow declares only its necessary token permissions. CI and CodeQL use read-only repository access plus the CodeQL security-event permission where required. Dependency Review reads PRs. Release Please alone receives contents/issues/pull-request write permissions to manage its release PR and GitHub release.

Never execute fork code with write permissions. Do not add `pull_request_target` to workflows that check out or execute untrusted PR code. Do not print tokens, secrets, environment dumps or private dependency URLs.

## Repository administrator setup — required once

These controls are repository settings, not workflow files. A repository owner must confirm:

1. **Actions:** allow GitHub Actions to create pull requests. This is required for Release Please to create/update its release PR. Do not enable blanket write permissions for all workflows.
2. **Dependency graph:** enable it so Dependabot and Dependency Review can resolve the pnpm graph.
3. **Dependabot alerts and security updates:** enable both where available.
4. **Secret scanning and push protection:** enable where supported by repository visibility/plan. Add the approved secret-scanning policy before accepting real secrets in CI.
5. **Code scanning:** confirm the repository plan/visibility supports uploaded CodeQL results and enable code scanning. The workflow can execute only where GitHub permits SARIF upload.
6. **Branch protection / ruleset for `main`:** require the Repository CI check, CodeQL analysis and Dependency Review where applicable; require PR review, conversation resolution and stale approval dismissal; disallow direct pushes and force pushes. Do not require a check name until its first successful run has registered it.

These administrator-level controls are deliberately left for the repository owner; a committed workflow does not prove the corresponding GitHub setting is enabled.

## Verification and failure ownership

- CI is the only workflow that owns deterministic lint/format/type/test pass or fail.
- CodeQL owns Code Scanning alerts and its scheduled analysis.
- Dependency Review owns only dependency deltas introduced by the PR.
- Dependabot creates proposals; it never merges them automatically.
- Release Please creates a reviewed release PR; it never bypasses CI or deploys production.
- Any workflow unavailable under the repository plan is a recorded blocker, not a falsely reported pass.
