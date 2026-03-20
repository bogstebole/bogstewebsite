---
phase: 01-foundation
verified: 2026-03-16T00:00:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "Open the site with localStorage cleared (DevTools > Application > Local Storage, delete intro_seen). Reload page."
    expected: "CloseupSprite overlay appears centered over the canvas. The close-up shows Boule's face — cap at top, squinting eyes (heavy upper lids, narrow iris slit), subtle smirk on right corner of mouth, beard below, shirt shoulders at bottom. Sprite renders crisp with no blurring (pixelated rendering)."
    why_human: "Cannot programmatically verify visual appearance, sprite readability at render size (80vh), or that the squint/smirk read as emotionally coherent at display scale."
  - test: "Click anywhere on the CloseupSprite overlay."
    expected: "Overlay dismisses, canvas becomes interactive. Reloading the page (without clearing storage) skips the overlay entirely and lands directly on the interactive canvas."
    why_human: "localStorage state transition and resulting UI change must be confirmed in a live browser session."
  - test: "Open the site in a private/incognito window with strict privacy settings."
    expected: "Overlay appears (treated as first visit even though storage is unavailable)."
    why_human: "localStorage blocking behavior varies by browser configuration and cannot be confirmed via static analysis."
---

# Phase 01: Foundation Verification Report

**Phase Goal:** Establish the core character presentation and first-visit experience so the site has a working interactive landing page identity
**Verified:** 2026-03-16
**Status:** human_needed (all automated checks passed; visual/behavioral confirmation pending)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A 96x128 pixel art close-up sprite renders on a canvas with crisp pixelated edges, using the same PALETTE as the walking character | VERIFIED | File exists at `components/canvas/closeup-sprite.tsx`. PALETTE imported from `./PixelCharacter` (not redefined). 96 rows x 128 chars each confirmed via Node.js validation. Canvas element: `width={512}` `height={384}`, style `imageRendering: "pixelated"`. |
| 2 | The close-up sprite is a self-contained component in its own file, with CLOSEUP_FRAME and CloseupSprite exported independently | VERIFIED | `export const CLOSEUP_FRAME: string[]` at module level (line 18). `export function CloseupSprite` at line 121. Both are named exports. File has no cross-dependencies other than PALETTE and CHARACTER (imported, not duplicated). |
| 3 | A first-time visitor (no intro_seen in localStorage) sees the CloseupSprite overlay mounted over the canvas | VERIFIED | `isFirstVisit()` returns `localStorage.getItem("intro_seen") === null`. Mount useEffect calls `if (isFirstVisit()) { setIntroActive(true); }`. JSX: `{introActive && <CloseupSprite onDismiss={handleIntroDismiss} />}` at GameCanvas line 483. |
| 4 | A repeat visitor (intro_seen present) skips the overlay and lands directly on the interactive canvas | VERIFIED | `isFirstVisit()` returns false when key is present. `introActive` stays false. `markVisited()` is called inside `handleIntroDismiss` (not at mount), so the key is set only after the visitor has seen and dismissed the overlay. |
| 5 | When localStorage is unavailable (incognito/blocked), the visitor is treated as first-time and the overlay mounts | VERIFIED | `isFirstVisit()` wraps `localStorage.getItem` in try/catch and returns `true` on any StorageError. `markVisited()` similarly wraps its write in try/catch with silent failure. |

