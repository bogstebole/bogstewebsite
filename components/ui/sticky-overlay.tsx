"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimation } from "framer-motion";
import { StickyNotesIcon } from "@/components/ui/sticky-notes-icon";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";
import {
  BADGE_CONTAINER_VARIANTS,
  BADGE_ITEM_VARIANTS,
} from "@/components/ui/project-card";

interface StickyOverlayProps {
  /** Kept for call-site compatibility — no longer used for FLIP */
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const SHEET_WIDTH = 877;

const STICKY_ASSETS = [
  { src: "/assets/Sticky/Home screen.png", alt: "Sticky home screen" },
  { src: "/assets/Sticky/Add task.png",    alt: "Add task" },
  { src: "/assets/Sticky/Expand.png",      alt: "Expand view" },
  { src: "/assets/Sticky/Reorder.png",     alt: "Reorder tasks" },
];

const DESCRIPTION =
  "Most task apps organize your work into lists that feel like chores. Sticky treats your tasks as a living canvas — notes float, stack, and drift, making the act of planning feel more like thinking than filing. Built for people who want their tools to have personality.";

const slideSpring = { type: "spring" as const, stiffness: 340, damping: 34 };
const returnTween = { type: "tween" as const, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

export function StickyOverlay({ onCloseStart, onClose }: StickyOverlayProps) {
  const { isMobile } = useBreakpoint();
  const [mounted, setMounted] = useState(false);
  const [panelClosing, setPanelClosing] = useState(false);
  const [isSheetReady, setIsSheetReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);

  const contentControls = useAnimation();
  const gridControls = useAnimation();
  const badgeControls = useAnimation();
  const closingRef = useRef(false);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Sticky floating header — appears when the badges/title row scrolls out of view
  useEffect(() => {
    if (!isSheetReady) {
      setShowFloatingHeader(false);
      return;
    }
    const el = badgesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSheetReady]);

  const handleContentOpen = useCallback(async () => {
    if (closingRef.current) return;
    setIsSheetReady(true);
    void badgeControls.start("visible");
    void contentControls.start("visible");
    setTimeout(() => {
      if (!closingRef.current) void gridControls.start("visible");
    }, 350);
  }, [badgeControls, contentControls, gridControls]);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    onCloseStart();
    await Promise.all([
      contentControls.start("exit"),
      gridControls.start("exit"),
      badgeControls.start("exit"),
    ]);
    setPanelClosing(true);
  }, [contentControls, gridControls, badgeControls, onCloseStart]);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  if (!mounted) return null;

  const floatingHeaderVisible = showFloatingHeader && !isClosing;

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: panelClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      />

