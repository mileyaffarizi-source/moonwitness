# BLUEPRINT-APPLICATIONS — FOURTEEN-APP ECOSYSTEM TOPOLOGY

**Document ID:** MW-BP-APP-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT.md · **Governance:** BLUEPRINT-RULES-GOVERN-CONTRACT.MD · **Execution:** tasks.json

## 1. Decision

The platform now contains **exactly fourteen named application surfaces/runtimes**. This replaces the previous three-application constraint. The three architectural planes (Intelligence, Authority and Experience) remain useful concepts, but they no longer represent the application count.

An application directory is a product/runtime boundary, not automatically a separate microservice, database or Kubernetes workload. Deploy independently only when security isolation, scaling, availability, lifecycle or ownership justifies the cost.

## 2. Canonical application inventory

| # | Application path | Product responsibility | Primary owner |
|---:|---|---|---|
| 1 | apps/agent | Mastra AI orchestration, agents and workflows | Agent Engineering |
| 2 | apps/api | Fastify platform authority and business APIs | Platform/API Engineering |
| 3 | apps/web | MoonWitness public front page and Community; CSS meaning is pending confirmation | MoonWitness Product |
| 4 | apps/OSS | Operational Support System: network/service operations | Network Operations |
| 5 | apps/BSS | Business Support System: commercial/customer lifecycle | Business Operations |
| 6 | apps/id | Central identity, login, OIDC/SSO and federation | Security/Identity |
| 7 | apps/docs | Documentation, wiki, DX knowledge and progress portal | Documentation/DX |
| 8 | apps/desktop | General end-user desktop experience | Client Experience |
| 9 | apps/mobile | Native mobile experience | Mobile Product |
| 10 | apps/cloud | Cloud/infrastructure business control plane | Cloud Platform |
| 11 | apps/isp | ISP/telco vertical service lifecycle | ISP Product |
| 12 | apps/dx | Developer Experience Workbench and local engineering orchestration | Developer Platform — highest implementation priority |
| 13 | apps/A-L-L-A-H | Flagship public landing and Divine Corpus/Ontology/Law/Government Knowledge | Corpus/Knowledge Product |
| 14 | apps/riot | Creative/media/content studio and isolated red-team/blue-team lab | Creative & Security Lab |

Use exact requested directory names where practical. npm package names, import aliases, service IDs and URLs should use lowercase stable identifiers (for example, app.oss, app.a-l-l-a-h) to avoid case-sensitivity issues across operating systems.

## 3. The three architectural planes

**INTELLIGENCE PLANE**
- apps/agent executes approved AI reasoning and workflows.
- apps/dx coordinates local developer agents and coding work.
- apps/riot may host controlled research/security-lab agents, isolated from production.

**AUTHORITY / CONTROL PLANE**
- apps/api owns platform business operations and shared domain APIs.
- apps/id owns identity policy and OIDC integration.
- apps/cloud owns infrastructure/resource lifecycle and secret-manager integration.
- Domain add-ons define model/business capabilities; the API composes and authorizes them.

**EXPERIENCE PLANE**
- apps/web, apps/A-L-L-A-H, apps/OSS, apps/BSS, apps/docs, apps/desktop, apps/mobile, apps/isp and apps/riot present purpose-specific experiences.
- apps/dx is also an operator/developer experience but has local privileged capabilities behind a separate daemon boundary.

## 4. Critical domain boundaries

### 4.1 OSS vs BSS vs ISP

- **BSS owns commercial truth:** party/customer/account, product offer, price, quote, commercial order, contract, subscription, invoice, payment, collection and revenue status.
- **OSS owns operational truth:** network/resource inventory, topology, alarms, faults, performance, configuration, provisioning execution, service assurance and technical SLA evidence.
- **ISP owns the vertical journey:** broadband product packaging and subscriber service lifecycle that coordinates BSS orders and OSS technical execution.

ISP must not become a second billing system or a second NMS. BSS must not directly configure routers/OLTs. OSS must not create commercial invoices. Each hand-off has a versioned contract, correlation ID and idempotency key.

### 4.2 ID vs secrets

apps/id owns identities, authenticators/IdP integration, OIDC clients, login/session/federation policy, user lifecycle and identity audit.

Secret values, API credentials, database passwords, signing keys and infrastructure secrets belong in a dedicated secrets-management system (for example OpenBao or a reviewed equivalent). apps/id may authenticate a workload and authorize access to a secret reference; it must not become a general plaintext secret database. Signing keys use a protected key-management strategy and are not exposed to application clients.

### 4.3 DX vs desktop

- **apps/dx:** developer workstation/control tower for building this ecosystem: repositories, local agent workers, task claims, worktrees, terminals, tests, diffs, code review and deployment workflows.
- **apps/desktop:** general desktop client for users/operators consuming the platform's products. It is not a second coding IDE.

