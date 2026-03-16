# Requirements: Anime Close-Up Intro

**Defined:** 2026-03-16
**Core Value:** The first second must hook the visitor with personality — unexpected, playful, technically deliberate.

## v1 Requirements

### Intro Animation

- [ ] **INTRO-01**: First-time visitor gate via `localStorage` flag — repeat visitors skip straight to canvas
- [ ] **INTRO-02**: Boule lunges toward the camera with fast snap motion (anime style — no ease-in float)
- [ ] **INTRO-03**: At close-up peak, character's head is dominant and fills the viewport
- [ ] **INTRO-04**: Transition from normal position to close-up is smooth but fast (≤0.4s lunge duration)

### Visual Effects

- [ ] **VFX-01**: Fish-eye / barrel distortion applied to the character sprite at close-up peak (CSS `perspective` + `scale` transforms)
- [ ] **VFX-02**: Dark vignette overlay on viewport edges during close-up state
- [ ] **VFX-03**: Vignette and distortion fade in during the lunge, fade out during pull-back

### Greeting

- [ ] **GREET-01**: Cheeky short greeting copy appears after lunge settles (e.g. "oh. a visitor.")
- [ ] **GREET-02**: Copy animates in with snappy, character-appropriate timing
- [ ] **GREET-03**: Auto-dismisses after ~2–3s; Boule pulls back and canvas becomes active

### Art

- [ ] **ART-01**: New higher-resolution pixel art sprite for the close-up moment — same palette as `PALETTE` in `PixelCharacter.tsx`, but more facial detail (eyes, nose, expression readable at large scale)
- [ ] **ART-02**: Close-up sprite is a self-contained component/asset separate from the walking character

### Cleanup

- [ ] **CLEAN-01**: Remove `IntroSequence`, `IntroBubble`, and `intro-bubble.module.css` — replaced entirely by the new intro

## v2 Requirements

### Enhancements

- Sound effect for the lunge — satisfying anime whoosh/thud
- Subtle screen shake on lunge impact
- Mobile adaptation of the close-up intro

## Out of Scope

| Feature | Reason |
|---------|--------|
| Modifying the walking character sprite | Walking sprite is separate from the close-up asset |
| Canvas behavior changes | Intro is a pre-canvas overlay only |
| Mobile adaptation | Desktop-first; mobile addressed in a later milestone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ART-01 | Phase 1 | Pending |
| ART-02 | Phase 1 | Pending |
| INTRO-01 | Phase 1 | Pending |
| INTRO-02 | Phase 2 | Pending |
| INTRO-03 | Phase 2 | Pending |
| INTRO-04 | Phase 2 | Pending |
| VFX-01 | Phase 2 | Pending |
| VFX-02 | Phase 2 | Pending |
| VFX-03 | Phase 2 | Pending |
| GREET-01 | Phase 3 | Pending |
| GREET-02 | Phase 3 | Pending |
| GREET-03 | Phase 3 | Pending |
| CLEAN-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after roadmap creation — traceability grouped by phase*
