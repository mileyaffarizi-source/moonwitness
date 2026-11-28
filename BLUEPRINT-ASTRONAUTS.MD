# BLUEPRINT-ASTRONAUTS — GO MACHINE CONTROL PLANE & EDGE AGENT

**Document ID:** MW-BP-AST-001 · **Version:** 1.0.0  
**Status:** Accepted architecture / implementation pending  
**Parent:** [BLUEPRINT-APPLICATIONS.MD](./BLUEPRINT-APPLICATIONS.MD) · **Tasks:** [tasks.json](./tasks.json)  
**Runtime:** Go 1.27.4 · one module / two independently deployed binaries

## 1. Mission

**apps/astronauts** is the governed machine-control bridge between MoonWitness platform capabilities and explicitly enrolled local/remote hosts. It provides one Controller control plane and a lightweight Edge Agent installed on each managed machine.

It fills the missing layer between an authorized platform request and a host. It is not a general-purpose remote shell, an AI agent with ambient root privileges, a cloud provider controller or a replacement for DX.

**Controller coordinates. Edge Agents connect. API authorizes. Humans remain in control.**

## 2. Exact ownership boundary

| Component | Owns | Does not own |
|---|---|---|
| apps/agent | AI reasoning, plans and approved tool/workflow invocation | Host identity, machine credentials, direct Agent-to-host channel |
| apps/api | Verified actor, authorization, approval, business rules, signed execution grants and audit attribution | Host daemon, arbitrary machine command execution |
| apps/dx | Developer workspace, Git worktree, coding-agent process, local build/test and diff evidence | General enrolled host fleet and operational machine lifecycle |
| apps/cloud | Cloud accounts, IaC, compute/storage/network resource creation and deployment intent | Post-provisioning host command execution |
| **Astronauts Controller** | Machine enrollment registry, certificates, heartbeat, host inventory, desired agent state, job queue/dispatch, job execution state and evidence | Cloud resource creation, subscriber/device/NMS truth, commercial/business writes |
| **Astronauts Edge Agent** | Host identity, connection, local capability execution, health and signed result reporting | General shell/SSH server, unbounded filesystem, arbitrary script runner |
| apps/OSS | Network/resource inventory, incidents, provisioning workflow, approvals and service assurance | Generic compute host fleet controller |
| Vault/KMS | Secret values and protected signing keys | Business policy or fleet scheduling |

Astronauts owns its operational fleet/control records in its own store. It references API/Cloud/OSS entities by stable IDs; it never shares their private databases.

## 3. Logical architecture

### 3.1 Controller

The Controller is a separate service in a management trust zone:

1. **Enrollment & identity:** one-time scoped enrollment, machine identity, certificate issue/renewal/revocation and quarantine.
2. **Fleet registry:** machine ID, approved labels/groups, OS/architecture/runtime, installed agent version, observed capability manifest, heartbeat and freshness.
3. **Control protocol:** versioned request/response envelopes, server identity, signatures, expiry, nonce, schema compatibility and correlation.
4. **Job coordinator:** queues, target selection, leases, delivery, acknowledgements, status, retry classification, deadline, cancellation and recovery.
5. **Policy/grant verifier:** verifies API-signed, exact-scope grants; it never decides business permission from model-supplied roles.
6. **Evidence & audit:** actor/request references, grant hash, job ID, target, capability, input hash, timestamps, result class, policy version and redacted output references.
7. **Operations:** liveness/readiness, telemetry, HA/recovery, kill switch and agent update orchestration.

The Controller must not become the API's shadow authorization database. It verifies short-lived signed grants from the API authority.

### 3.2 Edge Agent

The Edge Agent is one lightweight Go binary that can run as a system service on supported Linux/Windows hosts. The initial target matrix must be evidence-based; do not promise every OS/architecture before testing.

