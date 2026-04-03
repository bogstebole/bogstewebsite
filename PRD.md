# Product Requirements Document
## Boule's Portfolio — Website v1

**Author**: Bogdan (Boule)  
**Last Updated**: 2026-04-03  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Framer Motion · Tailwind v4

---

## 1. Product Vision

This is not a conventional portfolio. It is a deliberate argument against "one-style" design — a site that mixes pixel art, glassmorphism, retro game aesthetics, high-end shaders, and refined UI within a single page, on purpose. The eclecticism is the style. The connecting thread is craft, not visual consistency.

**Core thesis**: Design conformity produces sameness. This site proves the alternative — that someone who deeply knows the rules can break them deliberately and produce something worth exploring.

**What makes it distinct**:
- Every interactive element can have a completely different aesthetic
- Discovery and delight are the primary navigation model — the portfolio IS the work
- Every element should make someone want to click it just to see what happens

---

## 2. Audience & Context

- **Primary audience**: Design directors, senior engineers, potential collaborators
- **Device**: Desktop-first (cursor-driven). Mobile is addressed in §8
- **Session type**: Exploratory, not task-driven. The user wanders

---

## 3. Page Structure

The site is a single scrollable column, `maxWidth: 600px`, centered. All sections stack vertically. Overlays mount on top of the page via `position: fixed`. Body scroll is locked when any overlay is open.

```
V2Canvas
├── Section 1 — Info
├── Section 2 — Selected Projects
├── Divider ("Projects")
├── Section 3 — Other Projects (Client + Personal)
└── Section 4 — Footer (Socials + Envelope)

Overlays (position: fixed, mount on interaction)
├── Notes expanded (bottom sheet, 95vh)
├── VorliReceiptDetail
├── StickyOverlay
├── ZounDetail
├── WearDetail
├── PauschalDetail
├── FynnDetail
├── ContentSnareDetail
└── EnvelopeOverlay (About Me + Notes to Self)
```

---

## 4. Global Behaviors

### Page Load Animation
- Entry: scale `1.04` → `1`, blur `12px` → `0px`, opacity `0` → `1`
- Duration: 1.1s, cubic-bezier `[0.22, 1, 0.36, 1]`

### Build Version
Displayed below the name in the intro. Computed at runtime:
```ts
`v${currentYear - 1993}.${month}.${day}`
// Example: v33.4.3 on April 3, 2026
```
It's a signature, not semver.

### Blur & Focus System
When any overlay is open, the background recedes:
- Scale: `1.0` → `0.93`
- Blur: `0px` → `10px`
- Pointer events: disabled
- Transition: tween, 0.35s, cubic-bezier
- Unblur triggers immediately when close sequence begins (before animation completes) for fast feedback

### Body Scroll Lock
Applied when any of these are open: project detail, envelope, notes card expanded, sticky overlay.

### ESC to Close
All overlays respond to the Escape key.

### FLIP Animation Pattern
All project detail opens use FLIP (First, Last, Invert, Play):
1. Capture `DOMRect` of the clicked element
2. Mount overlay at the origin position/size
3. Animate to final position/size
4. On close: reverse back to origin

---

## 5. Section 1 — Info

**File**: `V2Canvas.tsx` (inline)

**Goal**: Establish personality before anything is clicked. Personal, not corporate.

### Content
- **Logo** — SVG mark, dual-color (teal + yellow), glassmorphic multi-layer drop shadow
- **"Hey You"** — small greeting label, JetBrains Mono
- **"I'm Bogdan"** — name, JetBrains Mono medium
- **Build version** — `v33.4.3`, computed dynamically from author's birth year
- **Typewriter role** — cycles through 3 phrases (see below)
- **Body text** — "I build things that feel considered..."

### Typewriter
Phrases (in order, cycled):
1. `Product Designer`
2. `Design Engineer`
3. `Or whatever the industry says`

Timings: 60ms/char to type · 1800ms pause · 40ms/char to delete · 400ms wait · cursor blinks during pause

### Interactions
- No click targets in this section
- Blurs/scales down when any overlay is open

---

## 6. Section 2 — Selected Projects

**File**: `components/elements/selected-projects-section.tsx`

**Goal**: Three featured projects as physical cards you want to touch. Immediate visual payoff.

