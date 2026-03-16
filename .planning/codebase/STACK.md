# Technology Stack

**Analysis Date:** 2026-03-16

## Languages

**Primary:**
- TypeScript 5.x - Strict mode, used throughout app and components
- JavaScript (ES2017 target) - Build output

**Secondary:**
- CSS/Tailwind CSS 4.x - Styling and layout

## Runtime

**Environment:**
- Node.js (via npm, deployment on Vercel)

**Package Manager:**
- npm (version specified in package-lock.json)
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js 16.1.6 - App Router, server components, API routes
- React 19.2.3 - UI components and hooks
- React DOM 19.2.3 - DOM rendering

**UI & Styling:**
- Framer Motion 12.34.0 - Animation and transitions for micro-interactions
- styled-components 6.3.9 - CSS-in-JS for dynamic styling (`lib/styled-components-registry.tsx`)
- react95 4.0.0 - Windows 95 retro UI components
- Tailwind CSS 4.x (via @tailwindcss/postcss) - Utility-first CSS

**Icons:**
- lucide-react 0.564.0 - SVG icon library

**Build/Dev:**
- ESLint 9.x - Linting with Next.js config (`eslint-config-next`)
- TypeScript 5.x - Type checking (`tsc --noEmit`)
- PostCSS 4.x - CSS processing with Tailwind plugin

## Key Dependencies

**Critical:**
- next 16.1.6 - Full-stack React framework with API routes, server-side rendering
- react + react-dom 19.2.3 - Modern React with suspense boundaries
- framer-motion 12.34.0 - Animation framework for interactive cursor-driven interactions
- styled-components 6.3.9 - Dynamic CSS injection for component-scoped styling

**Infrastructure:**
- @tailwindcss/postcss 4.x - Tailwind CSS processing pipeline
- eslint-config-next 16.1.6 - ESLint rules for Next.js best practices

## Configuration

**Environment:**
- `.env.local` file required (gitignored) for Spotify credentials
- Environment variables for Spotify API integration:
  - `SPOTIFY_CLIENT_ID` - Spotify app client ID
  - `SPOTIFY_CLIENT_SECRET` - Spotify app client secret
  - `SPOTIFY_REFRESH_TOKEN` - Long-lived refresh token for playback access
- Credentials set via environment, never committed to repository

**Build:**
- `next.config.ts` - Minimal Next.js configuration (`app/api/` routes enabled)
- `tsconfig.json` - TypeScript compiler options with strict mode enabled
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS v4 plugin
- `eslint.config.mjs` - ESLint flat config with Next.js web vitals and TypeScript presets

## Scripts

**Development:**
```bash
npm run dev              # Start Next.js dev server (localhost:3000)
npm run build            # Production build
npm start                # Start production server (post-build)
npm run lint             # Run ESLint
npx tsc --noEmit        # Type check without build
```

## Platform Requirements

**Development:**
- Node.js (v18+ recommended by Next.js 16)
- npm or compatible package manager
- Modern browser with ES2017+ support
- For Spotify features: Spotify Premium account required for Web Playback SDK

**Production:**
- Deployment target: Vercel (Next.js platform of choice)
- Serverless function support for API routes (`app/api/` handlers)
- Environment variables configured via Vercel dashboard

## Font Configuration

**Google Fonts (loaded via `next/font/google`):**
- Geist - Primary sans-serif (`--font-geist-sans`)
- Geist Mono - Monospace code font (`--font-geist-mono`)
- Inter - Secondary sans-serif (`--font-inter`)
- Silkscreen - Pixel art/retro aesthetic (`--font-silkscreen`)
- JetBrains Mono - Code font with weights 400, 500, 700 (`--font-jetbrains-mono`)
- Special Elite - Handwriting-style font (`--font-special-elite`)

Loaded as CSS variables in `lib/fonts.ts`, injected into root layout `app/layout.tsx`.

## External Integrations (in Stack)

**Weather API:**
- open-meteo.com v1 forecast API - No auth required, free tier
- Location: Belgrade (hardcoded coordinates in `components/canvas/weather/useWeather.ts`)
- Response: temperature, weather code (WMO), day/night indicator

**Spotify Web APIs:**
- Spotify Accounts API - OAuth 2.0 authorization and token refresh
- Spotify Web API - Recently played tracks endpoint
- Spotify Web Playback SDK - In-browser player via script tag injection

---

*Stack analysis: 2026-03-16*
