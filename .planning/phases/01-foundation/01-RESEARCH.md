# Phase 1: Foundation - Research

**Researched:** 2026-03-16
**Domain:** Pixel art canvas rendering + localStorage first-visit gate
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Close-up Sprite Dimensions:**
- 96×128 pixel grid — 3× the resolution of the walking character (32×48)
- Pixel data stored as hand-crafted string arrays, same pattern as `IDLE_FRAME` in `PixelCharacter.tsx`
- Face + shoulders only — not full body
- Must use the exact `PALETTE` from `PixelCharacter.tsx` (16 colors defined there)
- Rendered with `imageRendering: pixelated` — same canvas-based approach as existing character

**Expression & Pose:**
- Squinting heavy-lidded eyes — intense, focused stare
- Slight smirk at the corner of the mouth — confident, self-aware, not purely menacing
- Same cap, straight-on — cap fully visible, brim not casting shadow
- Face is forward-facing (no three-quarter turn)

**First-Visit Gate:**
- Gate check via `localStorage` key `intro_seen` — simple boolean, set to `"true"` after first visit
- First-time visitor: intro plays; after intro completes, flag is set
- Repeat visitor (flag present): skip directly to canvas
- localStorage unavailable (incognito, storage blocked): treat as first visit — show intro every time
- No dev bypass URL param — reset by clearing `intro_seen` from DevTools
- Flag is not version-keyed — once set, never resets unless storage cleared manually

### Claude's Discretion
- Exact canvas rendering implementation within the component (pixel loop approach, imageData vs fillRect)
- How the gate check integrates with the GameCanvas mounting sequence
- Component file naming and internal structure

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ART-01 | New higher-resolution pixel art sprite for the close-up moment — same palette as `PALETTE` in `PixelCharacter.tsx`, but more facial detail (eyes, nose, expression readable at large scale) | Confirmed: PALETTE is exported from PixelCharacter.tsx, importable directly. Canvas approach via fillRect per-pixel is the established pattern. |
| ART-02 | Close-up sprite is a self-contained component/asset separate from the walking character | Confirmed: New file exports both frame data array and the React component independently so Phase 2 can animate without touching sprite data. |
| INTRO-01 | First-time visitor gate via `localStorage` flag — repeat visitors skip straight to canvas | Confirmed: GameCanvas already has a working localStorage pattern (`boule-visited`). Key must be migrated to `intro_seen` per locked decision. Existing gate location is the `useEffect` on mount in GameCanvas. |
</phase_requirements>

---

## Summary

Phase 1 is a pure foundation phase: create one new pixel art asset (the 96×128 close-up sprite) and introduce the localStorage first-visit gate. No animation, no transitions, no effects — those belong to Phases 2 and 3.

The codebase already has all the patterns needed. The walking character (`PixelCharacter.tsx`) demonstrates the exact canvas rendering loop, pixel data array format, and PALETTE structure the close-up must reuse. A first-visit gate is already partially implemented in `GameCanvas.tsx` — it uses `localStorage.getItem("boule-visited")` — but the locked decision specifies `intro_seen` as the key. The planner's main job is wiring a new component file using established patterns and swapping/adding the correct localStorage key.

The gate integration point already exists in `GameCanvas.tsx` at the mount `useEffect` (lines 74–84). The close-up component should be a standalone overlay, following the same absolutely-positioned approach as `IntroSequence`. It requires no new libraries, no new infrastructure, and no changes to the game engine.

**Primary recommendation:** Build `components/canvas/closeup-sprite.tsx` exporting `CLOSEUP_FRAME` (96×128 string array) and `CloseupSprite` component; add `intro_seen` gate to `GameCanvas.tsx` mount effect.

---

## Standard Stack

### Core (all already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React + hooks | 19 (via Next.js 16) | Component lifecycle, refs, state | Already in project |
| Canvas API (browser native) | n/a | Per-pixel `fillRect` drawing | Already used in PixelCharacter.tsx and IntroSequence |
| localStorage (browser native) | n/a | First-visit persistence | Already used in GameCanvas.tsx |
| TypeScript | 5.x | Strict typing | Already enforced project-wide |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | Already installed | Overlay mount/unmount fade (Phase 2 will animate; this phase just needs the overlay rendered) | Use only if a simple CSS opacity transition is insufficient for initial render |

