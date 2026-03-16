# Bogste Portfolio — Anime Close-Up Intro

## What This Is

A replacement first-visit intro experience for bogste.com. When a visitor arrives for the first time, instead of the current wake-up/jump/bubble sequence, Pixel Boule lunges aggressively toward the "camera" in a dramatic anime close-up — head filling the entire viewport with fish-eye distortion and a dark vignette at the edges. A cheeky greeting then appears, auto-transitions after a few seconds, and the main canvas loads.

## Core Value

The first second a visitor lands must make them immediately feel the personality of this site — unexpected, playful, and technically deliberate. The close-up is the hook.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Replace the existing `IntroSequence` + `IntroBubble` components entirely with the new close-up intro
- [ ] First-visit-only gate via `localStorage` flag — repeat visitors go straight to the canvas
- [ ] Boule lunges toward the camera with a fast snap motion (very anime — no float, no ease-in)
- [ ] At peak close-up: character's head fills the viewport
- [ ] Fish-eye / lens distortion effect applied to the character sprite (CSS perspective/scale transforms + SVG/CSS filter)
- [ ] Dark vignette on viewport edges to sell the close-up camera feel
- [ ] Cheeky greeting copy appears after the lunge settles — personality-first, short
- [ ] Greeting auto-transitions after ~2–3s; Boule pulls back and canvas becomes active
- [ ] Higher-resolution pixel art sprite for the close-up (same pixel aesthetic, more facial detail — eyes, nose, expression visible)
- [ ] The close-up sprite is a separate asset/component from the walking character sprite

### Out of Scope

- Mobile adaptation — desktop-first, mobile addressed separately
- Sound effects for the intro — optional enhancement, not v1
- Any modification to the existing walking character or canvas behavior

## Context

- Stack: Next.js 16 App Router, TypeScript, Tailwind, Framer Motion
- Existing intro: `components/canvas/intro-sequence.tsx` — wake-up → jump → settle → speech bubble. To be fully replaced.
- Existing bubble: `components/canvas/intro-bubble.tsx` — "Look Muuum... a visitor!" — content and component both replaced.
- Character sprite: 32×48 pixel art, `PX = CHARACTER.PIXEL_SIZE` scale factor, drawn on `<canvas>` with pixel palette defined in `PixelCharacter.tsx`
- Fish-eye reference: extreme anime close-up trope — forehead dominant, eyes wide and spaced, perspective-distorted nose. Like the attached screenshot.
- Greeting copy direction: cheeky, short — e.g. "oh. a visitor." or "you actually showed up." — exact copy TBD.

## Constraints

- **Tech stack**: Framer Motion for animation orchestration — no additional animation libraries
- **Pixel art**: New close-up sprite must use same pixel palette (`PALETTE` in `PixelCharacter.tsx`) and `imageRendering: pixelated`
- **Performance**: Intro must not block canvas load — lazy trigger after canvas is mounted
- **No scroll on landing**: Canvas is fixed viewport, intro overlays it at `z-index` above canvas

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Replace intro entirely | The old wake-up sequence conflicts tonally with the anime close-up concept | — Pending |
| Fish-eye via CSS transforms | Avoids WebGL/shader complexity for a CSS-achievable effect; `perspective` + `scale` + `border-radius` distortion | — Pending |
| Auto-transition, no click needed | Reduces friction — visitor is a spectator for this moment, not in control | — Pending |
| Higher-res pixel sprite for close-up | Walking sprite is too low-detail for a full-viewport close-up; needs a dedicated asset | — Pending |

---
*Last updated: 2026-03-16 after initialization*
