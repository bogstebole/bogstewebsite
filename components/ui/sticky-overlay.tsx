"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { StickyNotesIcon } from "@/components/ui/sticky-notes-icon";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";

interface StickyOverlayProps {
  /** DOMRect of the mini sticky icon — FLIP origin */
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const FULLW = 486;
const FULLH = 680;

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

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type AnimationPhase = "move-to-center" | "open" | "move-to-origin";

const STICKY_ASSETS = [
  { src: "/assets/Sticky/Home screen.png", alt: "Sticky home screen" },
  { src: "/assets/Sticky/Add task.png",    alt: "Add task" },
  { src: "/assets/Sticky/Expand.png",      alt: "Expand view" },
  { src: "/assets/Sticky/Reorder.png",     alt: "Reorder tasks" },
];

const DESCRIPTION =
  "Most task apps organize your work into lists that feel like chores. Sticky treats your tasks as a living canvas — notes float, stack, and drift, making the act of planning feel more like thinking than filing. Built for people who want their tools to have personality.";

function StickyContent({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overscrollBehavior: "contain",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "24px 24px 32px",
        boxSizing: "border-box",
      }}
    >
      {/* Close button */}
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
        <GlassButton size="s" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </GlassButton>
      </div>

      {/* Thumbnail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 8, width: "100%" }}>
        <StickyNotesIcon />

        <div style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1 }}>
          Sticky
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center" }}>
          {["iOS", "Productivity"].map((label) => (
            <ProjectTag key={label} label={label} variant="glass" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          color: "#000000CC",
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 14,
          lineHeight: "18px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {DESCRIPTION}
      </div>

      {/* Media grid — 3 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
        {STICKY_ASSETS.map((asset) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={asset.src}
            src={encodeURI(asset.src)}
            alt={asset.alt}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

function MobileStickyContent({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overscrollBehavior: "contain",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        paddingTop: "calc(48px + env(safe-area-inset-top))",
        paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
        paddingInline: 24,
        boxSizing: "border-box",
      }}
    >
      {/* Close button */}
      <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 16px)", right: 16, zIndex: 2 }}>
        <GlassButton size="s" onClick={onClose} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </GlassButton>
      </div>

      {/* Thumbnail */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
        <StickyNotesIcon />

        <div style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1 }}>
          Sticky
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center" }}>
          {["iOS", "Productivity"].map((label) => (
            <ProjectTag key={label} label={label} variant="glass" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          color: "#000000CC",
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 14,
          lineHeight: "18px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {DESCRIPTION}
      </div>

      {/* Media grid — 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%" }}>
        {STICKY_ASSETS.map((asset) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={asset.src}
            src={encodeURI(asset.src)}
            alt={asset.alt}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }}
          />
        ))}
      </div>
    </div>
  );
}

export function StickyOverlay({ originRect, onCloseStart, onClose }: StickyOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("move-to-center");
  const [mounted, setMounted] = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => { setMounted(true); }, []);

  if (!originRect) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  // Target: centered
  const targetW = FULLW;
  const targetH = FULLH;
  const maxH = vh * 0.85;
  const maxW = vw * 0.45;
  const targetScale = Math.min(maxH / targetH, maxW / targetW);
  const targetTop = (vh - targetH) / 2;
  const targetLeft = (vw - targetW) / 2;

  // Origin calculations
  const originScale = originRect.width / FULLW;

  // Center-to-Center math for x/y
  const originCX = originRect.left + originRect.width / 2;
  const restingCY = originRect.top + 16 + originRect.height / 2;

  const targetCX = targetLeft + targetW / 2;
  const targetCY = targetTop + targetH / 2;
  const initialX = originCX - targetCX;
  const initialY = restingCY - targetCY;

  const initiateDesktopClose = () => {
    if (phase === "move-to-origin") return;
    onCloseStart();
    setPhase("move-to-origin");
  };

  const initiateMobileClose = async () => {
    if (mobileClosing) return;
    onCloseStart();
    setMobileClosing(true);
    await wait(360);
    onClose();
  };

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobile) void initiateMobileClose();
        else initiateDesktopClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, isMobile, mobileClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDesktopClosing = phase === "move-to-origin";

  const SHADOW_MINI = "0 4px 12px rgba(0,0,0,0.1)";
  const SHADOW_MAX = "0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.08)";

  if (!mounted) return null;

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  if (isMobile) {
    return createPortal(
      <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mobileClosing ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => void initiateMobileClose()}
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: mobileClosing ? "100%" : 0 }}
          transition={mobileClosing ? returnTransition : spring}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100dvh",
            background: "#FFFBF0",
            overflowY: "auto",
            overscrollBehavior: "contain",
            boxSizing: "border-box",
            zIndex: 1,
            boxShadow: SHADOW_MAX,
          }}
        >
          <MobileStickyContent onClose={() => void initiateMobileClose()} />
        </motion.div>
      </div>,
      document.body
    );
  }

  // ── Desktop: FLIP animation ───────────────────────────────────────────────
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, overflow: "hidden" }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDesktopClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateDesktopClose}
        style={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.4)",
          zIndex: 0,
        }}
      />

      {/* Panel — FLIP */}
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
            y: initialY - 16,
            scale: originScale,
            rotate: 5,
            boxShadow: SHADOW_MINI,
          }}
          animate={
            isDesktopClosing
              ? {
                  x: initialX,
                  y: initialY,
                  scale: originScale,
                  rotate: 5,
                  boxShadow: SHADOW_MINI,
                }
              : {
                  x: 0,
                  y: 0,
                  scale: targetScale,
                  rotate: 0,
                  boxShadow: SHADOW_MAX,
                }
          }
          transition={isDesktopClosing ? returnTransition : spring}
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
            borderRadius: 16,
            background: "#FFFBF0",
            willChange: "transform, box-shadow",
            overflow: "hidden",
          }}
        >
          <StickyContent onClose={initiateDesktopClose} />
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
