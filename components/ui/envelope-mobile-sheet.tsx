"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { PaperLogo } from "@/components/elements/notes-to-self";

interface EnvelopeMobileSheetProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const sheetSpring = { type: "spring" as const, stiffness: 340, damping: 34 };
const stickySpring = { type: "spring" as const, stiffness: 400, damping: 36 };
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function EnvelopeMobileSheet({ onCloseStart, onClose }: EnvelopeMobileSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [panelTopPx, setPanelTopPx] = useState(0);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [cardAnimationComplete, setCardAnimationComplete] = useState(false);

  const measurePanelTop = useCallback(() => {
    if (panelRef.current) {
      setPanelTopPx(panelRef.current.getBoundingClientRect().top);
    }
  }, []);

  useEffect(() => {
    measurePanelTop();
    window.addEventListener("resize", measurePanelTop);
    return () => window.removeEventListener("resize", measurePanelTop);
  }, [measurePanelTop]);

  useEffect(() => { setMounted(true); }, []);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    onCloseStart();
    await wait(400);
    onClose();
  }, [onCloseStart, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  // Sticky header observer — only active after sheet animation completes
  useEffect(() => {
    if (!cardAnimationComplete) return;
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cardAnimationComplete]);

  if (!mounted) return null;

  const closeIcon = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
    </svg>
  );

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        onClick={() => void initiateClose()}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "var(--color-bg-backdrop)",
          inset: 0,
          position: "fixed",
          zIndex: 10000,
        }}
      />

      {/* Bottom sheet */}
      <motion.div
        ref={panelRef}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={sheetSpring}
        onAnimationComplete={() => {
          if (!isClosing) { setCardAnimationComplete(true); measurePanelTop(); }
        }}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundColor: "var(--color-bg-sheet-mobile)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: "0px -8px 24px rgba(0,0,0,0.05)",
          bottom: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "95dvh",
          left: 0,
          overflowX: "hidden",
          overflowY: "auto",
          paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
          paddingInline: 16,
          paddingTop: 16,
          position: "fixed",
          right: 0,
          width: "100%",
          zIndex: 10001,
        }}
      >
        {/* Header */}
        <div ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <PaperLogo size={32} />
          <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
            {closeIcon}
          </GlassButton>
        </div>

        {/* About Me section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span style={{
              color: "var(--color-text-primary)",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 300,
              lineHeight: "20px",
            }}>
              About
            </span>
            <span style={{
              color: "var(--color-text-secondary)",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 14,
              fontWeight: 300,
              lineHeight: "20px",
            }}>
              Eerie black circles and beyond
            </span>
          </div>

          {/* Paragraph copy */}
          <p style={{
            color: "var(--color-text-secondary)",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 300,
            lineHeight: "150%",
            margin: 0,
          }}>
            Childhood fascination with drawing dark circles alarmed my parents but led me to explore conceptual art, product design and eventually AI. AI gave me opportunity to bring to life concepts that were just an idea a while ago. Through the process I learned to harness a child&apos;s innate curiosity. Now as a father, my son&apos;s wonder helps me rediscover that questioning spirit I sometimes lose touch with.
          </p>

          {/* Illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/me-and-son.png"
            alt="Me and my son illustration"
            style={{ width: "100%", height: "auto", display: "block" }}
          />

          {/* Read more button */}
          <GlassButton size="m" onClick={() => {/* step 3 */}}>
            Read more
          </GlassButton>

        </div>

        {/* Dashed divider */}
        <div style={{ alignItems: "start", display: "flex", gap: 2, height: "fit-content", opacity: 0.2, width: "100%", marginTop: 32 }}>
          {Array.from({ length: 56 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "var(--color-divider)", flex: 1, height: "1px" }} />
          ))}
        </div>

        {/* Note to Self section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32, paddingBottom: 16 }}>
          <span style={{
            color: "var(--color-text-primary)",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 300,
            lineHeight: "20px",
          }}>
            Note to self
          </span>
          <div style={{
            color: "var(--color-text-secondary)",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 300,
            lineHeight: "150%",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            {[
              "Deep dive into things that tickle your passion",
              "Don't be a fckn shit!",
              'Start with "What if..."',
              "Be respectful, listen, share...",
              "Respect yourself and your work, but be open to criticism...",
              "Be introspective",
              "Be humble",
              "Be honest",
            ].map((note, i) => (
              <span key={i}>{i + 1}. {note}</span>
            ))}
          </div>
        </div>

      </motion.div>

      {/* Sticky header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: showStickyHeader && !isClosing ? 1 : 0,
          y: showStickyHeader && !isClosing ? 0 : -12,
        }}
        transition={stickySpring}
        style={{
          alignItems: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 24,
          display: "flex",
          justifyContent: "space-between",
          left: 8,
          right: 8,
          padding: 16,
          pointerEvents: showStickyHeader && !isClosing ? "auto" : "none",
          position: "fixed",
          top: panelTopPx + 8,
          width: "calc(100% - 16px)",
          zIndex: 10002,
          backgroundColor: "var(--color-bg-sheet-header)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          boxSizing: "border-box",
        }}
      >
        <PaperLogo size={24} />
        <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
          {closeIcon}
        </GlassButton>
      </motion.div>
    </>,
    document.body
  );
}
