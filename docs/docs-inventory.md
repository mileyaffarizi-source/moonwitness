# Documentation inventory and publication classification

**Audit date:** 2026-11-27  
**Audited main commit:** `a4318676e91292bcb0cfc3f1138ad42ab6709354`  
**Task:** DOCS-001  
**Method:** repository file reads, merged pull-request file inventories (#1–#9), architecture blueprints and explicit path checks.

## Executive finding

The repository has a usable, version-controlled documentation foundation, but `apps/docs` is not implemented. Documentation is distributed between root blueprints, `docs/`, contributor policy in `.agents/` and `AGENTS.md`, execution contracts in `scripts/tasks/`, and the canonical `tasks.json` ledger. These sources have different authority and must not be collapsed into a single manually edited wiki.

This inventory describes repository evidence only. It does not imply that all content is approved for public release or that an external wiki, runbook store, OpenAPI server, cloud account or local documentation source was inspected.

## 1. Canonical source and authority map

| Source | Canonical for | Not authoritative for |
|---|---|---|
| `BLUEPRINT*.MD` / `BLUEPRINT*.MD` specialist files | Target architecture, app boundaries, product requirements and constraints | Implemented state, completed tests or deployment status |
| `tasks.json` | Task IDs, dependencies, status, ownership, approvals and task evidence | Architecture decisions or application runtime contracts |
| `docs/adr/ADR-*.md` | Accepted/rejected/superseded material architecture decisions | Current task progress or implementation proof |
| `docs/adr/decision-register.md` | ADR index and lifecycle pointer | Replacement for the individual ADR decision record |
| `docs/architecture/**` | Audited architecture/package snapshots and findings | Live source of task status or newer implementation state without refresh |
| `docs/governance/**` | Change process, governance baselines and change-history snapshots | Current main state after later commits unless re-audited |
| `docs/dx/**` | DX environment evidence and adapter inventory | User workstation facts not actually observed |
| `docs/engineering/**` | Engineering decisions and repository quality contracts | Product/domain business rules |
| `scripts/tasks/**` | Executable task protocol/specification and validator implementation | A second task-status ledger |
| `AGENTS.md`, `.agents/skills/**` | Contributor-wide and specialist AI/human operating rules | Product requirement or system-of-record data |
| GitHub Actions run/check records | Build and test evidence for a specific commit | Human approval or production deployment evidence |
| `apps/docs` (target) | Future browse/search/render/progress projection | Independent task, ADR or corpus authority |

## 2. Verified document catalogue

### Architecture and product blueprints

Root-level blueprints include:

- `BLUEPRINT.md` — parent architecture.
- `BLUEPRINT-APPLICATIONS.MD` — fourteen application inventory and ownership boundaries.
- `BLUEPRINT-AGENT.MD`, `BLUEPRINT-WEB.MD`, `BLUEPRINT-OSS.MD`, `BLUEPRINT-BSS.MD`, `BLUEPRINT-ID.MD`, `BLUEPRINT-DOCS.MD`, `BLUEPRINT-DESKTOP.MD`, `BLUEPRINT-MOBILE.MD`, `BLUEPRINT-CLOUD.MD`, `BLUEPRINT-ISP.MD`, `BLUEPRINT-DX.MD`, `BLUEPRINT-A-L-L-A-H.MD`, `BLUEPRINT-RIOT.MD`.
- `BLUEPRINT-PACKAGE.MD` — package/workspace boundaries.
- `BLUEPRINT-DESIGN-ASSETS.MD`, `BLUEPRINT-ASSETS-UI.MD`, `BLUEPRINT-ASSETS-ARTWORK.MD`, `BLUEPRINT-ASSETS-CHARACTER.MD`, `BLUEPRINT-ASSETS-SFX.MD`, `BLUEPRINT-ASSETS-VECTOR-LOGO-ICON.MD).
- `BLUEPRINT-NARATION.MD` — narrative/canon source policy; the filename spelling is intentional.
- `BLUEPRINT-RULES-GOVERN-CONTRACT.MD` — governance and authority contract.

These are target specifications. A document statement such as “will”, “must support” or a named route is not evidence that the feature exists.

### Architecture, governance and engineering records

Verified current files include:

- `docs/architecture/application-inventory.md`
- `docs/architecture/dependency-graph.md`
- `docs/architecture/existing-app-baseline.json`
- `docs/architecture/package-audit.md`
- `docs/engineering/ADR-0001-repository-foundation.md`
- `docs/engineering/QUALITY-GATES.md`
- `docs/adr/ADR-TEMPLATE.md`
- `docs/adr/decision-register.md`
- `docs/governance/baseline-report.md`
- `docs/governance/change-inventory.md`
- `docs/governance/architecture-change-process.md`
- `docs/dx/dx-workflow-audit.md`
- `docs/dx/agent-adapter-inventory.json`
- `scripts/tasks/local-agent-execution-protocol.md`
- `scripts/tasks/task-validator-spec.md`
- `README.md`, `apps/README.md`, `packages/README.md`
- `AGENTS.md` and `.agents/skills/README.md` with nine focused skills.

ADR-0001 is marked accepted for the initial repository foundation. The ADR template requires an authorized decision owner and exact approval scope; a model-generated approval is not valid.

### Wiki, API reference and runbooks

The intended information architecture is defined in `BLUEPRINT-DOCS.MD`, but these runtime/source elements are not yet verified as implemented:

- `apps/docs` application package and documentation rendering/search runtime: not materialized (the expected app package and README paths returned 404).
- OpenAPI schema generation, API reference build and API doc publishing: not verified; API runtime itself is not materialized in the application baseline.
- A wiki content service or external wiki connector: not verified.
- A dedicated runbook catalogue/publication pipeline: not verified.
- A searchable document index, tags, related-document graph and permission-aware snippets: target requirements only.

Do not create placeholder runtime directories to make these deliverables appear present. The repository Markdown/MDX files remain the canonical versioned engineering sources until an implementation task creates a tested projection layer.

## 3. Publication classification

Use the classifications in `docs/docs-access-map.json`:

- **Internal (default):** architecture, ADRs, task records, governance, DX reports, CI details, contributor guides, implementation notes and operational documentation. These may expose internal design and operational context and are not automatically public.
- **Public-candidate:** deliberately authored product/marketing/help content that has passed product-owner, editorial, privacy and security review. No blanket public classification is assigned to the current technical-document set.
- **Restricted:** secrets, tokens, private keys, customer/tenant data, private network topology, privileged access procedures, security incident detail and confidential external links. Never publish or index these into public search snippets.
- **Unknown/unclassified:** sources whose owner, audience, rights or sensitivity has not been confirmed. Keep internal and do not publish until classified.

Classification is a publication policy, not a substitute for authorization at request time. A future Docs application must enforce the source ACL before rendering titles, snippets, metadata, search facets, exports or attachments.

## 4. Conflicts, stale snapshots and reconciliation

1. `docs/governance/baseline-report.md` and `docs/governance/change-inventory.md` identify old commits and describe APP-001/PKG-001 as `in_review`. The current task ledger has since advanced those audits to `done`; those status statements are historical and must not be treated as current.
2. `docs/architecture/application-inventory.md`, `existing-app-baseline.json`, `dependency-graph.md` and `package-audit.md` cite an earlier audited commit. Their “not materialized” findings are consistent with the repository's subsequent changes inspected for this audit, but their commit identifiers and evidence references require a refreshed baseline before being presented as current.
3. `docs/dx/dx-workflow-audit.md` and `agent-adapter-inventory.json` cite the pre-quality-gate baseline commit and prior CI run. Their separation of verified GitHub capabilities from unverified local-host capabilities remains valid; their commit/run references are historical.
4. Blueprints and implementation audits have different roles. When they differ, report target-state versus observed-state explicitly; do not silently rewrite the blueprint to match incomplete code.
5. `decision-register.md` is an index. An index entry without its accepted ADR and approval evidence is not authorization to implement a material architecture change.

This inventory records those conflicts; it does not rewrite the source reports or alter their historical findings.

## 5. Required Docs portal controls

Before `apps/docs` is implemented, its design must preserve these invariants:

- Generate task/progress data from `tasks.json` and verified CI/evidence sources; never maintain a second status/count database by hand.
- Keep task and ADR writes outside the Docs UI. The UI is a read-only projection unless an authorized DX/governance protocol explicitly delegates a write.
- Resolve each document's owner, source commit, audience, classification, review state and related task.
- Enforce source access before search indexing and snippet generation to prevent restricted-title/metadata disclosure.
- Validate links and internal references in CI; flag stale commit/run evidence and broken canonical links.
- Show generated/source timestamp and source commit for progress/report views; never imply that a blueprint is implemented.
- Require editorial/security review for public publication and rights/provenance review for imported content.

## 6. Completion boundary

DOCS-001 is a repository documentation inventory and publication-classification task. It does not implement `apps/docs`, an OpenAPI server, a wiki backend, a search cluster or an external publishing integration. Those are separate tasks that must have approved owners, source contracts and acceptance tests.