**Installation:** No new packages needed. All capabilities exist in the current stack.

---

## Architecture Patterns

### Recommended File Structure for This Phase

```
components/canvas/
├── closeup-sprite.tsx     — NEW: CLOSEUP_FRAME data + CloseupSprite component
GameCanvas.tsx              — MODIFY: swap gate key, wire CloseupSprite overlay
```

### Pattern 1: Pixel Data Array — Established by PixelCharacter.tsx

**What:** Sprite is stored as an array of strings, one string per row. Each character is a key into `PALETTE`. `"0"` = transparent. The array is 96 strings long, each 128 characters wide for the 96×128 close-up.

**When to use:** Always — this is the locked decision and the established project pattern.

**Example (existing, from PixelCharacter.tsx):**
```typescript
// Source: components/canvas/PixelCharacter.tsx
export const IDLE_FRAME = [
  "00000000000000000000000000000000",  // row 0, 32 chars wide
  // ...48 rows total
];
// CLOSEUP_FRAME follows same pattern but 96 rows × 128 chars
export const CLOSEUP_FRAME = [
  "0".repeat(128),  // row 0
  // ...96 rows total, hand-crafted
];
```

### Pattern 2: Canvas Rendering Loop — Established by PixelCharacter.tsx

**What:** `useEffect` reads frame array row-by-row, column-by-column. For each non-transparent pixel: look up hex color in PALETTE, call `ctx.fillRect(col * PX, row * PX, PX, PX)`.

**When to use:** Always — the only approved rendering method for pixel sprites.

**Exact pattern (from PixelCharacter.tsx lines 151–175):**
```typescript
// Source: components/canvas/PixelCharacter.tsx
for (let row = 0; row < ROWS; row++) {
  const line = IDLE_FRAME[row];
  if (!line) continue;
  for (let col = 0; col < line.length; col++) {
    const colorKey = line[col];
    if (!colorKey || colorKey === "0") continue;
    const color = PALETTE[colorKey];
    if (!color || color === "transparent") continue;
    ctx.fillStyle = color;
    ctx.fillRect(col * PX, row * PX, PX, PX);
  }
}
```

For the close-up: `PX = CHARACTER.PIXEL_SIZE` (value: `4`). Canvas element `width = 128 * 4 = 512`, `height = 96 * 4 = 384`. CSS display size is independent — set via `width`/`height` style to desired viewport size. `imageRendering: "pixelated"` on the `<canvas>` element preserves crisp pixels.

### Pattern 3: Overlay Component — Established by IntroSequence

**What:** An absolutely-positioned `div` covering the game canvas, rendered conditionally. Receives no game-engine props — it is purely a visual overlay that invokes `onDismiss` when done.

**When to use:** For the close-up sprite container. Phase 1 does not animate it; it simply renders and sits waiting for Phase 2.

**Props shape for CloseupSprite (Phase 1 minimum):**
```typescript
interface CloseupSpriteProps {
  onDismiss: () => void;
}
// Phase 2 will add animation props without breaking this interface
```

### Pattern 4: First-Visit Gate — GameCanvas.tsx Mount Effect

**What:** Check localStorage on mount, set introActive state, set the flag.

**Current implementation (GameCanvas.tsx lines 80–83) uses key `"boule-visited"` — must be updated to `"intro_seen"` per locked decision:**
```typescript
// Source: components/canvas/GameCanvas.tsx (lines 74–84)
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;
  cursorXRef.current = container.clientWidth / 2;
  setCharacter(createInitialState(container.clientWidth));
  if (!localStorage.getItem("boule-visited")) {  // <-- change key to "intro_seen"
    setIntroActive(true);
    localStorage.setItem("boule-visited", "1");  // <-- change key to "intro_seen", value to "true"
  }
}, []);
```

**localStorage unavailable handling (per locked decision):**
```typescript
function isFirstVisit(): boolean {
  try {
    return localStorage.getItem("intro_seen") === null;
  } catch {
    // Storage blocked (incognito strict mode, etc.) — treat as first visit
    return true;
  }
}

function markVisited(): void {
  try {
    localStorage.setItem("intro_seen", "true");
  } catch {
    // Storage unavailable — silent, will show intro again next visit
  }
}
```

