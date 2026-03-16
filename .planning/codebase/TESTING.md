# Testing

## Status

**No test framework configured.** No `jest.config`, `vitest.config`, or test files exist in the codebase as of initial mapping.

## What's Testable

Despite no tests, the codebase is structured with testability in mind:

### Pure Functions in `lib/`

- `lib/game-engine.ts` — `updateCharacter()`, `checkInteractionZone()`, `jump()` are pure functions with no side effects, ideal for unit tests
- `lib/utils.ts` — helper utilities
- `lib/constants.ts` — static data

### Hooks

- `components/canvas/spotify/useSpotify` — Spotify API integration hook
- `useSpotifyRecent` — recent tracks hook
- `useSyncExternalStore` — clock synchronization

These hooks have side effects (API calls) and would require mocking for unit tests.

### Components

- Game canvas components are tightly coupled to browser APIs (`requestAnimationFrame`, canvas)
- Would require jsdom or Playwright for meaningful testing

## Recommended Setup (Not Yet Implemented)

```
Framework: Vitest (compatible with Next.js, fast, ESM-native)
E2E: Playwright (for canvas interactions)
```

## Coverage Gaps

- No test files exist
- No CI test step configured
- No mocking patterns established
- Canvas/game loop logic untested

## Notes

- TypeScript strict mode provides compile-time type safety as a partial substitute
- All props are explicitly typed — runtime type errors unlikely at component boundaries
