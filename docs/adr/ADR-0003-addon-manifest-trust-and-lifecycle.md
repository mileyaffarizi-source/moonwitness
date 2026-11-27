# ADR-0003: Add-on manifest, artifact trust and lifecycle contract

- **Status:** Proposed — owner and security review required before production implementation
- **Date:** 2026-11-27
- **Decision owner:** Repository owner, with Platform Security and API/ORM domain owners
- **Authors:** Platform engineering
- **Related tasks:** ADD-001 through ADD-011, PKG-003 through PKG-009, API-004, API-006, API-009, GOV-004, GOV-006, GOV-009, GOV-010, GOV-011
- **Supersedes / superseded by:** None

## Context and problem

The add-on blueprint already describes a modular extension model inspired by Odoo, but implementation needs explicit machine-enforceable rules for package identity, manifest shape, compatibility, dependency resolution, model ownership, capability authorization, artifact trust, runtime boundaries, data migrations, lifecycle and decommission.

Without a single contract, each app or AI worker can invent a slightly different manifest, permission representation, loading strategy or data migration convention. This creates duplicate ownership, accidental server-to-browser leakage, arbitrary executable package loading and unsafe disable/uninstall behavior.

Observed repository state is a planning/foundation monorepo. The root workspace and quality gate exist, but the API, ORM registry, identity, Agent runtime, apps and add-on loader are not yet materialized. This ADR therefore proposes the target contract and gates; it does not claim that add-on runtime behavior exists.

## Decision drivers

- One owner for every model, field, record, storage namespace and capability.
- Validate a manifest before loading or executing any add-on code.
- Default-deny authorization and no permission inheritance from installation.
- API remains the sole authoritative business write boundary.
- Browser and Agent contributions have independent runtime boundaries.
- Production code comes from immutable, reviewable and verifiable artifacts.
- Disable must preserve data; destructive decommission is a distinct approved operation.
- Add-ons must not become a route for direct Odoo/MikroORM writes, arbitrary shell execution or production secret exposure.
- Standards must be enforced by schema, static validator, tests and CI—not prose alone.

## Options considered

### Option A — Put add-on metadata only in package.json

- Benefits: fewer files and a familiar Node.js package manifest.
- Costs/risks: package distribution metadata becomes coupled to domain permissions, model ownership, realm contributions and lifecycle contracts; npm tooling does not validate the platform-specific rules.
- Operational consequences: platform-specific semantics become implicit or are encoded in arbitrary package.json extension keys.

### Option B — Use a separate versioned addon.manifest.json alongside package.json

- Benefits: separates Node package metadata from platform capability contract; provides a versioned schema and a deterministic validation boundary; package.json remains standard for pnpm/build tools.
- Costs/risks: a consistency validator is needed to enforce package/manifest name and version equality; two files must be reviewed together.
- Operational consequences: one platform-specific manifest is validated before code discovery/registration. This is the current blueprint direction and is recommended.

### Option C — Discover and install arbitrary npm packages at runtime

- Benefits: dynamic extension distribution and rapid third-party installation.
- Costs/risks: arbitrary executable code, dependency confusion, supply-chain compromise, privilege escalation, schema ownership bypass, difficult rollback and unbounded network/install-script side effects.
- Operational consequences: requires a separate marketplace, sandbox, signature trust root, artifact quarantine, policy engine and upgrade/decommission service that do not exist. Not suitable for the current foundation.

### Option D — Defer executable add-ons; define and test the contract first

- Benefits: avoids implementing speculative runtime abstractions before API/ORM/identity foundations exist.
- Costs/risks: postpones end-to-end extension features while interfaces are established.
- Operational consequences: schema, validator, package standards, boundary tests and a reference package can be built in order, with executable loading gated until API/ORM and trust decisions are accepted.

## Proposed decision

The following is proposed for owner approval:

1. Use standard package.json plus one root addon.manifest.json per add-on. The manifest is a strict, versioned platform contract; package.json remains authoritative for Node package resolution and scripts.
2. Require a stable, immutable add-on ID and exact agreement between package name/version and manifest package name/version. Use explicit SemVer ranges for platform, API contract and required/optional dependencies.
3. Validate JSON Schema and platform-specific invariants before loading code or registering capabilities. Invalid, unknown-major or incompatible manifests fail closed.
4. Use separate API, Agent, Web and Docs contribution entrypoints. Browser-safe exports must not import Node/server code; Agent tools must call approved API contracts; neither can obtain persistence adapters.
5. Bind every capability to add-on ID/version, realm, risk class, actor/resource scope and API-enforced permission. Installation/enabling does not imply permission.
6. Permit only approved workspace packages and immutable build artifacts. Reject arbitrary runtime package installation, uploaded executable add-ons and mutable-branch artifacts in production.
7. Require source revision, artifact digest, dependency lock, build provenance and security evidence. Introduce trusted signing identities only after the owner approves trust roots, signer custody, rotation and revocation policy.
8. Assign each model/storage namespace to one owner. Permit reviewed additive migrations; block Odoo-owned table claims and automatic destructive migrations.
9. Model install, enable, readiness, degrade, failure, disable, upgrade and decommission as explicit validated transitions. Disable removes capabilities and preserves data; decommission and deletion require a separate exact approval and recovery plan.
10. Implement schema/validator/fixtures and architecture boundary checks before an executable reference add-on. The first reference add-on is permitted only after the required API/ORM/capability contracts exist.

