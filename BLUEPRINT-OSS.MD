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
