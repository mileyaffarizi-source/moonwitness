# BLUEPRINT-DESIGN-ASSETS — CREATIVE ASSET GOVERNANCE

**Document ID:** MW-BP-DAS-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT.md](./BLUEPRINT.md) · **Task registry:** [tasks.json](./tasks.json)

## 1. Purpose

Define shared governance for design/creative assets: UI components, motion, SFX, artwork, character references, vector marks, logos and icons. Child specifications define their own formats and family quality criteria.

The asset library is a governed product capability, not an untracked folder of images. Every production asset has owner, source, rights/provenance, version, target use, technical properties, review state and relationship to the world/feature it serves.

## 2. Asset taxonomy

| Family | Specification | Typical content |
|---|---|---|
| UI | [BLUEPRINT-ASSETS-UI.MD](./BLUEPRINT-ASSETS-UI.MD) | tokens, components, layouts, themes, interaction states |
| SFX | [BLUEPRINT-ASSETS-SFX.MD](./BLUEPRINT-ASSETS-SFX.MD) | effects, feedback, ambience, transitions |
| Artwork | [BLUEPRINT-ASSETS-ARTWORK.MD](./BLUEPRINT-ASSETS-ARTWORK.MD) | illustrations, environments, backgrounds, posters |
| Character | [BLUEPRINT-ASSETS-CHARACTER.MD](./BLUEPRINT-ASSETS-CHARACTER.MD) | approved fictional character records/sheets |
| Vector/logo/icon | [BLUEPRINT-ASSETS-VECTOR-LOGO-ICON.MD](./BLUEPRINT-ASSETS-VECTOR-LOGO-ICON.MD) | identity marks, symbols, icons, vector assets |

Editable source files and production exports remain linked.

## 3. Canonical asset record

Every record includes immutable asset ID; name/family/world/product/feature; owner and creator where known; source/provenance; license/rights and permitted distribution; version/revision and parent/derived asset; format/dimensions/color space/duration/channels/frame rate as applicable; semantic tags and intended placement; responsive variants; alt text/transcript/decorative flag; optimization details; status (proposed/draft/in review/approved/production/deprecated/rejected/blocked_policy); reviewer/approval reason; checksum for immutable releases.

No production asset is approved based only on filename or generated preview.

## 4. Source, rights and provenance

Classify inputs as original, user-provided, licensed/stock, public-domain, open-license with conditions, generated derivative or unknown/unverified. Unknown provenance means blocked from publication/distribution until reviewed. Preserve source link, author attribution, license version and required notices.

Generated assets record prompt/source context, provider/model, creation date, reviewer and reference relationship. This metadata does not grant rights that do not exist.

## 5. Source versus derivative

Keep editable master separate from optimized delivery:
- vector master → SVG/PNG/ICO/WebP;
- artwork master → responsive WebP/AVIF/PNG;
- audio master → compressed delivery formats;
- animation source → optimized runtime/fallback;
- UI source → tokens/components/code and compiled bundle.

Never overwrite a master with optimized export. Record derivation settings and tool/version where practical.

## 6. Naming and organization

Use stable IDs and lowercase kebab-case names, e.g. **mw-moonwitness-evidence-orbit-v001.svg**. Version immutable release masters. Never encode secrets or personal data in filenames.

Suggested locations, subject to repository audit: assets/ui, assets/sfx, assets/artwork, assets/characters, assets/vector, assets/manifests, assets/source and assets/exports. Do not create empty folders merely to match a diagram.

## 7. Asset manifest and runtime loading

A typed manifest declares ID/family/world, source path, production variants, MIME, dimensions/duration, integrity hash, preload/lazy-load behavior, accessibility metadata, rights status and version. UI resolves assets by manifest ID, not arbitrary constructed paths/URLs.

Validate missing references at build time. Reject unknown/blocked assets in production manifest. Use immutable names/content hashes. Keep large source masters outside browser bundles.

## 8. Quality gates

**Visual:** correct world identity, readable composition, scale, contrast, no clipping, no unintended artifacts or restricted depiction.  
**Audio:** format, loudness, peak, duration, rights and transcript/context.  
**UI:** semantics, keyboard, responsive layout, states and reduced motion.  
**Security:** safe MIME, size limits, no executable untrusted SVG/HTML, path traversal protection and malware scanning for uploads.  
**Rights/canon:** provenance, usage rights, exact authored text and human review.

## 9. Lifecycle

**discovered → catalogued → sourced/created → draft → technical review → creative/canon review → rights review → approved → published → monitored → deprecated/archived**

A change in source, rights, canon status, target world or major composition may invalidate previous approval. Keep review evidence and version history.

## 10. Accessibility and performance

Meaningful images need useful alt text; decorative images are marked decorative. Audio has text alternatives where it conveys information. Motion has reduced-motion fallback. Use dimensions, responsive variants, compression and correct lazy/preload behavior. FX must not block interaction.

## 11. Restricted creative content

Never create visual depictions of Allah, Prophet Muhammad or Isa/Jesus. Preserve permitted textual references only in authored context. Do not represent them as avatars, portraits, silhouettes, game units, stand-ins or visual embodiments. Apply this across all asset families and derivatives. If uncertain, block and request human review.

## 12. Deliverables and task ownership

Deliver taxonomy, metadata schema, provenance/rights policy, directory/naming standards, manifest validator, review workflow, derivative pipeline, accessibility checklist, security checks and asset-library UX.

Tasks **DAS-001 through DAS-008** in [tasks.json](./tasks.json). Child task groups: UIA, SFX, ART, CHR and VEC.

## 13. Definition of done

No production asset is untraceable. The platform resolves assets deterministically, preserves editable sources, blocks unapproved/restricted content, validates rights/provenance, produces optimized derivatives and provides accessible alternatives.