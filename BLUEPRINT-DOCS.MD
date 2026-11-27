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
