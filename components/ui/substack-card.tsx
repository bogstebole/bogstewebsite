"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useHover } from "@/components/ui/hover-context";

type Props = {
  title: string;
  date: string;
  time: string;
  href: string;
};

export function SubstackCard({ title, date, time, href }: Props) {
  const { hoveredKey, setHoveredKey } = useHover();

  const isHovered = hoveredKey === "writing";
  const isDimmed = hoveredKey !== null && hoveredKey !== "writing";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHoveredKey("writing")}
      onMouseLeave={() => { setHoveredKey(null); }}
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
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontWeight: 400,
          fontSize: 10,
          lineHeight: 1.3,
          letterSpacing: "-0.04em",
          color: "var(--color-text-label)",
        }}
      >
        <span>{date}</span>
        <span>-</span>
        <span>{time}</span>
      </div>
    </motion.a>
  );
}
