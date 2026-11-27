# ADR-0003: Add-on execution trust boundary and capability isolation

- **Status:** Proposed — do not enable third-party add-on execution
- **Date:** 2026-11-27
- **Decision owner:** Repository owner + security/platform owner
- **Authors:** Platform engineering
- **Related tasks:** ADD-001, ADD-002, ADD-005, ADD-006, ADD-008, ADD-011, ADD-012, GOV-010, GOV-011
- **Supersedes / superseded by:** None

## Context and problem

MoonWitness is designed around independently versioned domain add-ons that can contribute API models/use cases, Agent tools/workflows, Web navigation/components, events and jobs. The current repository has a target architecture and is now adding a strict manifest/package hygiene gate. It does not yet have a Base SDK, API add-on loader, identity-bound capability engine, signed artifact registry or runtime isolation system.

A manifest is untrusted metadata until validated, a package is executable code, and a permission declaration is not authorization. Loading arbitrary add-on code inside the API process would grant it the process's effective filesystem, network and memory privileges. A package linter cannot create a sandbox or safely constrain malicious JavaScript.

The parent BLUEPRINT.md and BLUEPRINT-PACKAGE-ADDON.MD prohibit arbitrary runtime npm installation, direct ORM/DB access and disabling data deletion. This ADR evaluates the missing execution trust boundary before ADD-002 or external add-on support is implemented.

## Decision drivers

- One authoritative API owns business records, authorization, transactions and audit.
- Add-on code must not read/write persistence directly or gain privileges from manifest claims.
- Local first-party add-ons need a practical development and release workflow.
- External/third-party code must not inherit the API process's credentials, host filesystem, Docker socket or broad network.
- Add-ons must be revocable, observable, versioned and recoverable.
- A failed validation/upgrade must leave the add-on unavailable rather than partially registered.
- Security controls must be testable and cannot depend on a model's self-declared trust level.

## Options considered

### Option A — In-process dynamic JavaScript loading

Load module entrypoints into the API process after manifest validation.

**Benefits:** low operational overhead, straightforward TypeScript integration and low latency.

**Risks:** no meaningful privilege isolation; code can access ambient process state, Node APIs, memory, loaded credentials and any network/filesystem capability exposed to the process. A permission manifest cannot constrain the JavaScript VM.

**Assessment:** rejected for third-party/untrusted code. Even first-party code requires a trusted reviewed artifact and strong static/API controls.

### Option B — Reviewed workspace packages composed at startup/redeploy

Build first-party add-ons in the monorepo, pin them in the workspace lockfile, review source and artifact provenance, and compose explicit SDK entrypoints when the API starts or redeploys. No arbitrary package installation or hot loading occurs at runtime.

**Benefits:** reuses pnpm/CI/review, deterministic artifact composition, easiest initial implementation and avoids a public runtime package marketplace.

**Risks:** first-party code still shares the API process privileges. Static lint and code review reduce risk but do not provide an OS security boundary.

**Assessment:** recommended for the initial first-party implementation only, after the API/identity/capability gates are complete. It is not approval for public third-party add-ons.

### Option C — Isolated worker process/container per trust domain

Run add-on code in a separate, short-lived or supervised process/container with explicit RPC contracts, per-add-on workload identity, read-only filesystem, resource quotas, no Docker socket, secret-free environment by default, restricted egress and kill/restart controls.

**Benefits:** operating-system isolation, separate lifecycle/resource controls and better blast-radius containment.

**Risks:** operational complexity, RPC/versioning overhead, process management, observability/cold start and host sandbox hardening.

**Assessment:** preferred candidate for third-party or high-risk add-ons, but requires a dedicated threat model, local-daemon permission policy and deployment design before implementation.

### Option D — WASM/component sandbox for portable contributions

Compile supported add-on capabilities to a constrained WASM/component runtime with explicit imported host functions.

**Benefits:** smaller host API surface and capability-oriented execution model.

**Risks:** runtime/library compatibility, Node/native-module restrictions, debugging and incomplete support for some domain SDKs.

**Assessment:** candidate for specific pure/computation/transform contributions. Not a universal add-on runtime decision.

