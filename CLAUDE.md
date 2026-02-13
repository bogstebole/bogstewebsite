# Boule's Portfolio

Next.js 16 (App Router) + Tailwind CSS + TypeScript personal portfolio site. This is not a conventional portfolio — it's an interactive experience that challenges design conformity.

## Golden Rule
Perform code changes ONLY for the requested tasks. Do not reorganize, rearrange, or "improve" anything that was not explicitly asked for. If a change is not directly required to fulfil the request, leave it alone.

## Vision

This website is a deliberate rejection of "one style" portfolio design. It mixes pixel art, high-end shaders, refined UI, retro game aesthetics, and everything in between — not to flex range, but to argue that rigid design standards produce sameness. The eclecticism IS the style. It should feel like the creator clearly knows the rules and is deliberately breaking them, while being genuinely fun to explore.

### Core Concept: The Game Canvas
The landing page is a fixed-viewport canvas (no scrolling). A pixelated character (Boule) walks left and right along a ground line, following the user's cursor — movement is linear only, like Mario. Scattered along this line are interactive elements that use platformer mechanics to reveal content:

- **Doors** — character walks to a door, user clicks, character enters → section opens (e.g., About Me opens the pixelated 2D timeline game)
- **Blocks** — character jumps and hits a block with their head → content pops out (e.g., personal project app icons appear in a grid)
- **Other objects** — each element has its own interaction pattern and visual style

Each interactive element on the canvas can have a completely different aesthetic — one might be pixel art, another might be a refined glassmorphic panel, another might use shaders. This intentional chaos is the point.

### Section Behavior
Sections are not rigid categories. Content blends and mixes on the canvas. When a section opens:
- Some content may take over full screen (beneficial for case studies and detailed work)
- Some content may appear right on the canvas (pop-ups, grids, overlays)
- Closing returns to the character on the canvas
- The approach varies per section — there is no single pattern

### Micro Interactions
Micro interactions are the star of this website. Every element should make people want to click it just to see what happens. Prioritize:
- Hover states that surprise and delight
- Click/tap feedback that feels satisfying
- Cursor-driven reactions on the canvas
- Physics-based responses where appropriate
- Sound design is worth considering (optional, with mute)
- State transitions that feel alive, not just functional

### Desktop First
This is a desktop-first experience due to the cursor-driven interaction model. Mobile adaptation will be addressed later — don't block desktop progress for mobile concerns.

## Commands
- `npm run dev` — dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — type check without build

## Architecture
```
app/
  layout.tsx            — root layout, fonts, metadata
  page.tsx              — the game canvas (landing page)
components/
  canvas/               — game canvas system
    GameCanvas.tsx       — main fixed-viewport canvas container
    PixelCharacter.tsx   — the walking pixel character (cursor-following, left/right only)
    GroundLine.tsx       — the platform/ground the character walks on
    InteractiveElement.tsx — base component for doors, blocks, objects
  elements/             — specific interactive elements on the canvas
    Door.tsx            — door interaction (enter → open section)
    Block.tsx           — jump-and-hit block (pop out content)
  sections/             — content that opens from canvas interactions
    AboutTimeline.tsx   — pixelated 2D game timeline (port from existing HTML)
    ProjectGrid.tsx     — project showcase
    CaseStudy.tsx       — full-screen case study view
    Contact.tsx         — contact section
  ui/                   — reusable primitives (no single style — each can be unique)
  three/                — Three.js/R3F components (globe, particles, 3D models)
  animations/           — Framer Motion wrappers and scroll-triggered animations
lib/
  game-engine.ts        — character movement logic, collision detection, interaction zones
  utils.ts              — helper functions
  constants.ts          — site metadata, project data, interaction zone positions
  fonts.ts              — font loading config
public/
  sprites/              — pixel character sprite sheets, animations
  models/               — GLB/GLTF 3D assets
  textures/             — earth textures, normal maps, etc.
  images/               — project screenshots, og images
  sounds/               — interaction sound effects (if used)
```

## The Pixel Character

The character is central to the experience. Specs:
- Pixel art style matching the "About Me" timeline character already built
- Walks left and right only along a fixed ground line
- Follows the cursor's X position (character walks toward where cursor is horizontally)
- Walking animation (leg bobbing) while moving, idle animation when stopped
- Can jump when interacting with blocks (triggered by click near a block element)
- Stays within canvas boundaries
- Should feel responsive and alive — not sluggish

## Design Philosophy

### No Single Style
There is no unified design system in the traditional sense. Instead:
- Each element can have its own aesthetic (pixel art, glassmorphism, brutalist, refined, retro, futuristic)
- Typography can vary per context — monospace for technical moments, display fonts for impact, pixel fonts for game elements
- Color is not restricted to a palette — it shifts with context
- The connecting thread is CRAFT — every element, regardless of style, should feel intentionally made and polished

### What Ties It Together
- The pixel character as consistent navigator
- The game canvas as a shared spatial context
- The quality of execution across all styles
- A sense of playfulness and discovery throughout
- The philosophy itself: rules learned, then deliberately broken

## Portfolio Projects (Content)
Interactive pieces to embed as live components where possible:

- **Timezone Globe** — Three.js globe with real-time day/night terminator, contact pins. Use React Three Fiber. Lazy load with `dynamic(() => import(...), { ssr: false })`
- **SVG Particle System** — particles float freely, reform into SVG shapes on hover. Canvas-based
- **Pixelated 2D Timeline** — already built as standalone HTML. Port to React component for the About Me section. Character enters a door → this opens
- **Weather Wear Concept** — 3D clothing model that changes based on weather
- **Useless Notes** — iOS app (App Store live). Show as case study
- **ScanSpend** — iOS expense tracker with QR receipt scanning for Serbian market. Case study
- **Agency work** — projects from Cinnamon and Tenscope

## Conventions
- TypeScript strict mode — no `any` types
- Functional components with hooks only
- File naming: kebab-case for files, PascalCase for components
- One component per file
- Framer Motion for UI animations, React Three Fiber for 3D, raw Canvas API for the game engine if needed
- Images via `next/image` with proper sizing and alt text
- Commit messages: conventional commits (feat:, fix:, chore:)

## Performance
- The game canvas should load fast — keep initial bundle light
- Three.js scenes lazy-load only when their section is opened
- Use `dynamic(() => import(...), { ssr: false })` for all Three.js and heavy canvas components
- Optimize 3D models with draco compression
- Sprite sheets for character animation (not individual frames)
- `requestAnimationFrame` for game loop — don't use setInterval

## Deployment
- Vercel (standard Next.js deployment)
- GitHub repo for version control — commit and push regularly
- Environment variables (API keys, secrets) go in `.env.local` — this file is gitignored and should never be pushed to GitHub
- Set production env vars in Vercel dashboard instead

## What NOT to Do
- Don't impose a single design system across all elements — the variety is intentional
- Don't make it scroll on the landing page — the canvas is fixed viewport
- Don't use template layouts or generic portfolio structures
- Don't install UI libraries (Material UI, Chakra, shadcn) — everything is custom
- Don't SSR Three.js or canvas components — always dynamically import
- Don't add a blog (not needed for v1)
- Don't prioritize mobile over desktop — this is desktop-first
- Don't make the character movement feel floaty or delayed — it should be snappy and responsive
- Don't forget: every interaction should spark curiosity. If an element doesn't make someone want to click it, it's not done yet
