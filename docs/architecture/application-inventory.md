# MoonWitness application inventory

**Audit date:** 2026-11-27  
**Audited commit:** `c1c604801e4bbde982a44689aac7b6c48b1978ee`  
**Authority:** `BLUEPRINT-APPLICATIONS.MD` and `tasks.json`  
**Task:** APP-001

## Finding

The target architecture contains exactly fourteen application surfaces. The current Git tree contains only `apps/README.md`; none of the fourteen application directories or application source packages has been materialized. This is a planning-to-implementation baseline, not a runnable application inventory.

An app directory is a product/runtime boundary, not an automatic microservice, database or separate deployment.

## Canonical inventory

| # | Path | Purpose / owner | Repository state | Boundary / open point |
|---:|---|---|---|---|
| 1 | `apps/agent` | Mastra AI orchestration, agents and workflows / Agent Engineering | Not materialized | Executes approved tools; no direct business DB writes |
| 2 | `apps/api` | Fastify platform authority and business APIs / Platform/API Engineering | Not materialized | Business use cases, authorization, transactions and records |
| 3 | `apps/web` | MoonWitness public landing and Community / MoonWitness Product | Not materialized | CSS expansion is explicitly unconfirmed; preserve as an open question |
| 4 | `apps/OSS` | Network/service operational support / Network Operations | Not materialized | Technical inventory, alarms, provisioning and assurance |
| 5 | `apps/BSS` | Commercial/customer lifecycle / Business Operations | Not materialized | Customer, offer, order, contract, subscription and billing authority |
| 6 | `apps/id` | Central identity, login, OIDC/SSO and federation / Security & Identity | Not materialized | Authentication/identity; resource owners still authorize |
| 7 | `apps/docs` | Documentation, wiki, DX knowledge and progress portal / Documentation & DX | Not materialized | Projects canonical docs/task state; does not own a second task ledger |
| 8 | `apps/desktop` | General end-user/operator desktop experience / Client Experience | Not materialized | Not a developer IDE or DX replacement |
| 9 | `apps/mobile` | Native mobile experience / Mobile Product | Not materialized | Uses approved identity/API contracts |
| 10 | `apps/cloud` | Cloud/infrastructure business control plane / Cloud Platform | Not materialized | Desired state and policy; privileged apply runs in isolated execution plane |
| 11 | `apps/isp` | ISP/telco vertical service lifecycle / ISP Product | Not materialized | Owns subscriber-service orchestration between BSS and OSS |
| 12 | `apps/dx` | Developer Experience workbench and local engineering orchestration / Developer Platform | Not materialized | Developer workstation/control tower; privileged daemon separate from UI |
| 13 | `apps/A-L-L-A-H` | Flagship landing and Divine Corpus/Ontology/Law/Government Knowledge / Corpus & Knowledge Product | Not materialized | Separate editorial/corpus authority from MoonWitness Web |
| 14 | `apps/riot` | Creative/media/content studio and isolated red-team/blue-team lab / Creative & Security Lab | Not materialized | Public studio and privileged lab execution must remain isolated |

## Ownership overlap review

The blueprints define the following distinctions; they are not duplicate ownership:

- **Agent vs DX:** Agent owns model/agent/workflow runtime; DX owns engineering task coordination, worktrees and local coding-agent execution.
- **Desktop vs DX:** Desktop serves general users/operators; DX serves developers and the implementation factory.
- **Web vs A-L-L-A-H:** Web owns MoonWitness landing/community; A-L-L-A-H owns its separate flagship knowledge experience.
- **BSS vs ISP vs OSS:** BSS owns commercial truth; ISP owns subscriber-service journey/orchestration; OSS owns network and technical operational truth.
- **ID vs API vs vault:** ID authenticates; API/domain owners authorize resources; a dedicated vault/KMS owns secret values.
- **Cloud vs OSS vs RIOT:** each owns a different resource/security domain; privileged runners must not be shared as ambient host access.
- **Docs vs tasks.json:** docs renders/presents status; tasks.json remains the sole canonical execution ledger.

## Open questions / unknowns

1. The meaning of **CSS** in the Web/Community description remains unconfirmed. Do not expand the acronym or implement a feature based on a guess.
2. No application source, runtime manifest, route, API contract or deployment definition exists in this audited tree; runtime maturity and operational ownership beyond the blueprints remain unverified.
3. No separate deployment or database boundary has been proven necessary for any app. Start modular and split only with evidence.
4. Detailed owners are role/team labels from the blueprint; named individual maintainers are not specified.

## Evidence and verification

- Recursive Git tree at the audited commit: 72 entries; response was not truncated.
- Under `apps/`, the only tracked entry is `apps/README.md`.
- The fourteen target paths and roles match `BLUEPRINT-APPLICATIONS.MD`.
- No source code was created and no application is marked implemented by this audit.

**Review state:** ready for product-owner review. The CSS ambiguity and named maintainer assignments remain open.
