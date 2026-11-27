# BLUEPRINT-WEB — NEXT.JS EXPERIENCE REALM

**Document ID:** MW-BP-WEB-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)  
**Runtime:** Node.js LTS + pnpm · **Framework:** Next.js App Router

## 1. Mission

**apps/web** is the Experience Realm: the environment through which humans enter, navigate, understand, create, investigate, review and operate the Living Platform. It must feel like a coherent living universe, not a generic SaaS dashboard with dark colors and gradients.

The visual direction is immersive anime/game FX, cinematic and emotionally expressive, while remaining accessible, fast, legible and trustworthy.

## 2. Authority boundary

Web owns presentation, interaction state, route composition, responsive layouts, client-side UX validation, themes, visual effects, streaming presentation and typed API clients.

Web does not own business rules or authoritative record state; permission decisions; database access/MikroORM; direct Odoo access; private Agent runtime/provider credentials; or domain calculations that belong in API.

UI permissions only hide/disable controls for clarity. API authorization is mandatory for every request.

## 3. Runtime and architecture

Use Node.js LTS, pnpm, Next.js App Router and TypeScript. Server Components are default for data-oriented composition; Client Components are for interaction, animation, browser APIs and local state only where necessary.

Layers:
1. route segments and layouts;
2. world/realm composition;
3. add-on feature contributions;
4. shared UI primitives and visual engines;
5. typed API client and validated response adapters;
6. design tokens, themes and asset manifest;
7. accessibility/performance instrumentation.

Keep server-only code out of client bundles. Never import Fastify, MikroORM, DB drivers, secrets or private Agent runtime into browser code.

## 4. Primary journey

**THE THRESHOLD → UNIVERSE ENTRY → WORLD SELECTOR → WORLD EXPERIENCE → MISSIONS / STORY / RESEARCH / EVIDENCE / OPERATIONS**

The Threshold is the intentional entry sequence into RockSoul's universe. Authentication may be included, but remains understandable, accessible and usable with reduced motion.

## 5. Navigation and worlds

Use a registry-driven, permission-aware world catalog. Do not hardcode every future world or assume all users can access every world. Each world contribution declares stable ID, name, description, theme ID, icon/asset references, entry route, required capabilities, status and navigation metadata.

Preserve distinct identities:
- RockSoul: spatial exploration and portals.
- MoonWitness: source-aware research, evidence and narrative discovery.
- Story Worlds: work-specific composition, not one generic template.
- Operations/Agent control: clear operational state, not fictionalized risk.

## 6. Experience screen families

Prioritize a complete vertical slice for:
1. The Threshold and session entry.
2. Universe home/world selector.
3. Mission Board.
4. Agent Control Room and run detail.
5. MoonWitness StoryTelling and work/edition view.
6. Fact Exposure and evidence chain.
7. Change Advisory Board proposal/review.
8. Story archive and timeline.
9. Creative Asset Library.
10. Add-on directory/capability detail.
11. Model/registry diagnostics for authorized operators.
12. Monitoring, user access, audit and configuration.

A screen is complete only with real API integration, authorization-aware empty/loading/error states, responsiveness, accessibility and operational feedback.

## 7. Data fetching and mutation

Use generated/shared API contracts. Validate API responses at trust boundaries. Handle private credentials server-side. Never serialize secrets to Client Components. Use optimistic updates only for reversible/recoverable operations. Refetch/invalidate according to contract. Show pending/succeeded/failed/partial states. Handle expired sessions/revoked permissions. Bound large lists and graph queries.

## 8. Real-time and long-running work

Render Agent/workflow/job state only from API-owned contracts. Prefer SSE for one-way updates where sufficient; use WebSocket only for required bidirectional interaction. Reconnect with bounded backoff, preserve last event ID when supported, show disconnected/stale state and refresh authoritative state after reconnect.

Do not show completed because an animation finished. Completion is confirmed by API state.

## 9. Visual and motion system

Consume [BLUEPRINT-DESIGN-ASSETS.MD](./BLUEPRINT-DESIGN-ASSETS.MD) and [BLUEPRINT-ASSETS-UI.MD](./BLUEPRINT-ASSETS-UI.MD).

Use centralized semantic tokens. Theme hierarchy is platform → world → feature → user preference, with no arbitrary runtime CSS injection. FX must not block hit testing or keyboard operation. Heavy assets are lazy-loaded. Avoid continuous animation on every component. Keep contrast and focus visible. Provide adaptive visual quality and reduced-motion mode.

## 10. Accessibility and input

Target WCAG 2.2 AA as project quality goal. Provide keyboard navigation, visible focus, semantic landmarks, accessible names, logical headings, form labels/errors, screen-reader announcements, contrast, reduced motion, non-color status indicators and usable touch targets.

Game-like interactions cannot be the only completion path. Important mission, review and configuration actions need an accessible route.

## 11. Security

Use secure session cookies and server-side token handling where applicable. Apply CSRF controls for cookie-authenticated state changes, output encoding, URL validation, CSP, dependency scanning and safe file preview/download. Do not store long-lived credentials in localStorage. Route protection never replaces API authorization.

## 12. Performance

Measure Web Vitals, route bundle size, image/font payloads, animation frame rate, hydration, API latency and memory. Use responsive images, subsets, code splitting, dynamic imports and bounded particles. Test reduced CPU/GPU and mobile viewport. Set budgets after baseline measurement, not by guessing.

## 13. Tests

Unit tests for components and state; API contract tests; Playwright critical journeys; automated plus manual accessibility; visual regression for stable components/themes; reduced-motion tests; denied/expired-session scenarios; real Agent run status and reconnect flows.

## 14. Task ownership

Tasks **WEB-001 through WEB-010** in [tasks.json](./tasks.json).

## 15. Definition of done

Users can enter the universe, navigate enabled worlds, complete a real authorized workflow, understand evidence and operational state, recover from failure and use keyboard/reduced motion. All business state comes from API contracts; visuals never imply success or truth not established by platform.