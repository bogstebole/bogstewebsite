"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";

interface ZounDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const spring = { type: "spring" as const, stiffness: 340, damping: 36 };

const SCREENSHOTS = [
  { src: "/assets/Zoun/home.png", alt: "Zoun — globe view" },
  { src: "/assets/Zoun/compare.png", alt: "Zoun — compare time zones" },
  { src: "/assets/Zoun/search.png", alt: "Zoun — select country" },
];

const TAGS = ["iOS", "Time Zone Tracker", "In progress.."];

const DESCRIPTION =
  "Zoun is a personal iOS app built around the idea that comparing time zones across a global team should feel spatial and immediate, not like reading a spreadsheet. Existing world clock tools get the job done but look dated, and that gap was enough reason to build something better. The concept centers on a photorealistic 3D globe that reflects real-time daylight conditions, with contacts pinned to their locations and a list view below showing local times, UTC offsets, and day/night status at a glance. A time scrubber lets you simulate what everyone's clock looks like at any given hour, which is useful for scheduling calls across multiple zones. Built in SwiftUI, with an MVP already running using MapKit as a placeholder renderer. The final globe is still being evaluated between Metal, RealityKit, and SpriteKit, since MapKit does not deliver the visual fidelity the concept needs, and getting that right is the blocker between concept and release. Planned additions include calendar integrations for booking directly into Google Meet or similar. The app is intended for public release once the visuals meet the standard the concept sets.";

export function ZounDetail({ onCloseStart, onClose }: ZounDetailProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => setMounted(true), []);

  const initiateClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    onCloseStart();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Staggered child animation
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
        {/* Backdrop — blurs and dims content behind the sheet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.15)",
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
          onAnimationComplete={() => {
            if (isClosing) onClose();
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backdropFilter: "blur(3px) hue-rotate(180deg)",
            WebkitBackdropFilter: "blur(3px) hue-rotate(180deg)",
            backgroundImage: "linear-gradient(in oklab 122.24deg, oklab(20.9% 0.0005 -0.002) 7.63%, oklab(45.5% 0 -0.0001 / 60%) 102.21%)",
            backgroundOrigin: "border-box",
            border: "1px solid #FFFFFF4A",
            outline: "1px solid #565656",
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
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top) + 16px)",
              right: 16,
            }}
          >
            <GlassButton size="s" onClick={initiateClose} aria-label="Close">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <line x1="1" y1="1" x2="9" y2="9" />
                <line x1="9" y1="1" x2="1" y2="9" />
              </svg>
            </GlassButton>
          </motion.div>

          {/* Title */}
          <motion.div
            {...child(0.06)}
            style={{ alignItems: "center", display: "flex", gap: 8 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/globe.png"
              alt=""
              style={{
                borderRadius: 4,
                flexShrink: 0,
                height: 28,
                objectFit: "cover",
                width: 28,
              }}
            />
            <span
              style={{
                color: "#FFFFFF",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 22,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Zoun
            </span>
          </motion.div>

          {/* Tags */}
          <motion.div
            {...child(0.12)}
            style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 6 }}
          >
            {TAGS.map((tag) => (
              <ProjectTag key={tag} label={tag} variant="dark" />
            ))}
          </motion.div>

          {/* Description */}
          <motion.div {...child(0.18)}>
            <p
              style={{
                color: "#FFFFFFCC",
                fontFamily: '"Geist-Regular", "Geist", system-ui, sans-serif',
                fontSize: 14,
                lineHeight: "21px",
                margin: 0,
              }}
            >
              {DESCRIPTION}
            </p>
          </motion.div>

          {/* 2-column screenshot grid */}
          <motion.div
            {...child(0.26)}
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            {SCREENSHOTS.map((s) => (
              <div
                key={s.src}
                style={{ borderRadius: 12, overflow: "hidden" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  style={{ display: "block", height: "auto", objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </>,
      document.body
    );
  }

  // ── Desktop: centered floating card ──────────────────────────────────────
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
          animate={
            isClosing
              ? { opacity: 0, scale: 0.94, y: 14 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={spring}
          onAnimationComplete={() => {
            if (isClosing) onClose();
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            alignItems: "start",
            backdropFilter: "blur(3px) hue-rotate(180deg)",
            WebkitBackdropFilter: "blur(3px) hue-rotate(180deg)",
            backgroundImage:
              "linear-gradient(in oklab 122.24deg, oklab(20.9% 0.0005 -0.002) 7.63%, oklab(45.5% 0 -0.0001 / 60%) 102.21%)",
            backgroundOrigin: "border-box",
            border: "1px solid #FFFFFF4A",
            borderRadius: 24,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            fontSynthesis: "none",
            gap: 16,
            MozOsxFontSmoothing: "grayscale",
            outline: "1px solid #565656",
            paddingBlock: 16,
            paddingInline: 16,
            pointerEvents: "auto",
            WebkitFontSmoothing: "antialiased",
            width: "fit-content",
          }}
        >
          {/* Header row: icon + title on left, tags on right */}
          <motion.div
            {...child(0.08)}
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              minWidth: "100%",
              paddingInline: 12,
              width: 0,
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/globe.png"
                alt=""
                style={{ borderRadius: 4, flexShrink: 0, height: 24, objectFit: "cover", width: 24 }}
              />
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                Zoun
              </span>
            </div>

            <div style={{ alignItems: "center", display: "flex", gap: 6 }}>
              {TAGS.map((tag) => (
                <ProjectTag key={tag} label={tag} variant="dark" />
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div {...child(0.16)} style={{ minWidth: "100%", paddingInline: 12, width: 0 }}>
            <p
              style={{
                color: "#FFFFFFCC",
                fontFamily: '"Geist-Regular", "Geist", system-ui, sans-serif',
                fontSize: 14,
                lineHeight: "21px",
                margin: 0,
                maxWidth: "60%",
              }}
            >
              {DESCRIPTION}
            </p>
          </motion.div>

          {/* Screenshots row */}
          <div style={{ display: "flex", gap: 16 }}>
            {SCREENSHOTS.map((s, i) => (
              <motion.div
                key={s.src}
                {...child(0.26 + i * 0.1)}
                style={{ borderRadius: 8, flexShrink: 0, height: 770, overflow: "hidden", width: 356 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  style={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
