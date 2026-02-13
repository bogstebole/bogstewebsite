"use client";

import { useRef, useEffect } from "react";
import { CHARACTER } from "@/lib/constants";
import type { CharacterState } from "@/lib/game-engine";

// 32x48 pixel character data from prototype
// Colors: 0=transparent, 1=cap dark, 2=cap main, 3=skin, 4=eye, 5=beard dark,
// 6=beard main, 7=shirt dark, 8=shirt main, 9=pants dark, A=pants main,
// B=shoe dark, C=shoe main, D=skin shadow, E=beard mid, F=cap highlight
const PALETTE: Record<string, string> = {
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

const IDLE_FRAME = [
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
const DISPLAY_H = 72;
const DISPLAY_W = 48;

interface PixelCharacterProps {
  state: CharacterState;
  groundY: number;
}

export function PixelCharacter({ state, groundY }: PixelCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const breathY = Math.sin(state.breathTimer * 0.03) * 1.5;

    for (let row = 0; row < ROWS; row++) {
      const line = IDLE_FRAME[row];
      if (!line) continue;

      for (let col = 0; col < line.length; col++) {
        const colorKey = state.isBlinking && line[col] === "4" ? "3" : line[col];
        if (!colorKey || colorKey === "0") continue;

        const color = PALETTE[colorKey];
        if (!color || color === "transparent") continue;

        let px = col * PX;
        const py = row * PX + breathY;

        // Walking leg animation
        if (state.isWalking && row >= 42 && row <= 47) {
          const isLeftLeg = col < 16;
          const step = Math.sin(state.walkFrame * 0.3);
          px += isLeftLeg ? step * 3 : -(step * 3);
        }

        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(px), Math.floor(py), PX, PX);
      }
    }

    // Shadow under character
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, CANVAS_H - 2, CANVAS_W * 0.35, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }, [state]);

  const scale = DISPLAY_H / CANVAS_H;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: state.x - DISPLAY_W / 2,
        top: `calc(${groundY}% - ${DISPLAY_H}px + ${state.y * scale}px)`,
        width: DISPLAY_W,
        height: DISPLAY_H,
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
          transform: state.direction === "left" ? "scaleX(-1)" : "scaleX(1)",
        }}
      />
    </div>
  );
}
