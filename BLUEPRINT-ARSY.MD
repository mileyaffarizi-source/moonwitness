# BLUEPRINT-ARSY — RUST TELECOM PROTOCOL SERVICES

**Document ID:** MW-BP-ARS-001 · **Version:** 1.0.0  
**Status:** Accepted architecture / implementation pending  
**Parent:** [BLUEPRINT-APPLICATIONS.MD](./BLUEPRINT-APPLICATIONS.MD) · **Tasks:** [tasks.json](./tasks.json)  
**Runtime:** Rust 1.100.0 stable · async protocol services

## 1. Mission

**apps/arsy** is the telecom protocol runtime for MoonWitness ISP/OSS operations. It terminates and processes selected network service protocols:

1. RADIUS AAA for PPPoE access infrastructure (NAS/BRAS/BNG/router).
2. Broadband Forum TR-069 / CWMP Auto Configuration Server (ACS) for supported CPE.
3. Syslog listeners and normalized event ingestion for approved network devices and services.

Arsy is a **protocol server/adapter**, not a product billing platform, subscriber master, NMS, OSS workflow engine or PPPoE Access Concentrator.

## 2. Ownership boundaries

| System | Authority |
|---|---|
| BSS | Customer/commercial order, contract, plan price, subscription, invoice, payment and billing truth |
| ISP | Subscriber broadband service lifecycle, package entitlement, service status, activation/RFS, suspend/restore/change/cancel |
| OSS | Device/network inventory, topology, alarm/incident correlation, desired configuration, provisioning workflow, change approval/rollback and service assurance |
| **Arsy** | RADIUS/ACS/Syslog protocol sessions, protocol validation, bounded session state, vendor protocol adapters and normalized protocol evidence/events |
| API | Authentication/authorization, policy, typed capabilities, business records, transaction/outbox and audit |
| Vault/KMS | RADIUS NAS shared secrets, CPE credentials, TLS private keys and other secret values |
| Astronauts | Enrolled machine fleet and signed host operations; not network protocol/service lifecycle |

Arsy owns an isolated operational state store for protocol runtime data. It references stable subscriber/service/device/resource IDs but does not import or directly write BSS/ISP/OSS databases.

## 3. Service topology

One Rust workspace may compile multiple independently deployable binaries/processes; deploy them separately when security, traffic, HA or maintenance requires it:

- **radiusd:** RADIUS UDP listener and optional Dynamic Authorization listener; later evaluate RadSec over TLS.
- **acs:** HTTPS CWMP/SOAP ACS endpoint and bounded RPC/session workers.
- **syslogd:** UDP/TCP/TLS listeners, parser, source identity and bounded buffer.
- **event pipeline:** app-owned outbox, normalization, redaction and delivery to API/OSS event contracts.

The initial topology can run a single service binary group in a lab. Do not force a microservice per protocol before load/security measurements. Keep listeners, secrets, ports, privileges and resource budgets independent.

## 4. RADIUS AAA for PPPoE

### 4.1 Protocol responsibility

The customer's PPPoE NAS/BRAS/BNG (for example, an approved router/access platform) terminates PPPoE and sends RADIUS requests to Arsy. Arsy evaluates the current authorized subscriber/service policy and returns an appropriate RADIUS response. Arsy is not the PPPoE concentrator and does not replace the router's access/session termination function.

Initial protocol coverage:

- Access-Request → Access-Accept / Access-Reject / Access-Challenge where supported;
- Accounting-Start, Interim-Update and Stop;
- session correlation, duplicate detection and out-of-order packet handling;
- approved Dynamic Authorization: CoA and Disconnect, with response/acknowledgement;
- NAS client identity, configured source networks and per-client secret reference;
- stable session ID, NAS/session attributes, timestamps and accounting evidence.

RadSec (RADIUS over TLS) is a separately evaluated transport; do not enable it without NAS interoperability and TLS identity tests.

### 4.2 Security and credentials

- Validate RADIUS packet lengths, authenticators, identifiers, supported attributes and `Message-Authenticator` where required by the selected EAP/protocol path.
- Bind each request to an enrolled NAS identity and a scoped per-NAS secret reference. Obtain secret values just-in-time from Vault/KMS; never persist or log plaintext shared secrets.
- Apply source allowlist, rate limiting, request-size ceilings, anti-replay/deduplication, timeout and bounded work queues.
- Retain only attributes needed for authorization/accounting and protocol troubleshooting; classify/redact sensitive values.
- Do not store plaintext subscriber passwords. Do not assume all password methods can be verified from the same password hash: PAP, CHAP, MS-CHAP and EAP have different credential/challenge requirements. The read-only inventory and protocol PoC must prove compatibility with the existing subscriber credential source and NAS fleet before a production method is selected.
- Authentication outcomes are linked to the policy version, service reference, NAS ID and observed time.

