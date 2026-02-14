"use client";

import { useRef, useEffect } from "react";
import { CHARACTER } from "@/lib/constants";
import type { CharacterState } from "@/lib/game-engine";

// 32x48 pixel character data from prototype
// Colors: 0=transparent, 1=cap dark, 2=cap main, 3=skin, 4=eye, 5=beard dark,
// 6=beard main, 7=shirt dark, 8=shirt main, 9=pants dark, A=pants main,
// B=shoe dark, C=shoe main, D=skin shadow, E=beard mid, F=cap highlight
export const PALETTE: Record<string, string> = {
  "0": "transparent",
  "1": "#1a1a2e",
  "2": "#2d3a6e",
  "3": "#e8b88a",
  "4": "#1a1a1a",
  "5": "#3d2b1f",
  "6": "#5c3d2e",
  "7": "#2a4a3a",
  "8": "#3d6b52",
  "9": "#1a1a2e",
  A: "#2a2a4e",
  B: "#1a1a1a",
  C: "#3a3a3a",
  D: "#c49a6c",
  E: "#4a3528",
  F: "#243555",
};

export const IDLE_FRAME = [
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000112222211000000000000",
  "00000000001222222222100000000000",
  "00000000012222222222210000000000",
  "00000000122222222222221000000000",
  "00000000122222222222221000000000",
  "00000001111111111111111111100000",
  "00000001111111111111111111100000",
  "00000000011133333333110000000000",
  "00000000001333333333100000000000",
  "00000000013333333333310000000000",
  "00000000013304333043310000000000",
  "00000000013333333333310000000000",
  "00000000001333333333100000000000",
  "00000000001335666533100000000000",
  "00000000000156666651000000000000",
  "00000000001566666665100000000000",
  "00000000015666666666510000000000",
  "0000000005666EEEE66665000000000",
  "000000000566EEEEEEE665000000000",
  "00000000566666666666650000000000",
  "00000000056666666666500000000000",
  "00000000005666666665000000000000",
  "00000000000788888870000000000000",
  "00000000007888888887000000000000",
  "00000000078888888888700000000000",
  "00000000788888888888870000000000",
  "00000007888888888888887000000000",
  "00000078887888888878887000000000",
  "00000078870788888707887000000000",
  "00000007700788888700770000000000",
  "00000000000788888700000000000000",
  "00000000000799999700000000000000",
  "0000000000099AAAA9900000000000",
  "000000000009AAAAAA900000000000",
  "00000000009AAAAAAAA90000000000",
  "00000000009AAAAAAAA90000000000",
  "0000000000AAAAAAAAAA0000000000",
  "0000000000AA99AA99AA0000000000",
  "0000000000990000009900000000000",
  "0000000000990000009900000000000",
  "000000000099000000990000000000",
  "00000000009B000000B90000000000",
  "0000000000BBB0000BBB0000000000",
  "0000000000CCC0000CCC0000000000",
];

const PX = CHARACTER.PIXEL_SIZE;
const COLS = CHARACTER.SPRITE_COLS;
const ROWS = CHARACTER.SPRITE_ROWS;
const CANVAS_W = COLS * PX;
const CANVAS_H = ROWS * PX;

/** Displayed size — 72px height, maintain 2:3 aspect ratio */
export const DISPLAY_H = 72;
export const DISPLAY_W = 48;

/** Parse hex color to [r, g, b] tuple */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

interface PixelCharacterProps {
  state: CharacterState;
  groundY: number;
  /** Set of "row,col" keys for pixels that have been shed to the particle system */
  shedSet?: Set<string>;
  /** Forward lean angle in degrees during sprint (0–15) */
  leanAngle?: number;
}

