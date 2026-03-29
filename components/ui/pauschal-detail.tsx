"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1, transition: { delay: isClosing ? 0 : 0.3 } }}
            onClick={initiateClose}
            style={{
              alignItems: "center",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 14,
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              display: "flex",
              flexShrink: 0,
              fontSize: 13,
              height: 28,
              justifyContent: "center",
              position: "absolute",
              right: 16,
              top: 16,
              width: 28,
            }}
          >
            ✕
          </motion.button>

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