AAA decisions consume a versioned, freshness-bounded projection from API/ISP. If a policy snapshot is expired or the subscriber state is unknown, apply an explicitly documented fail-closed or emergency policy. Never silently authorize because the cache is unavailable.

### 4.3 Accounting and business handoff

Arsy records protocol facts: start/interim/stop, octets/packets, session duration, NAS attributes and delivery status. ISP consumes session/online state for its service lifecycle and assurance. BSS may consume metered usage under its own commercial rules. Arsy does not calculate invoices, decide package price, suspend a customer or create subscriber records.

Out-of-order or missing accounting events remain visible as incomplete/uncertain; they are not silently synthesized as truth. Use dedup keys and versioned event publication.

## 5. TR-069 / CWMP ACS

Initial ACS compatibility targets Broadband Forum TR-069/CWMP. The CPE initiates/participates in an authenticated HTTPS/SOAP session; Arsy validates device identity, handles Inform/session lifecycles and queues only bounded approved RPCs.

- Keep the CWMP transport/session state machine separate from the vendor parameter model.
- Store a device reference to OSS inventory; never create a second device master.
- Parameter paths, vendor extensions, writable flags, data types and firmware/model compatibility are versioned.
- Provisioning intent and approval belong to OSS/ISP/API policy. Arsy carries the authorized protocol RPC and records the CPE outcome.
- A successful HTTP/SOAP response or RPC acknowledgement is not proof that a desired device state has been reached. Verify the observed parameter/state before OSS closes a change.
- Apply authentication, request/body ceilings, XML parser hardening, timeouts, session limits and per-device concurrency controls.
- Never log ACS credentials, Wi-Fi keys or arbitrary parameter values classified as sensitive.

TR-369 / USP is a future compatibility evaluation only. Broadband Forum describes USP as an evolution of TR-069 designed to coexist with and allow migration from existing TR-069 deployments. It is not required for the initial TR-069 ACS delivery.

## 6. Syslog ingress and normalization

Support configured UDP and TCP sources first; add TLS-enabled ingestion when source identity/certificate provisioning is ready. Parse RFC 3164 and RFC 5424 as explicitly supported, preserving the original message reference, source address/identity, transport, receive time and parsed timestamp.

- Bind listeners only to intended management interfaces/ports.
- Authenticate or allowlist sources according to transport and threat model.
- Bound packet/message size, queue depth, parsing time, concurrency and retention.
- Preserve parse failures and unknown structured data without treating them as valid normalized fields.
- Normalize facility, severity, hostname, app name, process ID, message ID, structured data and timestamp where available.
- Redact credentials, tokens, keys, subscriber PII and device secrets before logs/events.
- Use a durable event outbox and idempotent event IDs for OSS consumption.

Syslog message ≠ OSS alarm ≠ incident. Arsy ingests and normalizes; OSS performs event correlation, alarm policy, incident creation and service-impact analysis.

## 7. API/event contracts and integration

No protocol runtime accesses BSS/ISP/OSS database tables. Contract surfaces:

- API/ISP → Arsy: bounded subscriber/service authorization projection, policy version/expiry, approved service profile references and revocation signals.
- OSS → Arsy: target-bound ACS RPC request, allowed parameter/method, input hash, expiry/approval reference and correlation ID.
- Arsy → API/ISP: RADIUS decision/session/accounting facts and delivery status.
- Arsy → OSS: normalized Syslog event, ACS session/RPC result, device observation and freshness/source provenance.
- BSS consumes only approved commercial metering/usage events through API-owned domain rules.

All events have stable ID, producer/version, schema version, source identity, occurred/observed time, correlation/causation and safe subscriber/service/device references. Delivery uses an outbox, retry classification, deduplication and dead-letter visibility.

## 8. Reliability, performance and deployment

- Isolate RADIUS, ACS and Syslog listeners from public web/API traffic and from one another where blast radius or traffic demands.
- Use asynchronous I/O and bounded backpressure; avoid unbounded per-packet tasks and in-memory-only accounting state.
- Define active-active or active-standby behavior per protocol. RADIUS NAS failover and accounting duplication must be tested; ACS sessions and Syslog delivery have different retry semantics.
- Use distinct config/secret identities per listener/service, host firewall rules, network segmentation, rate limits, health/readiness and graceful shutdown.
- Establish measured targets for auth latency, concurrent sessions, accounting events/sec, ACS concurrent CPE sessions, Syslog messages/sec, event lag, packet loss and failover recovery from the actual equipment estate.
- Run soak and overload tests before production. No capacity claim from synthetic microbenchmarks alone.

