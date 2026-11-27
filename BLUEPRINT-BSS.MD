# BLUEPRINT-BSS — BUSINESS SUPPORT SYSTEM

**Document ID:** MW-BP-BSS-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/BSS owns the commercial lifecycle: parties, customers, offers, pricing, sales, orders, contracts, subscriptions, billing, payment and collection. It is the commercial source of truth for new platform-owned records after an explicit transition decision.

BSS does not configure network devices and does not claim ownership of OSS telemetry or network inventory.

## 2. Domain capabilities

- Person, organization, customer/account and contact relationships.
- Prospect/lead/CRM and sales pipeline.
- Product/service catalogue, offer, price list, discount and eligibility.
- Quote, commercial order, contract and service agreement.
- Subscription/service entitlement and lifecycle.
- Rating/usage-to-charge mapping where applicable.
- Invoice, payment, refund, credit, collection and receivables.
- Tax, currency and accounting integration under jurisdictional review.
- Customer communication, notifications and account history.
- Revenue, churn, renewal and commercial reporting.

## 3. Source-of-truth and Odoo transition

Existing Odoo-owned commercial records remain authoritative until an explicit entity-by-entity transition is approved. Do not dual-write Odoo and BSS as independent masters.

For each entity, document owner, external ID, mapping, synchronization direction, conflict policy, cutover criteria, backfill scope and reconciliation. Use supported Odoo APIs and do not write Odoo-owned tables through MikroORM. No big-bang migration.

## 4. Order-to-activate integration

BSS validates offer, customer, credit/policy, commercial terms and order acceptance. It publishes an accepted service order through a versioned contract. ISP orchestrates the subscriber service journey; OSS qualifies technical resources and performs provisioning. BSS receives confirmed activation/operational milestones to start the agreed commercial billing event according to contract.

An accepted order is not the same as a provisioned service. Billing start must follow the agreed event and contractual policy.

## 5. Financial integrity

Money values use explicit currency and decimal-safe representation; never binary floating-point arithmetic for accounting values. Preserve invoice snapshots, line-level calculation details, tax jurisdiction/rules and immutable posted-document history. Payment reconciliation and refund/credit processes are auditable.

Do not claim compliance with a tax/accounting standard until the relevant jurisdiction and rules have been reviewed.

## 6. Access and controls

Separate sales, customer support, finance, collections and administrator roles. Use record/field rules for sensitive financial/account data. Approval gates cover discount exceptions, refunds, write-offs, credit overrides and contract amendments. Every material action records actor, reason and before/after references.

## 7. Integration boundaries

BSS owns commercial records and customer/order data; ISP owns the vertical service orchestration record; OSS owns technical resource/provisioning state; ID owns account authentication; API enforces business policies; Web/desktop/mobile are presentation clients.

## 8. Required deliverables

Commercial domain map, product catalogue schema, party/account model, order/contract lifecycle, invoice/payment model, Odoo transition map, financial calculation policy, access matrix, audit and reconciliation runbook.

## 9. Task ownership and definition of done

Tasks BSS-* in tasks.json. Done means a real commercial order can be accepted, versioned and traced through ISP/OSS hand-off, while customer/financial data remains consistent, auditable and owned by the correct system.


## 10. Commercial records and state ownership

Use explicit aggregate boundaries: **Party/Account**, **Product/Offer**, **Quote**, **Commercial Order**, **Contract**, **Subscription/Commercial Entitlement**, **Invoice**, **Payment/Refund**, **Collection**. Each record has stable ID, owner, lifecycle, effective dates, currency/jurisdiction where relevant, external references and audit/version history.

Commercial order lifecycle: **draft → quoted → accepted → confirmed → fulfilment_pending → fulfilled / partially_fulfilled / failed / cancelled**. An order is not fulfilled merely because ISP accepted an orchestration command; fulfilment needs authoritative ISP/OSS evidence.

Invoice lifecycle: **draft → calculated → approved → issued → partially_paid → paid / overdue / disputed / credited / voided**. Posted financial documents are immutable snapshots; correction uses credit/debit/reversal documents rather than rewriting history. Payment lifecycle distinguishes initiated, pending, settled, failed, reversed and refunded.

## 11. Rating and financial calculation contract

All amounts include explicit ISO currency, decimal precision, rounding mode, tax treatment and effective time. Never use binary floating point for money. A charge record references the rated source event, tariff/offer version, quantity/unit, rating timestamp, calculation breakdown and idempotency key.

Network usage or RADIUS accounting is evidence input, not an invoice. The BSS rating policy decides whether usage is billable, included, capped, prorated, disputed or excluded under the customer contract. Duplicate accounting events cannot create duplicate charges.

Tax, revenue-recognition, payment-provider and accounting compliance are jurisdiction-specific discovery/review tasks. Do not claim regulatory compliance until a qualified owner confirms the rules and test evidence.

## 12. Financial controls and audit

Segregate role capabilities for pricing, discount override, credit limit, invoice issue, payment reconciliation, refund, write-off, tax configuration and report export. Sensitive actions require maker/checker or a documented policy, exact amount/customer/document scope, reason, expiry and immutable audit.

Reconciliation compares internal invoice/payment state with payment-provider/bank/Odoo references using explicit matching rules and unresolved discrepancy queues. Never silently force balances to agree.

## 13. Integration contract to ISP and Arsy

BSS publishes an accepted commercial order with account/customer reference, offer/contract version, service specification, billing start rule and idempotency key. ISP returns qualification/activation/exception milestones; BSS decides commercial consequences.

Arsy RADIUS accounting events may be consumed only via an approved API/ISP contract. BSS must not treat an Accounting-Start packet as an invoice or a protocol Access-Accept as a commercial entitlement. Usage billing is a separate rating decision against the active contract and deduplicated metering period.

**Acceptance:** one test order can be accepted, fulfilled based on verified ISP evidence, invoiced from an immutable price/contract snapshot, reconciled against a simulated settlement and corrected without rewriting posted financial history.
