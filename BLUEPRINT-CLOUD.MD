# BLUEPRINT-CLOUD — CLOUD & INFRASTRUCTURE CONTROL PLANE

**Document ID:** MW-BP-CLOUD-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/cloud provides the cloud/infrastructure business and operational control plane: projects, environments, resource catalogue, compute/storage/network resource lifecycle, deployment orchestration, quotas, metering, cost visibility and controlled secret-manager integration.

It is not permission for Agent or Web to control host Docker sockets or production infrastructure directly.

## 2. Control plane vs execution plane

**Control plane** stores desired resource intent, policy, plan, approval, provider mapping, deployment state, cost/usage and audit.

**Execution plane** uses isolated short-lived runners with narrowly scoped workload identities to apply approved infrastructure plans. Runners are not public API processes and do not share unrestricted host credentials.

The control plane must preview changes before apply. Every run has immutable plan reference/hash, policy version, approver where required, provider, workspace/state reference, output summary and rollback/recovery information.

## 3. Capabilities

- Cloud/provider/account connections and regions.
- Projects, tenants, environments and resource catalogues.
- Compute, container, network, storage, DNS and certificate resources.
- Deployment templates and app environment manifests.
- Infrastructure-as-code plan/approval/apply workflows (OpenTofu is a candidate).
- Desired/observed state and drift detection.
- Quotas, reservations, resource metering and cost allocation.
- Secrets and configuration references with vault integration.
- Backup, restore, snapshot and disaster recovery orchestration.
- Cloud audit, policy evaluation and operational health.

## 4. IaC governance

Prefer declarative, version-controlled infrastructure. A candidate OpenTofu workflow is: validate → plan → publish immutable plan → policy check → cost/impact review → human approval for privileged/destructive changes → apply in isolated runner → verify actual provider state → record outputs and drift.

Remote state must be encrypted, access-controlled, versioned and locked against concurrent mutation. Secrets must not be committed into state/configuration/logs. Protect plan artifacts and redact sensitive outputs. Do not automatically apply a changed plan after approval.

## 5. Secret management

Integrate a dedicated vault (OpenBao/Vault/cloud secret manager after ADR). Use workload identity, short-lived leases, policy-scoped reads, dynamic credentials where supported, rotation, revocation and audit. UI stores references and metadata, never secret plaintext. Secret values never enter tasks.json, model context, terminal transcript or logs.

## 6. Deployment and container management

App deployment must use immutable image tags/digests, environment-scoped configuration, health/readiness checks, rollout strategy, secret references, logs/metrics/traces, resource limits and rollback procedure. Docker/Compose can support initial deployments; do not require Kubernetes before the operational need exists.

Any container management agent requires a narrow allowlist, restricted host mounts, no privileged containers by default, no unrestricted Docker socket and complete audit.

## 7. Security and approvals

Threat-model cloud account takeover, state-file theft, plan tampering, runner escape, privilege escalation, secret exfiltration, tenant crossover and destructive resource deletion. Separate read-only inventory from apply privileges. Production apply, deletion, network exposure and credential rotation require explicit scoped approvals.

## 8. Required deliverables

Provider decision, resource model, tenant/project model, runner isolation, IaC policy, state storage/locking, approval workflow, vault integration, metering/cost model, observability, disaster recovery and security runbooks.

## 9. Task ownership and definition of done

Tasks CLOUD-* in tasks.json. Done means a non-production test resource can be planned, policy-checked, approved, applied by an isolated runner, observed from provider state and safely destroyed with audit evidence.


## 10. Boundary with Astronauts

Cloud owns provider accounts, resource plans/state, compute/network/storage creation, deployment intents and provider-side lifecycle. Astronauts owns the enrolled machine fleet after a machine exists: enrollment, host identity, heartbeat, host inventory and signed typed operations. Cloud may request an approved Astronauts bootstrap capability after provisioning, but neither service may treat the other's runner or credential as ambient authority. Destroying a Cloud resource must revoke/decommission its Astronauts machine identity through an explicit, idempotent lifecycle hand-off.
