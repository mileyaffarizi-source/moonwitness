---
name: mw-identity-secrets-security
description: Implement MoonWitness identity, OIDC/SSO, session, workload identity, authorization integration and secret handling.
---

# Identity and secrets security

## Use when
Changing `apps/id`, login/session/token flows, service identity, API auth middleware or vault integration.

## Read first
[Identity blueprint](../../../BLUEPRINT-ID.MD) and the resource-owning domain's authorization rules.

## Rules
- Prefer a mature standards-compliant OIDC provider; do not invent an OAuth/OIDC protocol or custom token format.
- Use Authorization Code + PKCE for public/native clients. Validate issuer, audience, signature, expiry, allowed algorithms, state/nonce and exact redirect URIs. Define rotation, revocation and replay protection.
- Separate authentication, identity claims, authorization and secrets. Valid login is not blanket permission.
- Resource-owning API evaluates capability, model, record and field access. Never trust role, tenant or permission claims supplied only by the caller or model-generated tool argument.
- Keep access tokens short-lived; rotate/revoke refresh tokens where supported. Browser credentials use secure cookies/BFF where appropriate; native credentials use OS secure storage. Never persist long-lived tokens in localStorage.
- Vault/KMS owns secret values. Applications hold references/policies and obtain short-lived scoped leases through workload identity. ID is not a plaintext secret store.
- Never expose secrets to prompts, tasks, logs, browser bundles, telemetry or source control.

## Verify
Test wrong issuer/audience, expiry, signature/key rotation, redirect mismatch, session revocation, tenant crossover, privilege escalation and denied-by-default behavior. Review logs and traces for secret leakage.
