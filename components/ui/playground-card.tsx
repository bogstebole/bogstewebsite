"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useHover } from "@/components/ui/hover-context";
import { useBreakpoint } from "@/hooks/useBreakpoint";

export function PlaygroundCard() {
  const router = useRouter();
  const { hoveredKey, setHoveredKey } = useHover();
  const { isMobile } = useBreakpoint();

  const isHovered = hoveredKey === "playground";
  const isDimmed = hoveredKey !== null && hoveredKey !== "playground";

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onMouseEnter={() => { if (!isMobile) setHoveredKey("playground"); }}
      onMouseLeave={() => { if (!isMobile) setHoveredKey(null); }}
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
        position: "relative",
      }}
    >
      <AnimatePresence>
        {!isMobile && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "100%",
              left: 0,
              marginBottom: 16,
              width: 640,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              zIndex: 50,
              pointerEvents: "none",
              backgroundColor: "var(--background-default, #000)",
            }}
          >
            <video
              src="/assets/Video inlin chat/Chat highlight.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