**Container**: Gray rounded pill (`background: #F0F0F0`, `borderRadius: 40px`, `padding: 64px`). Cards sit inside slightly overlapping.

### Cards

#### Notes Card (Useless Notes — iOS app)
- **Resting state**: Card at default, overlaps Vorli (`marginRight: -21px`), `zIndex: 3`
- **Hover**: lifts `y: -16px` (spring)
- **Ripple wave**: fires from click point on the card — all text chars and the image pixels displace along the wave front at 270px/s, dissipates over 1000ms
- **Click**: FLIP expands card to a **bottom sheet** (`95vh`, `877px` wide, fixed bottom 0)
  - Background blurs behind it
  - Tags stagger-animate in (0.07s between each)
  - Content stagger-animates in: description → download button → media grid
  - Sticky header appears (IntersectionObserver) when user scrolls past the card header
- **Expanded sheet content**: App icon, title, tags, App Store badge, description, 3-column masonry grid of 4 videos + 5 screenshots
- **Close**: Click backdrop, or ESC → tags exit first, then content, then sheet FLIP-collapses back to card

#### Vorli Card (iOS Financial Assistant)
- **Resting state**: rotated `−5deg`, `zIndex: 2`
- **Hover**: `y: -16px`
- **Ripple wave**: same config as Notes
- **Click**: Opens `VorliReceiptDetail` (see §7)

#### Sticky Card (iOS Sticky Notes app)
- **Resting state**: rotated `+5deg`, `marginLeft: -21px`, `zIndex: 1`
- **Hover**: `y: -16px`
- **Image slot**: renders live `StickyNotesIcon` component (not a static image), fades to `opacity: 0` when overlay is open
- **Click**: Opens `StickyOverlay` (see §7)

---

## 7. Section 3 — Other Projects

**File**: `components/elements/project-section.tsx`

**Goal**: Full work list, scannable. Hover communicates interactivity without noise.

**Layout**: Two columns, 50/50, inside `maxWidth: 600px`. Column labels: `Client_` / `Personal_`.

### Hover Behavior
- Any entry hovered → all other entries dim
- Hovered entry stays full opacity
- Managed via `hoveredKey` state in `ProjectSection`

### Client Projects

| Project | Icon | Tags | Detail |
|---|---|---|---|
| Fynn.io | `fynn.png` rotated 13.1° | Web · HealthTech · B2B | `FynnDetail` |
| Content Snare | `content-snare.png` rotated 3.34° | Web · Productivity · B2B/B2C | `ContentSnareDetail` |

### Personal Projects

| Project | Icon | Tags | Detail |
|---|---|---|---|
| Zoun | `globe.png` | iOS · Time Zone Tracker | `ZounDetail` |
| Weather Wear | `puffer.png` grayscale | iOS · Weather Through Clothes | `WearDetail` (in progress) |
| Pauschal Tracker | `pauschal-tracker.png` rotated 7.68° | Web · Earning limit tracker | `PauschalDetail` |

### Click → Detail Flow
1. Entry clicked → `DOMRect` captured from the row element
2. Detail overlay mounts at that origin
3. FLIP animates to final position
4. Content stagger-animates in
5. ESC or backdrop click → FLIP returns to origin

---

## 8. Section 4 — Footer

**File**: `components/elements/project-section.tsx` (inside `ProjectSection`)

**Goal**: Social links + the most rewarding hidden interaction on the page (Envelope).

### Social Icons
Three icon buttons: **X/Twitter**, **LinkedIn**, **Substack**

- **Resting state**: grayscale, 45% opacity
- **Hover**: full brand color, color transition 0.4s cubic-bezier
- Each is a glassmorphic icon button (CSS module: `GlassButton.module.css`)
- All open in a new tab

### Envelope Widget
- **Resting state**: small envelope icon, visible at bottom right of footer
- **When overlay open**: fades to `opacity: 0`
- **Click**: Opens `EnvelopeOverlay` with FLIP from the widget's position

#### EnvelopeOverlay — Interaction Sequence
A multi-phase choreographed animation. Phases in order:

