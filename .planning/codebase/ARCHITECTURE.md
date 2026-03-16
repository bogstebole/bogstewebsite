# Architecture

## Pattern

**Canvas-centric game loop** — a fixed-viewport React component owns a `requestAnimationFrame` loop and drives all character state. UI components layer on top as absolutely-positioned overlays. No routing; the entire experience lives on one page.

## Architectural Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Entry | `app/page.tsx` | Renders `ThemeProvider` + `GameCanvas` |
| Canvas orchestrator | `components/canvas/GameCanvas.tsx` | Game loop, all state, event handlers |
| Game engine | `lib/game-engine.ts` | Pure state transitions (character movement, collision, jump) |
| Character renderer | `components/canvas/PixelCharacter.tsx` | Sprite rendering, walking/idle animations |
| Environment | `components/canvas/GroundLine.tsx`, `WeatherCanvas`, clouds, stars | Background layers |
| Interactive elements | `components/elements/` | Door, Block, ProjectCluster, WorkCluster |
| Effects | `components/canvas/WarpParticles`, `pixel-dust`, `lightning-trail`, `pixel-portal` | Visual feedback on interactions |
| Sections | `components/sections/` | Content panels that open from canvas interactions |
| UI primitives | `components/ui/` | Reusable styled components (RetroWindow, Win95Button, GlassButton, InfoPanel) |
| Providers | `components/providers/` | ThemeProvider, React95Provider |
| Config/scale | `lib/constants.ts`, `lib/figma-scale.ts` | Layout constants, Figma-to-canvas coordinate mapping |

## Data Flow

### Cursor → Character Movement
```
mousemove event
  → cursorXRef (mutable ref, no re-render)
  → rAF loop reads cursorXRef
  → updateCharacter() [pure fn in game-engine.ts]
  → setCharacter() [triggers render]
  → PixelCharacter re-renders with new x/facing/animation
```

### Interaction Zone Detection
```
rAF loop
  → checkInteractionZone(characterX, zones) [pure fn]
  → setNearZone(zoneId)
  → InteractiveElement highlights hover state
```

### Warp / Door Sequence
```
click on door zone
  → warpTriggerRef = "warping_out"
  → WarpParticles plays exit animation
  → setActiveSection("about")
  → AboutTimeline renders as overlay
  → close → warpTriggerRef = "warping_in"
```

### Headbutt Mechanic (Block/Project)
```
click on project icon
  → headbuttParamsRef = { sprintTargetX, headbuttTargetY }
  → warpTriggerRef = "headbutt_sprint"
  → character sprints to icon X
  → jump() triggered at target
  → phase: sprint → jump → impact → iconReaction → window
  → ProjectDetailWindow opens with origin rect for animation
```

## Key Abstractions

### `CharacterState` (lib/game-engine.ts)
Immutable state object returned by pure `updateCharacter()`. Contains: `x`, `y`, `facing`, `isWalking`, `isJumping`, `velocityY`.

### `WarpStateMachine` (inline in GameCanvas refs)
`warpTriggerRef` drives the warp/door animation state: `"idle" | "shivering" | "warping_in" | "warping_out" | "warped" | "headbutt_sprint" | "headbutt_jump" | "headbutt_falling"`.

### `HeadbuttState` (GameCanvas.tsx)
Tracks multi-phase headbutt sequence with project data, origin rect, and current phase for animation coordination.

### `FigmaCoordinateSystem` (lib/figma-scale.ts)
`figmaX()` / `figmaY()` convert Figma design coordinates to responsive canvas-local coordinates. Enables pixel-perfect placement across window sizes.

### `InteractionZones` (lib/constants.ts)
Named zones with X ranges. The game engine checks character X against these to trigger `nearZone` state, driving hover effects without direct component coupling.

## Entry Points

| Entry | File |
|-------|------|
| App shell | `app/layout.tsx` |
| Landing page | `app/page.tsx` |
| Spotify auth | `app/api/spotify/auth/route.ts` |
| Spotify callback | `app/api/spotify/callback/route.ts` |
| Spotify playback token | `app/api/spotify/playback-token/route.ts` |
| Recently played | `app/api/spotify/recently-played/route.ts` |

## Rendering Strategy

- **Server components**: `app/layout.tsx`, `app/page.tsx` (shell only)
- **Client components**: Everything under `components/canvas/` — all use `"use client"`
- **Dynamic imports (no SSR)**: `VintageTurntable` (Spotify player with Web Playback SDK)
- **CSS Modules**: `turntable.module.css`, `intro-bubble.module.css`, `GlassButton.module.css`, `project-detail-window.module.css`
- **Tailwind**: Used throughout for layout and utility classes

## External API Integration

- **Spotify Web API** — OAuth flow via `/api/spotify/`, playback via Web Playback SDK (client-side)
- **Open-Meteo** — weather data fetched in `useWeather.ts` (no API key required)
- **WMO weather codes** — mapped to pixel weather states in `wmo-map.ts`

## Theme System

`ThemeProvider` in `components/providers/theme-provider.tsx` manages light/dark mode with `isDark` state. `CelestialToggle` is the UI control. Weather canvas and character react to theme.
