# Codebase Concerns

**Analysis Date:** 2026-03-16

## Tech Debt

**Spotify Authentication Setup (One-time Manual Flow):**
- Issue: OAuth flow requires manual visit to `/api/spotify/auth` endpoint to obtain refresh token, which must be manually copied into `.env.local`. This is hardcoded for localhost development and will fail in production.
- Files: `app/api/spotify/auth/route.ts`, `app/api/spotify/callback/route.ts`, `app/api/spotify/playback-token/route.ts`
- Impact: Cannot deploy to production without completely rearchitecting the auth flow. The callback redirect is hardcoded to `http://localhost:3000/api/spotify/callback`, which will fail on production domains.
- Fix approach: Implement environment-aware redirect URI that changes per deployment. Add a proper token storage/refresh mechanism instead of manual copy-paste. Consider using a secure session or database to store refresh tokens instead of `.env.local`.

**Hardcoded Production Redirect URI:**
- Issue: `app/api/spotify/callback/route.ts` line 26 hardcodes `http://localhost:3000` redirect URI. Production deployment will immediately fail OAuth flow.
- Files: `app/api/spotify/callback/route.ts`
- Impact: Spotify authentication completely broken in production without code change.
- Fix approach: Detect environment from `process.env.NODE_ENV` or `process.env.VERCEL_URL` and construct the correct redirect URI dynamically.

**Temporary Routes Not Removed:**
- Issue: `app/api/spotify/auth/route.ts` and `app/api/spotify/callback/route.ts` are marked as "TEMPORARY — delete after obtaining refresh token" but are still in the codebase.
- Files: `app/api/spotify/auth/route.ts` (line 1), `app/api/spotify/callback/route.ts` (line 1)
- Impact: These routes expose the OAuth token exchange in a GET endpoint, storing plaintext JSON responses. Insecure for production.
- Fix approach: Remove these endpoints after implementing a proper secure token storage system. Replace with a proper OAuth library or framework integration.

**Error Handling in Spotify Token Fetch:**
- Issue: `app/api/spotify/playback-token/route.ts` silently returns `{ token: null }` on any error without logging. Makes debugging impossible in production.
- Files: `app/api/spotify/playback-token/route.ts` (line 48-49)
- Impact: When Spotify API calls fail, users get no feedback. Frontend silently fails to initialize the player.
- Fix approach: Add structured error logging (e.g., Sentry, server-side logging). Return more informative error responses that distinguish between configuration errors and transient failures.

**Untyped Implicit `any` in Weather API Response:**
- Issue: `components/canvas/weather/useWeather.ts` line 64 destructures the JSON response without validation: `const { temperature_2m, weather_code, is_day } = json.current as {...}`. If the API changes or returns unexpected structure, this silently fails with `undefined` values.
- Files: `components/canvas/weather/useWeather.ts` (lines 64-68)
- Impact: Weather display can show incorrect/default values if API response structure changes or is malformed.
- Fix approach: Add runtime validation (e.g., `zod`, `yup`) to ensure API response matches expected schema before destructuring.

**Silent Failures with Broad Catch-All:**
- Issue: Multiple async operations use broad `.catch(() => {...})` without distinguishing error types:
  - `useWeather.ts` line 83: weather fetch silently fails to time-based default
  - `useSpotify.ts` line 241: `playerRef.current?.resume().catch(() => {})`
  - `useSpotify.ts` line 245: `playerRef.current?.pause().catch(() => {})`
- Files: `components/canvas/weather/useWeather.ts`, `components/canvas/spotify/useSpotify.ts`
- Impact: User gets no feedback when operations fail. Debugging is nearly impossible in production.
- Fix approach: At minimum, log errors to console in development. Ideally, use error boundary or user-facing notifications for critical failures.

## Known Bugs

**WarpParticles Memory Leak Potential:**
- Symptoms: Long gaming sessions may accumulate particle objects in `particlesRef` without cleanup between warp sequences.
- Files: `components/canvas/WarpParticles.tsx` (lines 74-77)
- Trigger: Multiple rapid warp/unwarp cycles without full component unmount
- Workaround: Manually reload the page to clear particle state

