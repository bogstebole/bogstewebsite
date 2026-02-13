"use client";

import Image from "next/image";
import { figmaX, figmaY } from "@/lib/figma-scale";
import { FIGMA_POSITIONS } from "@/lib/constants";

const CARD_SHADOW = '0 12px 3px 0 rgba(0,0,0,0), 0 8px 3px 0 rgba(0,0,0,0.01), 0 4px 3px 0 rgba(0,0,0,0.05), 0 2px 2px 0 rgba(0,0,0,0.09), 0 0 1px 0 rgba(0,0,0,0.10)';

export function WorkCluster() {
  const pos = FIGMA_POSITIONS.work;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Fynn.io card (behind) */}
      <div
        className="absolute pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-105"
        style={{
          left: `${figmaX(pos.fynnio.x)}%`,
          top: `${figmaY(pos.fynnio.y)}%`,
          transform: "none",
          width: pos.fynnio.size,
          height: pos.fynnio.size,
          background: "#CDEBFF",
          borderRadius: 12,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <Image
          src="/images/fynn.svg"
          alt="Fynn.io"
          width={37}
          height={20}
          style={{ width: 34, height: 18 }}
        />
      </div>

      {/* Content Snare card (overlapping on top) */}
      <div
        className="absolute pointer-events-auto cursor-pointer transition-transform duration-200 hover:scale-105"
        style={{
          left: `${figmaX(pos.contentSnare.x)}%`,
          top: `${figmaY(pos.contentSnare.y)}%`,
          width: pos.contentSnare.size,
          height: pos.contentSnare.size,
          background: "#703DC1",
          borderRadius: 12,
          boxShadow: CARD_SHADOW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <Image
          src="/images/content-snare.svg"
          alt="Content Snare"
          width={31}
          height={33}
          style={{ width: 28, height: 30 }}
        />
      </div>

      {/* "Selected work" label */}
      <span
        className="absolute select-none"
        style={{
          left: `${figmaX(pos.label.x)}%`,
          top: `${figmaY(pos.label.y)}%`,
          fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
          fontSize: 14,
          color: "rgba(0,0,0,0.5)",
        }}
      >
        Selected work
      </span>
    </div>
  );
}