**Score: 5/5 truths verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/canvas/closeup-sprite.tsx` | Close-up sprite frame data and overlay component; exports `CLOSEUP_FRAME` and `CloseupSprite` | VERIFIED | File exists, 175 lines, substantive pixel art frame data (96 rows), functional canvas render loop, both exports present. |
| `components/canvas/GameCanvas.tsx` | First-visit gate logic using `intro_seen` key | VERIFIED | `isFirstVisit()` and `markVisited()` helper functions at module level (lines 38-52). Gate in mount useEffect (lines 98-101). `handleIntroDismiss` useCallback calls `markVisited()` (line 273). `CloseupSprite` mounted conditionally at line 483. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `closeup-sprite.tsx` | `PixelCharacter.tsx` | `import { PALETTE }` | VERIFIED | Line 4: `import { PALETTE } from "./PixelCharacter";`. PALETTE is not redefined anywhere in `closeup-sprite.tsx`. |
| `closeup-sprite.tsx` | `lib/constants.ts` | `import { CHARACTER }` | VERIFIED | Line 5: `import { CHARACTER } from "@/lib/constants";`. `CHARACTER.PIXEL_SIZE` used as `PX` constant (line 7). |
| `GameCanvas.tsx` | `closeup-sprite.tsx` | `import { CloseupSprite }` | VERIFIED | Line 34: `import { CloseupSprite } from "./closeup-sprite";`. Component used at line 484 inside `{introActive && ...}` block. |
| `GameCanvas.tsx` | `localStorage` | `isFirstVisit()` and `markVisited()` | VERIFIED | `localStorage.getItem("intro_seen")` in `isFirstVisit()` (line 40). `localStorage.setItem("intro_seen", "true")` in `markVisited()` (line 48). Old `boule-visited` key is completely absent. |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| ART-01 | 01-01-PLAN.md | New higher-resolution pixel art sprite for the close-up moment — same palette as PALETTE in PixelCharacter.tsx, but more facial detail | SATISFIED | `closeup-sprite.tsx` exists with 96x128 frame data. PALETTE imported from PixelCharacter, not copied. Eye rows (26-30) contain both lid shadow (`D`) and iris (`4`) pixels. Smirk present in rows 38-39 (right-side only: D chars on right half, none on left). |
| ART-02 | 01-01-PLAN.md | Close-up sprite is a self-contained component/asset separate from the walking character | SATISFIED | `closeup-sprite.tsx` is a separate file. No shared state or runtime coupling with `PixelCharacter.tsx`. Only static imports (PALETTE, CHARACTER constants). |
| INTRO-01 | 01-01-PLAN.md | First-time visitor gate via localStorage flag — repeat visitors skip straight to canvas | SATISFIED | `isFirstVisit()` / `markVisited()` with try/catch. Flag set in `handleIntroDismiss` (not at mount). `CloseupSprite` conditionally mounted via `introActive` state. |

**No orphaned requirements.** REQUIREMENTS.md traceability table maps ART-01, ART-02, and INTRO-01 to Phase 1 and marks all three as Complete.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `GameCanvas.tsx` | 32 | `// TODO(CLEAN-01): Remove IntroSequence import` | Info | Expected and intentional. Plan explicitly instructed keeping this commented import until Phase 3 (CLEAN-01). Not a blocker. |

No placeholder content, no stub implementations, no empty handlers, no console-log-only functions found in either changed file.

---

### Human Verification Required

**1. Sprite visual quality and readability**

**Test:** Open the site with `intro_seen` cleared from localStorage. Observe the CloseupSprite overlay.
**Expected:** Pixel art face centered on screen. Cap fills top rows. Eyes appear squinting (heavy upper lids, narrow iris band). Right corner of mouth shows a slight upward curve (smirk). Beard below mouth. Shirt shoulders at bottom. Sprite scales to 80vh with no blurring.
**Why human:** Static analysis confirms the row data contains the correct palette characters in structurally correct positions (lid rows above and below iris rows; right-only D shadow in mouth region), but whether the resulting image reads as a confident squinting smirk — the emotional intent — requires visual inspection.

**2. Overlay dismiss and first-visit/repeat-visit gate**

**Test:** (a) Click anywhere on the overlay. (b) Reload without clearing storage.
**Expected:** (a) Overlay dismisses; canvas becomes interactive immediately. (b) Overlay does not appear; canvas loads directly.
**Why human:** The localStorage read/write cycle and resulting UI state transition must be verified in a live browser where the storage API behaves as expected.

**3. Incognito/storage-blocked behavior**

**Test:** Open site in a private window with strict privacy settings (or block localStorage via DevTools).
**Expected:** Overlay appears (treated as first visit). No JavaScript errors thrown.
**Why human:** localStorage blocking behavior varies by browser version and privacy configuration; cannot be confirmed via static analysis alone.

---

### Verification Notes

**Sprite art structure confirmed programmatically:**
- Eye region (rows 26-30): Lid shadow (`D`) occupies rows 26-27 and 30 (3 rows); iris (`4`) occupies rows 28-29 (2 rows). Lids frame the iris from above and below, creating a narrow visible iris consistent with a squinting stare.
- Smirk (rows 38-39): `D` shadow chars present exclusively on the right half of the face (rightD=13 and 23 respectively, leftD=0 both rows), confirming asymmetric right-corner lift.
- Beard region (rows 44-57): `5`, `6`, `E` palette chars confirmed as described in the SUMMARY.
- Shoulder region (rows 58-95): `7`, `8` shirt colors filling the bottom rows as expected.

**Commits verified in git log:**
- `0971f94` — `feat(01-01): create CloseupSprite component with 96x128 pixel art frame data`
- `5a4ea5e` — `feat(01-01): wire first-visit gate and mount CloseupSprite in GameCanvas`

**TypeScript:** `npx tsc --noEmit` exits with code 0 (no output).

**Preserved files (required by plan, not to be deleted until Phase 3):**
- `components/canvas/intro-sequence.tsx` — EXISTS
- `components/canvas/intro-bubble.tsx` — EXISTS
- `components/canvas/intro-bubble.module.css` — EXISTS

---

_Verified: 2026-03-16_
_Verifier: Claude (gsd-verifier)_
