# BLUEPRINT-ASSETS-UI — DESIGN SYSTEM, UI COMPONENTS & MOTION

**Document ID:** MW-BP-UIA-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT-DESIGN-ASSETS.MD](./BLUEPRINT-DESIGN-ASSETS.MD) · **Task registry:** [tasks.json](./tasks.json)

## 1. Direction

The UI asset system creates an original immersive anime-game experience without reducing usability to spectacle. It supports spatial/cinematic worlds and dense research, evidence, permissions and operations clearly.

Not acceptable as a complete strategy: generic SaaS dashboard, stock dark theme with purple gradients, random glassmorphism, unbounded particles, illegible display fonts or decorative animation on every component.

## 2. UI asset layers

1. **Tokens:** color, typography, spacing, radius, border, elevation, depth, motion, breakpoints and z-index.
2. **Themes:** platform base and independently owned world themes.
3. **Primitives:** buttons, links, fields, focus rings, surfaces, typography, dialog, tooltip, tabs, progress and status.
4. **Compositions:** portal, mission card, evidence panel, source citation, timeline node, world selector, asset browser and approval panel.
5. **Layouts:** immersive shell, editorial/research, mission/operations and explorer layouts.
6. **FX:** atmosphere, particles, energy borders, light, motion and transitions.
7. **Accessibility:** keyboard, focus, reduced motion, contrast and screen reader behavior.

## 3. Design token contract

Create semantic tokens, not arbitrary color values. Include roles for canvas/surface/elevated surface/text/muted text/border/focus/accent/success/warning/danger/info; world-scoped accents; typography roles; spacing/density scales; radius/border; elevation/depth/shadow; motion durations/easing; responsive breakpoints/content widths; and named z-index layers.

World themes cannot weaken contrast, focus visibility or status semantics. Make contrast pairs and token references machine-testable.

## 4. Distinct visual identity

**ROCKSOUL:** cinematic portals, spatial depth, bold geometry, controlled luminous energy, exploration navigation.  
**MOONWITNESS:** lunar/editorial atmosphere, precision, restrained celestial FX, source/evidence clarity and readable research density.  
**STORY WORLDS:** work-specific typography, emotional palette and scene composition.  
**OPERATIONS:** legible information density and honest status semantics; never hide failure behind metaphor.

## 5. Component contract

Each component defines stable ID, owner/version, purpose, semantic element, variants, props/slots/events, tokens, loading/empty/error/disabled/hover/focus/active states, keyboard behavior, screen-reader labels, responsive behavior, reduced-motion fallback and tests.

Build compositions from primitives. Avoid duplicated components with near-identical behavior.

## 6. Motion and FX

Motion communicates entry/exit, content reveal, async progress, reversible interaction feedback, navigation hierarchy or approved narrative transition. FX layers must not intercept input or obscure text. Prefer transform/opacity; limit blur, full-screen filters and continuous canvas loops. Provide reduced-motion and low-performance modes.

A local animation may never claim an operation completed before authoritative API state confirms it.

## 7. UI states and data integrity

Data-backed components support relevant loading, stale, empty, error, forbidden, offline/reconnecting, partial and success states. Success animation follows API state, not a local timer. Production screens do not use demo data as real records.

## 8. Story and evidence components

Create accessible patterns for source/provenance, claim/evidence, verified/unverified/disputed status, editorial annotation vs quotation, version comparison, work/edition/chapter/scene navigation, timeline, relationship graph, mission status and approval review.

Graphs need equivalent list/table navigation. Timelines expose dates and relation context textually. Color alone cannot express verification.

## 9. Technology and formats

Use TypeScript/CSS variables for tokens, shared validated JSON only for interchange, approved motion technology and licensed fonts. Do not add competing component/motion libraries without an ADR. Keep asset masters separate from runtime bundles.

## 10. QA

Visual regression at defined viewports/themes; keyboard/focus/form/contrast/reduced-motion/screen-reader checks; bundle size; render performance; slow-network and partial API failure testing.

## 11. Deliverables and ownership

Deliver token catalogue, theme catalogue, component inventory/contracts, responsive layouts, motion/FX guidelines, Story/MoonWitness patterns, accessibility evidence and performance baseline.

Tasks **UIA-001 through UIA-008** in [tasks.json](./tasks.json).

## 12. Definition of done

A reusable UI system supports three distinct experience modes, tokenized consistency, component-state coverage, accessible/reduced-motion paths, visual regression and measurable performance. It is original without compromising operational truth.


## 13. Design token ownership and change process

The platform token set has one canonical owner and version. A world theme may override only named semantic tokens; it cannot redefine focus, danger/success meaning, contrast minimum, typography legibility or interaction state. Token changes include before/after values, affected components/worlds, contrast checks, screenshots and migration note.

Components declare stable ID, owner, API/state contract, accessibility behavior and supported themes. Shared primitives may not import app-specific business state. Domain compositions may depend on primitives but not duplicate their state semantics. Breaking component behavior requires versioned migration and affected-app tests.

## 14. Operational truth and evidence semantics

Every data-backed UI component maps its state to an authoritative source and freshness rule. At minimum distinguish loading, empty, stale, offline, partial, forbidden, failed, pending, queued, running, succeeded, rejected and unknown. Do not reuse a green success treatment for queued or acknowledged state.

Evidence widgets identify source, source revision, locator, reviewer/status and date. Graphs have a textual list/table alternative. Approval panels show exact operation, resource, payload summary/hash, expiry and approver; a decorative animation cannot act as approval.

## 15. Motion and visual QA profile

Each motion preset specifies duration, easing, distance/scale, interruptibility, reduced-motion behavior, low-performance fallback and whether it is essential to comprehension. Continuous motion must have a documented user benefit and a measurable frame/CPU budget. Avoid parallax/blur that breaks hit testing, focus or readability.

Visual regression uses fixed test data, viewport, theme and font versions. Separate expected dynamic regions from genuine regressions; never approve a snapshot solely because a generated screen looks attractive.

**Acceptance:** tokens and components are versioned/owned, every operational state is truthful, essential information survives reduced motion/no animation, and theme changes cannot weaken accessibility or status semantics.
