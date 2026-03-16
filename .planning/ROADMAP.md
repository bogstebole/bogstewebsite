# Roadmap: Anime Close-Up Intro

## Overview

Three phases to replace the existing intro sequence with a dramatic anime close-up moment. Phase 1 lays the foundation — the close-up sprite asset and the first-visit gate. Phase 2 delivers the cinematic core — the lunge animation and all visual effects that make the moment land. Phase 3 completes the sequence — greeting copy, auto-dismiss, and removal of the old intro components.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Close-up sprite asset and first-visit gate logic
- [ ] **Phase 2: Cinematic** - Lunge animation and full visual effects stack
- [ ] **Phase 3: Resolution** - Greeting sequence, auto-dismiss, and old component cleanup

## Phase Details

### Phase 1: Foundation
**Goal**: The close-up sprite exists and the intro only fires on first visits
**Depends on**: Nothing (first phase)
**Requirements**: ART-01, ART-02, INTRO-01
**Success Criteria** (what must be TRUE):
  1. A higher-resolution pixel art close-up sprite renders correctly using the same `PALETTE` as `PixelCharacter.tsx` with `imageRendering: pixelated`
  2. The close-up sprite lives in its own self-contained component, independent from the walking character
  3. A first-time visitor sees the intro overlay; a repeat visitor (returning after the flag is set) lands directly on the canvas with no intro
**Plans**: TBD

### Phase 2: Cinematic
**Goal**: The dramatic lunge animation plays with fish-eye distortion and a dark vignette
**Depends on**: Phase 1
**Requirements**: INTRO-02, INTRO-03, INTRO-04, VFX-01, VFX-02, VFX-03
**Success Criteria** (what must be TRUE):
  1. Boule snaps toward the camera with no ease-in float — the motion feels sudden and anime-aggressive, completing in ≤0.4s
  2. At the peak of the lunge, the character's head dominates the viewport — it reads as a close-up, not just a large sprite
  3. A CSS fish-eye / barrel distortion effect (via `perspective` + `scale` transforms) is visibly applied to the sprite at close-up peak
  4. Dark vignette overlays the viewport edges during the close-up state, reinforcing the camera-lens feel
  5. Vignette and distortion fade in during the lunge and fade out during the pull-back — they do not appear or disappear abruptly
**Plans**: TBD

### Phase 3: Resolution
**Goal**: The sequence delivers personality through a greeting, exits cleanly, and the old intro code is gone
**Depends on**: Phase 2
**Requirements**: GREET-01, GREET-02, GREET-03, CLEAN-01
**Success Criteria** (what must be TRUE):
  1. A short, cheeky greeting line appears after the lunge settles — timing feels deliberate, not delayed
  2. The greeting text animates in with snappy, character-appropriate motion (not a generic fade)
  3. Without any user input, Boule pulls back and the canvas becomes active after ~2–3 seconds
  4. `IntroSequence`, `IntroBubble`, and `intro-bubble.module.css` no longer exist in the codebase — the new intro is the only intro
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/TBD | Not started | - |
| 2. Cinematic | 0/TBD | Not started | - |
| 3. Resolution | 0/TBD | Not started | - |