| Phase | What Happens |
|---|---|
| `move-to-center` | Envelope travels from footer origin to viewport center (spring) |
| `open-flap` | Top flap opens (SVG path animation) |
| `pull-paper-up` | Notes paper rises from inside the envelope |
| `pull-paper-down` | Notes paper settles |
| `open` | Both papers visible — Notes (left) + About Me stack (right) |
| `focus-about` / `focus-notes` | Click either paper to zoom/focus on it |
| `return-paper-up/down` | Close sequence begins — paper reversal |
| `close-flap` | Flap closes |
| `move-to-origin` | Envelope returns to footer widget position |

**Notes paper** (left side inside envelope):
- Random motivational message on each open (12 messages total)
  - e.g. "You have a great fuckin' day...", "No notes. Genuinely. You're killing it."
- Draggable left/right
- Scrollable to reveal full content
- Component: `NotesToSelf`

**About Me stack** (right side inside envelope):
- Component: `AboutMeStack` — 4 physical pages rendered as a loose paper stack
- Pages sit at varied rotations (−8° to +6°) like real paper
- **Hover**: pages fan out more dramatically (spring physics: stiffness 130, damping 18)
- **Expanded mode** (`isExpanded`): pages fan horizontally into a readable side-by-side layout
- Each page uses the `PaperTexture` shader for realistic paper material
- Pages: Page 1 (intro/about), Page 2 (work), Page 3 (skills), Page 4 (personal)
- Personal photos embedded: `me-and-son.png`, `pool-side.png`, `landrover.png`, `figure.png`

**Close**: ESC or click outside → reverse phase sequence plays → envelope returns to origin.

---

## 9. Project Detail Overlays

All overlays share: ESC to close · click backdrop to close · FLIP animation · background blur · body scroll lock · stagger-in for content

### Notes — Bottom Sheet
- **Trigger**: Notes card in Selected Projects
- **Style**: Bottom-anchored sheet, `95vh`, `877px` wide, white-to-gray gradient
- **Header**: sticky when scrolled (IntersectionObserver)
- **Content**: App icon, title, tags, App Store badge, description, masonry grid (4 videos + 5 images)
- **Close**: FLIP collapses back to card with staggered exit

### VorliReceiptDetail
- **Trigger**: Vorli card click
- **Style**: Receipt aesthetic — bottom-aligned sheet, `PaperTexture` shader background, dashed separator lines
- **Content**: MetaRow label/value pairs, description, tags
- **Animation**: Spring entry (stiffness 380, damping 38), tween exit (0.42s)

### StickyOverlay
- **Trigger**: Sticky card click
- **Style**: Centered modal, FLIP from card icon origin
- **Origin**: DOMRect captured from the `StickyNotesIcon` element inside the card
- **Animation**: Manual scale math (not Framer Motion scale), 3 phases: `move-to-center` → `open` → `move-to-origin`
- **Content**: Full-size sticky note with personal copy

### ZounDetail
- **Trigger**: Zoun project row click
- **Style**: Centered modal, glassmorphism backdrop, Oklab gradient background
- **Content**: 3 app screenshots (vertical), description, tags (iOS · Time Zone Tracker · In progress)
- **Animation**: Spring (stiffness 340, damping 36)

### WearDetail
- **Trigger**: Weather Wear row click (marked as in-progress, still clickable)
- **Style**: Card positioned relative to click origin (offset right)
- **Content**: Screenshot carousel, description, tags

### PauschalDetail
- **Trigger**: Pauschal Tracker row click
- **Style**: Centered modal
- **Content**: 5 screenshots in carousel, description, tags

### FynnDetail
- **Trigger**: Fynn.io row click
- **Style**: Large scrollable card, 60% viewport width
- **Content**: 4-column screenshot grid, design system spec section, description, sticky header
- **Scroll**: Internal scroll, header sticks via IntersectionObserver

### ContentSnareDetail
- **Trigger**: Content Snare row click
- **Style**: Same as Fynn — large scrollable card, sticky header
- **Content**: Feature images, description, tags

---

## 10. Responsive Design

**Status**: Not yet implemented. Required before launch.

### Breakpoint Strategy

| Breakpoint | Width | Context |
|---|---|---|
| Mobile | < 480px | Single column, reduced padding, touch-optimized |
| Tablet | 480px – 768px | Single column, moderate padding |
| Desktop | > 768px | Current design, max-width 600px centered |

### Per-Section Responsive Behavior

**Section 1 — Info**
- Desktop: current layout (centered, 600px max)
- Tablet/Mobile: full width with 24px horizontal padding, smaller font sizes

