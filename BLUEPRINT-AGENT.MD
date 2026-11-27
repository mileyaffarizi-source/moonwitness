# BLUEPRINT-AGENT — MASTRA INTELLIGENCE REALM

**Document ID:** MW-BP-AGT-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS + pnpm · **Framework:** Mastra  
**Status:** Target specification; not evidence of implementation.

## 1. Mission and ownership

**apps/agent** is the Intelligence Realm. It reasons, plans, coordinates tools, executes workflows, requests approval and reports results. It is not the system of record, a parallel API, an unrestricted database client or a general-purpose shell.

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