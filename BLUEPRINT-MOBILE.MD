# BLUEPRINT-MOBILE — NATIVE MOBILE EXPERIENCE

**Document ID:** MW-BP-MOB-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission

apps/mobile provides native Android/iOS access to the platform's selected user journeys: MoonWitness discovery/community, notifications, ISP subscriber experience, approvals, missions and other app surfaces approved for mobile.

It is a distinct native client, not a small copy of every desktop screen.

## 2. Runtime approach

React Native with Expo and Expo Router is the preferred candidate for a first proof of concept, using Node.js/pnpm monorepo support. Revalidate native module/monorepo compatibility on the selected Expo SDK before adoption. Share API contracts, validation schemas and design tokens where they are browser/native safe; do not share server-only code.

## 3. Identity and token storage

Authenticate through apps/id using standards-based external browser/system authentication and Authorization Code + PKCE. Register exact app redirect/deep-link URIs. Store only necessary refresh/session data using platform secure storage (for example Expo SecureStore / OS Keychain/Keystore), never AsyncStorage for secrets. There is no equivalent secure browser storage; Web uses secure cookies/BFF.

Never embed client secrets in mobile binaries. Validate tokens on API resource servers. Refresh/revoke safely and handle lost devices.

## 4. Mobile capabilities

- push notifications with user preferences and deep links;
- secure inbox and task/approval notifications;
- selected community/research browsing;
- subscriber service status/support where authorized;
- offline reading cache for approved non-sensitive content;
- media capture/upload with file type/size/consent validation;
- camera/biometric/native capabilities only with explicit permission;
- app update and minimum supported API version.

## 5. Offline and synchronization

Define per-domain offline policy. Cache source/version metadata. Queue only safe idempotent user intents. Do not execute a delayed order, payment, network change or privileged approval without reconfirming state and user intent. Resolve conflicts explicitly. Show stale/offline state.

## 6. Accessibility and performance

Support platform accessibility APIs, dynamic type, screen readers, contrast, reduced motion and touch target sizes. Optimize images/media, startup and battery usage. Avoid continuous high-cost FX. Do not sacrifice native interaction quality to force identical Web UI.

## 7. Security and release

Use device attestation/risk signal only as defense in depth, not the sole authorization. Protect local data, validate deep links, pin no unchangeable credentials, scan dependencies, sign releases and define lost-device revocation. Push notifications must not expose sensitive account or network details on lock screens by default.

## 8. Task ownership and definition of done

Tasks MOBILE-* in tasks.json. Done means signed Android/iOS builds can authenticate, securely store minimum session material, use authorized APIs, handle push/deep links, recover from offline state and pass accessibility/security checks.


## 9. Mobile notification and offline data contract

A push payload contains only a non-sensitive notification ID, generic event category and safe deep-link reference. Customer name, subscriber address, invoice data, network credential or sensitive action detail must not appear in lock-screen payload by default. The app fetches current authorized details after authenticating.

Push delivery is best-effort, not proof that an event was read or an action approved. Deep links are allowlisted, versioned and re-authorized at the API when opened. A notification must expire or show stale state when its source event/resource is no longer current.

Offline cache policy is defined per domain: public corpus may be cacheable by rights; community/PII requires access-aware private storage; subscriber and operational information has explicit TTL/encryption/purge; privileged actions are never queued for silent execution. Reconnect performs authoritative refresh and surfaces conflict/expiry.

## 10. Consent, device and abuse controls

Request camera, microphone, location, notification and biometric permissions only at the moment a feature needs them with clear purpose. Biometric unlock gates local session access but does not replace server-side authentication or transaction approval. Lost-device revocation must be actionable from ID/security support.

Rate-limit login/recovery, uploads, community interactions and notification registration. Apply device revocation, token rotation, abuse reporting and privacy retention. Avoid collecting precise location unless a user feature actually requires it.

## 11. Release and compatibility matrix

Track OS minimum version, architecture, Expo/React Native SDK, native module compatibility, API minimum version, push provider settings, signing identity and store review status. Roll out internal test → closed beta → production by platform. Rollback/disable remote feature flags without deleting user data.

## 12. Acceptance

Tests cover PKCE/OIDC, secure storage, token revocation, deep-link allowlist, notification redaction, cache expiry/purge, offline conflict, accessibility/dynamic text, upload validation, lost-device recovery and minimum API compatibility.

**Acceptance:** a test user can complete one approved mobile journey securely online/offline with private push notifications, fresh authoritative state, accessible fallback and revocable device identity.
