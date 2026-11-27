# Add-on engineering standard

**Status:** Baseline v1 for manifest/package hygiene; runtime trust model remains proposed  
**Canonical blueprint:** BLUEPRINT-PACKAGE-ADDON.MD  
**Machine-readable contract:** docs/architecture/addons/addon.manifest.schema.json  
**Static gate:** pnpm lint:addons

## Mandatory package layout

Add-ons live only in packages/addons/<slug>. The manifest is addon.manifest.json; package name is @moonwitness/addon-<slug>; stable ID is moonwitness.addon.<slug>. Required files are manifest, private ESM package.json and README. Do not create empty API/Agent/Web folders or a package without an owned capability.

## Manifest rules

1. Pin manifest schema version and package SemVer.
2. Identify one owning team and explicit Node/platform/SDK compatibility.
3. Declare required vs optional dependencies separately.
4. Declare only allowlisted contribution types, permissions, risk and approval.
5. Keep model ownership and additive extensions explicit.
6. Declare storage owner and migration references; never imply ownership of an existing Odoo/domain table.
7. Use safe relative entrypoints only.
8. Record source repository, commit, license and release integrity.
9. Unknown fields, unknown capabilities, unknown permissions and undeclared grants fail closed.

## Package rules

- private: true, type: module, engines.node: >=24.22.3 <25.
- Use exact package versions or approved workspace references; no latest, *, git branch or local file: dependencies.
- Provide explicit exports; no deep imports into private packages.
- Provide build, lint, typecheck and test scripts.
- No preinstall, install, postinstall, prepare or other automatic lifecycle hooks.
- Do not declare DB drivers, ORM implementation, Fastify server/runtime or alternate persistence stacks as add-on dependencies.
- No direct DB/ORM imports, raw SQL, child-process, VM/eval, secret reads via process.env, or unrestricted network calls in add-on source.

## Ownership and security

The API is the sole authority for business persistence, authorization, transactions and audit. Add-ons use SDK descriptors/public contracts and API capabilities. Agent adapters call approved API clients only. Web contributions are browser-safe. Manifest permission declarations do not grant authority; the API policy engine enforces trusted actor, tenant, add-on/version, resource and operation.

Add-on storage defaults to add-on-owned. Existing Odoo data and domain-owned tables cannot be claimed by an add-on. Schema changes are reviewed/versioned; no global schema sync or destructive startup migrations. Disable preserves data and removes active contributions; decommission is a separate approved workflow.

## Static gate

pnpm lint:addons validates every packages/addons/*/addon.manifest.json and its paired package metadata, dependency graph, capabilities, permissions, entrypoints and imports. With no add-ons present, the gate reports that state explicitly; schema and linter regression tests still run under pnpm test.

The gate is static hygiene, not proof of runtime safety or signature validation. The proposed third-party runtime trust boundary remains unapproved until ADR-0003 has owner/security acceptance and adversarial isolation tests.
