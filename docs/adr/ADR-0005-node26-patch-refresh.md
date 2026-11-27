# ADR-0005: Refresh the exact Node.js 26 LTS patch

- **Status:** Accepted
- **Date:** 2026-11-28
- **Decision owner:** Repository owner
- **Related tasks:** PKG-010
- **Supersedes:** ADR-0004's exact 26.13.0 pin only; the Node.js 26 Active LTS choice, pnpm 12.24.0 and automation ownership remain accepted.

## Context

ADR-0004 established Node.js 26 Active LTS at 26.13.0. The official Node.js release listing verified on 2026-11-28 lists Node.js 26.13.1 as the latest 26.x LTS patch. The project should move to the newest verified patch in the selected major line, without changing the package-manager generation or dependency graph unnecessarily.

Sources:
- Node.js v26.13.1 release: https://nodejs.org/en/blog/release/v26.13.1/
- Node.js release schedule: https://github.com/nodejs/Release

## Decision

1. Pin `.nvmrc` and `.node-version` to `26.13.1`.
2. Set the root Node engine to `>=26.13.1 <27`.
3. Align add-on schema, examples, linter, tests and authoring standards to `>=26.13.1 <27.0.0`.
4. Keep pnpm exactly at `12.24.0`; retain the lockfile unless a frozen install on Node 26.13.1 demonstrates a justified change.
5. Preserve Node 26 as the only supported primary runtime line. Do not silently float to Node 27 or change one app's Node major independently.
6. Preserve ADR-0004 as historical evidence for the major-version migration and its automation decisions.

## Consequences and verification

- Root manifest, exact version files, add-on compatibility and CI must agree.
- A clean `pnpm install --frozen-lockfile` and complete `pnpm check` on 26.13.1 are required before PKG-010 is returned to done.
- Existing 26.13.0 CI evidence is not proof for 26.13.1. PKG-010 remains in review until new CI evidence exists.
- No deployment, package publishing, automatic merge or production system mutation is authorized by this patch update.
