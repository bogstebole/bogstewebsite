"use client";

import { useRef, useEffect } from "react";

const WIDTH = 35;
const HEIGHT = 62;

function quantize(val: number, steps = 10): number {
  return Math.round(Math.min(255, Math.max(0, val)) / (255 / steps)) * (255 / steps);
}

function hash(x: number, y: number, seed: number): number {
  const h = Math.sin(x * 127.1 + y * 311.7 + seed * 43758.5453) * 43758.5453;
  return h - Math.floor(h);
}

interface PixelPortalProps {
  scale?: number;
}

export function PixelPortal({ scale = 6 }: PixelPortalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    function draw(timestamp: number) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const time = timestamp / 1000;
      const w = WIDTH * scale;
      const h = HEIGHT * scale;

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);

      const cx = WIDTH  * 0.50;
      const cy = HEIGHT * 0.50;
      const portalRx = WIDTH  * 0.40;
      const portalRy = HEIGHT * 0.42;

      for (let py = 0; py < HEIGHT; py++) {
        for (let px = 0; px < WIDTH; px++) {
          const dx = px - cx;
          const dy = py - cy;
          // Elliptical distance — normalise X and Y against separate radii
          const normR = Math.sqrt((dx / portalRx) ** 2 + (dy / portalRy) ** 2);
          // Angle in ellipse-space so spiral arms stay uniform on the ellipse
          const angle = Math.atan2(dy / portalRy, dx / portalRx);

          let r = 0, g = 0, b = 0, a = 0;
          let shouldDraw = false;

          if (normR < 1.3) {
            const tightness = 2.0;
            const numArms = 4;
            const logR = Math.log(Math.max(normR, 0.04));
            const spiralPhase = angle - tightness * logR + time * 0.6;
            const armCos = Math.cos(numArms * spiralPhase);
            const armVal = Math.pow((armCos + 1) / 2, 1.2);
            const detail = (Math.cos(numArms * 2 * spiralPhase + 2.0) + 1) / 2;
            const striation = (Math.sin(numArms * 3 * spiralPhase - time * 0.3) + 1) / 2;

            if (normR < 0.08) {
              r = 8; g = 2; b = 20; a = 1;
              shouldDraw = true;
            } else if (normR < 0.18) {
              const fade = (normR - 0.08) / 0.1;
              const av = armVal * fade;
              r = 10 + av * 30;
              g = 4 + av * 15;
              b = 25 + av * 50;
              a = 1;
              shouldDraw = true;
            } else if (normR < 1.05) {
              const depthFactor = Math.pow(normR, 0.5);
              const totalBright = armVal * 0.55 + detail * 0.25 + striation * 0.2;
              r = 15 + depthFactor * 20;
              g = 10 + depthFactor * 25;
              b = 40 + depthFactor * 45;
              r += totalBright * (80 + depthFactor * 100);
              g += totalBright * (55 + depthFactor * 95);
              b += totalBright * (100 + depthFactor * 80);

              if (totalBright > 0.65) {
                const highlight = (totalBright - 0.65) / 0.35;
                const h2 = Math.pow(highlight, 1.5);
                r += h2 * 80;
                g += h2 * 130;
                b += h2 * 100;
              }
              if (armVal > 0.8 && striation > 0.6) {
                const streak = ((armVal - 0.8) / 0.2) * ((striation - 0.6) / 0.4);
                r += streak * 50;
                g += streak * 70;
                b += streak * 60;
              }
              a = 1;
              shouldDraw = true;
            }

            if (normR > 0.75 && normR < 1.25) {
              const ringDist = Math.abs(normR - 0.95) / 0.14;
              if (ringDist < 1) {
                const ringBright = Math.pow(1 - ringDist, 2.5);
                const ringMod = 0.6 + 0.25 * Math.sin(angle * 3 + time * 0.5) + 0.15 * Math.cos(angle * 5 - time * 0.8);
                const glow = ringBright * ringMod;
                r = Math.min(255, r + glow * 200);
                g = Math.min(255, g + glow * 255);
                b = Math.min(255, b + glow * 255);
                a = Math.max(a, Math.min(1, glow * 2));
                shouldDraw = true;
              }
            }

            if (normR > 1.0 && normR < 1.3) {
              const hazeFade = 1 - (normR - 1.0) / 0.3;
              const hazeVal = Math.pow(hazeFade, 3) * 0.3;
              const hazeMod = 0.5 + 0.5 * Math.sin(angle * 4 + time * 0.4);
              const hazeAlpha = hazeVal * hazeMod;
              r = Math.max(r, hazeAlpha * 80);
              g = Math.max(g, hazeAlpha * 160);
              b = Math.max(b, hazeAlpha * 180);
              if (hazeAlpha > 0.05) {
                a = Math.max(a, hazeAlpha * 2);
                shouldDraw = true;
              }
            }
          }

          if (normR > 0.8 && normR < 2.2) {
            const pHash = hash(px, py, 42);
            const pHash2 = hash(px, py, 137);
            const density = Math.pow(Math.max(0, 1 - (normR - 0.8) / 1.4), 2);
            const flicker = Math.sin(pHash * 100 + time * (2 + pHash2 * 3)) * 0.5 + 0.5;
            if (pHash < density * 0.12 && flicker > 0.4) {
              const pBright = flicker * (1 - (normR - 0.8) / 1.4);
              r = Math.min(255, Math.max(r, pBright * 40));
              g = Math.min(255, Math.max(g, pBright * 230));
              b = Math.min(255, Math.max(b, pBright * 240));
              a = Math.max(a, pBright);
              shouldDraw = true;
            }
          }

          if (shouldDraw && (r > 2 || g > 2 || b > 2)) {
            const finalA = Math.min(1, Math.max(0, a));
            ctx.fillStyle = `rgba(${quantize(r, 12)},${quantize(g, 12)},${quantize(b, 12)},${finalA.toFixed(2)})`;
            ctx.fillRect(px * scale, py * scale, scale, scale);
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [scale]);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH * scale}
      height={HEIGHT * scale}
      style={{
        imageRendering: "pixelated",
        width: WIDTH * scale,
        height: HEIGHT * scale,
      }}
    />
  );
}
