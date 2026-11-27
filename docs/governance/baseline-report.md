# Repository baseline report

**Audit date:** 2026-11-27  
**Audited branch:** `main`  
**Audited commit:** `16937bd804f2d2977227a5badc04648dc9170e55`  
**Task:** GOV-001

## Executive finding

MoonWitness is in an incremental transition from a blueprint/task-registry repository to an executable monorepo. The repository foundation and contributor governance are now present and CI-verified. The fourteen target applications, domain packages, API runtime, database adapters and deployment plane are **not yet implemented**.

This report deliberately separates committed artifacts, verified behavior, target architecture and unavailable external state.

## Verified repository state

- Main points at commit `16937bd804f2d2977227a5badc04648dc9170e55`.
- The recursive Git tree contains 77 entries; GitHub reported the tree response was not truncated.
- The tree contains the master/specialist blueprints, 234-task registry, repository audit, Node/pnpm workspace foundation, CI workflow, TypeScript baseline, root agent contract and nine indexed agent skills.
- `apps/` contains only `apps/README.md`; `packages/` contains only `packages/README.md`. No application source or shared package implementation has been materialized.
- Root scripts are `check:repo`, `test` and `check`. CI installs with frozen lockfile, validates repository structure and runs Node's built-in test runner.
- Node.js `22.14.0` and pnpm `10.8.1` are pinned. The pnpm lockfile has only the empty root importer.
- Turborepo is a target in the package blueprint but is not installed or configured. No Turbo compatibility or task graph has been claimed.
- `tasks.json` remains the sole canonical execution ledger. Its 234 records currently span 25 workstreams.

## Preservation and attribution

Existing blueprints and narrative/design documents were retained while the repository foundation was added. Changes are attributable through the commit history and two merged pull requests:

- PR #1 introduced the minimal Node/pnpm monorepo foundation, CI, ADR and AI contributor standards.
- PR #2 added the 14-app/package baseline audit and recorded APP-001/PKG-001 as `in_review`; it did not mark them complete.
- No tracked application source, customer/business database, Odoo data, deployment host or secret store was modified by these repository-level changes.

## Verification performed

| Check | Result | Boundary |
|---|---|---|
| Main ref | Verified | Remote Git ref only |
| Recursive tree | Verified, 77 entries, not truncated | Committed tree only |
| Commit history | Verified | Remote commit history |
| PR #1 / PR #2 | Both merged | GitHub PR records |
| Main CI after PR #1 | Pass | Frozen install, repo validation and tests |
| PR CI for PR #2 | Pass | Frozen install, repo validation and tests |
| Main CI after PR #2 | Run triggered | See Actions; current result should be checked separately |

The connected GitHub interface exposes committed repository state, not an arbitrary developer's local working tree. Therefore this audit does not claim to have inspected uncommitted local files or run `git status` on a developer workstation.

## Explicitly unknown / not inspected

- Local shells, installed coding-agent CLIs, models, editor extensions, user PATH, local credentials and personal machine state.
- Any private VPS, Docker host, database, Odoo instance, cloud account, network device, production deployment or external secret manager.
- Application runtime behavior, API routes, ORM metadata, live user workflows and operational health, because no app code exists in this repo.
- Named individual maintainers and the expansion of the Web label `CSS`.

## Conclusion

The baseline is not empty and not production-ready. It contains significant architecture/task documentation and a verified repository foundation, but no implemented product application. All subsequent tasks must treat that distinction as authoritative.