- Establishes an **outbound** long-lived authenticated channel to the configured Controller. No inbound firewall port is required for normal operations.
- Uses a unique machine identity and mutual TLS. It rejects unknown Controller identities and untrusted certificates.
- Validates each job's issuer, audience, target machine, capability, schema version, signature, expiry, nonce/idempotency and grant reference before execution.
- Exposes only a locally registered typed capability set. The requested capability must be present, enabled and within local policy/resource budgets.
- Reports signed acknowledgements, outcomes, bounded telemetry and sanitized failure reasons.
- Reconnects with bounded exponential backoff and jitter; never repeats an expired or non-idempotent job automatically.
- Supports safe shutdown, certificate rotation/revocation, quarantine, kill switch and verified staged update.

Controller and Edge Agent are separate binaries/processes with separate service identities and configuration profiles, even if they share one Go module.

## 4. Request and execution flow

1. A human/operator starts a task from Web, DX, Desktop or an approved workflow.
2. Agent/DX submits a typed operation request to the documented API capability.
3. API authenticates the caller, checks resource ownership and capability permission, evaluates risk, obtains exact approval where required and produces a short-lived signed grant.
4. The grant binds at minimum: issuer, audience, actor reference, initiating application, machine ID/set, capability ID/version, canonical payload hash, policy version, approval reference, issued-at, expiry, unique grant ID/nonce and idempotency key.
5. Controller validates the grant signature, issuer/audience, expiry, revocation state, allowed host and capability. It creates a durable job envelope bound to the grant and request.
6. The eligible Edge Agent receives the job over its existing outbound mTLS channel and independently verifies the job/grant binding and local policy.
7. The Agent executes one typed capability with CPU/memory/time/output limits and sends acknowledgement/result.
8. Controller persists execution evidence and emits a versioned result event to API. API records platform-side attribution and returns a status projection to the initiating app.
9. On timeout/disconnect, state is explicit (unknown/reconciling/failed/cancelled); never report success from a command dispatch alone.

**Human authority:** approval is tied to the exact host, capability, input hash, environment and expiry. A changed target or payload invalidates approval.

## 5. Protocol and contract choices

- **Starting transport candidate:** bidirectional gRPC over HTTP/2 + TLS/mTLS for Controller ↔ Agent. Confirm on supported networks, reverse proxies and host platforms in the protocol PoC before freezing the contract.
- **Serialization:** versioned protobuf contract candidate; include a stable job envelope and typed capability payloads. Do not ship arbitrary command strings, shell fragments or model output as executable protocol fields.
- **Identity:** unique machine certificate, short-lived enrollment grant, rotation/revocation and issuer/audience checks. Evaluate SPIFFE/SPIRE or another workload identity integration in an ADR rather than inventing an identity protocol.
- **Durability:** persist job state before dispatch; idempotency and reconciliation after reconnect; transactional outbox for cross-platform events.
- **Security:** TLS 1.3 where supported, modern cipher suites, key separation, anti-replay and request/body/connection limits; crypto policy belongs in reviewed shared contracts.

Do not introduce Kafka or a second general-purpose workflow scheduler at the start. Use an app-owned durable job store and API/outbox event integration; scale only when measured.

## 6. Capability model — no arbitrary shell

Capabilities are explicit, versioned, typed operations. The first slice is read-only:

- host identity and basic OS/architecture facts;
- agent version and service health;
- bounded CPU, memory, disk and network interface summaries;
- status of an allowlisted service;
- a bounded diagnostic report with redaction and output caps.

Later reversible operations (such as restarting one allowlisted service) require separate risk classification, typed arguments, exact host targeting, approval policy, idempotency and verified postcondition.

Forbidden by default:

- arbitrary shell, PowerShell, exec/eval or remote terminal;
- Docker/container-runtime socket or privileged container control;
- unrestricted filesystem browsing, upload/download or recursive collection;
- host root/admin impersonation, SSH private-key export or ambient credentials;
- arbitrary binary/script/plugin download and execution;
- firewall, network interface, route, package or kernel changes without a separate capability ADR and production approval;
- model-controlled capability registration or policy changes.

Every capability must declare inputs/outputs, target scope, permission, risk, data classification, timeout, resource limits, idempotency, retry behavior, approval and postcondition.

