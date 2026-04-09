"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface PauschalDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const spring = { type: "spring" as const, stiffness: 340, damping: 36 };

const SCREENSHOTS = [
  { src: "/assets/Pauschal tracker/1.png", alt: "Pauschal Tracker — dashboard" },
  { src: "/assets/Pauschal tracker/2.png", alt: "Pauschal Tracker — invoices" },
  { src: "/assets/Pauschal tracker/3.png", alt: "Pauschal Tracker — earnings" },
  { src: "/assets/Pauschal tracker/4.png", alt: "Pauschal Tracker — overview" },
  { src: "/assets/Pauschal tracker/5.png", alt: "Pauschal Tracker — settings" },
];

const TAGS = ["Web", "Earning limit tracker", "Personal Usage"];

export function PauschalDetail({ onCloseStart, onClose }: PauschalDetailProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useBreakpoint();

  useEffect(() => setMounted(true), []);

  const initiateClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    onCloseStart();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") initiateClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  const child = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: isClosing ? { opacity: 0, y: 4 } : { opacity: 1, y: 0 },
    transition: { ...spring, delay: isClosing ? 0 : delay },
  });

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  if (isMobile) {
    if (!mounted) return null;
    return createPortal(
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            inset: 0,
            position: "fixed",
            zIndex: 10,
          }}
        />

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isClosing ? "100%" : 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 34 }}
          onAnimationComplete={() => { if (isClosing) onClose(); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(180deg, #0a0a0d 0%, #232336 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            paddingTop: "calc(56px + env(safe-area-inset-top))",
            paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
            paddingInline: 16,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100dvh",
            overflowY: "scroll",
            overflowX: "hidden",
            zIndex: 11,
          }}
        >
          {/* Close button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            transition={{ delay: isClosing ? 0 : 0.3 }}
            style={{ position: "absolute", top: "calc(env(safe-area-inset-top) + 16px)", right: 16 }}
          >
            <GlassButton size="s" dark onClick={initiateClose} aria-label="Close">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
              </svg>
            </GlassButton>
          </motion.div>

          {/* Icon + title */}
          <motion.div {...child(0.06)} style={{ alignItems: "center", display: "flex", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/pauschal-tracker.png"
              alt="Pauschal Tracker"
              style={{ flexShrink: 0, height: 28, objectFit: "contain", width: 28 }}
            />
            <span
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Pauschal tracker
            </span>
          </motion.div>

          {/* Tags */}
          <motion.div {...child(0.12)} style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TAGS.map((tag) => (
              <ProjectTag key={tag} label={tag} variant="dark" />
            ))}
          </motion.div>

          {/* Description */}
          <motion.div {...child(0.18)}>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 14,
                lineHeight: "18px",
                margin: 0,
              }}
            >
              My personal SaaS for tracking pauschal limit for my design agency
              and tracking invoices as well as generating invoices.
              <br /><br />
              I have my mail connected to pull each xml file from the bank which
              then gets parsed and categorised.
            </p>
          </motion.div>

          {/* Screenshot stack */}
          <motion.div
            {...child(0.26)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
            }}
          >
            {SCREENSHOTS.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                style={{ borderRadius: 8, display: "block", height: "auto", width: "100%" }}
              />
            ))}
          </motion.div>
        </motion.div>
      </>,
      document.body
    );
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateClose}
        style={{ inset: 0, position: "fixed", zIndex: 10 }}
      />

      {/* Centering shell */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          pointerEvents: "none",
          position: "fixed",
          zIndex: 11,
        }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={isClosing
            ? { opacity: 0, scale: 0.94, y: 14 }
            : { opacity: 1, scale: 1, y: 0 }
          }
          transition={spring}
          onAnimationComplete={() => { if (isClosing) onClose(); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(180deg, #0a0a0d 0%, #232336 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            boxShadow: "0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            padding: 16,
            pointerEvents: "auto",
            position: "relative",
            width: "60vw",
            height: "80vh",
          }}
        >
          {/* Close button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1, transition: { delay: isClosing ? 0 : 0.3 } }}
            style={{ position: "absolute", right: 16, top: 16 }}
          >
            <GlassButton size="s" dark onClick={initiateClose} aria-label="Close">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
              </svg>
            </GlassButton>
          </motion.div>

          {/* ── Header: icon + title + description + tags ── */}
          <motion.div
            {...child(0.06)}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingBottom: 32,
              paddingTop: 24,
              width: "100%",
            }}
          >
            {/* Icon */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/pauschal-tracker.png"
              alt="Pauschal Tracker"
              style={{ flexShrink: 0, height: 48, objectFit: "contain", width: 48 }}
            />

            {/* Title */}
            <span
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              Pauschal tracker
            </span>

            {/* Description */}
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 14,
                lineHeight: "18px",
                margin: 0,
                maxWidth: "60%",
                textAlign: "center",
              }}
            >
              My personal SaaS for tracking pauschal limit for my design agency
              and tracking invoices as well as generating invoices.
              <br /><br />
              I have my mail connected to pull each xml file from the bank which
              then gets parsed and categorised.
            </p>

            {/* Tags */}
            <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
              {TAGS.map((tag) => (
                <ProjectTag key={tag} label={tag} variant="dark" />
              ))}
            </div>
          </motion.div>

          {/* ── Image gallery ── */}
          <motion.div
            {...child(0.18)}
            ref={scrollRef}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              flex: 1,
              minHeight: 0,
              overflow: "hidden auto",
              paddingTop: "4px",
              scrollbarWidth: "none",
              width: "100%",
            }}
          >
            <style>{`
              .pauschal-scroll::-webkit-scrollbar { display: none; }
            `}</style>
            <div className="pauschal-scroll" style={{ display: "flex", flexDirection: "column" }}>
              {SCREENSHOTS.map((s, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  style={{
                    borderRadius: i % 2 === 0 ? "24" : 0,
                    display: "block",
                    width: "100%",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
