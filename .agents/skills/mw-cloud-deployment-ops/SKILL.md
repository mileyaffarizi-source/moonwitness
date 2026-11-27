---
name: mw-cloud-deployment-ops
description: Build secure MoonWitness cloud control-plane, container deployment, infrastructure automation, observability and recovery workflows.
---

# Cloud and deployment operations

## Use when
Changing `apps/cloud`, Docker/Compose operations, IaC, deployment runners, environment management, resource lifecycle or disaster recovery.

## Read first
[Cloud blueprint](../../../BLUEPRINT-CLOUD.MD) and the app/runtime deployment contract. For developer-local execution, also consult the DX blueprint.

## Control-plane rules
- Separate desired intent, policy, plan/approval and audit from the isolated execution runner. Do not let a public API or Agent hold ambient host privileges.
- Use immutable image digests, environment-scoped configuration, readiness/health probes, resource limits, logs/metrics/traces and a documented rollback path.
- Start with Docker/Compose when adequate; do not add Kubernetes or a service mesh without a measured requirement.
- IaC follows validate → plan → policy/cost review → approval → isolated apply → provider-state verification. Approval is bound to the exact plan hash; changed plans require new approval.
- Remote state is encrypted, access-controlled, versioned and locked. Redact sensitive outputs. Never place secrets in state/config/logs or model context.
- Runners use short-lived workload identity, minimal permissions, constrained network/filesystem and complete audit. No unrestricted Docker socket or privileged container by default.
- Separate read-only monitoring from write/apply/delete operations. Production deploy, destructive change, public exposure and credential rotation require explicit scoped approval.

## Operational proof
Test a non-production resource end-to-end: plan, policy, approval, apply, observed state, health, rollback/destroy. Verify restart, timeout, partial failure, log redaction and recovery. A successful deployment command is not proof the service is ready.
