# Project Memory

## Stack
- Next.js 16 App Router, TypeScript strict, Tailwind CSS
- Framer Motion for UI animations, React Three Fiber for 3D
- Fonts via next/font/google, loaded via CSS variables in layout.tsx

## Key Fonts (lib/fonts.ts)
- `--font-geist-sans`, `--font-geist-mono`, `--font-inter`
- `--font-silkscreen` (pixel art)
- `--font-jetbrains-mono` (monospace, used for VFD/terminal displays)
- `--font-special-elite` (typewriter/vintage, added for turntable record label)

## Spotify Integration
- `app/api/spotify/auth/route.ts` — TEMPORARY OAuth helper, includes streaming + recently-played scopes
- `app/api/spotify/callback/route.ts` — TEMPORARY, exchanges code for refresh token
- `app/api/spotify/recently-played/route.ts` — returns last played track (no SDK, server-side only)
- `app/api/spotify/playback-token/route.ts` — returns fresh access token for Web Playback SDK

### Turntable Component
- `components/canvas/spotify/useSpotify.ts` — Web Playback SDK hook
  - Loads SDK script dynamically, sets window.onSpotifyWebPlaybackSDKReady
  - Returns: currentTrack, isPlaying, progress (0-100), duration (seconds), play(), pause(), isReady, error
  - Progress interpolated via setInterval(500ms) between SDK state events
  - Requires Spotify Premium + refresh token with streaming scope
- `components/canvas/spotify/turntable.module.css` — all styles, CSS vars for spin speed & dust timing
- `components/canvas/spotify/VintageTurntable.tsx` — skeuomorphic turntable component

### Re-auth needed
If Spotify SDK auth fails, visit /api/spotify/auth again — old refresh token may only have `user-read-recently-played` scope. New auth includes `streaming`, `user-read-email`, `user-read-private`, `user-read-playback-state`, `user-modify-playback-state`.

## Lint Notes
- `Math.random()` inside useMemo triggers react-hooks/purity — use `useState(() => ...)` lazy initializer instead
- `Date.now()` in useRef initial value also triggers purity — initialize with 0 instead
- Async functions called in useEffect that set state internally trigger set-state-in-effect false positives — use eslint-disable-next-line

## Pre-existing Lint Errors (not mine)
- `components/ui/project-detail-window.tsx` — set-state-in-effect warning
- `components/ui/win95-button.stories.tsx` — @ts-nocheck error
