---
name: mw-telecom-domain-workflows
description: Preserve domain ownership and lifecycle correctness across MoonWitness OSS, BSS and ISP telecom workflows.
---

# Telecom domain workflows

## Use when
Changing network inventory/alarms/provisioning, commercial orders/billing, subscriber lifecycle, service qualification or BSS–ISP–OSS integrations.

## Read first
[OSS](../../../BLUEPRINT-OSS.MD), [BSS](../../../BLUEPRINT-BSS.MD) or [ISP](../../../BLUEPRINT-ISP.MD) according to the owner. For cross-domain work, inspect the hand-off contracts only.

## Ownership
- **BSS:** party/customer, offer, price, quote, accepted commercial order, contract, subscription entitlement, invoice and payment.
- **ISP:** subscriber-service lifecycle, address/serviceability, orchestration state, activation verification and customer service state.
- **OSS:** technical inventory/topology, alarms, telemetry, incidents, device configuration and provisioning execution.
- **API:** shared persistence access, authorization, transactions, audit and cross-domain contracts.
- **ID:** authenticates the operator/customer; it does not own domain permissions or device credentials.

## Lifecycle rules
- An accepted order is not an activated service. BSS hands an accepted order to ISP; ISP coordinates qualification and OSS provisioning; ISP verifies activation from observable signals; BSS follows agreed contractual billing events.
- Preserve external IDs and source ownership for Odoo, CRM, RADIUS/AAA, OLT/ONT/NMS and router systems. No dual masters or bulk migration without approved entity-level cutover.
- Distinguish desired, observed, inferred and stale state. Missing telemetry is unknown, never healthy.
- Normalize vendor payloads behind typed adapters while retaining source references for troubleshooting.
- Separate read-only monitoring from device configuration write access. Credentials stay in vault-backed adapters.
- Provisioning needs idempotency, bounded retries, checkpoints, partial-failure recovery, preview, risk-based approval, verification and rollback.

## Verify
Use realistic fixtures or a representative non-production device/service. Test duplicate messages, out-of-order events, partial provisioning, retry, cancellation and reconciliation. Never claim activation from command acknowledgement alone.
