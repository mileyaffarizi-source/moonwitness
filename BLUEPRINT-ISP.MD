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