**When to set the flag:** After intro completes (`onDismiss` is called). Not on mount, not before the intro plays. This ensures the flag is only set after the visitor has actually seen the intro.

### Anti-Patterns to Avoid

- **Redefining PALETTE:** The close-up component must import `PALETTE` from `PixelCharacter.tsx`, not copy or redefine it. A diverged palette breaks visual consistency.
- **Canvas size = display size:** Canvas `width`/`height` attributes set the pixel buffer size (128×4=512, 96×4=384). CSS `width`/`height` set the display size. These are different. Conflating them causes blurry scaling.
- **Forgetting `imageRendering: "pixelated"`:** Without this, browsers apply bilinear interpolation when upscaling canvas content to display size, making pixels blurry.
- **Setting flag on mount:** The `intro_seen` flag must be set in `onDismiss`, not at mount. If set at mount, a crash before the intro completes would permanently skip the intro.
- **Embedding frame data inside the React component function:** Frame data should be declared at module level (as a `const` outside the component), not inside the component body. This avoids recreating the array on every render.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-pixel canvas rendering | Custom pixel renderer | `ctx.fillRect` loop (already established) | Pattern is proven in PixelCharacter.tsx; imageData approach offers marginal perf benefit not needed here |
| Animation state machine | Custom phase manager | Framer Motion (already used in IntroSequence) | Phase 2 will animate; keep the overlay structure compatible |
| Feature detection for localStorage | Try-catch wrapper | Simple try/catch (see Pattern 4 above) | localStorage throws synchronously on access in some browsers — catch is sufficient, no library needed |

**Key insight:** This phase introduces zero new infrastructure. Everything required already exists in the codebase as proven patterns.

---

## Common Pitfalls

### Pitfall 1: Canvas Pixel Size vs Display Size Mismatch

**What goes wrong:** Developer sets canvas `width={displayWidth}` and `height={displayHeight}` (CSS size), then draws `fillRect(col * PX, ...)` — but the drawing loop expects `PX` to map to 1px in the canvas buffer. Result: sprite drawn at wrong scale, or compressed into a corner.

**Why it happens:** HTML Canvas `width`/`height` attributes control the internal pixel buffer. CSS dimensions control how the buffer is stretched to screen. They are independent.

**How to avoid:** Always set `width={COLS * PX}` and `height={ROWS * PX}` on `<canvas>` attributes. Set desired visual size via CSS `style={{ width: displayW, height: displayH }}`. See PixelCharacter.tsx lines 82–90 and 258–263.

**Warning signs:** Sprite appears squashed, stretched, or only partially visible.

### Pitfall 2: localStorage Access Without Error Handling

**What goes wrong:** `localStorage.getItem(...)` throws a `DOMException` in browsers with strict incognito mode or certain security policies. An unhandled throw crashes the component mount effect.

**Why it happens:** Unlike typical web APIs, localStorage throws synchronously (not rejects a Promise) on access when storage is blocked.

**How to avoid:** Wrap ALL localStorage access in try/catch. Return `true` (first visit) on catch. See Pattern 4 above.

**Warning signs:** Site crashes on load in some incognito configurations; error logged to console mentioning `SecurityError`.

### Pitfall 3: CLOSEUP_FRAME String Width Inconsistency

**What goes wrong:** Some rows in the 96×128 string array are accidentally 127 or 129 characters wide. The rendering loop uses `line.length` to determine column count, so short rows create gaps or extra pixels.

**Why it happens:** Manual pixel art data entry in strings is error-prone. Existing IDLE_FRAME in PixelCharacter.tsx already has this issue on several rows (e.g. line 52: `"0000000005666EEEE66665000000000"` is 31 chars, not 32).

**How to avoid:** Define a TypeScript type assertion or runtime validation in development that checks all rows equal 128. Alternatively, pad each row with a comment to make the count visually verifiable.

**Warning signs:** Visual artifacts where columns appear missing or shifted.

### Pitfall 4: Gate Flag Set at Wrong Time

**What goes wrong:** `localStorage.setItem("intro_seen", "true")` is called at mount (when intro starts) rather than in `onDismiss` (when intro finishes). If the user closes the tab mid-intro, the flag is already set and they never see the complete intro on return.

**Why it happens:** Existing code in GameCanvas sets the flag at mount — this pattern must be changed for the new key.

