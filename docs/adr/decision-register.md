# Architecture decision register

**Authority:** `BLUEPRINT-RULES-GOVERN-CONTRACT.MD`  
**Template:** [ADR-TEMPLATE.md](./ADR-TEMPLATE.md)

## Register

| ID | Decision | Status | Canonical document | Notes |
|---|---|---|---|---|
| ADR-0001 | Repository foundation: Node.js/pnpm workspace, strict TS defaults and repository CI | Accepted | [docs/engineering/ADR-0001-repository-foundation.md](../engineering/ADR-0001-repository-foundation.md) | Initial implementation baseline; app frameworks/ORM/deployment remain deferred |
| ADR-0002 | Node.js 24.22.3, pnpm 12.24.0 and non-overlapping GitHub security/release automation | Accepted | [ADR-0002-runtime-and-github-automation.md](./ADR-0002-runtime-and-github-automation.md) | Supersedes ADR-0001 runtime pins only; GitHub owner settings remain required |
| ADR-0003 | Add-on manifest, artifact trust, capability and lifecycle contract | Proposed | [ADR-0003-addon-manifest-trust-and-lifecycle.md](./ADR-0003-addon-manifest-trust-and-lifecycle.md) | Owner/security review pending; does not authorize production code loading, signing trust or destructive migrations |

ADR-0002 records the owner-approved runtime and repository automation update. Other blueprint proposals remain non-authoritative until accepted through this process.

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
