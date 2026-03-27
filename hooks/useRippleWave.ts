"use client";

import { useEffect, useRef } from "react";

export interface RippleWaveOptions {
  /** px/sec — how fast the ring expands (default: 320) */
  speed?: number;
  /** px — thickness of the pressure zone (default: 60) */
  ringWidth?: number;
  /** ms — how long each wave lives (default: 1000) */
  duration?: number;
  /** px — max character displacement (default: 44) */
  textStrength?: number;
  /** px — max image pixel warp; set 0 to disable (default: 22) */
  imageStrength?: number;
  /** max concurrent waves (default: 4) */
  maxWaves?: number;
}

const DEFAULTS: Required<RippleWaveOptions> = {
  speed: 320,
  ringWidth: 60,
  duration: 1000,
  textStrength: 44,
  imageStrength: 22,
  maxWaves: 4,
};

interface SpanEntry {
  el: HTMLElement;
  cx: number;
  cy: number;
}

interface ImageEntry {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  base: ImageData;
  w: number;
  h: number;
}

interface Wave {
  x: number;
  y: number;
  t: number;
}

/**
 * useRippleWave(options?)
 *
 * Attach a physical ripple wave to any element.
 * Fires on pointerdown. Displaces all text characters and images inside.
 *
 * @example
 * const ref = useRippleWave({ textStrength: 60 })
 * <div ref={ref}>Any content</div>
 */
