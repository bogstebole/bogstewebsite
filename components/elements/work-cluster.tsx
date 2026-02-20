"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { figmaX, figmaY } from "@/lib/figma-scale";
import { FIGMA_POSITIONS } from "@/lib/constants";
import { useTheme } from "@/components/providers/theme-provider";

// ─── Scale & dimensions ──────────────────────────────────────────────────────
// The front SVG viewBox is 84×59 and the backside is 63×28.
// We render at SCALE × those dimensions.
const SCALE = 0.75;

const FRONT_W = Math.round(84 * SCALE); // 63
const FRONT_H = Math.round(59 * SCALE); // 44
const BACK_W  = Math.round(63 * SCALE); // 47
const BACK_H  = Math.round(28 * SCALE); // 21

// In the front SVG the folder-body path begins at y=10 (of 59).
// At our render height that maps to: round(10/59 * FRONT_H) ≈ 7px from SVG top.
// We want the visible fold-line at FOLDER_LID_Y (= 14 * SCALE = 11) in container coords,
// so position the front SVG at FRONT_TOP = FOLDER_LID_Y − 7 = 4.
const FOLDER_LID_Y = Math.round(14 * SCALE); // 11
const FRONT_PATH_Y = Math.round((10 / 59) * FRONT_H); // 7
const FRONT_TOP    = FOLDER_LID_Y - FRONT_PATH_Y; // 4

// Folder-content zone (Figma: left=7, top=−2, width=53, height=44, scaled ×0.75)
const CONTENT_LEFT = Math.round(7  * SCALE); // 5 (unused — zone is centered)
const CONTENT_TOP  = -10; // raised so icons sit inside the folder body
const CONTENT_W    = Math.round(53 * SCALE); // 40
const CONTENT_H    = Math.round(44 * SCALE); // 33

// Total container
const CONTAINER_W = FRONT_W;             // 63
const CONTAINER_H = FRONT_TOP + FRONT_H; // 4 + 44 = 48

// Icon card size (proportional to Figma ~35px cards inside 68px folder, at ×1.5)
const CARD_SIZE   = 38;
const CARD_RADIUS = 8;
const CARD_SHADOW = "0 8px 3px rgba(0,0,0,0), 0 5px 2px rgba(0,0,0,0.03), 0 3px 2px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.17), 0 0 1px rgba(0,0,0,0.2)";
const CARD_BORDER = "0.7px solid rgba(255,255,255,0.4)";

// ─── Component ───────────────────────────────────────────────────────────────
export function WorkCluster() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pos = FIGMA_POSITIONS.work;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* ── Folder + Label group ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${figmaX(pos.folder.x)}%`,
          top: `${figmaY(pos.folder.y)}%`,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
      {/* ── Folder ── */}
      <div
        className="relative pointer-events-auto"
        style={{
          width: CONTAINER_W,
          height: CONTAINER_H,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          cursor: "pointer",
        }}
        onClick={(e) => { e.stopPropagation(); setIsOpen((o) => !o); }}
      >
        {/* Layer 1 – Backside (folder tab) */}
        <img
          src="/images/folder-backside.svg"
          alt=""
          width={BACK_W}
          height={BACK_H}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            zIndex: 1,
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* Layer 2 – Icons (between backside and front) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: CONTENT_TOP,
            width: CONTENT_W,
            height: CONTENT_H,
            zIndex: 2,
          }}
        >
          {/* Fynn.io card */}
          <motion.div
            animate={
              isOpen
                ? { x: -22, y: -30, rotate: -8,  scale: 1.15 }
                : { x: 0,   y: 0,   rotate: -9.5, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              width: CARD_SIZE,
              height: CARD_SIZE,
              background: "#CDEBFF",
              borderRadius: CARD_RADIUS,
              border: CARD_BORDER,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: CARD_SHADOW,
            }}
          >
            <Image
              src="/images/fynn.svg"
              alt="Fynn.io"
              width={22}
              height={12}
              style={{ width: 22, height: 12 }}
            />
          </motion.div>

          {/* Content Snare card */}
          <motion.div
            animate={
              isOpen
                ? { x: 22, y: -34, rotate: 8,  scale: 1.15 }
                : { x: 0,  y: 0,   rotate: 15, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: isOpen ? 0.04 : 0 }}
            style={{
              position: "absolute",
              right: 2,
              top: 6,
              width: CARD_SIZE,
              height: CARD_SIZE,
              background: "#703DC1",
              borderRadius: CARD_RADIUS,
              border: CARD_BORDER,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: CARD_SHADOW,
            }}
          >
            <Image
              src="/images/content-snare.svg"
              alt="Content Snare"
              width={18}
              height={19}
              style={{ width: 18, height: 19 }}
            />
          </motion.div>
        </div>

        {/* Layer 3 – Front (covers lower portion of icons) */}
        <img
          src="/images/folder-front.svg"
          alt=""
          width={FRONT_W}
          height={FRONT_H}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: FRONT_TOP,
            zIndex: 3,
            display: "block",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Label */}
      <span
        className="select-none transition-colors duration-700"
        style={{
          fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
          fontSize: 14,
          color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        }}
      >
        Selected work
      </span>
      </div>
    </div>
  );
}
