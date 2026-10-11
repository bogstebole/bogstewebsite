// Each layer fades in over its own band and then stays on to the bottom edge,
// so the blurs stack: nothing at the top, the sum of all of them at the bottom.
const BLUR_STEPS = [1, 2, 4, 8];

/** A backdrop blur that builds from clear at the top of its parent to full strength at the bottom. */
export function ProgressiveBlur() {
  const band = 100 / BLUR_STEPS.length;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {BLUR_STEPS.map((blur, i) => {
        const mask = `linear-gradient(to bottom, transparent ${i * band}%, black ${(i + 1) * band}%)`;
        return (
          <div
            key={blur}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