**React Hook Exhaustive-Deps Disabled:**
- Symptoms: Linter warning disabled in GameCanvas game loop, masking potential state closure bugs.
- Files: `components/canvas/GameCanvas.tsx` (line 247)
- Trigger: Game loop relies on stale closure over `character` state
- Workaround: None — potential for subtle state synchronization bugs

**Blinking Timer Logic Non-Deterministic:**
- Symptoms: Character blinking uses `Math.random()` thresholds, making blink timing non-reproducible and potentially inconsistent across rapid state changes.
- Files: `lib/game-engine.ts` (lines 228-234)
- Trigger: Blinking occurs after 180–300 frames unpredictably
- Workaround: None — visual only, not a functional bug

## Security Considerations

**Spotify Refresh Token in Environment File:**
- Risk: `.env.local` containing `SPOTIFY_REFRESH_TOKEN` is gitignored but if accidentally committed, exposes ability to refresh tokens indefinitely.
- Files: Configured in `.env.local` (not in repo)
- Current mitigation: `.env.local` is in `.gitignore`
- Recommendations:
  - Use environment secrets management (Vercel's secret manager, CI/CD vault)
  - Implement token rotation/expiration policies
  - Never commit refresh tokens to version control even by accident

**Inline Credentials in Auth Routes:**
- Risk: `app/api/spotify/auth/route.ts` and `app/api/spotify/callback/route.ts` explicitly handle and return tokens as plaintext JSON in HTTP responses.
- Files: `app/api/spotify/callback/route.ts` (lines 43-49)
- Current mitigation: None — routes are unprotected and token is logged in plain text
- Recommendations:
  - Remove these debug endpoints before production
  - Store tokens in secure, httpOnly cookies instead of localStorage or plain responses
  - Implement PKCE flow for additional OAuth security

**Missing CSRF Protection on Spotify Routes:**
- Risk: `/api/spotify/auth` and `/api/spotify/callback` don't validate request origin or include CSRF tokens.
- Files: `app/api/spotify/auth/route.ts`, `app/api/spotify/callback/route.ts`
- Current mitigation: None
- Recommendations: Add state parameter validation to OAuth flow; use PKCE if not already present

**No Rate Limiting on Token Endpoint:**
- Risk: `app/api/spotify/playback-token/route.ts` can be called infinitely by frontend, causing excessive Spotify API calls.
- Files: `app/api/spotify/playback-token/route.ts`
- Current mitigation: None
- Recommendations: Implement rate limiting (e.g., per-IP, per-session) to prevent abuse

## Performance Bottlenecks

**WeatherCanvas Rendering Every Frame:**
- Problem: `components/canvas/weather/WeatherCanvas.tsx` (501 lines) renders animated weather effects continuously regardless of visibility or user interaction.
- Files: `components/canvas/weather/WeatherCanvas.tsx`
- Cause: Uses HTML5 Canvas with `requestAnimationFrame` loop, no pause mechanism
- Improvement path: Pause canvas animation when infoPanelOpen/section is active, or when weather data hasn't changed for 30s+

**WarpParticles Re-initializes on Every Active Toggle:**
- Problem: Particle array is recreated entirely each time active prop changes, destroying and rebuilding ~350+ particle objects.
- Files: `components/canvas/WarpParticles.tsx` (lines 79-130, called in useEffect)
- Cause: `initParticles` callback not memoized, dependency array includes `active`
- Improvement path: Memoize `initParticles` with useCallback, only reinitialize if character position changes significantly

**GameCanvas Game Loop Doesn't Pause:**
- Problem: `requestAnimationFrame` loop in `components/canvas/GameCanvas.tsx` runs every 16ms continuously, even when sections are open or game is not interactive.
- Files: `components/canvas/GameCanvas.tsx` (lines 108–246)
- Cause: No conditional stop/pause mechanism; loop always runs
- Improvement path: Cancel `animationFrame` when `activeSection` is not null; resume on close

**Chromatic Aberration Rendering Triple-Pass:**
- Problem: During warp (shivering/warping_in), `PixelCharacter.tsx` renders 3 separate canvas passes (R, G, B channels) instead of a single composited pass.
- Files: `components/canvas/PixelCharacter.tsx` (lines 179–216)
- Cause: Intentional for visual effect, but renders 3x pixels during warp state
- Improvement path: Cache the composited result during sustained warp; only re-render on state change

**SessionStorage Synchronous JSON Parse Without Validation:**
- Problem: `useWeather.ts` line 49 parses cache synchronously without validation; if cache is large or corrupted, blocks render.
- Files: `components/canvas/weather/useWeather.ts` (lines 46–54)
- Cause: No size limit on cache entries; malformed cache locks up parsing
- Improvement path: Add try-catch, validate cache entry size, use LRU eviction for old entries

## Fragile Areas

**GameCanvas Headbutt State Machine:**
- Files: `components/canvas/GameCanvas.tsx` (lines 43–327), `lib/game-engine.ts` (lines 88–186)
- Why fragile: Complex multi-stage state machine (sprint → jump → impact → falling) with 80ms, 100ms, 180ms timeout chains. Tight coupling between UI state refs and game engine state.
- Safe modification: Add comprehensive unit tests for each state transition; use state machine library (e.g., `xstate`) to formalize transitions; document timing assumptions
- Test coverage: Headbutt sequence has no explicit tests; timing-dependent code relies on manual QA

**Warp Particle Integration/Shedding Logic:**
- Files: `components/canvas/WarpParticles.tsx` (entire component), `components/canvas/GameCanvas.tsx` (lines 337–351)
- Why fragile: Particle lifecycle tightly coupled to external callbacks. Order of operations critical: `onAllConsumed` → `onShedUpdate` → state transitions must be precise or particles hang or character gets stuck.
- Safe modification: Add detailed comments explaining particle state transitions; add defensive checks for null/undefined refs; add timeout safety nets
- Test coverage: No tests; visual-only verification

**Weather to Dark Mode Transition:**
- Files: `components/canvas/weather/WeatherCanvas.tsx`, `components/providers/theme-provider.tsx`, `components/canvas/GameCanvas.tsx` (line 399)
- Why fragile: Dark mode toggle affects both background and canvas rendering; weather background color scheme must stay readable across both modes. Changes to either require coordinating color changes in 3+ files.
- Safe modification: Extract color schemes into a single theme config; add contrast validation tests
- Test coverage: No tests for theme-weather interaction

**Portal Clickable Area & Z-Index Layering:**
- Files: `components/canvas/GameCanvas.tsx` (lines 433–444), `components/elements/project-cluster.tsx`
- Why fragile: Multiple overlapping clickable elements (portal, project icons, work cluster) with z-index manually managed. Hard to understand layering intent from code alone.
- Safe modification: Document z-index strategy in a single reference (e.g., constants); use z-index utility system; add visual debug mode to show hit zones
- Test coverage: No interaction tests; relies on manual click testing

## Scaling Limits

**Canvas Size Hard-Limited by Figma Prototype:**
- Current capacity: Designed for 1440×1024 Figma canvas, scaled to viewport
- Limit: Responsive scaling assumes 16:9 or similar; ultra-wide (32:9) or portrait (mobile) breaks layout
- Scaling path: Implement proper responsive breakpoints; redesign element positions for mobile; consider separate mobile layout or disable canvas on small screens

**Particle Count Not Capped:**
- Current capacity: ~350 particles (IDLE_FRAME pixels × 2 for normal + warp states)
- Limit: If character sprite grows larger or animation complexity increases, could hit 60fps ceiling on lower-end devices
- Scaling path: Implement particle LOD (level-of-detail); reduce particle count on low-end devices (via `navigator.hardwareConcurrency`); add frame-rate monitoring

**Single Weather API Endpoint:**
- Current capacity: 30-minute session cache + 1 fetch per unique user per session
- Limit: No pagination or batching; if expanded to multiple cities, would require client-side logic
- Scaling path: Move weather endpoint to server-side cached proxy to batch requests; add support for historical data or multiple locations

## Dependencies at Risk

**Spotify Web Playback SDK (External CDN):**
- Risk: `components/canvas/spotify/useSpotify.ts` (line 225) fetches SDK from `https://sdk.scdn.co/spotify-player.js` at runtime. Spotify could deprecate, rate-limit, or change API.
- Impact: Turntable feature fails silently if SDK unavailable or API changes
- Migration plan: Self-host SDK if possible; implement fallback (e.g., show static turntable if SDK unavailable); watch Spotify developer announcements for deprecations

**React95 Library:**
- Risk: `react95@4.0.0` is a retro UI component library. If unmaintained, could accumulate bugs or become incompatible with React 19 updates.
- Impact: Windows 95 styled components (used in `RetroWindow`) may break in future React versions
- Migration plan: Monitor react95 GitHub for activity; be prepared to fork or migrate to custom styled-components if abandoned

**Framer Motion Warp/Animation Logic:**
- Risk: Heavy use of Framer Motion for particle animations and transitions. Major version upgrades could break animation syntax or performance.
- Impact: Warp sequences and particle effects may become janky or non-functional
- Migration plan: Keep Framer Motion locked to tested version; review changelog before major upgrades; test all warp sequences after dependency updates

## Missing Critical Features

**No Mobile Support:**
- Problem: Game canvas is desktop-first; cursor following and jump interactions don't translate to touch. Site is completely unusable on mobile.
- Blocks: Mobile users cannot access portfolio at all
- Suggested approach: Add touch-to-walk, tap-to-jump controls; implement separate mobile layout or detect and show "desktop-only" message

**No Error Boundaries:**
- Problem: If any component throws (e.g., Spotify SDK load fails, weather API timeout), entire canvas crashes without graceful fallback.
- Blocks: One bad external API call or SDK load breaks the entire portfolio
- Suggested approach: Wrap sections in React error boundary; implement graceful degradation (e.g., show static version if warp fails)

**No Build-Time Typecheck in CI/CD:**
- Problem: `npx tsc --noEmit` is available locally but not run in CI. TypeScript errors could ship to production.
- Blocks: Cannot guarantee type safety in deployed code
- Suggested approach: Add tsc check to CI pipeline before deployment

**No Automated Tests:**
- Problem: Zero unit/integration/E2E tests. All verification is manual.
- Blocks: Refactoring game logic is terrifying; Spotify auth changes untested; particle system changes could break silently
- Suggested approach: Add Jest for game-engine logic tests; add Cypress/Playwright for interaction tests (portal click, headbutt sequence); add visual regression tests for canvas

**No Analytics or Error Tracking:**
- Problem: Cannot track which sections users interact with, which features fail, or if Spotify auth fails for users.
- Blocks: Cannot prioritize improvements; production errors are invisible
- Suggested approach: Add Sentry or similar for error tracking; add simple event tracking for section opens/closes

## Test Coverage Gaps

**Game Engine Logic Not Tested:**
- What's not tested: `lib/game-engine.ts` (270 lines) — all character movement, jump physics, warp state transitions, headbutt calculations
- Files: `lib/game-engine.ts`
- Risk: Jump physics could be broken, warp state could be stuck, collision detection could be wrong — all undetectable until manual testing
- Priority: **High** — core game logic; bugs here affect entire experience

**Weather Integration Not Tested:**
- What's not tested: Weather API integration, caching logic, time-based fallback, dark-mode color mapping
- Files: `components/canvas/weather/useWeather.ts`, `components/canvas/weather/WeatherCanvas.tsx`
- Risk: Weather background could fail silently, cache could corrupt, dark mode could render unreadable
- Priority: **Medium** — feature only; doesn't block core experience

**Spotify Auth Flow Not Tested:**
- What's not tested: Token refresh, player initialization, state synchronization, error recovery
- Files: `components/canvas/spotify/useSpotify.ts`, `app/api/spotify/playback-token/route.ts`
- Risk: Turntable could fail silently; token could expire without refresh; player state could desync
- Priority: **High** — production will immediately fail without proper auth

**Particle System Not Tested:**
- What's not tested: Particle initialization, shedding order, integration path, callback sequencing
- Files: `components/canvas/WarpParticles.tsx`
- Risk: Warp sequences could hang, particles could leak memory, character could get stuck mid-warp
- Priority: **Medium** — visual feature; doesn't block core experience but poor UX if broken

**Headbutt Sequence Not Tested:**
- What's not tested: State machine transitions (sprint → jump → impact → falling), timing, collision detection, window opening
- Files: `components/canvas/GameCanvas.tsx`, `lib/game-engine.ts`
- Risk: Headbutt could get stuck mid-sequence, project window could open at wrong time, character could become uncontrollable
- Priority: **High** — primary interaction mechanic; if broken, core feature is unusable

---

*Concerns audit: 2026-03-16*
