# BLUEPRINT-ASSETS-VECTOR-LOGO-ICON — IDENTITY MARKS & VECTOR SYSTEM

**Document ID:** MW-BP-VEC-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT-DESIGN-ASSETS.MD](./BLUEPRINT-DESIGN-ASSETS.MD) · **Task registry:** [tasks.json](./tasks.json)

## 1. Scope

Govern logos, wordmarks, world marks, symbols, interface icons, pictograms, badges and vector illustrations. A logo expresses identity; an icon communicates an action or concept. They are not interchangeable.

## 2. Identity architecture

Maintain distinct identity records for:
- The Living Platform;
- RockSoul;
- MoonWitness;
- individual Story Worlds only when source or approved identity brief establishes them;
- A-L-L-A-H.COM — EMPIRE OF THE LIGHT.

A shared design system may provide common construction rules but must not erase distinctive marks or world identity. Do not invent an official logo when only a name/text treatment is known; label proposals exploratory.

## 3. Logo brief and master

Each mark defines stable asset ID, owner/world/brand hierarchy, intended meaning and source/approval, primary/monochrome/reversed/compact variants when justified, clear space, minimum size, prohibited alterations, colors/contrast, optical alignment, editable vector master, delivery exports/checksum, rights/provenance and version.

Use vector source as master. Export raster/favicon variants only where required. Never edit a raster export and call it the master.

## 4. SVG security

Production SVG must be sanitized: no scripts, event attributes, foreign objects, executable references or external network loads; no unbounded filters/pathological complexity; explicit viewBox; accessible title/description where appropriate; predictable dimensions/color inheritance; automated linter and render tests.

Untrusted uploaded SVG is not injected inline before sanitization. Use safe image embedding where inline interactivity is unnecessary.

## 5. Icon system

Define icon grid, stroke/fill rules, optical sizes, baseline, corner/negative-space conventions and semantic families for navigation, actions, status, evidence, worlds and operations.

Every icon has semantic ID/name, category, intended/prohibited meaning, size variants, source/master, theme behavior, accessibility label/decorative flag, license/provenance, version and review status.

A status icon cannot imply verification, security approval or successful execution unless authoritative state confirms it. Pair status with text or accessible label.

## 6. Religious and canon boundaries

Do not create marks/symbols functioning as visual depictions of Allah, Prophet Muhammad or Isa/Jesus. Preserve allowed names/taglines only as authored text. Avoid representational substitutes, silhouettes, avatars or visual embodiments. Do not infer sacred meaning for a generic motif without source approval.

## 7. Exact text handling

Protected strings:
- ROCKSOUL — THE LIVING UNIVERSE
- MOONWITNESS — WHEN THE MOON WITNESS, WE SHARE A MESSAGE
- A-L-L-A-H.COM — EMPIRE OF THE LIGHT
- SUNSHINE BELONG
- FIND LIGHT IN DARKNESS
- HOW U REMIND ME

Store strings in source-of-truth registry. Preserve exact text in visual treatments; validate kerning/legibility without changing spelling.

## 8. Quality assurance

Render at intended sizes/themes; inspect optical balance and pixel snapping; verify contrast/monochrome/clear space/minimum size; sanitize SVG; validate accessibility labels; check prohibited depictions; compare to approved source; confirm export/cache versions.

## 9. Deliverables and ownership

Deliver identity inventory, approved logo/wordmark masters, icon grid/rules, semantic registry, sanitized SVG pipeline, export matrix, usage rules and visual QA evidence.

Tasks **VEC-001 through VEC-008** in [tasks.json](./tasks.json).

## 10. Definition of done

Every production mark has approved meaning, separate source/exports, stable identity, correct world ownership, sanitized SVG, accessible use, version history and documented rights. Exploratory concepts are never mistaken for official identity.


## 11. Vector asset publication pipeline

Vector pipeline: **source/brief → editable master → semantic review → rights/canon review → sanitizer → static render/size tests → export variants → manifest approval → consuming-app integration**. Sanitization is mandatory for externally supplied or generated SVG before any inline rendering.

The sanitizer allowlist specifies XML elements, attributes, namespaces, path/gradient/filter limits and reference policy. Reject script, event handlers, foreignObject, external href/url, embedded HTML, data-URI payloads, CSS imports, oversized path complexity and unsupported animation. Do not allow SVG to fetch remote resources.

## 12. Semantic and identity review

A world mark/wordmark and a functional icon have different approval records. Confirm intended identity, owner, meaning, usage scope and prohibited interpretations. Do not use a generated logo proposal as an official identity without the brand owner approval. Sacred/restricted-content checks apply to visual geometry and symbolic stand-ins as well as explicit figures.

Icons must have consistent visual weight/grid, readable optical size, explicit semantic name and accessible label or decorative status. An icon alone cannot communicate destructive action, permission or operational success.

## 13. Export and compatibility matrix

For each approved master, export only required variants: SVG, raster sizes, favicon/app icon, monochrome/high-contrast and theme variants where justified. Record viewBox, intrinsic dimensions, color inheritance, minimum size, clear-space rules, MIME and checksum. Test on light/dark/world themes, high-DPI, disabled color, small sizes and screen-reader path.

**Acceptance:** published logo/icon artifacts originate from an approved master, are sanitized, readable at target sizes, have correct identity/accessibility metadata and cannot load external content.
