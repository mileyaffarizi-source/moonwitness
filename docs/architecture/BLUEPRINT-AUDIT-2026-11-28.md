# MoonWitness Blueprint & Task Architecture Audit

**Audit date:** 2026-11-28  
**Repository:** mileyaffarizi-source/moonwitness  
**Scope:** all root blueprints, application inventory, dependency graph, ADRs, contributor rules, task registry, validator and engineering quality gates.  
**Status:** deep review; corrective documentation and task decomposition in progress.  
**Authority:** source files at the audit branch revision. This report does not prove planned applications are implemented.

## 1. Executive assessment

The repository is a planning/foundation monorepo transitioning toward executable products. Its strongest foundations are explicit app/domain roles, an API authority boundary, Odoo ownership safeguards, security-oriented workflow rules, one canonical task ledger, and specialist blueprints for ISP/telecom and creative domains.

The main weaknesses were incomplete operational contracts and insufficiently enforced cross-document invariants:

1. Several documents described intent but did not define enough state, failure, reconciliation, ownership and acceptance semantics for independent implementation.
2. The master blueprint contained inherited “three realms / three deployable apps” phrasing that conflicted with the sixteen-app/four-plane topology. The creative canon phrase “Three Realms” is preserved as authored narrative language and explicitly separated from technical plane count.
3. Package and Web blueprints still described fourteen apps; these have been aligned to sixteen.
4. The app hand-off model needed stronger producer/consumer contracts for API↔Astronauts, ISP↔Arsy, OSS↔Arsy and Cloud↔Astronauts.
5. The task registry had no formal parent/subtask/integration model, did not verify workstream membership against task records, and did not verify project counts against canonical arrays.
6. Fifty-two tasks were sized XL despite representing multiple separately testable outcomes; eleven add-on records also retained legacy duplicate fields.
7. The dependency graph document described a historical Node 22/pnpm 10 baseline as if it were current. It must distinguish historical observed state from the current target and never synthesize package edges from blueprint labels.
8. Application directories/README anchors are not implementation evidence. Astronauts and Arsy remain planning-only; no production machine or network integration is claimed.

## 2. Repository truth vs architecture target

| Area | Observed truth in this audit | Target stated by the blueprints |
|---|---|---|
| Node monorepo | Node.js 26.13.1 and pnpm 12.24.0 are pinned in the PR branch; frozen install and canonical Node quality gate passed on the checked CI head | Node/TypeScript apps stay on one exact Node 26 major line |
| Go / Rust | Astronauts and Arsy currently have planning anchors only | Go Controller + Edge Agent; Rust RADIUS/ACS/Syslog runtimes |
| Apps | Sixteen identities are inventoried; most app source packages are not yet materialized | Sixteen bounded app surfaces; only justified trust/scale boundaries become services |
| Shared packages | Workspace patterns and package blueprint exist; the complete app/package graph is not yet materialized | Node packages have explicit exports; Go and Rust keep native module/lockfile boundaries |
| Tasks | tasks.json is the only execution/status ledger | A validated DAG with atomic tasks, evidence, ownership, parent/child and cross-workstream contracts |
| Odoo | Legacy Odoo remains authoritative for existing Odoo-owned entities until explicit entity-level cutover | Version-aware API integration, no direct MikroORM writes to Odoo-owned tables |
| Telecom systems | Vendor/NAS/ONT/CPE/protocol compatibility has not been proven by Arsy code; no executable Arsy runtime exists yet | RADIUS AAA, CWMP ACS and Syslog adapters behind ISP/OSS domain ownership |
| Hosts | No Astronauts host enrollment or remote execution is implemented | Explicitly enrolled machines, outbound mTLS, signed typed jobs and attributable results |

## 3. Blueprint coverage and review result

