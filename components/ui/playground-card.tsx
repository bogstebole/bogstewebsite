"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useHover } from "@/components/ui/hover-context";

export function PlaygroundCard() {
  const router = useRouter();
  const { hoveredKey, setHoveredKey } = useHover();

  const isHovered = hoveredKey === "playground";
  const isDimmed = hoveredKey !== null && hoveredKey !== "playground";

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHoveredKey("playground")}
      onMouseLeave={() => { setHoveredKey(null); }}
      onClick={() => router.push("/inline-chat-experience")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push("/inline-chat-experience"); }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        textDecoration: "none",
        cursor: "pointer",
        transformOrigin: "50% 50%",
        opacity: isDimmed ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: 1.3,
          letterSpacing: "-0.04em",
          color: "var(--color-text-card)",
        }}
      >
        Inline Chat Input
      </div>

      <div
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 400,
          fontSize: 10,
          lineHeight: 1.3,
          letterSpacing: "-0.04em",
          color: "var(--color-text-label)",
        }}
      >
        UI showcase
      </div>
    </motion.div>
  );
}
