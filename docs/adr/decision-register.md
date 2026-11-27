# Architecture decision register

**Authority:** `BLUEPRINT-RULES-GOVERN-CONTRACT.MD`  
**Template:** [ADR-TEMPLATE.md](./ADR-TEMPLATE.md)

## Register

| ID | Decision | Status | Canonical document | Notes |
|---|---|---|---|---|
| ADR-0001 | Repository foundation: Node.js/pnpm workspace, strict TS defaults and repository CI | Accepted | [docs/engineering/ADR-0001-repository-foundation.md](../engineering/ADR-0001-repository-foundation.md) | Initial implementation baseline; app frameworks/ORM/deployment remain deferred |

No additional ADR is recorded in the register at this audit. Do not infer that a blueprint proposal is an accepted ADR.

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