export function PixelCharacter({ state, groundY, shedSet, leanAngle }: PixelCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Don't draw anything if fully warped
    if (state.warpState === "warped") return;

    const breathY = Math.sin(state.breathTimer * 0.03) * 1.5;
    const isShivering = state.warpState === "shivering" || state.warpState === "warping_in";

    // Chromatic aberration: compute per-channel offsets
    // Ramp intensity from 0 → max over SHIVER_DURATION
    // If warping_in, lock at max intensity (1.0)
    const shiverT = state.warpState === "shivering"
      ? Math.min(1, state.warpTimer / CHARACTER.SHIVER_DURATION)
      : isShivering ? 1.0 : 0;

    // Ease-in-quad for more explosive final distortion
    const shiverIntensity = shiverT * shiverT;
    const maxOff = CHARACTER.SHIVER_MAX_OFFSET * shiverIntensity;

    // Smooth pseudo-random drift per channel (seeded by warpTimer)
    const t = state.warpTimer * 0.7;
    const channelOffsets = isShivering
      ? [
        { dx: Math.sin(t * 1.3 + 0.0) * maxOff, dy: Math.cos(t * 1.7 + 2.0) * maxOff },  // R
        { dx: Math.sin(t * 1.1 + 4.0) * maxOff, dy: Math.cos(t * 0.9 + 1.0) * maxOff },  // G
        { dx: Math.sin(t * 1.5 + 2.5) * maxOff, dy: Math.cos(t * 1.3 + 5.0) * maxOff },  // B
      ]
      : null;

    // Build pixel data for the frame
    const pixels: { px: number; py: number; color: string }[] = [];

    for (let row = 0; row < ROWS; row++) {
      const line = IDLE_FRAME[row];
      if (!line) continue;

      for (let col = 0; col < line.length; col++) {
        const colorKey = state.isBlinking && line[col] === "4" ? "3" : line[col];
        if (!colorKey || colorKey === "0") continue;

        const color = PALETTE[colorKey];
        if (!color || color === "transparent") continue;

        // Skip pixels that have been shed to the particle system
        if (shedSet?.has(`${row},${col}`)) continue;

        let px = col * PX;
        const py = row * PX + breathY;

        // Walking leg animation
        if (state.isWalking && row >= 42 && row <= 47) {
          const isLeftLeg = col < 16;
          const step = Math.sin(state.walkFrame * 0.3);
          px += isLeftLeg ? step * 3 : -(step * 3);
        }

        pixels.push({ px, py, color });
      }
    }

    if (isShivering && channelOffsets) {
      // Three-pass chromatic aberration rendering
      ctx.globalCompositeOperation = "lighter";

      // Red pass
      for (const { px, py, color } of pixels) {
        const [r] = hexToRgb(color);
        ctx.fillStyle = `rgb(${r},0,0)`;
        ctx.fillRect(
          Math.floor(px + channelOffsets[0].dx),
          Math.floor(py + channelOffsets[0].dy),
          PX, PX
        );
      }

      // Green pass
      for (const { px, py, color } of pixels) {
        const [, g] = hexToRgb(color);
        ctx.fillStyle = `rgb(0,${g},0)`;
        ctx.fillRect(
          Math.floor(px + channelOffsets[1].dx),
          Math.floor(py + channelOffsets[1].dy),
          PX, PX
        );
      }

      // Blue pass
      for (const { px, py, color } of pixels) {
        const [, , b] = hexToRgb(color);
        ctx.fillStyle = `rgb(0,0,${b})`;
        ctx.fillRect(
          Math.floor(px + channelOffsets[2].dx),
          Math.floor(py + channelOffsets[2].dy),
          PX, PX
        );
      }

      ctx.globalCompositeOperation = "source-over";
    } else {
      // Normal single-pass rendering
      for (const { px, py, color } of pixels) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(px), Math.floor(py), PX, PX);
      }
    }

    // Shadow under character
    if (state.warpState === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(CANVAS_W / 2, CANVAS_H - 2, CANVAS_W * 0.35, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [state, shedSet]);

  const scale = DISPLAY_H / CANVAS_H;

  // Simple visibility: hidden when warped
  const opacity = state.warpState === "warped" ? 0 : 1;
  const dirScale = state.direction === "left" ? "scaleX(-1)" : "scaleX(1)";
  const lean = leanAngle ? `rotate(${state.direction === "left" ? -leanAngle : leanAngle}deg)` : "";

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: state.x - DISPLAY_W / 2,
        top: `calc(${groundY}% - ${DISPLAY_H}px + ${state.y * scale}px)`,
        width: DISPLAY_W,
        height: DISPLAY_H,
        opacity,
        transformOrigin: "bottom center",
        transform: lean,
      }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          transform: dirScale,
        }}
      />
    </div>
  );
}
