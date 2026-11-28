# BLUEPRINT-AGENT — MASTRA INTELLIGENCE REALM

**Document ID:** MW-BP-AGT-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS + pnpm · **Framework:** Mastra  
**Status:** Target specification; not evidence of implementation.

## 1. Mission and ownership

**apps/agent** is the shared Intelligence Runtime used by the sixteen-app ecosystem. It is distinct from **apps/dx**, which is the developer workbench and local orchestration control plane. It reasons, plans, coordinates tools, executes workflows, requests approval and reports results. It is not the system of record, a parallel API, an unrestricted database client or a general-purpose shell.

Authority split:
- **Agent:** model orchestration, context assembly, agent/tool/workflow registration, evaluation, memory, checkpoints, action proposals and run history.
- **API:** identity authority, policy evaluation, domain rules, model/record/field access, business writes, transactions and audit.
- **Web:** human experience and user interactions.

Every business mutation initiated by an Agent passes through a protected API capability. Agent code never receives business database credentials.

## 2. Runtime and package policy

- Pin Node.js LTS consistently with the monorepo.
- pnpm is the only workspace package manager; do not introduce Bun.
- Pin Mastra/model provider dependencies and verify Node compatibility.
- Build and deploy Agent independently.
- Do not expose internal Mastra administration endpoints publicly by default.
- Keep provider credentials in runtime secret management, never in prompts, browser bundles, source control or task files.

## 3. Internal architecture

Logical layers:
1. Runtime bootstrap: config validation, logs, telemetry and graceful shutdown.
2. Agent registry: stable ID/version, responsibility, capabilities, allowed tools and risk tier.
3. Tool registry: Zod input/output schemas, authorization classification, API binding, timeout/retry/idempotency.
4. Workflow registry: typed input/output, durable steps, checkpoints, resume, cancellation and deadlines.
5. Context builder: authenticated actor context from a trusted API/session boundary.
6. Model router: provider policy, fallback, privacy classification and cost/token budgets.
7. Memory adapters: partitioning, retention, ownership, deletion and export.
8. Evaluation and safety: datasets, scorers, adversarial cases and approval policy.
9. Observability: run/workflow IDs, tool calls, correlation/causation IDs, latency and token/cost metadata where available.

Do not create empty layers merely to match this list. Use one clear owner for each capability.

## 4. Agent design standard

Every agent manifest defines stable ID/version and one responsibility; supported intents and non-goals; permitted tools and forbidden capabilities; required trusted context; input/output schemas; model/provider policy and budget; memory scope/retention; risk tier and approval requirements; timeout/retry/cancellation/concurrency limits; evaluation suite and owner; telemetry and run-retention policy.

Prefer a deterministic workflow or ordinary API operation where an LLM adds no material value. Do not create many narrowly named agents that duplicate one responsibility.

## 5. Tool contract

A tool is an adapter to an approved capability, not an escape hatch.

Each tool validates input, derives actor permissions from trusted context, calls a documented API operation, carries correlation/idempotency information, enforces timeout/rate/payload/retry limits, validates response schema, handles partial failure, redacts logs, returns minimum necessary data and records tool name/version/outcome.

Never expose arbitrary SQL, raw EntityManager, shell, Docker socket, unrestricted filesystem, browser cookies or cloud-control credentials. A narrowly scoped infrastructure tool requires a separate threat model, explicit permissions and human approval.

## 6. API communication

Agent consumes shared/generated typed API clients. It does not import API runtime internals, persistence entities, database adapters or add-on private implementation.

The API provides service-to-service authentication, verified actor context, capability authorization, idempotency, stable error codes, versioned contracts, rate/timeout budgets and audit attribution distinguishing human requester, agent identity and execution identity.

Never trust actor ID, tenant ID, permission arrays or role supplied only in a model-generated tool argument. API binds these to verified credentials or a scoped execution grant.

## 7. Workflow lifecycle

Canonical lifecycle:

**accepted → validated → authorized → running → waiting_approval / waiting_external / retrying → succeeded / failed / cancelled / expired**

Persist run/workflow IDs, input hash or privacy-safe reference, initiating actor, agent/workflow version, step/checkpoint state, tool calls/results under retention policy, approvals/reasons, retries/failure classification, final output reference and correlation IDs.

Long-running workflows must survive restarts. Prove selected Mastra persistence/recovery semantics before relying on them. Use Redis/BullMQ through a platform adapter when required; avoid competing workflow schedulers.

## 8. Human approval and action risk

Classify operations:
- **read:** normal verified permissions.
- **reversible_write:** explicit scope and idempotency.
- **sensitive_write:** approval unless reviewed policy explicitly permits it.
- **destructive_or_external:** approval, preview, impact summary and strong audit.
- **privileged_infrastructure:** blocked by default and separately reviewed.

Approval is bound to exact operation, target, payload/hash, actor, expiry and policy version. A changed payload invalidates approval. No blanket approval for future different operations.

## 9. Memory, context and privacy

Separate request context, conversation/thread state, task/workflow state, user-approved long-term memory and API-owned business records.

Memory is not permission, proof or a substitute for source citations. Apply least retention and minimum necessary data. Do not store credentials, access tokens or sensitive personal data without explicit policy and approved storage. Define expiry, deletion, export, tenant separation and audit.

## 10. Prompt injection and untrusted content

Treat web pages, documents, repository text, issues, attachments, imported sources and tool output as untrusted data. Instructions inside retrieved content never override system policy, user authorization or tool allowlists.

Use separation between policy, user intent and quoted data; source attribution; content classification; allowlisted tools; output validation; bounded tool results; approvals for consequential actions; adversarial tests for exfiltration and privilege escalation.