**How to avoid:** Call `markVisited()` only inside the `onDismiss` callback. Confirmed in locked decisions: "After intro completes, flag is set."

**Warning signs:** Returning visitors who closed the tab early are permanently skipped.

---

## Code Examples

### CloseupSprite Component Structure (full scaffold)

```typescript
// Source: pattern derived from PixelCharacter.tsx and IntroSequence
"use client";

import { useRef, useEffect } from "react";
import { PALETTE } from "./PixelCharacter";
import { CHARACTER } from "@/lib/constants";

// 96×128 pixel close-up sprite data
// Colors: same keys as PALETTE in PixelCharacter.tsx
// 0=transparent, 1=cap dark, 2=cap main, 3=skin, 4=eye, 5=beard dark,
// 6=beard main, 7=shirt dark, 8=shirt main, 9=pants dark, A=pants main,
// B=shoe dark, C=shoe main, D=skin shadow, E=beard mid, F=cap highlight
export const CLOSEUP_FRAME: string[] = [
  // 96 rows, each exactly 128 characters
  // Hand-crafted pixel art — face + shoulders, forward-facing
  // Expression: heavy-lidded squinting eyes, slight smirk
  // TO BE DRAWN
];

const PX = CHARACTER.PIXEL_SIZE;   // 4
const COLS = 128;
const ROWS = 96;
const CANVAS_W = COLS * PX;        // 512
const CANVAS_H = ROWS * PX;        // 384

interface CloseupSpriteProps {
  onDismiss: () => void;
}

export function CloseupSprite({ onDismiss }: CloseupSpriteProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    for (let row = 0; row < ROWS; row++) {
      const line = CLOSEUP_FRAME[row];
      if (!line) continue;
      for (let col = 0; col < line.length; col++) {
        const colorKey = line[col];
        if (!colorKey || colorKey === "0") continue;
        const color = PALETTE[colorKey];
        if (!color || color === "transparent") continue;
        ctx.fillStyle = color;
        ctx.fillRect(col * PX, row * PX, PX, PX);
      }
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 30,
        pointerEvents: "auto",
      }}
      onClick={onDismiss}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          imageRendering: "pixelated",
          // Display size: fill viewport height, maintain aspect ratio
          height: "100vh",
          width: "auto",
        }}
      />
    </div>
  );
}
```

### Gate Logic for GameCanvas.tsx

```typescript
// Source: pattern derived from GameCanvas.tsx lines 74–84 + locked decisions

function isFirstVisit(): boolean {
  try {
    return localStorage.getItem("intro_seen") === null;
  } catch {
    return true; // Storage blocked — treat as first visit
  }
}

function markVisited(): void {
  try {
    localStorage.setItem("intro_seen", "true");
  } catch {
    // Storage unavailable — silent
  }
}

// In GameCanvas useEffect (mount):
useEffect(() => {
  const container = containerRef.current;
  if (!container) return;
  cursorXRef.current = container.clientWidth / 2;
  setCharacter(createInitialState(container.clientWidth));
  if (isFirstVisit()) {
    setIntroActive(true);
    // NOTE: do NOT call markVisited() here — call it in onDismiss
  }
}, []);

// In onDismiss handler:
const handleIntroDismiss = useCallback(() => {
  markVisited();
  setIntroActive(false);
}, []);
```

### Wiring CloseupSprite into GameCanvas.tsx