## Proposed decision

1. **Initial phase:** only reviewed first-party workspace add-ons may be considered for composition. Package versions are pinned in pnpm-lock.yaml. API composition occurs through explicit public SDK exports during controlled startup/redeploy.
2. **No runtime installation:** application startup may not invoke npm/pnpm install, fetch executable packages, execute remote URLs or hot-load an unreviewed package.
3. **No self-authorizing manifests:** the manifest declares requested contributions/permissions; only the API policy engine grants access based on trusted actor, tenant, add-on/version, resource, operation and current policy.
4. **No direct persistence:** add-ons receive model descriptors and authorized use-case interfaces, never MikroORM EntityManager, DB drivers, SQL connections or API private repositories.
5. **No secret inheritance:** add-ons receive only explicitly scoped secret references/capabilities after identity/policy review; raw global environment variables are prohibited.
6. **External side effects:** network provisioning, cloud apply, deploy, payment, notification to external recipients and destructive operations require distinct capability IDs and human/per-operation approval.
7. **Disabled state:** removes routes/tools/jobs/events/navigation and prevents new work; it preserves model data, migration history and audit evidence.
8. **Third-party add-ons remain disabled** until the owner/security decision for signature authority, artifact registry, sandbox, workload identity, secret injection, egress, quotas, cancellation, audit and revocation is accepted and verified.

## Open decisions requiring owner/security approval

- Who operates the signing root of trust and how are key rotation/revocation and compromised signer response handled?
- Are third-party packages allowed at all, and who approves publishers/owners?
- Which runtime isolation target is accepted: worker process, OCI container, WASM/component, or a combination by risk class?
- Which OS sandbox features are required (read-only filesystem, seccomp/AppArmor, namespaces, cgroups, network namespace, Windows Job Objects)?
- What outbound network destinations/protocols are allowed and where is egress enforced?
- How are tenant/user/workload identities propagated without ambient credentials?
- How are secrets injected, time-limited, redacted and revoked?
- What CPU/memory/disk/process-count/output/time quotas, cancellation and kill-switch behavior are mandatory?
- Can multiple versions of an add-on coexist during rolling deploys?
- What migration/restore evidence is required before a production upgrade or decommission?

## Security and failure model

The threat model must cover malicious package code, compromised dependency, manifest spoofing, dependency confusion, typosquatting, publisher/signing-key compromise, prompt/tool injection, cross-tenant access, capability escalation, secret exfiltration, SSRF/egress, resource exhaustion, event replay, migration corruption and disabled add-on residue.

Validation/trust/compatibility/dependency/permission/migration/health stages are fail-closed. The API does not register partial capabilities after failure. Lifecycle and every denied/approved operation produce correlation IDs and audit records. Revocation withdraws active registrations and blocks new invocations.

## Consequences

### Positive

- The manifest and static lint gate can be built now without implying a production plugin runtime exists.
- First-party monorepo packages can be designed under explicit ownership and compatibility.
- Third-party execution cannot accidentally become enabled by a valid JSON manifest.

### Negative / trade-offs

- Add-on runtime execution remains blocked until API/ID/GOV dependencies and this ADR are accepted.
- Static lints and in-process review are not a sandbox.
- The secure third-party runtime adds deployment, RPC, identity and observability components.

## Implementation sequencing

1. ADD-012 — static manifest/package contract and lint gate.
2. PKG-004 / API-004 — Base SDK and model/field authority.
3. GOV-010 / ID trust context — identity, actor and capability threat model.
4. ADD-001 — typed add-on SDK and manifest types.
5. ADD-002 — loader/trust validation after approved trust decision.
6. ADD-003..011 — dependency, extension, capability, lifecycle, migration, adapters and proof.
7. Only after sandbox decision — third-party registry/artifact distribution and execution proof.

Do not remove task dependencies to make the schedule appear parallel.

## Approval record

**No final runtime/sandbox decision is recorded by this ADR yet.** The repository owner asked for an add-on standard and lint rules; this draft defines the static manifest/package hygiene baseline. It does not approve public/third-party code execution, runtime privileges or production add-on installation.
