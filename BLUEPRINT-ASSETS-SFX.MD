# BLUEPRINT-ASSETS-SFX — SOUND EFFECTS & AUDIO EXPERIENCE

**Document ID:** MW-BP-SFX-001 · **Version:** 1.0.0  
**Parent:** [BLUEPRINT-DESIGN-ASSETS.MD](./BLUEPRINT-DESIGN-ASSETS.MD) · **Task registry:** [tasks.json](./tasks.json)

## 1. Purpose

Sound is an optional feedback and atmosphere layer for entry, navigation, discovery, interaction and state changes. It must never be required to understand, authorize or complete an action. It respects browser autoplay restrictions and user preferences.

## 2. Sound categories

- **Threshold:** entry/exit, portal activation and world arrival.
- **Navigation:** focus, selection, open/close and transition.
- **Feedback:** success, warning, error, blocked, attention and approval.
- **Mission:** start, milestone, paused, completed and failed.
- **Research:** source reveal, evidence link, timeline transition and discovery cue.
- **Ambient:** optional low-level world ambience.
- **Accessibility:** optional audio-assisted cues, never a replacement for text/visual state.

## 3. World sound identity

**RockSoul:** cinematic, futuristic and spatial, layered but restrained.  
**MoonWitness:** quiet, atmospheric, precise and investigative; discovery must not sound like proof.  
**Story Worlds:** work-specific emotional palette with documented rights.  
Operational warning/error cues must be distinguishable from narrative ambience.

## 4. Asset metadata and formats

Each SFX record includes stable asset ID, category, world/feature, semantic event, editable master/source, provenance/creator/license, sample rate/bit depth/channels/duration/loudness, peak/clipping result, normalized variant, loop/fade metadata, description, status/version/checksum and reviewer.

Keep WAV or another editable/high-quality source master where available. Test browser support and quality before choosing OGG/MP3 delivery policy. Do not convert low-quality compressed files into supposed masters.

## 5. Playback rules

- No autoplay before valid user interaction and appropriate consent.
- Provide master mute and separate ambience/SFX controls.
- Keep audio preference separate from reduced motion.
- Limit simultaneous layers and stop obsolete sounds on route/state change.
- Prevent duplicate playback from rerenders or hydration.
- Preload only small priority cues; lazy-load ambience/large files.
- Audio load/decode failure must not break UI.
- Never play in tests unless specifically mocked/verified.
- A sound is triggered by semantic state transition, not arbitrary component mount.

## 6. Event mapping

Map each sound to event name, authorizing state transition, asset ID/version, volume class, cooldown/debounce, quiet/reduced mode behavior, analytics policy and fallback. Do not repeat cues for polling updates. A cue fires only on a meaningful state transition.

## 7. Rights, safety and accessibility

Unknown rights means blocked from production. Preserve attribution/source. Important information needs text equivalent. Avoid startling, excessive loudness or high-frequency cues. Mute must remain obvious and accessible. Audio briefs and related artwork obey all creative restrictions.

## 8. Quality gates

No clipping or accidental silence; appropriate loudness; clear semantic distinction; no repetition loops; works with mute/no audio device/autoplay blocked; file size/decode time within measured budget; rights/source/version recorded.

## 9. Deliverables and ownership

Deliver event map, SFX inventory, world style guide, editable masters, optimized variants, manifest, playback service, preferences, accessibility mapping and validator.

Tasks **SFX-001 through SFX-007** in [tasks.json](./tasks.json).

## 10. Definition of done

Audio enhances optional experience but never blocks function, never plays unexpectedly, has mute/quiet paths, is optimized and traceable, and maps only to real semantic state transitions.


## 11. Audio event contract and playback lifecycle

A sound event is bound to a meaningful application state transition, not a render, poll or animation frame. Each binding declares event ID/version, authoritative state source, asset ID/version, volume class, cooldown, concurrency limit, mute/quiet/reduced mode behavior, route cancellation rule and analytics policy.

Playback lifecycle: **requested → user_preference_checked → asset_loaded → played → completed / interrupted / failed**. If the asset fails to load, playback is blocked by preference/autoplay policy or the device is unavailable, the UI continues normally and text/status remains authoritative.

Audio cues must not imply approval, successful execution, factual verification or incident resolution before the domain API reports that state.

## 12. Audio QA and acceptance

Automated checks inspect duration, channel/sample-rate metadata, peak/clipping, file-size limits, loop boundaries and manifest integrity. Manual review covers loudness, headphone/speaker quality, semantic distinctness, startling/overlapping sounds and world identity. Test first-gesture/autoplay policy, mute persistence, route-change cancellation, duplicate polling events, no-audio device and reduced sensory mode.

**Acceptance:** one approved semantic transition plays at most one appropriate optional sound; user preferences always win and the product remains fully usable with all audio disabled.
