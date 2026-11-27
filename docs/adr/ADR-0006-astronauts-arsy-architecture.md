# ADR-0006: Add Astronauts and Arsy as bounded application runtimes

- **Status:** Accepted
- **Date:** 2026-11-28
- **Decision owner:** Repository owner
- **Related workstreams:** APP, AST, ARS, AGT, DX, CLOUD, OSS, ISP, BSS

## Context

The existing application topology separates AI orchestration, business authority, developer workbench, cloud resources and telecom domain workflows, but it lacks two runtime boundaries:

1. A secure controller/agent bridge between MoonWitness and explicitly managed local/remote host machines.
2. A dedicated telecom protocol runtime for PPPoE AAA, CPE ACS and network Syslog.

Implementing either as a broad feature inside DX, Cloud, OSS or ISP would create overlapping responsibilities and mix very different trust/traffic profiles.

## Decision

Add two application surfaces, increasing the target inventory from fourteen to sixteen. This is not a mandate for sixteen microservices.

### Astronauts — Go

- One Go module with two separately deployed binaries: Controller and outbound-only Edge Agent.
- Controller owns enrolled machine identity/fleet state, heartbeat, host inventory, signed job dispatch, execution status and machine-side evidence.
- API remains the authorization authority and issues short-lived signed grants bound to actor, machine, capability, exact payload hash, expiry and approval reference.
- Edge Agent connects outbound via mTLS and executes only versioned, reviewed typed capabilities.
- No arbitrary shell, remote terminal, unrestricted filesystem, Docker socket, ambient SSH key or cloud/IaC authority.
- Cloud owns provisioning the machine resource; Astronauts controls the host after enrollment. DX owns developer worktrees/local build/test. OSS owns network device/resource workflow.
- Initial toolchain baseline is Go 1.27.4, latest stable verified on 2026-11-28: https://go.dev/doc/devel/release

### Arsy — Rust

- One Rust workspace can build separate RADIUS, ACS and Syslog binaries/processes; split deployment only when load/security/availability evidence justifies it.
- RADIUS AAA serves existing PPPoE NAS/BRAS/BNG; it is not a PPPoE Access Concentrator. Accounting and Dynamic Authorization are separate bounded capabilities.
- TR-069/CWMP ACS is the initial device-management protocol. TR-369/USP is future compatibility evaluation, not MVP scope.
- Syslog receivers validate source policy, parse supported formats, bound resource use and publish normalized versioned events.
- Arsy owns protocol sessions/observations only. ISP owns subscriber service lifecycle and entitlements; BSS owns commercial/billing truth; OSS owns network inventory, alarms/incidents and provisioning workflows.
- No direct database sharing, direct business writes or plaintext password/secret storage.
- Initial toolchain baseline is Rust 1.100.0 stable, latest stable verified on 2026-11-28: https://blog.rust-lang.org/releases/

## Four-plane topology

1. **Intelligence:** Agent and controlled AI workflows.
2. **Authority:** API, ID and domain authorization/persistence.
3. **Protocol & Operations:** Astronauts host fleet, Arsy telecom protocols, OSS network operations and Cloud isolated infrastructure execution.
4. **Experience:** Web, BSS, ISP, OSS consoles, Docs, Desktop, Mobile, A-L-L-A-H, DX and RIOT as their specialist blueprints define.

## Consequences

- APP-001 and the cross-blueprint consistency tasks are reopened/revised from fourteen to sixteen apps.
- New AST-* and ARS-* workstreams are atomic and have non-overlapping owned paths.
- OSS/ISP dependencies use Arsy only as the protocol provider; Astronauts is used only for enrolled host operations.
- Tool/library selection remains task-gated. In particular, the RADIUS parser/server library, gRPC transport, certificate issuer and ACS implementation must pass protocol/security/license/maintenance review before pinning.
- No runnable scaffold is represented as production capability. The two app directories initially contain planning anchors only.

## Rollout

Audit → contracts/threat model → pinned Go/Rust toolchain → minimal runnable service → protocol/agent capabilities → integration and security tests → controlled non-production pilot → explicit production readiness approval.
