# Code Conventions

## File Naming

- **Components**: PascalCase — `GameCanvas.tsx`, `PixelCharacter.tsx`
- **Utilities / lib**: kebab-case — `game-engine.ts`, `fonts.ts`
- **One component per file** — enforced throughout codebase

## Naming Patterns

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `LiveClock`, `InfoPanel` |
| Functions | camelCase | `updateCharacter`, `checkInteractionZone` |
| Factory fns | `create*` prefix | `createSomething()` |
| Hooks | `use*` prefix | `useSpotify`, `useSyncExternalStore` |
| Constants | UPPER_SNAKE_CASE | `CHARACTER`, `FIGMA_W`, `PALETTE` |
| Types/Interfaces | PascalCase | `CharacterState`, `WeatherData` |
| Prop interfaces | `Props` suffix | `LiveClockProps`, `InfoPanelProps` |

## TypeScript

- **Strict mode enabled** — `tsconfig.json` strict: true
- **ES2017 target**
- **No `any` types** — enforced by ESLint + project CLAUDE.md
- All component props typed with explicit interfaces

## Import Order

```ts
// 1. React
import { useState, useEffect } from 'react'
// 2. Next.js
import Image from 'next/image'
// 3. Third-party packages
import { motion } from 'framer-motion'
// 4. Internal lib (@/)
import { updateCharacter } from '@/lib/game-engine'
// 5. Internal components (@/)
import { GroundLine } from '@/components/canvas/GroundLine'
// 6. CSS modules / styles
import styles from './Component.module.css'
```

## React Patterns

- **Functional components only** — no class components
- **`"use client"` directive** on all interactive/stateful components
- **Server-default** for layout and static components
- Hooks for all side effects and state

## Comments

- JSDoc for exported functions
- `// ──` section header separators for visual clarity within long files
- Minimal inline comments — code should be self-documenting

## ESLint

- ESLint v9 flat config (`eslint.config.mjs`)
- Extends Next.js defaults
- No Prettier configured — formatting not enforced by tooling

## Error Handling

- `try/catch` blocks with fallback `null` values
- Errors captured in component state where relevant
- No global error boundary pattern observed yet