| Blueprint | Domain/role | Audit result and required invariant |
|---|---|---|
| BLUEPRINT.md | Platform master | Align deployment language, four-plane model, per-language builds and true implementation status. Narrative “Three Realms” remains canon, not architecture. |
| BLUEPRINT-APPLICATIONS.MD | Sixteen-app topology | Primary ownership map. Producer/consumer hand-off matrix and definition-of-ready added. |
| BLUEPRINT-RULES-GOVERN-CONTRACT.MD | Governance and engineering law | Add atomic task decomposition and machine-checkable registry invariants. |
| BLUEPRINT-PACKAGE.MD | Node packages and cross-language package boundaries | Separate pnpm from Go modules and Cargo workspace; do not create package placeholders. |
| BLUEPRINT-PACKAGE-ADDON.MD | Add-on lifecycle and trust | Runtime execution remains disabled while its security decision is Proposed; a valid manifest is not a sandbox. |
| BLUEPRINT-AGENT.MD | Mastra Intelligence Runtime | Agents reason/propose; API authorizes; prompt/tool output is untrusted; remote host dispatch is only through API grants and Astronauts. |
| BLUEPRINT-API.MD | Fastify authority and model kernel | API remains the resource authorization point and owner of transactions, records, event outbox and audit. |
| BLUEPRINT-ID.MD | OIDC, sessions and workload identity | Identity authenticates; domains authorize; vault stores secret values; human/workload/target identity remain distinct. |
| BLUEPRINT-WEB.MD | MoonWitness landing and Community | UI state must match API truth; Community/CSS is unresolved and cannot be invented. |
| BLUEPRINT-BSS.MD | Commercial domain | Commercial records and immutable financial documents belong to BSS; usage evidence is not automatically a charge/invoice. |
| BLUEPRINT-ISP.MD | Subscriber/service lifecycle | ISP owns service orchestration/entitlement; state transitions require evidence and reconciliation. |
| BLUEPRINT-OSS.MD | Network inventory, assurance and provisioning | OSS owns resource inventory, incidents, change approval and observed-state verification; Arsy is a protocol adapter. |
| BLUEPRINT-CLOUD.MD | Provider/IaC/resource lifecycle | Cloud provisions provider resources; Astronauts enrolls/operates hosts only after creation. |
| BLUEPRINT-DX.MD | Developer workbench | DX owns local developer workspace and bounded local execution; remote hosts require API grant + Astronauts. |
| BLUEPRINT-DOCS.MD | Documentation and progress portal | Docs is a read-only projection of versioned sources, tasks and CI evidence; it is not a second ledger. |
| BLUEPRINT-DESKTOP.MD | General desktop client | Native capabilities are typed, scoped and audited; Desktop is not DX. |
| BLUEPRINT-MOBILE.MD | Native mobile client | Secure session storage, private push, per-domain offline rules and API re-authorization. |
| BLUEPRINT-RIOT.MD | Creative studio and isolated security lab | Exercise requires exact signed-off scope, isolated identity/egress, kill switch and cleanup. |
| BLUEPRINT-A-L-L-A-H.MD | Corpus, ontology, law and government knowledge | Source/translation/commentary/legal analysis remain separate; claim support and law currency need provenance. |
| BLUEPRINT-NARATION.MD | Creative canon | Preserve exact strings and uncertainty; source-recorded is not the same as verified relationship. |
| BLUEPRINT-DESIGN-ASSETS.MD | Asset governance | Each production derivative must link to an editable master, rights and review record. |
| BLUEPRINT-ASSETS-UI.MD | UI tokens/primitives/motion | World themes cannot weaken status semantics, accessibility or operational truth. |
| BLUEPRINT-ASSETS-SFX.MD | Audio behavior | Sound is optional and bound to semantic state changes; it cannot imply success. |
| BLUEPRINT-ASSETS-ARTWORK.MD | Artwork and environments | Brief/source/rights/review/real-screen placement are required. |
| BLUEPRINT-ASSETS-CHARACTER.MD | Character and alias canon | Alias resolution is evidence-based; restricted depictions remain blocked. |
| BLUEPRINT-ASSETS-VECTOR-LOGO-ICON.MD | Marks and icons | Source masters, identity meaning, SVG sanitization and accessible semantics are required. |
| BLUEPRINT-ASTRONAUTS.MD | Go machine control | Controller/Edge Agent identity, signed job envelope, typed capability, durable state and reconciliation are explicit. |
| BLUEPRINT-ARSY.MD | Rust telecom protocols | RADIUS auth/accounting, CWMP RPC and Syslog source trust have distinct state, identity and failure semantics. |

## 4. Cross-domain ownership invariants

### 4.1 Identity and authority

- ID/IdP verifies the human or workload identity.
- API/resource owner decides authorization for the resource and operation.
- Vault/KMS stores protected secret values.
- An approval is bound to exact target, operation, payload/version, expiry and actor; it is not a blanket capability.
- Every privileged trace distinguishes initiating human, executing workload and target resource/device.

### 4.2 Infrastructure and machine operations

- Cloud owns provider account/resource/IaC state and resource lifecycle.
- Astronauts owns only explicitly enrolled host identity, heartbeat, host inventory, signed job lifecycle and machine execution evidence.
- DX owns developer worktrees, local coding-agent process, build/test and diff/review.
- Agent does not receive shell, Docker socket, SSH key or host credentials.
- Cloud resource deletion must explicitly revoke/decommission the corresponding Astronauts machine identity where enrolled.

