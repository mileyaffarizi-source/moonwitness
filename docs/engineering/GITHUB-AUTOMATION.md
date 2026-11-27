# GitHub automation policy

**Owner:** Platform Engineering  
**Runtime baseline:** Node.js 26.13.0 Active LTS · pnpm 12.24.0  
**Scope:** repository CI, source security, workflow security, dependency risk, dependency update proposals and release metadata.

## Automation ownership — one owner per responsibility

| Capability | Canonical mechanism | Trigger | Owns | Explicitly does not own |
|---|---|---|---|---|
| Build, repository lint, format, type gate and tests | CI `.github/workflows/ci.yml` | PR, push, manual | Deterministic merge-quality result | Security findings, changelog, publishing or deployment |
| Source-code security analysis | CodeQL `.github/workflows/codeql.yml` | PR, main push, weekly schedule | JS/TS code vulnerability analysis and Code Scanning results | Dependency bump proposals or secret scanning |
| Secret and credential leak detection | Gitleaks `.github/workflows/secrets.yml` | PR, main push, daily full-history scan | Detect credentials committed to tracked Git history | Secret rotation, vault administration or GitHub push-protection settings |
| Workflow supply-chain/security lint | Zizmor `.github/workflows/workflow-security.yml` | PRs touching workflow/action files, main, weekly | Unsafe GitHub Actions patterns, token permissions, expression injection and workflow hardening | General source-code SAST or dependency vulnerability review |
| Changed dependency risk | Dependency Review `.github/workflows/dependency-review.yml` | PR only | New/changed vulnerable dependency risk; fails at high severity | Routine dependency update proposals |
| Dependency update proposals | Dependabot `.github/dependabot.yml` | Weekly | GitHub Actions and npm/pnpm update PRs | Release notes or automatic merge |
| Changelog, version PR and GitHub Release | Release Please `.github/workflows/release-please.yml` | Main push/manual | One root release stream, `CHANGELOG.md`, version PR, tag and GitHub Release | Package publishing, deployment or app-specific release streams |

These workflows intentionally do not duplicate one another. CodeQL analyzes source, Gitleaks detects secrets, Zizmor audits GitHub workflow construction, Dependency Review checks the dependency delta, Dependabot proposes updates, and Release Please owns release metadata.

Do not add Changesets, semantic-release, Release Drafter, Changelogithub or another changelog writer alongside Release Please. Do not add a second secret scanner or workflow linter without an ADR explaining the distinct coverage. Reconsider multi-package release orchestration only when independently versioned packages actually exist.

## Supported toolchain

- Node.js: exact repository pin in `.nvmrc` and `.node-version`: `26.13.0` (Lithium, Active LTS).
- Node engine contract: `>=26.13.0 <27`.
- pnpm: exact `packageManager` and `engines.pnpm`: `12.24.0`.
- Workspace: pnpm 12 Workspaces; one root `pnpm-lock.yaml`; no Bun/npm/yarn lockfiles.
- CI actions: checkout v7, setup-node v7, pnpm/action-setup v6.
- CodeQL Action v4, Dependency Review Action v5, Release Please Action v5.
- Gitleaks Action v3 (Node 24-compatible action runtime; the project build/runtime remains Node 26).
- Zizmor 1.32.0, installed with pinned setup-uv action v10.3.3 and run in GitHub annotation mode.
- Dependabot updates GitHub Actions and the pnpm/npm workspace manifest/lockfile.

The Node.js version used by GitHub Actions themselves is separate from the Node.js project runtime selected by `.nvmrc`. The root CI installs Node 26.13.0 and runs the project there; third-party Actions may have their own supported runtime. Do not add Actions that depend on removed Node 20 runtimes.

The pinned Node patch is reproducible. Upgrade it through a reviewed runtime PR: update both version files, package engine policy, add-on compatibility schema/linter, checks, blueprints, ADR and task evidence together, then prove a frozen install and all gates.

## Release and changelog contract

Release Please is the only automatic changelog writer. It reads Conventional Commit history and creates or updates a release PR. The release PR is the review point: version bump and CHANGELOG changes must pass CI before a human merges it. The merge creates a GitHub tag/release. It does not publish the private root package to a registry or deploy applications.

