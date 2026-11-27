# MoonWitness application inventory

**Audit date:** 2026-11-28  
**Base branch:** `main` · **Architecture change branch:** `foundation/node26-lts-automation`  
**Authority:** `BLUEPRINT-APPLICATIONS.MD`, accepted ADRs and `tasks.json`

## Finding

The target architecture now contains exactly sixteen application surfaces. The current repository is still a planning/foundation repository: only the shared `apps/README.md` and the two specification-only anchors for Astronauts and Arsy are present. Those anchors do not contain executable services. No application should be called implemented until its source, tests, build and runtime evidence exist.

An app directory is a product/runtime boundary, not an automatic microservice, database or separate deployment.

## Canonical inventory

| # | Path | Technology | Purpose / authority | Implementation truth |
|---:|---|---|---|---|
| 1 | `apps/agent` | Node.js 26 / Mastra | AI reasoning, agents, tool/workflow runtime; no direct business DB or host access | Planned |
| 2 | `apps/api` | Node.js 26 / Fastify | Shared platform authority, domain use cases, authorization, transactions, API contracts and audit | Planned |
| 3 | `apps/web` | Node.js 26 / Next.js | MoonWitness public landing, research/story discovery and Community | Planned |
| 4 | `apps/OSS` | API-backed operational client | Network inventory, topology, alarms, incidents, provisioning workflow and assurance | Planned |
| 5 | `apps/BSS` | API-backed business client | Customer, offer, commercial order, contract, subscription, invoice and payment authority | Planned |
| 6 | `apps/id` | OIDC/SSO integration | Central identity, login, federation and workload identity; not a plaintext secret vault | Planned |
| 7 | `apps/docs` | Documentation application | Wiki, ADRs, DX knowledge and progress projection; no separate task ledger | Planned |
| 8 | `apps/desktop` | Desktop client | General user/operator client; not a coding IDE | Planned |
| 9 | `apps/mobile` | Native mobile client | Mobile experience through approved identity/API contracts | Planned |
| 10 | `apps/cloud` | Cloud control plane + isolated runners | Cloud/provider accounts, resources, IaC plan/apply, deployment, usage/cost and recovery | Planned |
| 11 | `apps/isp` | ISP vertical application/domain | Subscriber service lifecycle and orchestration between BSS and OSS | Planned |
| 12 | `apps/dx` | Developer workbench + local daemon | Repository/worktree, coding-agent adapters, local build/test, diff review and evidence | Planned |
| 13 | `apps/A-L-L-A-H` | Knowledge experience | Flagship landing, corpus, ontology, law and government knowledge | Planned |
| 14 | `apps/riot` | Creative/media + isolated lab client | Creative studio and separately authorized red/blue-team lab workflows | Planned |
| 15 | `apps/astronauts` | Go Controller + Go Edge Agent | Enrolled host fleet, machine identity, heartbeat/inventory, desired host state, signed typed job dispatch and execution evidence | Planning anchor only |
| 16 | `apps/arsy` | Rust async protocol services | RADIUS AAA for PPPoE NAS/BRAS/BNG, TR-069/CWMP ACS and Syslog ingest/normalization | Planning anchor only |

## Ownership and overlap review

- **Agent vs DX vs Astronauts:** Agent reasons and calls approved capabilities; DX manages developer workspaces and coding workflows; Astronauts controls only explicitly enrolled host fleets and executes signed typed capabilities. None receives ambient production access.
- **Cloud vs Astronauts:** Cloud creates/owns provider resources and IaC state; Astronauts enrolls and operates the host after it exists. Cloud can request scoped bootstrap/host actions, never a general shell.
- **Arsy vs ISP/BSS/OSS:** Arsy implements wire protocols and protocol-session state. ISP owns subscriber service lifecycle and entitlements; BSS owns commercial/billing truth; OSS owns network inventory, NMS alarms/incidents, provisioning workflows and technical assurance.
- **ID vs API vs Vault:** ID authenticates; API/resource owners authorize; a dedicated vault/KMS owns secret values.
- **Docs vs tasks.json:** documentation projects the canonical plan; tasks.json remains the only execution/status ledger.

## Source-of-truth boundaries

| Data | Authority |
|---|---|
| Identity and workload identity | ID/IdP |
| Commercial customer/order/subscription/invoice/payment | BSS domain; legacy Odoo remains authoritative until explicit cutover |
| Subscriber-service state and entitlements | ISP domain; references BSS and OSS records |
| Network inventory/topology/alarms/provisioning/technical SLA | OSS and authoritative equipment adapters |
| Cloud resource/provider/IaC state | Cloud control plane/provider |
| Enrolled host identity, heartbeat, host inventory and machine execution state | Astronauts operational store; API remains authorization authority |
| RADIUS auth/accounting, ACS protocol sessions/RPC results and Syslog ingest | Arsy protocol store with bounded retention; subscriber/device masters remain ISP/OSS-owned |
| AI execution state | Agent workflow store; API owns resulting business records |
| Task ID/dependency/status | tasks.json |
| Documentation and ADRs | version-controlled Markdown sources |

## Open technical decisions

1. Astronauts must benchmark the control transport and protocol implementation (gRPC streaming is the starting candidate), certificate issuer/rotation and controller HA before selecting final dependencies.
2. Arsy must validate RADIUS password-authentication compatibility and credential handling per method (PAP, CHAP, MS-CHAP/EAP) before production. No plaintext subscriber password storage.
3. TR-069/CWMP is the initial ACS compatibility track. TR-369/USP is a future interoperability evaluation, not a first-release requirement.
4. Exact NAS/OLT/ONT/CPE vendors, traffic rates, retention and failover targets require the read-only system inventory tasks.
5. CSS in the Web/Community description remains unconfirmed; do not expand the acronym from guesswork.

## Evidence rules

- Directory/README presence is not an implementation result.
- A new app is complete only after its bounded acceptance criteria, security/contract tests, build and deployment evidence pass.
- No task status is changed to done in this inventory update.