**Section 2 — Selected Projects**
- Desktop: 3 cards side-by-side with overlap
- Tablet: 3 cards with reduced padding, smaller card size
- Mobile: horizontal scroll, cards at reduced size (120×165px) or single featured card
- Notes bottom sheet: on mobile → full-width (100vw), adjust masonry grid to 2 columns

**Section 3 — Other Projects**
- Desktop: 2-column (Client / Personal)
- Tablet/Mobile: single column, Client section first then Personal, same hover → active behavior (use tap instead of hover)

**Section 4 — Footer**
- Desktop: single row (social icons left, envelope right)
- Mobile: same layout, tap targets minimum 44×44px

### Overlay Behavior on Mobile

| Overlay | Mobile Adaptation |
|---|---|
| Notes bottom sheet | Full width, 98vh, 1-column grid |
| VorliReceiptDetail | Full width bottom sheet |
| StickyOverlay | Centered, max 90vw |
| ZounDetail / PauschalDetail | Full width, inset 16px |
| FynnDetail / ContentSnareDetail | Full screen (100vw, 100vh), scrollable |
| EnvelopeOverlay | Simplified — papers shown sequentially, not side-by-side |

### Touch Interactions
- Ripple wave: trigger on `touchstart` (same as click)
- FLIP animations: same spring config, no changes needed
- Hover → active state (`:active` pseudo class or `onTouchStart`)
- Drag on Notes paper: `dragConstraints` already set, works on touch

---

## 11. Dead Code / Unused Components

The following exist in the codebase but are **not used** in the current design. They should be removed or explicitly kept as planned future features:

| File | Status | Notes |
|---|---|---|
| `components/ui/celestial-toggle.tsx` | Unused | Was part of a theme toggle. No theme toggle in current design |
| `components/ui/live-clock.tsx` | Unused | Removed from header in current design |
| `components/ui/win95-button.tsx` | Unused | React95 dependency no longer needed |
| `components/providers/react95-provider.tsx` | Unused | Can be removed alongside Win95 |
| `app/api/spotify/*` | Scaffold | Spotify integration not wired to UI |
| `lib/constants.ts` (CHARACTER, FIGMA_POSITIONS, INTERACTION_ZONES) | Unused | Game canvas constants — keep if canvas is planned for v2 |
| `lib/sun-shadow.ts` / `hooks/useSunShadow.ts` | Unused | Was for logo shadow animation. Not active |

---

## 12. Assets

| Type | Files |
|---|---|
| Project icons | `fynn.png`, `content-snare.png`, `receipt.png`, `notes.png`, `puffer.png`, `globe.png`, `pauschal-tracker.png`, `sticky.png` |
| Envelope SVG parts | `envelope-top/bottom/left/right.svg`, `paper-folded/unfolded.svg` |
| About Me photos | `me-and-son.png`, `pool-side.png`, `landrover.png`, `figure.png` |
| App screenshots | Fynn (8), Pauschal (5), Zoun (3), Content Snare (varies), Wear (varies), Useless Notes (5 images) |
| App videos | Useless Notes: `Onboarding.mp4`, `Da bomb.MP4`, `Sharing.mp4`, `card burn.MP4` |
| Audio | `woosh.mp3`, `glitch.mp3` (not yet wired to interactions) |

---

## 13. Typography

| Font | Usage |
|---|---|
| JetBrains Mono | Headings, labels, tags, code-like UI text |
| Geist Sans | Body text, descriptions |
| Special Elite | Handwritten/note aesthetic (Notes to Self, About Me pages) |
| Silkscreen | Pixel-art elements (planned for game canvas) |

---

## 14. What This Is Not

- Not a blog
- Not a template or generic portfolio
- Not a UI library consumer (no Chakra, shadcn, MUI — everything custom)
- Not using a dark/light theme toggle (light mode only for v1)
- Not scroll-hijacked — natural scroll within the single column

---

## 15. Success Criteria

A visitor should:
1. Click something within the first 10 seconds — purely out of curiosity
2. Open at least 2 overlays in one session
3. Discover the envelope without being told it exists
4. Leave with a clear sense of Bogdan's range — both in design and engineering
5. Feel like the site itself is the case study

---

*This document reflects the actual built state of Website v1 as of 2026-04-03. Update it when the implementation changes.*
