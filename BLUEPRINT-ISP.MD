# BLUEPRINT-ISP — ISP & TELECOM SERVICE LIFECYCLE

**Document ID:** MW-BP-ISP-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/isp is the ISP vertical product and subscriber-service layer. It translates commercial offers and customer orders into an operational broadband service journey, joining BSS commercial authority with OSS technical operations.

ISP is not a second BSS or NMS. It owns the subscriber service orchestration and customer-facing service state.

## 2. Core lifecycle

**catalogue eligibility → address/service qualification → quote/order acceptance (BSS) → resource reservation → technical provisioning (OSS) → activation verification → service in operation → assurance/support → suspend/restore/change/cancel**

Every transition carries subscriber/service identity, source order, correlation ID, idempotency key, actor and version.

## 3. Candidate domain records

- service address/location and qualification result;
- access technology and serviceability;
- subscriber service/line identity;
- package/profile reference;
- ONT/ONU reference (not secret or device-owner bypass);
- service instance and resource assignment;
- activation checklist and RFS evidence;
- speed/profile entitlement;
- suspension/restoration/cancellation request;
- service-health summary and support case reference.

Use references to OSS-owned equipment/resource records rather than duplicate inventory.

## 4. Provisioning choreography

BSS creates accepted commercial order. ISP validates serviceability and owns orchestration state. OSS reserves network resources and performs authorized provisioning through device adapters. ISP verifies activation against observable signals and returns status to BSS. BSS starts billing only according to the contract and agreed activation evidence.

Handle partial failures, retries, compensation, manual intervention and cancellation at each step. A successful command response does not necessarily prove service activation; use operational verification such as reachability/session/AAA/ONT state as defined by the product.

## 5. Subscriber experience

Provide service status, package/entitlement, appointment/activation milestones, support case, outage notice and self-service requests through approved Web/mobile/desktop experiences. Do not expose other subscriber data or internal network details.

## 6. Integrations and legacy

Inventory current CRM/ERP/Odoo sales orders, subscriber codes, RFS state, RADIUS/AAA, OLT/ONT/NMS, routers and network provisioning systems. Preserve existing ownership during integration. Map existing identifiers rather than replacing them. No bulk migration until a reviewed plan exists.

## 7. Product/SLA rules

Separate advertised speed, configured profile, access-layer capability and measured throughput. Store effective period and source for each. Define service availability, maintenance exclusions, measurement windows and evidence before calculating SLA. Do not treat a marketing promise as live network telemetry.

## 8. Security

Subscriber PII and service location are restricted. Network/device credentials remain in vault and OSS adapters. Support actions need verified identity and scoped permission. AI can summarize/propose changes but cannot activate/suspend services outside approved capabilities.

## 9. Required deliverables

Service lifecycle state machine, service qualification contract, subscriber/service schema, BSS/OSS mappings, provisioning orchestration, activation verification rules, exception/compensation process, subscriber UX and integration tests.

## 10. Task ownership and definition of done

Tasks ISP-* in tasks.json. Done means one real test subscriber/order traverses accepted order, qualification, OSS provisioning, activation verification, BSS confirmation and support state without duplicated ownership or lost correlation.


## 11. Arsy protocol integration

ISP remains authoritative for subscriber-service lifecycle, entitlement and service state. It provides a versioned, time-bounded service-policy projection to Arsy for RADIUS AAA decisions; Arsy returns authentication/accounting/CoA outcomes and usage-session events with source and freshness metadata. The BRAS/BNG/NAS still terminates PPPoE; Arsy is its RADIUS AAA backend, not the PPPoE access concentrator.

ACS/CWMP operations are initiated by an OSS-owned provisioning/change workflow or approved ISP service transition. Arsy transports and records the authorized protocol RPC; it does not choose the commercial profile, own the ONT inventory or determine billing. RADIUS accounting facts are evidence/input to downstream service and billing processes, not invoices. Subscriber entitlements and billing triggers remain under ISP/BSS policy.


## 12. Subscriber service state machine and invariants

Separate the subscriber/person/account identity from the **service instance**. A service instance references the BSS commercial order and offer, a service address, an ISP entitlement version and OSS-owned resource IDs. One subscriber may have more than one service; one service may change package/resources over time.

Canonical service lifecycle: **draft → qualification_pending → qualified / not_qualified → order_accepted → resource_reserved → provisioning_pending → provisioning → activation_verification → active → suspended / restoration_pending / change_pending / cancellation_pending → cancelled / failed / needs_manual_reconciliation**.

Each transition requires actor/workload, source state/version, target state, reason, correlation ID, idempotency key, effective time and authoritative evidence. Reject illegal transitions and stale writes. Active requires an explicit activation predicate; do not infer it from a queued provisioning job.

## 13. Provisioning saga and compensation

ISP owns orchestration, not low-level network execution. Model each step with command ID, owner, deadline, retry policy and compensation/manual recovery:
1. validate commercial order and serviceability;
2. reserve OSS resource;
3. request OSS provisioning/change;
4. wait for adapter/protocol result;
5. verify actual service signals defined by product;
6. commit ISP service state and publish activation milestone to BSS;
7. reconcile delayed/out-of-order results.

A failure after partial provisioning enters the needs_manual_reconciliation state or a defined compensation state. Compensation is a new, audited operation; it is not assumed to reverse the original side effect. A retry uses the same logical idempotency key only when the operation contract permits it.

## 14. Arsy policy projection and AAA session semantics

ISP is authoritative for subscriber entitlement and service state. It produces a versioned policy projection to Arsy containing stable subscriber/service references, allowed service/profile policy, status, validity window, source version and revocation/freshness information. Do not send unnecessary PII or plaintext subscriber password.

Define behavior for active policy, suspended service, pending activation, cancelled service, unknown subscriber, cache miss and stale projection. The allow/deny rule and emergency-cache behavior must be explicit per product/NAS; stale data must never silently authorize. RADIUS session/accounting facts are consumed back into ISP as observations, not state authority.

## 15. Activation verification and service assurance

Define the activation predicate from the actual access/network estate. Candidate evidence may include NAS session state, expected service profile, OLT/ONT reachability/operational state, assigned resource mapping and end-to-end reachability/measurement. Each signal records source, observed time, freshness, expected value, actual value and failure reason.

An active result requires all mandatory signals within configured freshness windows, or an explicit human-approved exception. Advertised speed, configured profile and measured throughput remain distinct fields.

**Acceptance:** a lab service can be qualified, reserved, provisioned, observed and activated; a suspend/restore/change is idempotent and auditable; stale/missing AAA or device signals cannot be presented as healthy.