### 4.4 Web vs A-L-L-A-H

- **apps/web:** MoonWitness public landing, narrative/research discovery and community/social system (CSS expansion remains unconfirmed).
- **apps/A-L-L-A-H:** separate flagship landing and knowledge experience focused on Divine Corpus, ontology, law and government knowledge.

Do not combine their editorial authority or rewrite one brand into the other.

## 5. Shared platform architecture

All app experiences consume shared platform capabilities:
- central identity and token verification;
- API-owned domain operations and Odoo-oriented model/record kernel;
- stable app/add-on/capability registry;
- versioned HTTP/event contracts;
- audit/correlation/observability;
- asset manifest, design tokens and accessibility;
- task registry and documentation rules.

The API should start as a modular, domain-oriented platform API unless actual scale/security requirements justify extraction. Domain modules must still have strict ownership boundaries so a future service split is possible without rewriting the domain model.

## 6. Deployment classes — not every app is a microservice

Use these provisional classes, then validate them with operational evidence:
- **Core authority services:** API; identity provider integration/service boundary.
- **Privileged control services:** DX local daemon; Cloud execution workers; OSS network adapters; RIOT lab runners.
- **Web experiences:** Web, OSS console, BSS console, Docs, A-L-L-A-H, ISP, and any RIOT studio UI.
- **Native clients:** Desktop and Mobile.
- **AI runtime:** Agent.

Separate deployment/security domains where credentials, privileges or blast radius differ. Multiple frontends may share API/domain packages and release infrastructure without being forced into one bundle.

## 7. Cross-app dependency rules

1. Every app has a named owner, purpose, threat boundary and API contract.
2. No app accesses another app's private database.
3. Apps communicate through API contracts or versioned events, not deep imports.
4. Domain packages own business logic; frontends own presentation.
5. Identity verification is centralized; authorization is enforced by the resource-owning API/domain.
6. Secrets are retrieved just-in-time from a vault; never copied through task files, logs or UI.
7. App enablement and navigation are capability/permission-aware.
8. No destructive cross-domain action without explicit approval and audit.
9. Local privileged execution (DX/Cloud/RIOT) is separated from public request handling.
10. A shared user interface does not imply shared data ownership.

## 8. Source-of-truth map

| Data | Authority |
|---|---|
| Identity, login, sessions, OIDC clients | ID/IdP |
| Commercial customer/order/subscription/invoice | BSS domain; existing Odoo remains authoritative until an approved transition |
| Network inventory, alarms, configuration, provisioning state | OSS domain and authoritative equipment adapters |
| ISP subscriber service journey | ISP domain orchestration, linking BSS and OSS |
| Infrastructure resources and deployment records | Cloud control plane and provider state |
| AI run/workflow state | Agent workflow store for execution; API owns resulting business records |
| Canon text/ontology/source provenance | Relevant A-L-L-A-H or MoonWitness corpus domain |
| Task identity/dependency/status plan | tasks.json; execution updates are serialized/atomic |
| Documentation and ADRs | version-controlled Markdown/MDX sources; docs app is a projection |
| Asset rights/version/approval | Asset registry and source provenance |

A transitional system may remain authoritative for legacy records. Record the system-of-record and synchronization direction per entity. Do not dual-write without a reconciliation design.

## 9. Integration backbone

Each request/job should carry a trace/correlation ID, actor identity reference, initiating app ID, capability ID, schema version and idempotency key where applicable. Events have producer identity and version. Consumers are idempotent and can handle replay, duplication and out-of-order delivery where relevant.

The platform should start with API + transactional outbox + Redis/BullMQ where suitable. Introduce a heavier event backbone only after measured throughput, replay and decoupling needs justify it.

## 10. Cross-app implementation sequence

1. Repository/source audit and app ownership matrix.
2. DX task/worktree orchestration foundation.
3. Base contracts, Node/pnpm workspace and architecture boundaries.
4. Central ID/OIDC integration and service identity.
5. API modularity and model kernel proof.
6. Cloud security plane and execution isolation.
7. OSS/BSS domain contracts.
8. ISP order-to-activate vertical slice.
9. MoonWitness Web and A-L-L-A-H corpus/landing foundations.
10. Docs portal and generated progress.
11. Desktop/Mobile clients.
12. RIOT isolated studio/lab.
13. Full cross-app tests, observability and release policy.

Tasks APP-* and app-specific workstreams in tasks.json govern the execution order.

## 11. Definition of done

The ecosystem has fourteen distinct app identities, documented source-of-truth boundaries, no overlapping OSS/BSS/ISP responsibilities, centrally governed identity, externalized secret storage, traceable app-to-app contracts, isolated privileged control planes, reproducible builds and an executable dependency graph. Directory count alone is not completion.