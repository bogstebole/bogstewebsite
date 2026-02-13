"use client";

import { useRef, useEffect } from "react";
import { figmaX, figmaY } from "@/lib/figma-scale";
import { FIGMA_POSITIONS } from "@/lib/constants";

/** 8-bit cloud pixel patterns (0 = transparent, 1 = white) */
const CLOUD_PATTERNS = [
  // Pattern A — wide flat cloud
  [
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  // Pattern B — tall bumpy cloud
  [
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  // Pattern C — small puffy cloud
  [
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
];

interface PixelCloudProps {
  x: number;
  y: number;
  delay: number;
  patternIndex: number;
  isDark?: boolean;
}

function PixelCloud({ x, y, delay, patternIndex, isDark }: PixelCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pattern = CLOUD_PATTERNS[patternIndex % CLOUD_PATTERNS.length];
  const pw = pattern[0].length;
  const ph = pattern.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, pw, ph);
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.55)";

    for (let row = 0; row < ph; row++) {
      for (let col = 0; col < pw; col++) {
        if (pattern[row][col] === 1) {
          ctx.fillRect(col, row, 1, 1);
        }
      }
    }
  }, [pattern, pw, ph, isDark]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${figmaX(x)}%`,
        top: `${figmaY(y)}%`,
        animation: `cloud-float ${120 + delay}s ease-in-out ${delay}s infinite alternate`,
      }}
    >
      <canvas
        ref={canvasRef}
        width={pw}
        height={ph}
        style={{
          imageRendering: "pixelated",
          width: pw * 5,
          height: ph * 5,
        }}
      />
    </div>
  );
}

import { useTheme } from "@/components/providers/theme-provider";

export function Clouds() {
  const { isDark } = useTheme();
  return (
    <>
      <style>{`
        @keyframes cloud-float {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(200px) translateY(10px); }
        }
      `}</style>
      {FIGMA_POSITIONS.clouds.map((cloud, i) => (
        <PixelCloud
          key={i}
          x={cloud.x}
          y={cloud.y}
          delay={i * 5}
          patternIndex={i}
          isDark={isDark}
        />
      ))}
    </>
  );
}