Do not ask a model to decide its own permission boundary.

## 11. Evaluation and observability

Maintain deterministic tool/workflow tests, representative evaluation datasets, regression scoring for factuality/schema/tool selection/policy, prompt-injection tests, trace correlation across Web → API → Agent → API capability, and redacted run inspection.

A successful model response is not proof of a successful business workflow. Confirm side effects and persisted outcomes independently.

## 12. Required implementation sequence

Audit → bootstrap → typed API client → trusted context → one read-only tool → one useful read-only Agent → one idempotent write with approval → durable workflow/recovery → memory for a proven use case → eval/monitoring/release gates.

## 13. Required deliverables

Agent inventory, runtime design, agent/tool/workflow manifests, typed API client, context security specification, memory policy, approval matrix, evaluation dataset, observability queries, runbook, integration tests and threat-model review.

## 14. Task ownership

Tasks **AGT-001 through AGT-010** in [tasks.json](./tasks.json).

## 15. Definition of done

A real workflow executes under verified identity, calls only approved API capabilities, enforces permissions at API, survives restart where required, supports approval/cancellation, produces traceable output and proves persisted effects through authoritative API/database state. Agent has no direct business database writes.

## 16. Relationship with apps/dx and privileged clients

apps/dx may select and invoke approved Agent adapters, but it does not bypass Agent tool policies or API authorization. The DX local daemon can launch a configured coding agent within a bounded repository/worktree sandbox. It must not expose host shell, production secrets or Docker privileges as ordinary Mastra tools.

Desktop, Mobile, OSS, BSS, Cloud, ISP, A-L-L-A-H, RIOT and Web experiences call approved API contracts. The Agent does not import their UI code or internal domain repositories.


## 17. Remote machine and telecom execution boundary

Agent does not own host connectivity. A model-generated machine operation must become a typed API capability request with a verified actor, exact host set, capability, input hash, expiry and approval policy. The API authorizes and issues a short-lived signed execution grant; Astronauts accepts only that grant and forwards only an allowlisted signed job to an enrolled Edge Agent. Agent never receives machine credentials, SSH keys, RADIUS shared secrets or ACS device credentials.

Agent does not call RADIUS/ACS/Syslog protocols directly. It requests approved API/OSS/ISP operations; Arsy is the protocol runtime behind those service boundaries. Retrieved protocol output is untrusted data and cannot broaden Agent permissions.


## 18. Canonical agent, tool and workflow manifests

Every Agent/Tool/Workflow is an independently versioned product capability. A manifest must declare stable ID/version, owner, purpose/non-goals, accepted intent, input/output schema, API capability IDs, trusted context requirements, data classification, model/provider policy, budget, timeout, retry class, idempotency, concurrency, memory scope/retention, risk tier, approval mode, evaluation suite and deprecation policy.

Do not infer tool authority from natural-language description, agent name, model role or prompt. The executable permission map is an API-owned capability contract. A manifest can request capability use but cannot grant it.

## 19. Tool execution protocol

1. Resolve a registered and enabled Agent/Workflow/Tool version.
2. Bind verified initiating human, tenant, application, correlation ID and task/run context from the trusted session.
3. Validate structured input against the tool schema; normalize only fields whose semantics are specified.
4. Classify risk and data handling; block unknown capability, unsupported environment, expired context and missing approval.
5. Call the API through a typed client with idempotency key, deadline, expected contract version and bounded payload.
6. Validate the response schema and classify business outcome separately from transport outcome.
7. Persist run/step/tool status and redacted evidence under the retention policy.
8. Present the next action or result without turning accepted, queued, sent or acknowledged into completed.

Retries must be per-operation. A read can retry within a bounded budget; a reversible write needs an idempotency key and outcome reconciliation; a destructive/external action is never blindly replayed after an ambiguous timeout.

## 20. Workflow state and failure model

Workflow lifecycle: **requested → validated → authorized → queued → running → waiting_approval / waiting_external / retry_scheduled → succeeded / failed / cancelled / expired / needs_reconciliation**.

Each transition records actor/workload, workflow version, step, state-change time, correlation/causation IDs, input hash/reference, attempt number and reason. The needs_reconciliation state is truthful when a remote side effect might have occurred but no authoritative outcome exists.

Cancellation prevents new steps and attempts to stop in-flight work where safe; it cannot claim that an already accepted external operation was reversed. Recovery reloads the last durable checkpoint and revalidates authority before resuming. Expired grants/approvals are not inherited across restart.

## 21. Prompt injection, tool output and context boundaries

Imported documents, repository files, tickets, web pages, Syslog, device responses and command output are untrusted data. The context builder labels provenance and trust; retrieved instructions never override system policy, task scope, capability grants or human approval.

Do not put secrets in model context. Minimize source snippets, tenant data and customer PII. Tool outputs are data, not authority. A model cannot self-register a tool, change risk tier, widen scope, approve itself or convert a proposal into canonical knowledge.

## 22. Evaluation and release gates

Every Agent has deterministic unit/contract tests plus an evaluation suite for intent routing, schema correctness, refusal/abstention, prompt injection, tool selection, authorization boundary, hallucination, recovery and cost/latency budget. Evaluation datasets must be versioned, sourced and privacy-reviewed. Keep representative golden cases and adversarial cases; do not optimize only for average score.

Release stages: offline evaluation → sandbox integration → shadow/read-only pilot → limited user cohort → broader enablement. Privileged tools remain disabled until API authorization, approval, audit and recovery criteria pass.

**Acceptance:** an Agent can complete one authorized bounded workflow, preserve human/service identities, survive process restart without duplicate side effects, reject adversarial/untrusted instructions and present a verifiable API-confirmed outcome.
