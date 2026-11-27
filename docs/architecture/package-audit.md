# Monorepo and package baseline audit

**Audit date:** 2026-11-27  
**Audited commit:** `c1c604801e4bbde982a44689aac7b6c48b1978ee`  
**Task:** PKG-001

## Summary

The repository has a reproducible minimal Node.js/pnpm workspace foundation. It does not yet contain application or shared package manifests, a Turbo pipeline, or a dependency graph between executable workspace projects.

| Area | Observed state | Evidence / implication |
|---|---|---|
| Runtime | Node.js `22.14.0` pinned in `.nvmrc`; engine range `>=22.14.0 <23` | Exact runtime pin exists; CI installs it |
| Package manager | pnpm `10.8.1` via `packageManager` and CI action | Version pinned in root manifest and CI |
| Workspace | pnpm globs `apps/*`, `packages/*` | Workspace discovery is configured, but no child package manifests exist |
| Lockfile | lockfile v9; only root importer `.: {}` | No workspace package dependencies are currently locked |
| TypeScript | strict shared compiler defaults in `tsconfig.base.json` | No TypeScript compiler dependency, app tsconfig or typecheck script yet |
| Turborepo | Not installed; no `turbo.json` | Compatibility with this exact runtime/workspace has not been exercised |
| Root scripts | `check:repo`, `test`, `check` | Uses Node built-in test runner; no build/lint/typecheck script |
| CI | GitHub Actions installs with `--frozen-lockfile`, runs repo check and tests | Actual workflow passed on the audited main commit after merge |
| Apps/packages | only `apps/README.md` and `packages/README.md` | No child package boundaries/dependencies exist yet |

## Compatibility statement

- **Node.js + pnpm:** validated together by the successful main-branch CI run using Node `.nvmrc`, pnpm `10.8.1`, and `pnpm install --frozen-lockfile`.
- **pnpm workspace:** configured for `apps/*` and `packages/*`; there are currently no child importers to validate.
- **Turborepo:** target tooling in `BLUEPRINT-PACKAGE.MD`, but not installed/configured. Its compatibility and task-graph behavior are **not yet verified**. Do not represent Turbo as active.
- **TypeScript:** strict shared options are present, but there is no compiler package or project build to execute.

## Findings and recommendations

1. Keep the current dependency-light root package; do not add toolchain dependencies solely to populate a manifest.
2. Materialize the first real app/package slice before enabling Turbo. At that point add a pinned Turbo version, explicit task pipeline and cache policy, then verify `turbo run` and `turbo run --dry` in CI.
3. Add child package manifests only when a real owner, consumer and public contract exist.
4. Treat root manifests, lockfile and Turbo config as serialized integration files.
5. Add lint/typecheck/build commands only when the tools and actual source projects exist.
6. Preserve Node/pnpm pins until a deliberate runtime update is evaluated in CI; do not silently change the baseline in an unrelated task.

## Verification boundary

Repository inspection and lockfile review used the complete recursive Git tree and the exact root manifests. The main-branch CI run installed from the lockfile with frozen mode, validated the repository and ran Node tests successfully. No Turbo command, app build, TypeScript compilation, external database, local workstation or deployment host was inspected.

**Review state:** package/runtime observations are complete; Turbo compatibility remains explicitly unverified and must be exercised before PKG-001 is finalized as fully accepted.
