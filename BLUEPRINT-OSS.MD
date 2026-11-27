# BLUEPRINT-OSS — OPERATIONAL SUPPORT SYSTEM

**Document ID:** MW-BP-OSS-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/OSS owns the technical operation and assurance of network resources and delivered services. It is the operational truth for network inventory, topology, faults, performance, configuration/provisioning execution and technical SLA evidence.

OSS is not a billing/CRM replacement and is not the consumer broadband product catalogue.

## 2. Domain capabilities

- Physical/logical inventory: sites, POPs, racks, devices, ports, links, VLANs, interfaces, cards, OLT/ONU/ONT and network services.
- Topology and dependency graph.
- Fault/alarm/event correlation and incident lifecycle.
- Performance/telemetry and thresholding.
- Configuration/version/backup/desired-vs-observed state.
- Provisioning workflows and adapter jobs.
- Service assurance, availability and technical SLA evidence.
- Change windows, maintenance and rollback.
- Network access control, operator roles and audit.

## 3. Network adapters

Use explicit adapters for equipment APIs/protocols such as NETCONF/RESTCONF, SNMP, syslog, vendor APIs, streaming telemetry, RADIUS/AAA integrations and OLT/NMS interfaces where applicable. Normalize to typed canonical resource/alarm models but preserve vendor-native payload references for troubleshooting.

No UI or AI tool may issue arbitrary device commands by bypassing a policy-aware adapter. Configuration changes require validation, target scope, preview/diff, approval based on risk, execution window, result verification and rollback strategy.

## 4. Lifecycle and reliability

An alarm is not automatically an incident; correlation rules should reduce duplicate noise. Distinguish observed state, desired state, inferred state and stale state. Every adapter reports source, collection time, freshness and confidence/health. Missing telemetry must not be represented as healthy.

Provisioning jobs require idempotency, checkpoints, bounded retries, dependency ordering, cancellation where safe and manual recovery for partial application.

## 5. Integration boundaries

- BSS sends accepted commercial orders and service intent; OSS performs technical qualification/resource reservation/provisioning and returns operational states.
- ISP orchestrates subscriber lifecycle by coordinating BSS and OSS contracts; it does not directly access device credentials.
- API owns shared domain access, authorization, record operations and audit.
- Cloud manages compute/network infrastructure resources for platform hosting; OSS owns ISP/network service resources. Cross-over must be explicit in resource ownership.
- Agent may propose/observe/execute only approved capabilities with risk control.

## 6. Security and operations

Separate read-only monitoring from configuration write permissions. Device credentials are retrieved just-in-time from the vault. Use network segmentation, jump/management paths, scoped service accounts, credential rotation, immutable audit and emergency break-glass. Never expose management-plane credentials to browser or model context.

## 7. Data ownership and legacy systems

Inventory current NMS/OLT/AAA/RADIUS systems and Odoo references. Do not make a new OSS database authoritative by copying all legacy state. Map external IDs, source of truth, sync direction and transition plan per entity. Retain existing system ownership until approved cutover.

## 8. Initial implementation slice

Start with read-only inventory and alarms from one representative device/NMS adapter. Then add topology, event correlation, incident workflow and read-only service assurance. Add provisioning only after ownership, policy and rollback tests exist.

## 9. Required deliverables

Resource model, topology model, adapter SDK, alarm/event schema, telemetry freshness model, incident process, provisioning state machine, access matrix, integration contracts, audit and runbooks.

## 10. Task ownership and definition of done

Tasks OSS-* in tasks.json. Done means OSS can trace an operational service to its resources, display real freshness-aware alarms/metrics, manage incidents, and execute a bounded authorized provisioning path with verified result and rollback evidence.


## 11. Arsy as the protocol adapter plane

OSS remains owner of device/resource inventory, topology, alarms/incidents, desired configuration, provisioning workflow, approval, rollback and technical assurance. Arsy provides protocol endpoints and execution adapters: RADIUS AAA/session/accounting events, TR-069 CWMP ACS requests/RPC results, and Syslog ingestion/normalization. OSS submits approved target-scoped requests and consumes versioned results/events; it does not share a database with Arsy.

Arsy may store protocol session state and bounded raw/normalized protocol evidence, but must reference OSS-owned device/resource IDs and ISP-owned subscriber/service IDs. Syslog events are not automatically incidents; OSS correlation and incident policy decide that. ACS command acceptance is not proof of configuration success; verify the observed CPE parameter/state before closing an OSS work item.


## 12. Canonical resource inventory and state model

An OSS resource has one stable resource ID, type, owner/source system, external IDs, parent/child topology, lifecycle, observed/desired versions, location/scope, management path reference, credentials reference (never a secret), freshness and audit. Model sites/POPs, racks, devices, interfaces/ports, links, VLANs, OLT/PON/ONU/ONT, NAS/BNG/BRAS, service resources and logical dependencies without duplicating customer/subscriber ownership.

Resource state separates **planned, discovered, managed, maintenance, degraded, unreachable, retired, unknown**. Observations have source, timestamp, collector version, quality and expiry/freshness rule. Absence of a recent observation is stale/unknown, never healthy.

## 13. Alarm, incident and configuration workflows

Alarm lifecycle: **observed → normalized → correlated → active / cleared / suppressed / flapping**. Incident lifecycle: **new → triaged → assigned → investigating → mitigated → resolved → closed** with reopen path. A raw Syslog message is evidence, not automatically an alarm/incident; correlation policy belongs to OSS.

Configuration change lifecycle: **draft → validated → diff_ready → approval_pending → approved → scheduled → executing → verifying → applied / partial / failed / rolled_back / needs_manual_reconciliation**. A command acknowledgement is not applied; compare observed state to expected postcondition.

## 14. Adapter contract, including Arsy

Every adapter declares supported resource/vendor/protocol versions, auth method and secret reference, network zone, request schema, timeout, retry/idempotency class, rate limit, concurrency budget, event schema, observation parser and recovery method.

- Arsy is the protocol adapter for RADIUS session/accounting facts, CWMP ACS RPC/session delivery and Syslog ingestion/normalization.
- OSS owns the resource mapping, alarm correlation, change approval, requested desired configuration, rollback and service assurance.
- Before an ACS RPC is submitted, OSS validates device/resource ID, allowed method/parameter, expected state, approval, expiry and maintenance window.
- After Arsy returns RPC outcome, OSS verifies the CPE observed parameter/state and records applied, partial, failed or reconciliation status.
- Astronauts is used only for explicitly enrolled general-purpose hosts; it is not the default device management path for routers/OLTs/ONTs.

## 15. Operations, SLO and failure handling

Track collector lag, stale inventory %, device query success, alarm ingestion rate, incident correlation backlog, configuration job age, adapter retry/dead-letter count, rollback/reconciliation queue, poll cost and protocol source availability. Define SLOs only after baseline measurements.

On network partition, provider outage or bad credentials: preserve last observed state with an explicit stale timestamp, stop unsafe writes, rate-limit retries and expose a recovery queue. Credential rotation failure must be visible and not fall back to plaintext or shared admin credentials.

**Acceptance:** one lab resource can be discovered, linked to topology, generate a normalized observation/alarm, enter an incident workflow and receive an authorized config change whose postcondition is independently verified.
