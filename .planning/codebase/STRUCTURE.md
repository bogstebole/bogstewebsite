# Directory Structure

## Overview

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — fonts, metadata, ThemeProvider shell
│   ├── page.tsx                # Landing page — renders GameCanvas only
│   ├── globals.css             # Global CSS resets
│   └── api/
│       └── spotify/            # Spotify OAuth + API routes
│           ├── auth/route.ts
│           ├── callback/route.ts
│           ├── playback-token/route.ts
│           └── recently-played/route.ts
│
├── components/
│   ├── canvas/                 # Game canvas system (all "use client")
│   │   ├── GameCanvas.tsx      # Main orchestrator — game loop, all state
│   │   ├── PixelCharacter.tsx  # Walking character renderer
│   │   ├── GroundLine.tsx      # Ground platform
│   │   ├── InteractiveElement.tsx  # Base interactive element
│   │   ├── WarpParticles.tsx   # Door warp effect
│   │   ├── pixel-portal.tsx    # Portal ring visual
│   │   ├── pixel-dust.tsx      # Dust burst on headbutt impact
│   │   ├── lightning-trail.tsx # Lightning effect
│   │   ├── intro-sequence.tsx  # Intro animation
│   │   ├── intro-bubble.tsx    # Speech bubble
│   │   ├── NervousBoule.tsx    # Anxious character variant
│   │   ├── clouds.tsx          # Cloud layer
│   │   ├── stars.tsx           # Star layer (dark mode)
│   │   ├── "Pixel Weather Background.jsx"  # Legacy JSX (not migrated)
│   │   ├── spotify/            # Spotify player components
│   │   │   ├── VintageTurntable.tsx    # Main turntable UI (dynamic import)
│   │   │   ├── AquaMediaPlayer.tsx     # Alt media player UI
│   │   │   ├── useSpotify.ts           # Spotify playback hook
│   │   │   ├── useSpotifyRecent.ts     # Recently played hook
│   │   │   └── turntable.module.css
│   │   └── weather/            # Weather system
│   │       ├── WeatherCanvas.tsx       # Pixel weather renderer
│   │       ├── WeatherReadout.tsx      # Weather data display
│   │       ├── useWeather.ts           # Open-Meteo data fetch hook
│   │       └── wmo-map.ts              # WMO code → weather state mapping
│   │
│   ├── elements/               # Interactive canvas elements
│   │   ├── Door.tsx            # Door element (enter → section)
│   │   ├── Block.tsx           # Block element (headbutt → content)
│   │   ├── project-cluster.tsx # Project icons cluster
│   │   ├── project-icon.tsx    # Individual project icon
│   │   └── work-cluster.tsx    # Work/agency project cluster
│   │
│   ├── sections/               # Content panels opened from canvas
│   │   └── about-timeline.tsx  # About Me pixelated timeline
│   │
│   ├── ui/                     # Reusable UI primitives
│   │   ├── win95-button.tsx    # Windows 95 retro button
│   │   ├── info-panel.tsx      # HUD info overlay panel
│   │   ├── live-clock.tsx      # Real-time clock display
│   │   ├── celestial-toggle.tsx  # Day/night theme toggle
│   │   ├── logo.tsx            # Site logo
│   │   ├── retro-window.tsx    # Win95-style window frame
│   │   ├── project-detail-window.tsx  # Project detail panel
│   │   ├── GlassButton.module.css
│   │   └── project-detail-window.module.css
│   │
│   ├── providers/              # React context providers
│   │   ├── theme-provider.tsx  # Light/dark theme context
│   │   └── react95-provider.tsx  # React95 UI lib provider
│   │
│   ├── animations/             # Framer Motion wrappers (empty, reserved)
│   └── three/                  # R3F components (empty, reserved)
│
├── lib/                        # Pure logic and config
│   ├── game-engine.ts          # Character movement, collision, jump physics
│   ├── figma-scale.ts          # Figma → canvas coordinate conversion
│   ├── constants.ts            # INTERACTION_ZONES, CANVAS, FIGMA_POSITIONS, CHARACTER
│   ├── fonts.ts                # Font loading (next/font)
│   ├── utils.ts                # General helpers
│   └── styled-components-registry.tsx  # SSR registry for styled-components
│
├── assets/                     # Source design assets (not served directly)
│   ├── logo.svg
│   ├── fynn.svg
│   ├── content-snare.svg
│   ├── Folder/                 # Folder icon SVGs
│   └── Useless Notes/          # App screenshots + videos
│
├── public/                     # Static files served at root
│   └── (sprites, images, sounds — currently minimal)
│
├── memory/                     # Claude persistent memory (not project code)
│
└── "Vintage Turntable.html"    # Standalone prototype (not integrated)
```

## Key File Locations

| Purpose | File |
|---------|------|
| Game loop | `components/canvas/GameCanvas.tsx` |
| Character physics | `lib/game-engine.ts` |
| Layout constants | `lib/constants.ts` |
| Coordinate scaling | `lib/figma-scale.ts` |
| Theme context | `components/providers/theme-provider.tsx` |
| Spotify OAuth | `app/api/spotify/auth/route.ts` |
| Weather data | `components/canvas/weather/useWeather.ts` |
| Root metadata | `app/layout.tsx` |

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component files | PascalCase | `PixelCharacter.tsx` |
| Utility/hook files | kebab-case | `game-engine.ts`, `useSpotify.ts` |
| CSS Modules | `ComponentName.module.css` | `turntable.module.css` |
| API routes | directory + `route.ts` | `app/api/spotify/auth/route.ts` |

## Where to Add New Code

| What | Where |
|------|-------|
| New canvas element | `components/canvas/` |
| New interactive element (door/block variant) | `components/elements/` |
| New section/panel | `components/sections/` |
| New reusable UI primitive | `components/ui/` |
| New 3D component (R3F) | `components/three/` |
| New animation wrapper | `components/animations/` |
| New game logic (pure) | `lib/game-engine.ts` |
| New site-wide constant | `lib/constants.ts` |
| New API route | `app/api/[feature]/route.ts` |
| Static assets (sprites, sounds) | `public/` |