Use Conventional Commit titles and squash commit messages:

- `feat(scope): ...` — user-visible capability, minor release.
- `fix(scope): ...` — bug fix, patch release.
- `docs(scope): ...`, `refactor(scope): ...`, `test(scope): ...`, `build(scope): ...`, `ci(scope): ...`, `chore(scope): ...` — maintenance/documentation; no version bump unless release policy explicitly changes.
- Append `!` for a breaking change and include a `BREAKING CHANGE:` footer.

Do not create manual CHANGELOG entries for changes already captured by Release Please. Human-written operational migration guides remain separate documentation. Release Please PRs require the same CI and human merge as every other PR.

## Permissions and safe defaults

- CI: `contents: read`; checkout credentials are not persisted unless a documented step needs them.
- CodeQL: `contents: read`, `actions: read`, `security-events: write` only for the analysis job.
- Dependency Review: read-only contents/PR metadata; no write permissions.
- Gitleaks: read repository history and narrowly scoped PR comment permission to report findings.
- Zizmor: contents read only; emits GitHub annotations rather than requiring SARIF/code-scanning upload.
- Dependabot: GitHub-managed dependency PRs; no automatic merge.
- Release Please: the only workflow with contents/issues/pull-request write permissions to manage release PRs and GitHub releases.

Never run fork-controlled code with write permissions. Do not add `pull_request_target` to workflows that check out or execute untrusted PR code. Do not print tokens, secrets, environment dumps or private dependency URLs. Every workflow must declare the minimum permissions it needs.

## Secret detection and response

Gitleaks scans the full Git history on PRs and main pushes, with a scheduled rescan. A finding is a security incident, not a formatting warning.

1. Revoke/rotate the affected credential at its issuing system first.
2. Identify the secret owner, affected scope and exposure window.
3. Remove the value from current source and prevent recurrence using an approved secret reference/vault.
4. Consider history remediation only after preserving evidence and obtaining owner approval; rewriting Git history is a coordinated destructive repository operation.
5. Record the resolution without copying the secret into issues, logs, task context or commit messages.

Deleting a secret from the latest file does not invalidate a credential or remove it from Git history. If this repository is moved under a GitHub Organization, confirm the Gitleaks Action licensing requirement before enabling the workflow there.

## Repository administrator setup — required once

These controls are GitHub repository settings, not workflow files. A repository owner must confirm:

1. **Actions:** allow GitHub Actions to create pull requests. This is required for Release Please to create/update its release PR. Do not enable blanket write permissions for all workflows.
2. **Dependency graph:** enable it so Dependabot and Dependency Review can resolve the pnpm graph.
3. **Dependabot alerts and security updates:** enable both where available.
4. **Secret scanning and push protection:** enable where supported by repository visibility/plan. Gitleaks workflow scanning is defense-in-depth, not a replacement for pre-receive push protection.
5. **Code scanning:** confirm the repository plan/visibility supports CodeQL SARIF results and verify the first CodeQL run in the Security tab.
6. **Branch protection / ruleset for `main`:** require Repository CI, CodeQL, Dependency Review, Secret Scanning and Workflow Security checks after each has completed successfully at least once; require PR review, conversation resolution and stale approval dismissal; disallow direct pushes and force pushes. Do not require a check name until its first successful run has registered it.
7. **Release policy:** protect release tags, restrict release permissions to Release Please and authorized maintainers, and keep package publishing/deployment disabled until separately approved.

If Dependency Review or CodeQL is unavailable under the repository's current visibility/plan, record that exact limitation and do not state the feature is active. Gitleaks and Zizmor still provide independent checks.

## Verification and failure ownership

- CI is the only workflow that owns deterministic lint/format/type/test pass or fail.
- CodeQL owns Code Scanning alerts for supported source.
- Gitleaks owns repository-history secret detection.
- Zizmor owns GitHub Actions workflow security annotations.
- Dependency Review owns only dependency deltas introduced by a PR.
- Dependabot creates proposals; it never merges them automatically.
- Release Please creates a reviewed release PR; it never bypasses CI or deploys production.
- Any feature unavailable under the repository plan/settings is an explicit owner action, not a falsely reported pass.