## 9. Technology and dependency policy

- Pin the current Rust stable toolchain in `rust-toolchain.toml`; initial verified baseline: Rust 1.100.0 (2026-11-28).
- Use Tokio for asynchronous service/runtime primitives after a minimal proof of concept.
- Evaluate protocol crates against RFC coverage, security advisories, maintenance, license, fuzzability, packet validation and interoperability. A pre-1.0 crate must not become a critical production dependency merely because it compiles.
- Keep protocol adapters behind internal traits so RADIUS/ACS parsing libraries can be replaced.
- Prefer explicit RFC/BBF conformance and fixtures over large frameworks.
- Use Cargo.lock, cargo-deny/audit/SBOM policy and pinned CI actions; do not add Node/pnpm dependencies for the Rust runtime.

## 10. Delivery phases

1. Read-only vendor/NAS/CPE/source inventory.
2. Boundary and threat model; decide authentication credential compatibility.
3. Reproducible Rust workspace and typed protocol/event contracts.
4. RADIUS authentication, then accounting and Dynamic Authorization in lab.
5. Syslog ingestion, normalization and OSS event delivery.
6. TR-069/CWMP session transport, then authorized RPC adapter.
7. Policy projection, audit, hardening, HA and realistic load/soak.
8. End-to-end lab verification with ISP/OSS.
9. Optional TR-369/USP evaluation after an explicit compatibility decision.

Atomic ownership is represented by ARS-001 through ARS-014 in tasks.json.

## 11. Definition of done

A lab NAS authenticates an explicitly authorized PPPoE subscriber through RADIUS and its accounting events correlate to the ISP service; a lab CPE completes a CWMP session and an OSS-authorized RPC with observed state evidence; and an authenticated Syslog source produces a normalized, deduplicated OSS event. Security, rate limits, secret handling, restart, failover, load and audit acceptance criteria pass. Arsy does not own BSS/ISP/OSS business records.

## 12. Standards and current toolchain references

- RADIUS authentication: RFC 2865 — https://www.rfc-editor.org/rfc/rfc2865
- RADIUS accounting: RFC 2866 — https://www.rfc-editor.org/rfc/rfc2866
- RADIUS Dynamic Authorization: RFC 5176 — https://www.rfc-editor.org/rfc/rfc5176
- RadSec: RFC 6614 — https://www.rfc-editor.org/rfc/rfc6614
- Syslog protocol: RFC 5424 — https://www.rfc-editor.org/rfc/rfc5424
- Broadband Forum TR-069/CWMP: https://www.broadband-forum.org/technical/download/TR-069.pdf
- Broadband Forum TR-369/USP overview: https://www.broadband-forum.org/technical/download/TR-369.pdf
- Rust stable release announcements: https://blog.rust-lang.org/releases/

Rust 1.100.0 is the latest stable release verified on 2026-11-28. Re-check official stable before locking the first Cargo workspace.


## 13. RADIUS client registry, policy decision and attribute contract

Each NAS client record includes stable client ID, device/resource reference, allowed source address/range, vendor/model/software version, shared-secret vault reference, supported transports, authenticator/Message-Authenticator policy, allowed packet types/attributes, rate/timeout limits, failover group and lifecycle. Network address alone is not sufficient identity; pair it with scoped secret/transport authentication.

Subscriber policy projection includes subscriber/service IDs, status, entitlement/profile version, effective interval, allowed access attributes, source version, freshness expiry and revocation version. The projection must not contain plaintext credentials. Arsy decision logs store policy version and redacted attributes, not the secret.

Authentication result is one of accept/reject/challenge/unsupported/temporarily_unavailable with a reason class. Unknown NAS, malformed packets, invalid authenticators, expired policy and unsupported authentication method follow explicit fail-closed or documented emergency behavior. Do not silently accept on cache miss.

Supported subscriber credential methods (PAP, CHAP, MS-CHAP variants and EAP where required) are discovered against the existing credential source and NAS fleet. Each requires a method-specific proof of compatible secret/challenge material; a generic password hash is not assumed interchangeable. Production acceptance requires test vectors and approved handling for the actual methods in use.

RADIUS response attributes are generated from an allowlisted service-profile mapping owned by ISP/OSS. Do not allow subscriber-provided fields or vendor attributes to override policy. Preserve vendor-specific attribute mapping and version fixtures.

## 14. Accounting session identity and reconciliation

An accounting session key binds NAS identity, Acct-Session-Id, subscriber/service reference and session start identity; handle missing/reused IDs explicitly. Store packet/event ID, status type, counters, event time, receive time, NAS port/circuit identifiers, policy/profile version and deduplication key.

