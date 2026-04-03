"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNotesIcon } from "@/components/ui/sticky-notes-icon";

interface StickyOverlayProps {
  /** DOMRect of the mini sticky card — unused now by layoutId but kept for compatibility or manual fallback if needed */
  originRect?: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const spring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 38,
};

const returnTransition = {
  type: "tween" as const,
  duration: 0.32,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

export function StickyOverlay({ originRect, onCloseStart, onClose }: StickyOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const initiateClose = () => {
    onCloseStart();
    setIsOpen(false);
  };

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") initiateClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.22 }}
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

      {/* Sticky stack — FLIP via layoutId */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence onExitComplete={onClose}>
          {isOpen && (
            <motion.div
              initial={{ rotate: 5 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 5 }}
              transition={spring}
              style={{ cursor: "default" }}
            >
              <StickyNotesIcon isExpanded layoutId="sticky-stack" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button — fades in after expand settles */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          onClick={initiateClose}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
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
    </div>
  );
}
