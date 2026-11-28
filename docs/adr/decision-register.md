# Architecture decision register

**Authority:** `BLUEPRINT-RULES-GOVERN-CONTRACT.MD`  
**Template:** [ADR-TEMPLATE.md](./ADR-TEMPLATE.md)

## Register

| ID | Decision | Status | Canonical document | Notes |
|---|---|---|---|---|
| ADR-0001 | Repository foundation: Node.js/pnpm workspace, strict TS defaults and repository CI | Accepted | [docs/engineering/ADR-0001-repository-foundation.md](../engineering/ADR-0001-repository-foundation.md) | Initial implementation baseline; app frameworks/ORM/deployment remain deferred |
| ADR-0002 | Node.js 24.22.3, pnpm 12.24.0 and non-overlapping GitHub security/release automation | Superseded (runtime only) | [ADR-0002-runtime-and-github-automation.md](./ADR-0002-runtime-and-github-automation.md) | Node 24 runtime selection superseded by ADR-0004; pnpm 12 and automation ownership remain accepted |
| ADR-0004 | Node.js 26 Active LTS and GitHub security automation hardening | Accepted | [ADR-0004-node26-lts-and-github-automation.md](./ADR-0004-node26-lts-and-github-automation.md) | Initial Node 26 adoption at 26.13.0; one owner per security/release automation function |
| ADR-0005 | Node.js 26.13.1 patch refresh | Accepted | [ADR-0005-node26-patch-refresh.md](./ADR-0005-node26-patch-refresh.md) | Current exact Node 26 patch pin; pnpm remains 12.24.0 |
| ADR-0006 | Sixteen-app topology: Astronauts Go control plane and Arsy Rust telecom protocol plane | Accepted | [ADR-0006-astronauts-arsy-architecture.md](./ADR-0006-astronauts-arsy-architecture.md) | Adds two bounded app responsibilities; not a mandate for sixteen microservices |
| ADR-0003 | Add-on execution trust boundary and capability isolation | Proposed | [ADR-0003-addon-runtime-and-trust-boundary.md](./ADR-0003-addon-runtime-and-trust-boundary.md) | Third-party add-on execution remains disabled pending owner/security approval |

ADR-0002 records the owner-approved runtime and repository automation update. ADR-0003 is a proposed trust-boundary decision; it does not authorize third-party add-on execution. Other blueprint proposals remain non-authoritative until accepted through this process.

## ID allocation and lifecycle

- Allocate the next sequential `ADR-NNNN` identifier only after checking this register and the repository.
- Keep one canonical ADR file per decision. Do not copy an ADR into multiple directories.
- Status values: **Proposed**, **Accepted**, **Rejected**, **Superseded**.
- Proposed decisions may guide exploration but are not authorization to change a higher-level invariant.
- Accepted decisions record owner/reviewer, date, consequences and evidence. If implementation is not complete, say so.
- A changed decision creates a new ADR that supersedes the old one; do not silently rewrite historical reasoning.
- Update this register and affected task/blueprint references in the same change set.
- Link implementation evidence to commits/tests/releases. Do not mark a task done from an ADR alone.

## Decision authority

Apply the precedence order in [the governance contract](../../BLUEPRINT-RULES-GOVERN-CONTRACT.MD): applicable safety/legal restrictions and explicit human decisions; governance contract and accepted ADRs; master blueprint; specialist blueprint; task registry; implementation notes.

A decision that affects security, data ownership, identity, production privilege, external contracts, destructive migration, canon or release policy requires the designated human owner and any required security/domain review. AI agents may draft, compare and test options; they cannot approve their own proposed decision.