Accounting state: **start_seen → active → interim_observed → stop_seen → reconciled**, with states for missing_start, missing_stop, out_of_order, duplicate, stale and unknown. Counter resets, wraparound, NAS reboot and delayed Stop packets are explicit reconciliation cases. Accounting packet receipt does not prove a subscriber is online at present; use freshness and latest observed event.

RADIUS Accounting is at-least-once evidence. Publish events through a durable outbox and deduplicate by stable event key. ISP consumes session observations; BSS consumes only an approved usage/rating projection. Arsy does not compute invoice totals.

## 15. Dynamic Authorization and NAS change safety

CoA/Disconnect is a privileged outbound network operation. The request must bind to exact NAS identity, subscriber/session identifiers, intended attribute/profile change, API/ISP authorization, expiry, reason and idempotency key. Validate response authenticator and expected NAS source. Unknown or mismatched session identifiers fail closed.

Track requested, sent, acknowledged, rejected, timed_out, unknown and reconciled separately. A timeout is not proof the session was disconnected. Re-query the session/accounting state or expose unknown for OSS/ISP reconciliation. Rate-limit per NAS and require maintenance/approval policy for bulk or disruptive operations.

## 16. TR-069/CWMP ACS session and RPC lifecycle

ACS device identity is referenced from OSS inventory; serial number/MAC alone is not treated as cryptographic identity. Define CPE authentication mode, credential rotation, TLS validation, source policy, connection-request handling and vendor/model compatibility per device cohort.

A CWMP session records device/resource ID, CPE identity, session ID, Inform event codes, protocol version, RPC request ID, request hash, authorization reference, expiry, attempt, CPE response and observed parameter state. RPC states: **queued → eligible → delivered → acknowledged → executing / response_pending → completed / faulted / timed_out / unknown → verified**.

Support only an explicitly reviewed initial RPC allowlist, such as read/diagnostic operations and selected configuration operations. Every write RPC is bound to an OSS-approved target/parameter/value set and maintenance window. SOAP parsing must reject unsafe XML constructs and enforce body, nesting, entity, timeout and concurrency limits. A CWMP success/fault response is not automatically proof of observed configuration; verify parameters in a subsequent observation where required.

## 17. Syslog source, normalization and event contract

Syslog source registry stores resource/device reference, source identity, expected address/certificate, transport, message format, facility/severity expectations, parsing profile, rate/size limits, retention and enablement state. UDP provides no inherent source authentication; use network segmentation/source policy and mark trust limitations. TLS source identity must map to an authorized source record.

Raw message is retained only according to explicit retention/PII policy; normalized event records parsed timestamp, receive timestamp, source/resource ID, transport, facility, severity, app/process/message ID, structured attributes, parser version, parse status, redaction status and dedup fingerprint.

Malformed/oversized/unknown messages are counted and isolated; never allow log content to trigger a privileged action. Syslog text is untrusted data and cannot modify Agent prompts, policies or device configuration.

## 18. Arsy service topology and reliability

Separate RADIUS, ACS and Syslog listener configuration, credentials, OS permissions, rate limits, queues and health. The first deployment may be one binary grouping, but the fault/credential/security boundary is independent. Do not expose management listeners on public interfaces without an approved network design.

RADIUS needs low-latency bounded packet processing and tested NAS failover; ACS needs per-CPE session limits and retry semantics; Syslog needs bounded ingestion/backpressure and loss/overflow visibility. Define persistence durability, active-active/active-standby behavior and failover after the equipment inventory. No universal HA model is assumed.

## 19. Arsy production readiness and acceptance

- RADIUS test vectors verify packet lengths, authenticators, NAS identity, supported auth methods, Access-Accept/Reject/Challenge and policy freshness.
- Accounting tests cover duplicate, missing, out-of-order, reset/wrap counters, NAS restart and outbox recovery.
- CoA/Disconnect tests prove exact session binding, authorization, response authentication, timeout/unknown semantics and rate limits.
- ACS tests cover Inform, session correlation, RPC allowlist, TLS/device auth, malformed SOAP, timeouts, retry and observed-state verification.
- Syslog tests cover source policy, UDP/TCP/TLS, RFC parser fixtures, malformed/oversized payload, spoofing limitations, redaction, dedup and backpressure.
- Soak/failover tests reflect measured concurrent sessions, packet rate and device estate.
- Secret rotation, credential revoke, log redaction, audit retention and restore are verified before production.

**Acceptance:** a lab NAS completes approved RADIUS AAA/accounting, a lab CPE completes an authorized CWMP operation with observed-state verification, and an approved Syslog source generates a normalized OSS event with source/time provenance. No direct subscriber/OSS/BSS database write exists.
