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