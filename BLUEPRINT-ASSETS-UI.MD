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