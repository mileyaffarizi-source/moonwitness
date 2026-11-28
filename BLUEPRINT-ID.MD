# BLUEPRINT-ID — CENTRAL IDENTITY, OIDC & ACCESS

**Document ID:** MW-BP-ID-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission and security boundary

apps/id is the centralized Identity Center for the ecosystem. It provides login entry, account lifecycle, OIDC/SSO client registration, federation, sessions, identity policy, user/profile administration and identity audit.

It is a high-trust security boundary. Do not implement a new cryptographic protocol or casual home-grown OAuth/OIDC server. Prefer integrating a mature standards-compliant Identity Provider through a provider adapter and select the product only after a deployment/security proof of concept.

## 2. Identity vs authorization vs secrets

- **Authentication:** ID/IdP verifies who the principal is.
- **Identity claims:** ID issues/verifies stable subject and agreed identity attributes.
- **Authorization:** each resource-owning domain/API decides what the principal can do on its records and capabilities. A valid login is not blanket permission.
- **Secrets management:** a dedicated vault/KMS manages secret values, encryption keys, certificates and rotation. ID may authenticate a workload and authorize a vault policy but must not store arbitrary plaintext application secrets.

Never embed detailed business permissions, secret values or long-lived provider credentials in ID tokens.

## 3. Protocol and client requirements

Use OpenID Connect Core for authentication and OAuth security best current practice. Use Authorization Code flow with PKCE for public/native clients. Enforce exact redirect URI registration, state/nonce binding as applicable, issuer/audience validation, signing algorithm allowlists, key rotation, short-lived access tokens, refresh-token rotation/revocation where supported, secure logout and replay protections.

Do not use Implicit or Resource Owner Password Credentials grants. For browser clients, review current browser-based OAuth BCP. For native apps, use external user-agent/system browser patterns and registered app redirect/deep-link handling rather than embedding credentials in a webview.

## 4. Identity domain

Core concepts:
- subject/person and account;
- organization/tenant membership;
- authenticator and recovery method;
- OIDC client/application registration;
- IdP connection/federation;
- session/device;
- service account/workload identity;
- group/role/attribute;
- credential metadata (not secret value);
- consent and policy acceptance where applicable;
- security/audit event.

Define uniqueness, lifecycle and recovery. Identity merge/deletion must be carefully reviewed and auditable.

## 5. App and service integration

Every app has a registered client identity, redirect URIs, logout URIs, allowed grant types, scopes, token audience and environment. Separate dev/staging/prod clients. Service-to-service calls use workload credentials or short-lived client credentials, not a human's browser token or shared static API key.

API resource servers validate issuer, signature, audience, expiry, allowed algorithms and required scopes/claims. Authorization is performed at API/domain resource boundary. Propagate actor, initiating human and executing service separately for Agent/DX actions.

## 6. Sessions and devices

Define session TTL/idle timeout, refresh rotation, revocation, device inventory, concurrent sessions, step-up/MFA policy, account recovery, logout propagation and incident response. Desktop and Mobile store only necessary credentials in OS-protected secure storage; browser uses secure cookies/BFF where appropriate. Never put long-lived tokens in localStorage.

## 7. Secret management integration

Use an external secret manager (OpenBao/Vault or approved KMS/secrets service) with identity-based auth, narrow policies, audit, rotation and dynamic credentials where supported. Apps receive short-lived secret leases only when needed. Secret values must never appear in tasks.json, logs, telemetry, prompts, browser storage or Git.

A secret reference is not the secret. Applications store references and policy metadata; the vault stores and serves the protected value.

## 8. Operational safeguards

Threat-model login abuse, account takeover, token theft, redirect manipulation, client confusion, issuer mix-up, key compromise, refresh replay, session fixation, privilege escalation, federation misconfiguration and lost-device scenarios. Provide key rotation/backup/recovery, audit export, rate limits and security alerts.

## 9. Required deliverables

IdP/provider decision ADR; OIDC client registry; trust/claims map; account lifecycle; MFA/recovery policy; session and device policy; service identity; token validation library/contract; vault integration policy; incident/rotation runbook; conformance/security tests.

## 10. Task ownership and completion

Tasks ID-* in tasks.json.

Done means every app uses registered identity clients, tokens are validated by intended resource servers, authorization remains resource-owned, sessions/revocation work, secrets are externalized and security tests cover the relevant flows.


## 11. Client registration and token contract

Every application/environment has a separate registered client record. The registry stores stable client ID, display owner, environment, exact redirect/logout URI set, client type (public/confidential/service), allowed grant/response types, audience/resource indicators, scopes, authentication method, signing-key reference, permitted origins, lifecycle state, owner, review date and rotation/revocation evidence. Secret values and private signing keys remain in the vault/KMS.

Client lifecycle: **proposed → reviewed → registered → active → rotating → suspended/revoked → retired**. A client must not become active merely because a package or app directory exists. Redirect URI changes and new privileged scopes require review and audit. Development, staging and production clients are never interchangeable.

Token validation contract for API and service resource servers:
- pin trusted issuer and discovery/JWKS source; cache keys with bounded refresh and safe unknown-key retry;
- verify signature using an explicit algorithm allowlist, issuer, audience, expiry, not-before and required token type/claims;
- distinguish ID token from access token; never accept an ID token as an API bearer token;
- reject missing/ambiguous subject, tenant/organization context, audience or scope where required;
- handle signing-key rotation overlap, emergency key revocation and issuer outage explicitly;
- avoid putting volatile business permissions, customer data or vault values into tokens;
- record authentication result and key ID without logging the bearer token.

## 12. Human, workload and delegated identity

Keep three identities separate in every privileged trace: **initiating human**, **calling workload/agent**, and **target resource identity**. An Agent/DX request must not replace the human actor with the service account or claim the service account is the approving human.

Define delegation as a short-lived, audience-bound grant with allowed operation, resource/tenant scope, expiry, policy version and original actor reference. Token exchange/on-behalf-of semantics must be chosen from a supported standard/provider capability; do not invent a custom bearer-token format.

Human MFA/step-up is risk-driven for account recovery, finance-sensitive actions, production approvals, secret access and identity-administration changes. A workload identity cannot satisfy a human approval gate.

## 13. Session, recovery and incident state

Specify session states, idle/absolute TTL, refresh-token rotation/reuse detection, logout/revocation propagation, concurrent device policy, risk events and recovery. Account recovery must not silently bypass MFA or privileged approval. Lost-device handling revokes the specific device/session and allows review of recent actions.

Operational SLOs are to be measured and approved before production: login availability/latency, revocation propagation, JWKS/key-rotation recovery, federation error rate and account-recovery completion. Runbooks cover IdP outage, compromised client, signing-key compromise, refresh-token replay, mass revocation and tenant/issuer misconfiguration.

## 14. Test and rollout acceptance

- OIDC conformance/provider integration tests cover code + PKCE, nonce/state, issuer/audience, redirect exact-match and logout.
- Negative tests cover algorithm downgrade, wrong issuer/audience, expired/not-yet-valid token, ID-token misuse, unknown key, replayed refresh token and revoked session.
- Cross-client tests prove dev/staging/prod redirect and audience separation.
- Workload tests prove service credentials cannot impersonate human approvals.
- Recovery drills prove key rotation, session revocation, lost-device flow and IdP outage behavior.
- Rollout starts with one non-production client and one API resource server; expand by client/environment after measured telemetry and security review.

**Acceptance:** every app client is registered and independently scoped, every resource server validates the intended issuer/audience, delegated operations preserve the initiating human, session revocation is observable, and secrets never enter tokens/logs/tasks.