## 7. Security, trust and operations

Threat-model malicious/compromised host, Controller takeover, enrollment-token theft, certificate theft, replay, forged grant, stale policy, target substitution, agent downgrade, malicious capability, command-output exfiltration, denial-of-service and controller/agent split-brain.

Required controls:

- short-lived one-time enrollment grant; explicit inventory approval or quarantine;
- mTLS identities, rotation, revocation and pinned trusted issuer policy;
- API-signed exact-scope grant and Controller-signed job; independently checked by the Agent;
- canonical payload hash, expiry, nonce, replay cache and idempotency;
- least-privilege OS service account; no root by default;
- capability allowlist compiled/registered from reviewed code; no runtime remote executable extensions;
- secure local config/key storage; Vault/KMS access for server secrets only;
- output limits/redaction, structured audit and tamper-resistant retention;
- network egress restrictions, backpressure, bounded queues and rate limits;
- fleet kill switch, host quarantine, certificate revoke and incident runbook;
- staged signed agent release, version floor/rollback and downgrade protection.

Production operation needs an operator approval matrix, emergency break-glass process, on-call runbook and tested recovery.

## 8. Deployment and scaling

- Controller: deploy in a restricted management/control network; expose only authenticated agent ingress and narrowly scoped internal API.
- Edge Agent: deploy as a service/daemon on explicitly registered target hosts; outbound connectivity only.
- Start with one Controller deployment and a durable app-owned store. Add HA/partitioning after connection/job-count measurements.
- Controllers may be sharded by region/site; each agent has one active control owner and a safe failover strategy.
- No Kubernetes requirement; Docker/Compose or a small system service can run the Controller.
- Do not co-host Controller with public AI/web request processes when it increases the host privilege blast radius.

## 9. Observability and recovery

Trace from API request → grant → Controller job → target machine → capability → result → API projection. Record source/target and observed time. Metrics include connected/stale agents, enrollment failures, certificate age/rotation, pending jobs, queue age, delivery/ack latency, execution duration, failure/cancel/retry counts, reconnects and update status.

A disconnect during mutation must not be reported as success or automatically retried. Reconcile actual host state through a safe read-only capability. Retention must minimize host-identifying/PII data; never log secret values or unrestricted command output.

## 10. Required implementation phases

1. Read-only fleet/host/environment inventory.
2. Architecture, threat model and API/grant/protocol contract.
3. Reproducible Go module/toolchain and separate Controller/Agent binaries.
4. Controller health/configuration and outbound Agent connection.
5. Enrollment, machine identity, cert rotation/revocation, fleet heartbeat.
6. Versioned signed job envelope and durable dispatch/cancel/recovery.
7. Read-only capabilities and evidence.
8. Exact-scope signed grants and bounded executor; production changes remain gated.
9. Observability, audit, signed agent update and rollback.
10. Non-production end-to-end security test and operational review.

Atomic work is tracked by AST-001 through AST-014 in tasks.json.

## 11. Definition of done

A non-production host can be enrolled, establish outbound mTLS, appear with truthful freshness, receive a signed and exact-scope API-authorized typed read-only job, validate the grant independently, return verifiable evidence, reconnect/recover without duplicate side effects and reject expired/replayed/wrong-target/modified-payload jobs. No unrestricted host interface or business DB credential exists.

## 12. Toolchain baseline

Go 1.27.4 is the current stable release verified on 2026-11-28. Pin the toolchain in the module/build workflow and re-check the official release page before implementation: https://go.dev/doc/devel/release. Dependencies remain open until the transport and security PoC selects them.


## 13. Normative machine identity and job envelope

Machine ID is generated by the enrollment authority and never derived solely from hostname/IP/MAC, because these can change or collide. Enrollment binds a one-time invitation to a verified owner/resource reference, intended environment, allowed agent version/platform and expiry. Re-enrollment requires explicit policy; cloning a disk/image must not clone a usable private identity.