      {/* Floating sticky header — appears when title scrolls out of view */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: floatingHeaderVisible ? 1 : 0,
          y: floatingHeaderVisible ? 0 : -12,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 36 }}
        style={{
          alignItems: "center",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 9999,
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 24px",
          pointerEvents: floatingHeaderVisible ? "auto" : "none",
          position: "fixed",
          top: "calc(5vh + 16px)",
          left: isMobile ? 16 : "50%",
          marginLeft: isMobile ? 0 : -(SHEET_WIDTH / 2 - 16),
          width: isMobile ? "calc(100% - 32px)" : SHEET_WIDTH - 32,
          zIndex: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sticky.png"
            alt="Sticky Icon"
            style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: 4 }}
          />
          <span style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "16px", letterSpacing: "-0.01em", lineHeight: "1" }}>
            Sticky
          </span>
        </div>
        <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </GlassButton>
      </motion.div>

      {/* Bottom sheet panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: panelClosing ? "100%" : 0 }}
        transition={panelClosing ? returnTween : slideSpring}
        onAnimationComplete={() => {
          if (closingRef.current) {
            onClose();
          } else {
            void handleContentOpen();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          alignItems: "center",
          backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #EEEEEE 100%)",
          backgroundOrigin: "padding-box",
          borderTopLeftRadius: isMobile ? 0 : "40px",
          borderTopRightRadius: isMobile ? 0 : "40px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: "inset 0 0 0 4px #FFFFFF, #00000003 0px 400px 165px, #0000000D 0px 105px 140px, #0000001A 0px 105px 105px, #0000001A 0px 25px 55px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "24px" : "48px",
          paddingTop: isMobile ? "calc(48px + env(safe-area-inset-top))" : 48,
          paddingBottom: isMobile ? "calc(32px + env(safe-area-inset-bottom))" : 32,
          paddingInline: 16,
          position: "fixed",
          bottom: 0,
          left: isMobile ? 0 : "50%",
          marginLeft: isMobile ? 0 : -(SHEET_WIDTH / 2),
          width: isMobile ? "100%" : SHEET_WIDTH,
          height: isMobile ? "100dvh" : "95vh",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: 51,
          cursor: "default",
        }}
      >
        {/* Close button — always visible in top-right corner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
          style={{
            position: "absolute",
            top: isMobile ? "calc(env(safe-area-inset-top) + 16px)" : 24,
            right: 24,
          }}
        >
          <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
            </svg>
          </GlassButton>
        </motion.div>

        {/* Header: Icon, Title, Tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            width: isMobile ? "100%" : "480px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}>
            {/* Icon & Title */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
              <StickyNotesIcon />
              <div style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "20px", letterSpacing: "-0.01em", lineHeight: "1" }}>
                Sticky
              </div>
            </div>

            {/* Animated tags */}
            <motion.div
              ref={badgesRef}
              animate={badgeControls}
              initial="hidden"
              variants={BADGE_CONTAINER_VARIANTS}
              style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center" }}
            >
              {["iOS", "Productivity"].map((label) => (
                <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                  <ProjectTag label={label} variant="glass" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Staggered description + button */}
          <motion.div
            animate={contentControls}
            initial="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: { transition: { staggerChildren: 0.05 } },
              exit: { transition: { staggerChildren: 0.05 } },
            }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", width: "100%" }}
          >
            {/* Description */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                hidden: { opacity: 0, y: 15 },
                exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
              }}
              style={{
                color: "#000000CC",
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: "14px",
                lineHeight: "18px",
                textAlign: "center",
                width: "100%",
              }}
            >
              {DESCRIPTION}
            </motion.div>

            {/* Download button */}
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                hidden: { opacity: 0, y: 15 },
                exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
              }}
              style={{
                alignItems: "center",
                backdropFilter: "blur(1px)",
                borderRadius: "9999px",
                boxShadow: "#FFFFFF -2px 2px 2px 1px inset, #00000069 -1px -3px 3px -2px inset, #000000D6 2px 1px 4px -4px inset, #FFFFFF 0px 0px 7px 4px inset, #00000040 0px -9px 14px 4px inset, #0000001A -2px -3px 5px 3px inset, #FFFFFF 0px 20px 8px -9px inset, #0000001A 0px 34px 10px -9px inset, #00000003 0px 27px 8px, #00000003 0px 17px 6px, #0000000D 0px 10px 6px, #0000001A 0px 4px 4px, #0000001A 0px 1px 3px",
                display: "flex",
                gap: "4px",
                height: "32px",
                justifyContent: "center",
                paddingBottom: "9px",
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "9px",
                cursor: "progress",
              }}
            >
              <span style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "14px", letterSpacing: "0.03em", lineHeight: "1" }}>
                Download the app
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Staggered media grid */}
        <motion.div
          animate={gridControls}
          initial="hidden"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: { transition: { staggerChildren: 0.05 } },
            exit: { transition: { staggerChildren: 0.05 } },
          }}
          style={
            isMobile
              ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", paddingBottom: 48, boxSizing: "border-box" }
              : { columns: 3, columnGap: 16, width: "100%", paddingBottom: 48, boxSizing: "border-box" }
          }
        >
          {STICKY_ASSETS.map((asset, i) => (
            <motion.div
              key={i}
              variants={{
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
                hidden: { opacity: 0, y: 40, scale: 0.95 },
                exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } },
              }}
              style={{
                breakInside: isMobile ? undefined : "avoid",
                marginBottom: isMobile ? 0 : 16,
                borderRadius: isMobile ? 12 : 32,
                overflow: "hidden",
                backgroundColor: "#DDDDDD",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI(asset.src)}
                alt={asset.alt}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>,
    document.body
  );
}
