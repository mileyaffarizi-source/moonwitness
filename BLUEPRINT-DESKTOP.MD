# BLUEPRINT-DESKTOP — GENERAL DESKTOP EXPERIENCE

**Document ID:** MW-BP-DESK-001 · **Version:** 1.0.0  
**Parent:** BLUEPRINT-APPLICATIONS.MD · **Tasks:** tasks.json

## 1. Mission and distinction from DX

apps/desktop is the general desktop client for users, researchers, operators and creators using platform products. It is not the developer IDE/orchestrator; that belongs to apps/dx.

Desktop may provide persistent workspace, richer multi-window workflows, notifications, local file integration and secure access to Web/API experiences.

## 2. Product capabilities

- Sign in through central apps/id.
- Open authorized worlds and product workspaces.
- Present long-form research/content and operational views.
- Receive actionable notifications and approval requests.
- Handle permitted local files/import/export with explicit user choice.
- Support deep links, OS notifications and secure document handoff.
- Optionally provide offline read cache for explicitly approved data classes.
- Integrate with Web/API through typed contracts.

## 3. Runtime approach

Evaluate Tauri 2 as a lightweight native shell candidate; compare against Electron and a Progressive Web App baseline. Decision must consider OS coverage, WebView behavior, native plugins, update mechanism, signing, accessibility, security capabilities and team expertise.

If Tauri is selected, grant each window only the native capabilities it needs. Do not expose unrestricted filesystem, shell, process or network privileges to the WebView. Native commands validate inputs and enforce caller permissions.

## 4. Identity and local data

Use apps/id OIDC flow. Store only necessary session material in platform secure storage/keychain. Do not store passwords or vault secrets in application config. Encrypt local cache where sensitive. Define cache expiry, logout purge, device revocation and recovery behavior.

## 5. Offline behavior

Offline support is explicit by data class and feature. Show last sync time and stale state. Queue only operations with idempotency and safe reconciliation. Do not queue privileged/destructive actions for automatic execution after reconnect.

## 6. UX and accessibility

Share design tokens and API clients where useful, but adapt interactions to desktop windowing, keyboard, native notification and high-density workflows. Respect accessibility and reduced motion. Never require animation/audio to understand state.

## 7. Security and release

Use code signing, signed updates, dependency scanning, platform permissions, safe IPC, deep-link validation, secure auto-update and incident/rollback policy. Do not include API/IdP/vault master credentials in packaged binaries.

## 8. Task ownership and definition of done

Tasks DESKTOP-* in tasks.json. Done means a signed test desktop app can authenticate through apps/id, open an authorized real workflow, safely manage permitted local state and update through a verified release channel.


## 9. Native capability and IPC contract

Desktop native operations are capability-based. Each command declares caller/window identity, purpose, allowed input schema, permitted paths/resources, confirmation requirement, audit class, timeout and result schema. WebView content cannot construct an arbitrary filesystem path, process command or URL and have it executed by the native host.

Deep links are parsed against an explicit route allowlist; they cannot inject shell arguments, arbitrary file paths or token values. Inter-window messages are versioned and validated. File access uses user-selected handles/permissions and minimum scope.

## 10. Update, rollback and incident behavior

A release manifest records app version, platform/architecture, provider artifact checksum/signature, minimum supported API, signing identity and release channel. Verify artifact signature before install; staged rollout and rollback retain the last known-good version. A compromised update key has a documented revoke/reissue process.

Crash reporting and diagnostics are opt-in/transparent and redact document paths, user content, tokens and local secrets. Define supported OS versions and signing/notarization requirements as a release matrix after a real proof of concept.

## 11. Acceptance

- Authentication uses the registered ID client and an external/system browser flow where required.
- Native command allowlist denies path traversal, arbitrary process execution and untrusted deep links.
- User-selected file access is bounded to the granted file/directory.
- Offline cache displays revision and freshness; sensitive cache purges at logout/revocation.
- Signed update verification rejects tampered or wrong-platform artifacts.
- Keyboard, screen-reader, high-DPI, reduced-motion and window lifecycle tests pass.

**Acceptance:** a signed test build can enter a real permitted workflow without turning Desktop into a privileged developer console or a second DX implementation.
