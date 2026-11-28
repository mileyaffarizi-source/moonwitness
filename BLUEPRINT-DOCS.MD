# BLUEPRINT-DOCS — DOCUMENTATION, WIKI & DX PROGRESS PORTAL

**Document ID:** MW-BP-DOC-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/docs is the documentation and knowledge portal for the engineering/product ecosystem. It hosts architecture docs, wiki pages, contributor guides, runbooks, ADRs, API reference, changelog, release notes and a readable project progress view.

It must not become a second source of truth for task state or duplicate the corpus/knowledge authority of A-L-L-A-H or MoonWitness.

## 2. Content sources

- Markdown/MDX in the repository is canonical for versioned engineering documentation.
- OpenAPI schemas are canonical for API reference generation.
- ADR files are canonical architecture decisions.
- tasks.json is the canonical task ID/dependency/status ledger.
- CI/release records are canonical evidence of build/test/deployment.
- Docs app is a search, browse, render and projection layer.

Never manually maintain task counts or progress summaries separately when they can be generated from tasks.json and verified evidence.

## 3. Information architecture

Sections: Getting Started, Product/Universe Map, Architecture, Applications, Packages/Add-ons, ORM & Data, Identity/Security, API, Agent, Web/UX, Assets/Creative Canon, Cloud/Operations, ISP/OSS/BSS, DX Developer Guide, ADRs, API Reference, Runbooks, Releases and Progress.

Separate public documentation from internal/private operational docs. Enforce access classification and do not publish secrets, private topology, customer data, security procedures or internal-only links to public routes.

## 4. Progress dashboard

Render counts by phase/workstream/priority/status, dependency-ready tasks, blockers, claims/leases, recent evidence and app completion. Show the task registry version/commit and last refresh. Progress is derived/read-only by default. A task status update must go through the DX/task coordination protocol, not a Docs UI direct JSON edit.

## 5. Publishing and review

Every document has owner, scope, audience, version/source commit, review status and related tasks. Broken links, missing references and stale docs are tested in CI. Significant architecture changes update docs/ADRs within the same change set. Public content has editorial/security review.

## 6. Search and navigation

Support full-text search, tags, app/workstream filters, related-document graph and breadcrumbs. Search result snippets must obey document access controls. Do not leak the title/snippet of restricted documents.

## 7. Required deliverables

Docs source conventions, MDX/render pipeline, navigation, private/public access policy, OpenAPI integration, ADR index, task progress projection, search index, link checker and publishing runbook.

## 8. Task ownership and definition of done

Tasks DOCS-* in tasks.json. Done means a contributor can find the correct current blueprint, follow a tested guide, inspect task progress from the canonical registry and trace every release claim to evidence.


## 9. Document metadata and lifecycle

Every document projection records canonical source path/URI, source commit/blob revision, owner, application/workstream, document type, audience, classification, status, last review date, related ADR/task IDs, generated-at time and content checksum. A rendered copy must link back to the exact source revision.

Document lifecycle: **discovered → classified → reviewed → current → stale / superseded → archived**. “Current” is evaluated against the source branch/revision; it must not be a manually asserted status. Blueprints describe target state; repository audits describe observed state at a commit; CI evidence describes a specific run/commit. These evidence types must not be conflated.

## 10. Publication and access enforcement

Default audience is internal. Public-candidate requires product/editorial/security/rights review. Restricted includes secrets, credentials, customer data, private network topology, security runbooks, unpatched vulnerability detail and privileged access procedures. Unknown classification stays internal until an owner resolves it.

Authorization applies before index creation and before every render/export. Do not leak restricted document existence through page title, tags, autocomplete, search facets, snippets, breadcrumbs or related-document recommendations. Public and internal indexes have separate ingestion policies.

## 11. Progress projection contract

Task dashboard data is generated from the validated tasks.json at a specific commit. CI badges link to the exact run/commit; completed-task counts include only tasks with valid evidence under the task validator. Show stale/blocked/in-review states and unresolved blockers; do not turn a proposed plan into an implementation percentage.

Projection cache records source revision and generated-at. Invalidation is event- or revision-driven; stale data is labeled. Docs does not have a task status writer. All task mutations go through the DX/governance registry writer.

## 12. Search, links and retention

Index only documents whose current audience policy allows the requesting principal. Preserve source sections/headings and exact link targets. Broken links, missing ADR IDs, unresolvable task IDs, stale source references and incompatible document frontmatter fail or warn according to an explicit severity policy.

Set retention for indexed content and attachments by classification. When source access is revoked or a document becomes restricted, remove cached snippets and search material within a measured revocation window. Exports include source revision and audience classification.

## 13. Acceptance and test matrix

Tests cover public vs internal vs restricted search, snippets, unauthorized title discovery, changed permissions, source revision drift, stale task projection, broken task/ADR links, source deletion/rename, generated progress counts and cache purge after revocation.

**Acceptance:** a contributor can find a current approved document, trace it to an exact source commit, view a truthful task/CI projection and never discover restricted metadata through search or navigation.