export function useRippleWave(options: RippleWaveOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const P: Required<RippleWaveOptions> = { ...DEFAULTS, ...options };

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // ── internal state ─────────────────────────────────────────────────
    const state = {
      spans: [] as SpanEntry[],
      images: [] as ImageEntry[],
      waves: [] as Wave[],
      raf: 0,
      alive: true,
    };

    // ── STEP 1: split all text nodes into per-character spans ──────────

    function splitText() {
      const walker = document.createTreeWalker(container!, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(p.tagName))
            return NodeFilter.FILTER_REJECT;
          if ((p as HTMLElement).dataset.rw) return NodeFilter.FILTER_REJECT; // already split
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodes: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) nodes.push(n as Text);

      nodes.forEach((textNode) => {
        const frag = document.createDocumentFragment();
        for (const ch of textNode.textContent ?? "") {
          const s = document.createElement("span");
          s.dataset.rw = "1";
          s.style.cssText = "display:inline-block;will-change:transform;white-space:pre";
          s.textContent = ch;
          frag.appendChild(s);
        }
        textNode.parentNode?.replaceChild(frag, textNode);
      });
    }

    // ── STEP 2: measure span positions (relative to container) ─────────

    function measureSpans() {
      const cr = container!.getBoundingClientRect();
      state.spans = [];
      container!.querySelectorAll<HTMLElement>("[data-rw]").forEach((el) => {
        const r = el.getBoundingClientRect();
        state.spans.push({
          el,
          cx: r.left - cr.left + r.width / 2,
          cy: r.top - cr.top + r.height / 2,
        });
      });
    }

    // ── STEP 3: wrap images in canvas overlay for pixel displacement ───

    function setupImages() {
      container!.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        if (img.dataset.rwImg) return;
        img.dataset.rwImg = "1";

        const w = img.offsetWidth;
        const h = img.offsetHeight;
        if (!w || !h) return;

        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
          position:relative;
          display:inline-block;
          width:${w}px;
          height:${h}px;
          overflow:hidden;
        `;
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.style.cssText = `
          position:absolute;
          top:0;left:0;
          width:${w}px;height:${h}px;
          pointer-events:none;
        `;
        wrapper.appendChild(canvas);

        const ctx = canvas.getContext("2d")!;

        const off = document.createElement("canvas");
        off.width = w;
        off.height = h;
        const octx = off.getContext("2d")!;

        const doCapture = () => {
          octx.drawImage(img, 0, 0, w, h);
          const base = octx.getImageData(0, 0, w, h);
          state.images.push({ canvas, ctx, base, w, h });
        };

        if (img.complete) doCapture();
        else img.addEventListener("load", doCapture, { once: true });
      });
    }

    // ── STEP 4: wave math ──────────────────────────────────────────────

    function waveOffset(
      cx: number,
      cy: number,
      wx: number,
      wy: number,
      elapsed: number
    ): [number, number] {
      const front = (elapsed / 1000) * P.speed;
      const age = 1 - elapsed / P.duration;
      const dx = cx - wx;
      const dy = cy - wy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const u = Math.abs(dist - front);
      if (u >= P.ringWidth) return [0, 0];
      const s = (1 - u / P.ringWidth) * age;
      const il = 1 / (dist || 0.0001);
      return [dx * il * s, dy * il * s];
    }

    // ── STEP 5: per-frame image displacement (pixel sampling) ──────────

    function displaceImages(now: number) {
      for (const img of state.images) {
        const { ctx, base, w, h } = img;
        const src = base.data;
        const out = ctx.createImageData(w, h);
        const dst = out.data;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            let ox = 0,
              oy = 0;
            for (const wave of state.waves) {
              const [dx, dy] = waveOffset(x, y, wave.x, wave.y, now - wave.t);
              ox += dx * P.imageStrength;
              oy += dy * P.imageStrength;
            }
            const sx = Math.min(w - 1, Math.max(0, Math.round(x - ox)));
            const sy = Math.min(h - 1, Math.max(0, Math.round(y - oy)));
            const si = (sy * w + sx) * 4;
            const di = (y * w + x) * 4;
            dst[di] = src[si];
            dst[di + 1] = src[si + 1];
            dst[di + 2] = src[si + 2];
            dst[di + 3] = src[si + 3];
          }
        }
        ctx.putImageData(out, 0, 0);
      }
    }

    function clearImages() {
      for (const img of state.images) {
        img.ctx.clearRect(0, 0, img.w, img.h);
      }
    }

    // ── STEP 6: animation loop ─────────────────────────────────────────

    function frame() {
      if (!state.alive) return;
      const now = performance.now();

      state.waves = state.waves.filter((w) => now - w.t < P.duration);

      for (const sp of state.spans) {
        let ox = 0,
          oy = 0;
        for (const wave of state.waves) {
          const [dx, dy] = waveOffset(sp.cx, sp.cy, wave.x, wave.y, now - wave.t);
          ox += dx * P.textStrength;
          oy += dy * P.textStrength;
        }
        sp.el.style.transform =
          ox || oy ? `translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px)` : "";
      }

      if (state.waves.length > 0) displaceImages(now);
      else clearImages();

      state.raf = requestAnimationFrame(frame);
    }

    // ── STEP 7: click handler ──────────────────────────────────────────

    function onClick(e: PointerEvent) {
      measureSpans();

      const cr = container!.getBoundingClientRect();
      const x = e.clientX - cr.left;
      const y = e.clientY - cr.top;

      if (state.waves.length >= P.maxWaves) state.waves.shift();
      state.waves.push({ x, y, t: performance.now() });
    }

    // ── INIT ───────────────────────────────────────────────────────────

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        splitText();
        setupImages();
        measureSpans();
        frame();
      })
    );

    container.addEventListener("pointerdown", onClick);

    // ── CLEANUP ────────────────────────────────────────────────────────

    return () => {
      state.alive = false;
      cancelAnimationFrame(state.raf);
      container.removeEventListener("pointerdown", onClick);

      container.querySelectorAll<HTMLElement>("[data-rw]").forEach((span) => {
        const parent = span.parentNode;
        if (!parent) return;
        parent.replaceChild(document.createTextNode(span.textContent ?? ""), span);
        (parent as Element).normalize?.();
      });

      state.images.forEach(({ canvas }) => {
        const wrapper = canvas.parentNode as HTMLElement | null;
        if (!wrapper) return;
        const img = wrapper.querySelector("img");
        if (img) {
          delete img.dataset.rwImg;
          wrapper.parentNode?.insertBefore(img, wrapper);
        }
        wrapper.remove();
        canvas.remove();
      });
    };
  }, []); // runs once on mount

  return ref;
}
