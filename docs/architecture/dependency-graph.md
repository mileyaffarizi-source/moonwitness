# Workspace and application dependency graph

**Audit date:** 2026-11-28  
**Branch:** foundation/node26-lts-automation  
**Purpose:** distinguish observed repository state from the target dependency and execution topology.

## 1. Observed repository state at this audit

The repository is still a planning/foundation monorepo. The root Node workspace and validation scripts exist; the sixteen application identities are inventoried, but the application source packages have not all been materialized. Astronauts and Arsy each have a planning README anchor, not an executable Go/Rust service.

The package graph must be generated from actual package manifests/imports once packages exist. Do not turn a blueprint list into a fictional import graph.

Historical baseline notes in older audits (Node 22 / pnpm 10, earlier branch revisions) are historical evidence only. The current PR branch pins Node.js 26.13.1 and pnpm 12.24.0. Go and Rust have their own module/lockfile/build pipelines and are not pnpm packages.

## 2. Four cooperating architecture planes

~~~mermaid
flowchart TB
  subgraph EXPERIENCE[Experience plane]
    WEB[Web / Community]
    CLIENTS[OSS · BSS · ISP]
    DESKTOP[Desktop · Mobile]
    DOCS[Docs]
    DX[DX Workbench]
    KNOWLEDGE[A-L-L-A-H]
    RIOT[RIOT]
  end
  subgraph INTELLIGENCE[Intelligence plane]
    AGENT[Mastra Agent / Workflows]
  end
  subgraph AUTHORITY[Authority plane]
    ID[ID / OIDC / Workload Identity]
    API[Fastify API / Authorization / Domain Use Cases]
    VAULT[Vault / KMS]
  end
  subgraph OPERATIONS[Protocol & Operations plane]
    CLOUD[Cloud / IaC / Provider Resources]
    AST[Astronauts Go Controller]
    EDGE[Go Edge Agent]
    ARSY[Arsy Rust Protocol Runtime]
    OSSOPS[OSS Inventory / Incidents / Provisioning]
  end
  EXPERIENCE --> API
  EXPERIENCE --> ID
  AGENT --> API
  DX --> API
  API --> ID
  API --> VAULT
  API --> AST
  AST <-->|outbound mTLS / signed typed job| EDGE
  CLOUD -->|provisioned resource + scoped enrollment| AST
  API -->|scoped policy and approved RPC contracts| ARSY
  ARSY -->|RADIUS / CWMP / Syslog facts| OSSOPS
  ARSY --> CLIENTS
  CLIENTS --> API
~~~

These are architectural responsibility planes, not four mandatory deployment units.

## 3. Domain source-of-truth graph

| Domain information | Authoritative owner | Consumers/adapters |
|---|---|---|
| Human/workload identity | ID / selected IdP | API, all clients, Agent, Astronauts, Arsy |
| Business customer/order/contract/invoice/payment | BSS; existing Odoo remains owner until entity-level cutover | ISP, API, approved reporting |
| Subscriber service/entitlement/lifecycle | ISP | BSS milestone consumer, Arsy policy projection, OSS workflow |
| Network inventory/topology/alarms/incidents/configuration/technical SLA | OSS | ISP, Arsy resource references, clients |
| Provider account/IaC/resource state/cost | Cloud + provider | Astronauts enrollment hand-off, deployment clients |
| Enrolled host/machine identity/heartbeat/job/result | Astronauts operational store | API grant authority, DX/Cloud consumers |
| RADIUS/ACS/Syslog protocol session/evidence | Arsy operational store | ISP, OSS, approved BSS usage projection |
| AI runs/workflows/memory | Agent runtime under policy | API and clients; never business truth |
| Narrative/corpus source and canon | authored source/editorial owner | Web, A-L-L-A-H, Agent retrieval with provenance |
| Task ID/dependency/status | tasks.json | DX and Docs read-only projection |

No cross-domain database sharing or dual-master sync is permitted by default.

## 4. Mandatory inter-application flows

### 4.1 Human/client request

Client → ID authentication → API token/resource authorization → owning domain use case → authoritative store → audit/outbox → client projection.

### 4.2 AI or developer machine operation

Human/DX → Agent or DX request → API actor/workload authorization → exact-scope signed grant → Astronauts Controller → outbound mTLS Edge Agent → typed capability → signed result/evidence → API audit/status projection.

No Agent/DX direct SSH, Edge Agent direct call, arbitrary shell, Docker socket or ambient host credential.

### 4.3 Broadband order to active service

BSS accepted order → ISP subscriber-service orchestration → OSS qualification/resource reservation/change workflow → Arsy protocol adapter where needed (RADIUS/ACS/Syslog) → OSS observed-state verification → ISP activation predicate → BSS commercial milestone. Arsy packet/session facts do not themselves activate the subscriber or start billing.

### 4.4 Cloud resource to managed host

Cloud immutable plan → approval → isolated runner apply → provider-observed resource verification → scoped Astronauts enrollment/bootstrap → machine certificate/heartbeat → revocation hand-off on resource decommission.

### 4.5 Documentation and progress

Versioned Markdown/OpenAPI/ADR/tasks.json/CI evidence → Docs parser/index → access-filtered read-only projection. Docs never becomes a second task writer.

## 5. Cross-language build graph

| Language | Owner surface | Source-of-truth for dependencies | Required checks |
|---|---|---|---|
| Node.js 26.13.1 / TypeScript | Node apps and pnpm packages | package.json + pnpm-lock.yaml + workspace config | format, lint, typecheck, unit/contract tests, build |
| Go | apps/astronauts | go.mod + go.sum + pinned toolchain | gofmt, vet, tests/race where applicable, static/security checks, build/cross-build |
| Rust | apps/arsy | Cargo.toml + Cargo.lock + rust-toolchain.toml | cargo fmt, clippy, tests, audit/SBOM, fuzz/integration where applicable |

The aggregate CI reports each language as passed, failed, blocked or not-applicable with a reason. A missing toolchain or unbuilt app is not a pass.

## 6. Dependency direction and forbidden edges

- Experience clients → versioned API/client contracts; no domain database drivers.
- Agent/DX → approved API capability contracts; no API private repository/ORM internals.
- API → Base contracts, ORM ports, domain use cases and versioned integrations.
- Astronauts → API-signed grant contract and machine identity contracts; no business DB, provider resource creation or device/NMS inventory authority.
- Arsy → API/ISP policy projections, OSS-approved ACS requests and protocol contracts; no BSS/ISP/OSS DB imports.
- Cloud → provider/IaC adapters; Astronauts is a post-provisioning host hand-off, not Cloud's runner substitute.
- UI packages → neutral tokens/primitives; no business state ownership.
- Narrative/Knowledge packages → source-aware schemas; AI-generated assertions remain proposals.
- No cyclic package imports, no private app imports and no direct cross-domain DB writes.

## 7. Graph generation and verification

Until application/package manifests exist, the graph above is an architecture/contract graph, not the actual package import graph. PKG-009 must produce the real graph from workspace manifests and source imports, include Go/Rust module graphs, detect cycles/forbidden edges, attach source revision and preserve the distinction between declared, resolved and observed dependencies.
