---
phase: 01-foundation
plan: 01
subsystem: canvas/intro
tags: [pixel-art, sprite, localStorage, intro-gate]
dependency_graph:
  requires: []
  provides: [closeup-sprite-component, intro-seen-gate]
  affects: [GameCanvas, intro-sequence]
tech_stack:
  added: []
  patterns: [canvas-pixel-render, localStorage-try-catch]
key_files:
  created:
    - components/canvas/closeup-sprite.tsx
  modified:
    - components/canvas/GameCanvas.tsx
decisions:
  - "PALETTE imported from PixelCharacter.tsx — never redefined in closeup-sprite.tsx"
  - "intro_seen localStorage key replaces boule-visited — flag set in onDismiss not at mount"
  - "IntroSequence import commented out (not deleted) — CLEAN-01 removes in Phase 3"
metrics:
  duration: "6 minutes"
  completed_date: "2026-03-16"
  tasks_completed: 2
  files_changed: 2
---

# Phase 1 Plan 01: CloseupSprite and First-Visit Gate Summary

**One-liner:** 96x128 pixel art close-up face sprite of Boule with squinting eyes + smirk, wired as first-visit overlay via `intro_seen` localStorage gate with try/catch safety.

## Objective

Create the higher-resolution close-up pixel art sprite for Boule and wire the first-visit localStorage gate that controls whether the intro overlay displays.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Create CloseupSprite component with 96x128 pixel art frame data | `0971f94` | `components/canvas/closeup-sprite.tsx` (new) |
| 2 | Wire first-visit gate and mount CloseupSprite in GameCanvas | `5a4ea5e` | `components/canvas/GameCanvas.tsx` |

## What Was Built

**Task 1 — closeup-sprite.tsx:**
- `CLOSEUP_FRAME: string[]` — 96 rows of exactly 128 characters each, depicting:
  - Cap rows 0-15: dark blue cap with F highlight stripe, brim
  - Forehead rows 16-25: skin tone
  - Eyes rows 26-30: heavy upper lids (D=skin shadow), narrow iris slit (4), squinting stare
  - Nose rows 31-35: shadow shaping
  - Mouth/smirk rows 36-39: right-corner D shadow creating subtle smirk
  - Beard rows 44-58: 5/6/E layered beard transitioning to shirt colors
  - Shirt/shoulders rows 59-95: 7/8 shirt with shoulder framing
- `CloseupSprite` component: renders frame on a 512x384 canvas (`imageRendering: pixelated`)
- Overlay: `position: absolute`, `zIndex: 30`, centered, `80vh` display height
- `onClick={onDismiss}` for temporary Phase 1 dismiss

**Task 2 — GameCanvas.tsx:**
- `isFirstVisit()`: reads `intro_seen` from localStorage with try/catch (returns `true` on StorageError)
- `markVisited()`: writes `intro_seen: "true"` with try/catch (silent fail)
- Mount useEffect: calls `isFirstVisit()` instead of raw `localStorage.getItem("boule-visited")`
- `handleIntroDismiss` useCallback: calls `markVisited()` then `setIntroActive(false)`
- JSX: `<CloseupSprite onDismiss={handleIntroDismiss} />` replaces `<IntroSequence .../>`
- IntroSequence import commented with TODO(CLEAN-01) note — file NOT deleted

## Verification

- `npx tsc --noEmit`: exit 0
- `npm run lint`: 4 pre-existing errors in unrelated files, 0 errors in changed files
- `npm run build`: build completes successfully with all pages generated

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `components/canvas/closeup-sprite.tsx` exists: YES
- `components/canvas/GameCanvas.tsx` modified: YES
- Commit `0971f94` exists: YES
- Commit `5a4ea5e` exists: YES
- CLOSEUP_FRAME has 96 rows x 128 chars: YES (validated with Node.js)
- `intro-sequence.tsx` still exists (not deleted): YES
- `intro-bubble.tsx` still exists (not deleted): YES
