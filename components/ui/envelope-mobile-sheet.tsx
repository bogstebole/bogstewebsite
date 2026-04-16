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
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function EnvelopeMobileSheet({ onCloseStart, onClose }: EnvelopeMobileSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);

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

  if (!mounted) return null;

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
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={sheetSpring}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <PaperLogo size={32} />
          <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
            </svg>
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

          {/* Read more button */}
          <GlassButton size="m" onClick={() => {/* step 3 */}}>
            Read more
          </GlassButton>

          {/* Illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/me-and-son.png"
            alt="Me and my son illustration"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

        </div>
      </motion.div>
    </>,
    document.body
  );
}
