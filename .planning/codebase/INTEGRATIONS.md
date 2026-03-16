# External Integrations

**Analysis Date:** 2026-03-16

## APIs & External Services

**Weather:**
- Open-Meteo Weather API - Real-time weather data for Belgrade
  - SDK/Client: Native `fetch()` in `components/canvas/weather/useWeather.ts`
  - Auth: None required (free public API)
  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Data: Current temperature (Celsius), WMO weather code, day/night indicator
  - Caching: 30-minute session cache with fallback to time-based default

**Spotify:**
- Spotify Accounts API - OAuth 2.0 authorization and token management
  - SDK/Client: Native `fetch()` in API routes
  - Auth: Requires Spotify Premium account for Web Playback SDK
  - Endpoints:
    - `https://accounts.spotify.com/authorize` - User authorization (OAuth)
    - `https://accounts.spotify.com/api/token` - Token exchange and refresh
  - Credentials required:
    - `SPOTIFY_CLIENT_ID` - App ID from Spotify Developer Dashboard
    - `SPOTIFY_CLIENT_SECRET` - App secret (server-side only)
    - `SPOTIFY_REFRESH_TOKEN` - Long-lived refresh token (obtained via `/api/spotify/auth` flow)

- Spotify Web API - Recently played tracks and playback state
  - SDK/Client: Native `fetch()` in `app/api/spotify/recently-played/route.ts`
  - Auth: Bearer token (obtained from refresh token)
  - Endpoint: `https://api.spotify.com/v1/me/player/recently-played`
  - Scope: `user-read-recently-played`
  - Response caching: 60 seconds with stale-while-revalidate (server-side)
  - Client caching: 60-second session cache via `sessionStorage`

- Spotify Web Playback SDK - In-browser playback control
  - SDK/Client: Browser script injection in `components/canvas/spotify/useSpotify.ts`
  - Auth: Bearer token with streaming scope
  - Script source: `https://sdk.scdn.co/spotify-player.js`
  - Scopes required:
    - `streaming` - Required for playback
    - `user-read-playback-state` - Current playback state
    - `user-modify-playback-state` - Play/pause control
    - `user-read-currently-playing` - Current track info
    - `user-read-email` - Email scope (for auth)
    - `user-read-private` - Private user data scope
  - Device: Named device "Bogste's Turntable"

## Data Storage

**Databases:**
- None - Static site with no persistent data

**File Storage:**
- Local filesystem only (public assets in `public/` directory)

**Caching:**
- Client-side: `sessionStorage` for weather and recently played tracks (30-60 minute TTL)
- Server-side: Next.js response caching headers for Spotify recently-played API

## Authentication & Identity

**Auth Provider:**
- Spotify OAuth 2.0 (custom implementation via server-side API routes)

**Implementation:**
- Flow: `app/api/spotify/auth` redirects to Spotify authorization endpoint
- Callback: `app/api/spotify/callback` exchanges auth code for refresh token
- Token management: `app/api/spotify/playback-token` refreshes expired access tokens on demand
- Token storage: `SPOTIFY_REFRESH_TOKEN` stored as environment variable (server-only)
- Client receives: Short-lived access token from `/api/spotify/playback-token` endpoint

## Monitoring & Observability

**Error Tracking:**
- None configured - Errors logged to console and relayed to UI

**Logs:**
- Console logging in browser for debugging
- Spotify error states surface as user-facing error messages in `useSpotify` hook
- Weather fetch failures fall back to time-based default silently

## CI/CD & Deployment

**Hosting:**
- Vercel (Next.js deployment platform)

**CI Pipeline:**
- None detected - Likely handled by Vercel's built-in GitHub integration

## Environment Configuration

**Required env vars:**
```
SPOTIFY_CLIENT_ID         - Spotify app client ID
SPOTIFY_CLIENT_SECRET     - Spotify app client secret (server-side)
SPOTIFY_REFRESH_TOKEN     - Refresh token (obtained via /api/spotify/auth flow)
```

**Optional:**
- None detected

**Secrets location:**
- Development: `.env.local` file (gitignored, never committed)
- Production: Vercel dashboard environment variables

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Spotify callback redirect: `http://localhost:3000/api/spotify/callback` (development)
- Redirects back to Spotify authorization endpoint after token exchange

## API Routes

**Location:** `app/api/` (Next.js API routes)

**Spotify OAuth Flow:**
- `GET /api/spotify/auth` - Initiates OAuth authorization (temporary, for setup only)
- `GET /api/spotify/callback?code=...` - OAuth callback, exchanges code for refresh token
- `GET /api/spotify/playback-token` - Returns valid access token (with 60s cache header)
- `GET /api/spotify/recently-played` - Returns most recently played track

## Integration Architecture

**Weather:**
- Client hook `useWeather()` in `components/canvas/weather/useWeather.ts`
- Direct fetch to open-meteo API on component mount
- Session storage caching, time-based fallback on failure
- No server-side routing required

**Spotify Playback:**
- Client hook `useSpotify()` in `components/canvas/spotify/useSpotify.ts`
- Fetches access token from `/api/spotify/playback-token` on mount
- Loads Spotify Web Playback SDK script dynamically
- Manages player lifecycle, state changes, playback control
- Error handling for auth, account, and playback failures

**Spotify Recently Played:**
- Client hook `useSpotifyRecent()` in `components/canvas/spotify/useSpotifyRecent.ts`
- Calls `/api/spotify/recently-played` API route
- Session storage caching with 60s TTL (matches server cache)
- Graceful fallback to null on failure

---

*Integration audit: 2026-03-16*
