# Phase 1: Foundation - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a higher-resolution pixel art close-up sprite (face + shoulders) for Boule and wire a first-visit localStorage gate that determines whether the intro plays. No animation, no effects, no greeting — those are Phase 2 and 3. This phase is purely the asset and the gate logic.

</domain>

<decisions>
## Implementation Decisions

### Close-up Sprite Dimensions
- **96×128 pixel grid** — 3× the resolution of the walking character (32×48)
- Pixel data stored as hand-crafted string arrays, same pattern as `IDLE_FRAME` in `PixelCharacter.tsx`
- **Face + shoulders only** — not full body. The crop itself sells the close-up: head dominant, shoulders framing, intentionally cropped at the viewport edge
- Must use the exact `PALETTE` from `PixelCharacter.tsx` (16 colors defined there)
- Rendered with `imageRendering: pixelated` — same canvas-based approach as existing character

### Expression & Pose
- **Squinting heavy-lidded eyes** — intense, focused stare
- **Slight smirk at the corner of the mouth** — dangerous smile energy underneath the intensity
- Together: confident, self-aware, not purely menacing. The intensity is the hook; the smirk is the personality
- **Same cap, straight-on** — cap fully visible, brim not casting shadow, consistent with the walking character's design
- Face is forward-facing (no three-quarter turn)

### First-Visit Gate
- Gate check via `localStorage` key `intro_seen` — simple boolean, set to `"true"` after first visit
- **First-time visitor**: intro plays. After intro completes, flag is set
- **Repeat visitor** (flag present): skip directly to canvas
- **localStorage unavailable** (incognito, storage blocked): treat as first visit — show intro every time. No fallback storage, no silent skip
- **No dev bypass URL param** — to reset during development, clear `intro_seen` from localStorage in DevTools
- Flag is not version-keyed — once set, it never resets (returning visitors never see intro again unless they clear storage manually)

### Claude's Discretion
- Exact canvas rendering implementation within the component (pixel loop approach, imageData vs fillRect)
- How the gate check integrates with the GameCanvas mounting sequence
- Component file naming and internal structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Sprite & Palette
- `components/canvas/PixelCharacter.tsx` — `PALETTE` (16-color map), `IDLE_FRAME` (32×48 pixel data array pattern), `PX = CHARACTER.PIXEL_SIZE` (scale factor), canvas drawing approach. The close-up sprite MUST use the same palette and the same pixel-data-array pattern.

### Existing Intro (to understand the gate integration point)
- `components/canvas/intro-sequence.tsx` — Current intro component. Shows how `onDismiss` callback is used, how the intro overlays the canvas, and the `characterX` / `groundY` props pattern. Phase 1 introduces the gate logic that will control whether this (or the new intro in Phase 2) fires.

### Requirements
- `.planning/REQUIREMENTS.md` — ART-01 (higher-res sprite, same palette), ART-02 (self-contained component), INTRO-01 (first-visit gate)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PALETTE` in `PixelCharacter.tsx`: Exact 16-color map to import and reuse in the close-up component. Do not redefine — import directly.
- `CHARACTER.PIXEL_SIZE` from `lib/constants`: Scale factor used for canvas pixel sizing. Use the same value.
- `IDLE_FRAME` pattern: The 32×48 string array format in `PixelCharacter.tsx` is the template for the `CLOSEUP_FRAME` 96×128 array.

### Established Patterns
- Canvas drawing: `ctx.fillRect(col * PX, row * PX, PX, PX)` per pixel — see `PixelCharacter.tsx` render loop
- Intro overlay structure: `intro-sequence.tsx` renders absolutely positioned over the canvas at `z-index` above it, receives `characterX`, `groundY`, and `onDismiss` — the new close-up component will follow this same overlay pattern

### Integration Points
- `app/page.tsx` or `components/canvas/GameCanvas.tsx`: Where the gate check (`localStorage.getItem('intro_seen')`) should live, controlling whether the intro component is mounted
- The close-up component should export its frame data and component separately so Phase 2 can animate the component without touching the sprite data

</code_context>

<specifics>
## Specific Ideas

- The expression brief: "heavy-lidded squinting eyes with a slight smirk underneath — dangerous smile energy." Not comedic, not menacing. Confident and self-aware.
- The close-up crop is intentional — shoulders should be visible but the character should clearly be "lunging into camera" even before animation. The framing does half the work.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-16*
