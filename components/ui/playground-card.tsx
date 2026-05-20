"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function PlaygroundCard() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const targetScale = pressed ? 0.96 : hovered ? 0.98 : 1;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onClick={() => router.push("/inline-chat-experience")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push("/inline-chat-experience"); }}
      animate={{ scale: targetScale }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
        textDecoration: "none",
        cursor: "pointer",
        transformOrigin: "50% 50%",
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