```typescript
// Replace IntroSequence with CloseupSprite for first-visit gate:
{introActive && (
  <CloseupSprite onDismiss={handleIntroDismiss} />
)}
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| `"boule-visited"` key in localStorage | `"intro_seen"` key | Key change per locked decision — both are simple localStorage strings |
| `IntroSequence` for first-visit | `CloseupSprite` for Phase 1 (data + placeholder overlay) | IntroSequence is NOT removed in Phase 1 — CLEAN-01 is Phase 3 |

**Important:** `CLEAN-01` (remove IntroSequence, IntroBubble, intro-bubble.module.css) is a Phase 3 requirement. Phase 1 must NOT delete these files. The gate in GameCanvas will switch from mounting `IntroSequence` to mounting `CloseupSprite`, but the old files stay until Phase 3.

---

## Open Questions

1. **CLOSEUP_FRAME pixel art data**
   - What we know: Spec is clear (96×128, forward-facing, squinting + smirk, same cap, PALETTE colors)
   - What's unclear: The actual pixel art data must be hand-crafted by the implementer. This is creative/artistic work, not a technical question.
   - Recommendation: The implementer draws the sprite row-by-row in the string array. The expression brief is precise: heavy-lidded squinting eyes, slight smirk at corner of mouth. Cap fully visible, straight-on.

2. **Display size of the close-up canvas**
   - What we know: Phase 2 will animate a "lunge toward camera" from normal character size to filling the viewport. Phase 1 just needs the sprite to render.
   - What's unclear: What display size should Phase 1 render the sprite at? Large enough to validate the pixel detail is readable, but exact viewport-filling and positioning is Phase 2's concern.
   - Recommendation: Phase 1 renders the sprite centered, with `height: "80vh"` and `width: "auto"` as a placeholder. Phase 2 adjusts sizing when implementing the lunge animation.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected |
| Config file | None — no jest.config, vitest.config, or pytest.ini found |
| Quick run command | `npm run build && npx tsc --noEmit` (type safety + build validation) |
| Full suite command | `npm run lint && npx tsc --noEmit` |

No automated test framework is installed. The project's quality gates are TypeScript strict-mode type checking and ESLint.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Infrastructure Exists? |
|--------|----------|-----------|-------------------|----------------------|
| ART-01 | Close-up sprite renders using PALETTE colors, 96×128 grid, `imageRendering: pixelated` | Visual / type-check | `npx tsc --noEmit` (verifies PALETTE import, no `any` types) | Yes — tsc available |
| ART-02 | CloseupSprite is self-contained; `CLOSEUP_FRAME` and component exported independently | Type-check / build | `npm run build` (verifies no import cycles, clean exports) | Yes |
| INTRO-01 | First-visit shows intro overlay; repeat visit skips to canvas; storage-blocked treats as first visit | Manual browser test + type-check | `npx tsc --noEmit` for type safety; manual: open in fresh browser, verify overlay; open again, verify canvas | Partial — manual only |

### Sampling Rate

- **Per task commit:** `npx tsc --noEmit`
- **Per wave merge:** `npm run lint && npx tsc --noEmit`
- **Phase gate:** `npm run build` green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] No test framework installed — unit tests for `isFirstVisit()` / `markVisited()` would require Jest or Vitest setup (out of scope for this phase; type-checking is the available gate)
- [ ] Manual test checklist needed for INTRO-01: (1) clear `intro_seen` from DevTools, reload — verify overlay renders; (2) reload again without clearing — verify overlay absent; (3) test in incognito — verify overlay renders

*(No framework installation needed for Phase 1 — type checking and build verification are sufficient for this phase's deliverables.)*

---

## Sources

### Primary (HIGH confidence)

- `components/canvas/PixelCharacter.tsx` — PALETTE definition, IDLE_FRAME format (32×48), canvas rendering loop, PX/COLS/ROWS constants, imageRendering pattern
- `components/canvas/GameCanvas.tsx` — existing localStorage gate (lines 80–84), introActive state, IntroSequence mount pattern, onDismiss wiring
- `components/canvas/intro-sequence.tsx` — overlay component structure, characterX/groundY/onDismiss prop pattern, absolutely-positioned canvas overlay
- `lib/constants.ts` — CHARACTER.PIXEL_SIZE (4), CHARACTER.SPRITE_COLS/ROWS, CANVAS.GROUND_Y
- `.planning/phases/01-foundation/01-CONTEXT.md` — all locked decisions directly constraining implementation

### Secondary (MEDIUM confidence)

- MDN Canvas API docs — `ctx.fillRect`, `imageRendering: pixelated` CSS property behavior (standard browser behavior, well-documented)
- MDN localStorage docs — SecurityError on blocked storage, try/catch pattern (standard browser behavior)

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new libraries; all patterns confirmed in existing source files
- Architecture: HIGH — patterns read directly from canonical source files, not inferred
- Pitfalls: HIGH — Pitfall 3 (string width) confirmed by inspecting IDLE_FRAME in PixelCharacter.tsx (lines 52, 67, 71, 72 are shorter than expected); Pitfalls 1, 2, 4 are well-known browser API behaviors

**Research date:** 2026-03-16
**Valid until:** 2026-06-16 (stable — no external dependencies to drift)
