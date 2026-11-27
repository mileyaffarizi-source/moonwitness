# Repository quality gates

## Purpose

Every human or local AI contribution must use the same repeatable repository gate before hand-off. The gate is dependency-free while MoonWitness is still a planning/foundation repository with no implemented TypeScript application packages.

This foundation gate is not a substitute for application-specific ESLint, framework lint, CSS lint or full Prettier. Those tools must be introduced with the first real source package, pinned in the workspace manifest and lockfile, configured for its actual stack, and exercised in CI. Do not report a skipped check as a pass.

## Canonical commands

Run from the repository root with Node.js 22.14.x and pnpm 10.8.1:

~~~sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm check:repo
pnpm check:tasks
pnpm test
pnpm check
~~~

pnpm check is the canonical pre-commit/pre-PR gate. CI runs the same command after a frozen install.

## What each gate verifies

| Gate | Checks |
|---|---|
| lint | Syntax-check all tracked/unignored .js, .cjs and .mjs files using the pinned Node runtime; parse every JSON file; check Markdown code-fence balance; validate runtime/package-manager contract, .editorconfig, CI workflow and mandatory AGENTS.md rules. |
| format:check | UTF-8 without BOM, LF line endings, final newline, no trailing whitespace or tab indentation in source/config files. Markdown hard-break spaces are preserved. |
| typecheck | Explicitly reports SKIPPED while no .ts/.tsx implementation exists. Once TypeScript implementation appears, fails closed until TypeScript is pinned and root tsconfig.json exists, then runs tsc --noEmit. |
| check:repo | Existing repository baseline and skill-pack structural validation. |
| check:tasks | Read-only validation of tasks.json, including dependency graph, claims, evidence and readiness invariants. |
| test | Node.js built-in test suite, including quality-gate and task-registry regression tests. |

The repository lint is not a TypeScript type checker and does not claim to replace ESLint. The initial typecheck skip is visible in the output and becomes a hard failure if TypeScript source is introduced without a real compiler configuration.

## Rules for local AI agents

1. Read AGENTS.md, the exact task and only its direct dependencies before editing.
2. Stay inside the task's owned paths. Do not edit shared manifests, lockfiles, task registry or architecture boundaries concurrently.
3. Do not create empty app scaffolds, placeholder implementations, fake data or tests that only assert constants.
4. Reuse existing dependencies. Any dependency or formatter/linter addition requires a pinned version, a frozen-lockfile update and CI coverage.
5. Preserve authored product language and design identity. Avoid generic AI dashboard layouts, random gradients, decorative glassmorphism and filler copy.
6. Never weaken, skip or silently bypass a failing gate. A suppression needs a narrow scope, an explanation, an owner and a removal condition.
7. Run pnpm check after the final code change. If it fails, fix the cause or report the exact failure; do not claim completion.
8. Include task ID, changed paths, commands, observed exit results, commit/PR and unresolved gaps in the hand-off.
9. Test claims must reflect commands actually run. Local and CI results are separate evidence.

## When app source arrives

The first implementation task for each stack must add its real lint/type/style tools and config rather than relying on this foundation-only gate. Keep versions exact and update pnpm-lock.yaml in the same serialized manifest change.

- TypeScript/React/Next.js: ESLint flat config, TypeScript compiler project(s), framework-aware lint and production build checks.
- CSS/design system: style lint and token/contrast checks tied to actual design tokens.
- API/Node packages: package-specific lint, typecheck, unit/integration tests and contract checks.
- Documentation: link validation and structured frontmatter/schema validation where the platform requires it.

Do not add every future tool at the root pre-emptively. The package that owns the source owns its lint configuration; the root gate composes those package checks.

## Failure policy

CI failure blocks merge. Do not add continue-on-error, blanket || true, warning-only lint steps, or automatic formatting writes inside CI. Formatters may be run locally as explicit edits; CI only checks. Branch protections must require the Repository CI check before merge.
