---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via `npm run test` / `npx vitest`) |
| **Config file** | none — Wave 0 installs if needed |
| **Quick run command** | `npx tsc --noEmit && npm run lint` |
| **Full suite command** | `npx tsc --noEmit && npm run lint && npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit && npm run lint`
- **After every plan wave:** Run `npx tsc --noEmit && npm run lint && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | ART-01 | type-check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-01-02 | 01 | 1 | ART-01, ART-02 | type-check | `npx tsc --noEmit` | ✅ | ⬜ pending |
| 1-02-01 | 02 | 2 | INTRO-01 | type-check + lint | `npx tsc --noEmit && npm run lint` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — TypeScript and ESLint are already configured.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Close-up sprite renders with correct pixel art expression (squinting eyes, smirk, cap) | ART-01 | Visual/artistic verification | Open localhost:3000, confirm sprite renders at expected display size with `imageRendering: pixelated`, verify PALETTE colors match PixelCharacter.tsx |
| First visit shows intro overlay | INTRO-01 | Browser state (localStorage) | Clear localStorage, open localhost:3000, confirm intro overlay appears |
| Return visit skips intro | INTRO-01 | Browser state (localStorage) | After seeing intro, reload page, confirm canvas loads directly with no intro |
| Flag set on dismiss (not on mount) | INTRO-01 | Timing behavior | Clear localStorage, open page, close window before dismissing intro, reopen — intro must appear again |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
