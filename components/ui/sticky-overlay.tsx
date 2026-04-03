"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNotesIcon } from "@/components/ui/sticky-notes-icon";

interface StickyOverlayProps {
  /** DOMRect of the mini sticky icon — FLIP origin */
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const FULLW = 486;
const FULLH = 491;

const spring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 38,
};

const returnTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

type AnimationPhase = "move-to-center" | "open" | "move-to-origin";

export function StickyOverlay({ originRect, onCloseStart, onClose }: StickyOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("move-to-center");

  if (!originRect) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  // Target: centered
  const targetW = FULLW;
  const targetH = FULLH;
  const maxH = vh * 0.75;
  const maxW = vw * 0.45;
  const targetScale = Math.min(maxH / targetH, maxW / targetW);
  const targetTop = (vh - targetH) / 2;
  const targetLeft = (vw - targetW) / 2;

  // Origin calculations
  const originScale = originRect.width / FULLW;
  
  // Center-to-Center math for x/y
  const originCX = originRect.left + originRect.width / 2;
  // Account for the fact that the card un-hovers (moves down 16px)
  // because V2Canvas sets pointerEvents: none on the background when open.
  const originCY = (phase === "move-to-origin" ? originRect.top + 16 : originRect.top) + (originRect.height / 2);
  
  const targetCX = targetLeft + targetW / 2;
  const targetCY = targetTop + targetH / 2;
  const initialX = originCX - targetCX;
  const initialY = originCY - targetCY;

  const initiateClose = () => {
    if (phase === "move-to-origin") return;
    onCloseStart();
    setPhase("move-to-origin");
  };

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") initiateClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const isClosing = phase === "move-to-origin";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, overflow: "hidden" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateClose}
        style={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.4)",
          zIndex: 0,
        }}
      />

      {/* Sticky stack — Pure manual scale FLIP */}
      <div 
        style={{ 
          position: "absolute", 
          top: targetTop, 
          left: targetLeft, 
          width: targetW, 
          height: targetH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={{
            x: initialX,
            y: initialY,
            scale: originScale,
            rotate: 5,
          }}
          animate={
            isClosing
              ? {
                  x: initialX,
                  y: initialY,
                  scale: originScale,
                  rotate: 5,
                }
              : {
                  x: 0,
                  y: 0,
                  scale: targetScale,
                  rotate: 0,
                }
          }
          transition={isClosing ? returnTransition : spring}
          onAnimationComplete={() => {
            if (phase === "move-to-center") setPhase("open");
            if (phase === "move-to-origin") onClose();
          }}
          style={{
            width: FULLW,
            height: FULLH,
            position: "relative",
            zIndex: 1,
            pointerEvents: "auto",
            transformOrigin: "center center",
            boxShadow: isClosing 
              ? "none" 
              : "0 20px 50px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)",
            borderRadius: 8, // match mini icon roundedness
            overflow: "hidden",
          }}
        >
          {/* Inner content - now visible from frame 1 for smooth growth */}
          <div style={{ width: "100%", height: "100%" }}>
             <StickyNotesIcon isExpanded />
          </div>
        </motion.div>
      </div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "open" ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        onClick={initiateClose}
        style={{
          position: "fixed",
          top: targetTop + (targetH - targetH * targetScale) / 2 + 16,
          left: targetLeft + (targetW + targetW * targetScale) / 2 - 48,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
        aria-label="Close"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </motion.button>
    </div>
  );
}