This proposal intentionally does not grant production signing trust, runtime third-party code loading, privileged infrastructure permissions or approval for destructive migrations.

## Scope and boundaries

- **In scope:** add-on identity/manifest, schema, compatibility, dependency graph, capability/permission declaration, realm-specific exports, model/field ownership, migration declaration, artifact verification evidence, lifecycle states and authoring/CI rules.
- **Out of scope:** third-party marketplace, public extension registry, runtime npm install, arbitrary uploaded code, hot-reload, automated production enablement, automatic destructive migrations, Odoo direct DB writes and application-specific add-on implementations.
- **Owning package/domain:** Base Add-on SDK and API-side add-on composition; ORM owns model/field metadata; Agent/Web own their realm contributions.
- **Consumers:** API, ORM, Agent, Web, Docs, DX, OSS/BSS/ISP and other app surfaces through public contracts.
- **Source of truth:** accepted version of BLUEPRINT-PACKAGE-ADDON.MD, schema and validator implementation, package.json and immutable artifact evidence.
- **Trust boundary:** artifact/source trust is separate from runtime authorization; API re-authorizes each operation and the owner approves high-risk capabilities.
- **Legacy boundary:** Odoo-owned entities remain Odoo-owned until an entity-specific transition and cutover is approved.

## Consequences

### Positive

- One standard manifest and validation process for all add-ons.
- Consistent public exports and ownership across realms.
- Disabled add-ons cannot retain callable routes/tools/jobs through stale registries.
- Package supply-chain evidence and data migration policy are explicit.
- Local AI workers can validate contributions before proposing integration.

### Negative / trade-offs

- A schema and domain validator must be maintained alongside the SDK.
- Separate manifest and package.json require equality checks.
- Signature verification and trusted publishing cannot be completed without a separate, approved trust-root design.
- Add-on implementation follows the API/ORM/identity prerequisites and cannot be used to bypass them.

### Follow-up work

- **ADD-001:** finalize strict manifest schema and SDK types after ADR approval.
- **ADD-002/003:** discovery, artifact trust and dependency/compatibility validation.
- **ADD-004/005:** model extension and capability/policy registry.
- **ADD-006/007:** lifecycle and owned-storage/migration policy.
- **ADD-008/009:** realm adapters and the reference end-to-end add-on.
- **ADD-010/011:** upgrade/decommission, security diagnostics and operational verification.
- **GOV-010:** security threat model and exact-scope approval matrix.
- **PKG-008:** workspace dependency graph and architecture boundary checks.

## Security, privacy and data impact

Add-ons are executable supply-chain inputs. A compromised or malicious add-on could expose tenant/customer data, change records, run background work, register routes or tools, read secrets, alter schemas or cross domain boundaries. Mitigations include immutable artifact identity, provenance verification, default-deny capabilities, scoped service identity, API-enforced authorization, strict realm boundaries, no direct DB/shell/filesystem access, audit records, safe diagnostics and independent security tests.

No secret value, production database, customer record, network device, cloud account, artifact-signing key or external provider credential is accessed or added by this proposal.

## Compatibility and migration

The initial contract applies to new add-ons and workspace packages. It does not rewrite existing Odoo modules, customer data or historical application records. package.json remains the Node package manifest; addon.manifest.json is an additional platform metadata contract. Future contract changes require a manifest schema version and a migration/compatibility path.

A breaking change requires a new contract major, compatibility review, fixture updates, consumer matrix, migration notes and a new ADR if ownership/trust semantics change.

## Open owner decisions required before acceptance

1. **Trust roots:** which identities may sign production add-on artifacts; where signing keys live; who can approve/revoke signers; and how rotation/revocation is tested.
2. **Artifact promotion:** whether the initial production trust source is GitHub Actions provenance only, an organization signing service, or both.
3. **Public distribution:** whether add-ons remain internal workspace packages indefinitely or a future private/public registry is planned. No marketplace is approved here.
4. **Permission risk matrix:** exact capabilities and action classes that always require human approval, including network changes, cloud apply, secrets, payments, production deploy and security-lab operations.
5. **Migration authority:** which role may approve destructive/irreversible schema or data changes and which backup/restore evidence is mandatory.
6. **Version policy:** monorepo/workspace versioning versus independently versioned add-ons; do not adopt per-package release automation until this is decided.
7. **Isolation model:** whether high-risk add-ons require a separate process/container/runner, and the acceptable IPC/capability boundary.
8. **Data decommission:** retention, legal hold, export, deletion and customer-impact policy when an add-on is removed.

Until these are resolved, code may implement static schema validation and non-privileged fixtures, but production trust, privileged loading and destructive operations remain blocked.

## Verification and evidence

Acceptance requires:
- The owner marks this ADR Accepted with exact scope and conditions.
- Manifest schema and fixture validator pass positive and negative cases.
- Dependency graph, ownership collision, permission and realm-boundary tests pass.
- CI runs the standard add-on gate against the repository and any declared manifests.
- No production execution, artifact publishing or destructive data migration is claimed by these tests.

At proposal time, this ADR is not accepted and does not authorize the operations described in the Open owner decisions section.

## Review and approval

- **Status:** Proposed.
- **Required reviewers:** repository owner, Platform Security, API/ORM owner and Add-on platform owner.
- **Approval record:** pending.
- **Conditions:** all eight open owner decisions above must be resolved or explicitly deferred with a bounded scope before production add-on trust and lifecycle implementation.