### 4.3 Subscriber and network operations

- BSS owns commercial offer, order, contract, invoice, payment and collections.
- ISP owns subscriber service instance, entitlement and service lifecycle.
- OSS owns network inventory/topology, alarms/incidents, provisioning workflow, change approval, rollback and technical assurance.
- Arsy owns protocol listeners/session state/normalized RADIUS, CWMP and Syslog evidence.
- PPPoE termination remains on NAS/BRAS/BNG; Arsy is RADIUS AAA, not the access concentrator.
- An Accounting-Start is not an invoice; a CWMP acknowledgement is not proof of observed device configuration; Syslog is not automatically an incident.

### 4.4 Knowledge, narrative and media

- Original source, translation, commentary, claim, ontology assertion and AI-generated summary have distinct types and provenance.
- Community/UGC is not canon or editorial truth by popularity.
- The authored “Three Realms” phrase is retained as narrative language; the technical topology is four planes.
- Unresolved canon (including the missing ninth-world name and ambiguous aliases) remains unresolved until a real source is found.
- Rights review and content restrictions apply to source assets and derivatives.

## 5. Task registry audit findings

At the start of this audit the registry contained 266 tasks, 27 workstreams and 16 app identities. It had three structural weaknesses:
1. Workstream references were stored separately from each task's workstream field without an enforced bijection; new AST/ARS records used short codes instead of the display/workstream names.
2. The registry lacked task type, parent task and child task links, so integration work could not be formally distinguished from atomic work.
3. XL tasks combined several independent outcomes and could be claimed as one large task. Eleven add-on records duplicated canonical fields with legacy aliases.

Corrective task model:
- task: one atomic bounded unit;
- subtask: one independently testable piece with a parent reference and disjoint path ownership;
- integration: a parent/report task that depends on all children and owns only integration evidence/report paths.

Every task must have one workstream, one owner role, exact paths, explicit dependencies, inputs, exclusions, deliverables, acceptance criteria and verification. A child cannot depend on its parent. A parent cannot own a child's source paths. XL implementation work must be decomposed before becoming claimable.

## 6. Prioritized unresolved architecture decisions

| Priority | Decision/discovery | Owner | Why it must stay open |
|---|---|---|---|
| P0 | Go controller transport, certificate issuer/rotation and HA model | Astronauts | Must pass a network/host proof of concept and threat review. |
| P0 | NAS vendor inventory and actual RADIUS password methods/credential source | Arsy + ISP | PAP/CHAP/MS-CHAP/EAP have different credential requirements; cannot assume hash compatibility. |
| P0 | CPE vendor/model/CWMP compatibility and allowed RPC set | Arsy + OSS | ACS success needs observed postcondition on the actual device estate. |
| P0 | Syslog sources, trust boundary, rates, message formats and retention | Arsy + OSS | UDP source identity and flood behavior require measured network design. |
| P0 | API-issued grant schema and delegated workload identity | API + ID + Astronauts | Remote operations must preserve human/workload/target attribution. |
| P1 | IdP provider, MFA/recovery policy and vault/KMS | ID + Security | Must be selected by security/deployment proof, not brand preference alone. |
| P1 | Cloud provider(s), IaC tool, state backend and account layout | Cloud | Must account for tenancy, budget, state locking and runner isolation. |
| P1 | Odoo version/entity authority and per-entity sync/cutover rules | API + BSS + ISP + OSS | No direct-table migration or dual master. |
| P1 | Community/CSS intended meaning and moderation scope | Web/Product | Acronym remains unconfirmed; requirements discovery only. |
| P1 | Creative canon missing ninth-world source and alias relationships | Narrative editor | Do not infer missing canon. |
| P1 | Actual application deployment grouping and service boundaries | Platform | Sixteen app directories do not imply sixteen microservices. |

## 7. Delivery gates

1. **Discovery gate:** source/vendor/host inventory and current-state truth are documented.
2. **Contract gate:** resource owners, identity, schemas, error states, idempotency, correlation and version compatibility are reviewed.
3. **Security gate:** threat model, least privilege, secret policy, approval and kill switch pass.
4. **First runnable slice:** one small non-production end-to-end workflow per domain.
5. **Failure gate:** restart, replay, timeout, stale state, revocation, partial result and manual recovery are tested.
6. **Production readiness:** measured capacity/SLO, operator runbooks, backup/restore, access review and explicit human approval.

No app is implemented by directory existence. No task is done by a commit, a plan or an unverified self-report.