A machine certificate identifies one enrolled agent instance and its controller audience. Store private keys in an OS-protected store where available; prohibit logging/export. Rotation supports overlap and acknowledgement, then revokes the prior certificate. Revocation/quarantine must be checked on new sessions and before new jobs, with a documented maximum cache age.

Canonical signed job fields:
- envelope version, job ID, issuer, audience/controller ID and target machine ID;
- originating human, initiating app/workflow and API grant reference;
- capability ID/version and canonical input schema/payload hash;
- issue/expiry time, nonce, replay key and idempotency key;
- environment/risk class, approval reference and policy version;
- resource/time/output budgets and cancellation deadline.

The controller signs the dispatched envelope; the Edge Agent independently verifies issuer, audience, target, expiry, replay, capability registration, grant binding and local policy. Result envelope includes job/host IDs, capability version, input hash, start/end times, outcome class, observed postcondition where applicable, redacted output reference, telemetry and agent signature.

## 14. Job lifecycle, retry and reconciliation

Job lifecycle: **created → authorized → queued → offered → acknowledged → executing → reporting → succeeded / failed / partial / cancelled / expired / unknown → reconciled**. Delivery acknowledgement means only that the Agent received the envelope. Execution acknowledgement and observed postcondition are separate events.

Use a durable store with explicit lease owner, lease expiry, attempt, retry class and last known state. Re-delivery is safe only when the capability has an idempotency contract and the same grant remains valid. A non-idempotent action with lost result enters unknown/reconciliation; never replay merely because the connection dropped.

Cancellation is cooperative and bounded; it stops queued work and asks a running capability to stop where safe. The result must indicate whether the action was stopped before execution, interrupted, completed despite cancellation or remains unknown.

## 15. Capability descriptor and host hardening contract

Each capability descriptor contains immutable ID/version, purpose, input/output schema, read/write classification, allowed OS/architecture, privilege required, host/resource scope, data sensitivity, timeout, CPU/memory/output limits, idempotency/retry behavior, approval class, audit event and postcondition.

Run the Agent under a dedicated unprivileged OS service identity. Each capability has a separate handler and minimum OS permissions. No arbitrary shell/PowerShell, arbitrary executable, dynamic plugin download, Docker socket, raw terminal or filesystem traversal. Diagnostics are bounded, redact secrets and avoid collecting full environment variables, home-directory contents or unrelated process command lines.

## 16. Controller availability, deployment and update

Controller HA must define leader/lease behavior, agent reconnect spread, job ownership transfer, storage durability, certificate revocation availability and split-brain prevention. An agent must not accept conflicting active controllers without an explicit failover protocol and issuer/audience trust.

Update manifest binds version, platform/architecture, artifact digest, signer, minimum allowed version, release channel and rollout group. Verify signature before install, prevent downgrade below the security floor, stage canaries, monitor health and keep a last-known-good rollback mechanism. A failed update quarantines safely rather than opening arbitrary fallback execution.

## 17. Required operational metrics and SLO discovery

Measure enrolled/active/stale hosts, certificate age/rotation, connection churn, enrollment rejection, queue age/depth, dispatch/ack/execution latency, unknown outcomes, cancellation latency, retry count, capability failure class, update success/rollback and storage recovery. Define SLOs after the host inventory determines fleet size, network topology and management windows.

## 18. Astronauts integration acceptance

- Enrollment is one-time, scoped, auditable and rejects cloned/replayed identity.
- A host connects outbound using a per-machine certificate and no public inbound listener.
- API grant and Controller job signatures are both independently verified by the Edge Agent.
- Wrong target, expired approval, changed payload, replay, revoked identity and unknown capability are rejected.
- A read-only capability returns a verifiable result with bounded/redacted output.
- Controller restart/reconnect does not duplicate an unsafe job.
- Kill switch, quarantine and certificate revocation stop new jobs within the documented policy bound.
- Signed update rejects tampered/downgraded artifacts and can roll back.

**Acceptance:** one non-production host executes only a signed, scoped, read-only job and produces attributable evidence; no generic remote shell or business credential exists.
