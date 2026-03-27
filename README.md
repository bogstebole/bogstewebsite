# useRippleWave

A React hook that attaches a physical ripple wave interaction to any element.
Click anywhere on the element — a shockwave expands from the click point and
physically displaces all text characters and images inside it.

---

## Install

Copy `useRippleWave.js` into your project (e.g. `src/hooks/useRippleWave.js`).
No dependencies beyond React.

---

## Usage

```jsx
import { useRippleWave } from './hooks/useRippleWave'

function MyCard() {
  const ref = useRippleWave()

  return (
    <div ref={ref}>
      <img src="/photo.jpg" />
      <h2>Title goes here</h2>
      <p>Subtitle or any other content.</p>
    </div>
  )
}
```

That's it. Click the element.

---

## Options

```jsx
const ref = useRippleWave({
  speed:         320,   // px/sec  — how fast the ring expands
  ringWidth:     60,    // px      — thickness of the pressure zone
  duration:      1000,  // ms      — how long each wave lives
  textStrength:  44,    // px      — max character displacement
  imageStrength: 22,    // px      — max image pixel warp
  maxWaves:      4,     // n       — max concurrent waves
})
```

### Preset feels

| Feel    | speed | ringWidth | duration | textStrength | imageStrength |
|---------|-------|-----------|----------|--------------|---------------|
| Default | 320   | 60        | 1000     | 44           | 22            |
| Sharp   | 540   | 26        | 580      | 88           | 12            |
| Slow    | 130   | 110       | 2000     | 55           | 38            |
| Gentle  | 250   | 85        | 1300     | 20           | 8             |

---

## How it works

- **Text** — on mount, all text nodes inside the element are split into
  per-character `<span>` elements. Each frame, the wave equation computes
  an `(x, y)` offset for every character and applies it via
  `transform: translate()`. Characters snap back as the wave passes.

- **Images** — each `<img>` gets a canvas overlay. Each frame, pixels are
  resampled from displaced coordinates — the image physically warps as the
  ring passes through it.

- **Wave math** — the shockwave is a radial ring that expands at `speed`
  px/sec. At any point in time, only characters/pixels within `ringWidth`
  of the current ring radius are displaced. The displacement follows a
  smooth falloff from the ring center and decays with `age` as the wave dies.

- **Cleanup** — on unmount, all split spans are restored to original text
  nodes, canvas overlays are removed, and event listeners are detached.

---

## Notes

- Works on any element — cards, buttons, nav items, hero sections, anything.
- Multiple waves stack correctly (up to `maxWaves`).
- Positions are re-measured on every click, so it handles dynamic content
  and layout shifts without needing to re-mount.
- Image displacement is pixel-level and runs on the CPU — use `imageStrength: 0`
  to disable it on performance-sensitive contexts.
