"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { UselessNotesDetail } from "./useless-notes-detail";

interface ProjectFloatingCardProps {
  projectKey: string;
  /** Bounding rect of the list entry at click time */
  originRect: DOMRect;
  /** Called when all content has faded out — lets parent un-blur + show list item */
  onCloseStart: () => void;
  onClose: () => void;
  primaryColor: string;
  primary40: string;
}

const PROJECT_LABELS: Record<string, string> = {
  uselessNotes: "Notes",
  fynn: "Fynn.io",
  contentSnare: "Content Snare",
  vorli: "Vorli",
  timezoneGlobe: "Timezone Globe",
  weatherWear: "Weather Wear",
  svgParticles: "SVG Particles",
  pauschalTracker: "Pauschal Tracker",
};

const PROJECT_ICONS: Record<string, { src: string; rotate?: string }> = {
  uselessNotes: { src: "/images/notes.png", rotate: "342.8deg" },
  fynn: { src: "/images/fynn.png", rotate: "13.1deg" },
  contentSnare: { src: "/images/content-snare.png", rotate: "3.34deg" },
  vorli: { src: "/images/receipt.png", rotate: "359.41deg" },
  timezoneGlobe: { src: "/images/globe.png" },
  weatherWear: { src: "/images/puffer.png" },
  pauschalTracker: { src: "/images/pauschal-tracker.png", rotate: "7.68deg" },
};

const PROJECT_TAGS: Record<string, { tags: string[]; appStore?: boolean }> = {
  uselessNotes: { tags: ["iOS", "Canvas"], appStore: true },
  fynn: { tags: ["Web", "HealthTech", "B2B"] },
  contentSnare: { tags: ["Web", "Productivity", "B2B, B2C"] },
  vorli: { tags: ["iOS", "AI Financial Assistant", "Personal Usage"] },
  timezoneGlobe: { tags: ["iOS", "Time Zone Tracker"] },
  weatherWear: { tags: ["iOS", "Weather Through Clothes"] },
  svgParticles: { tags: ["Web", "Canvas, Loader Tool", "Personal Usage"] },
  pauschalTracker: { tags: ["Web", "Earning limit tracker", "Personal Usage"] },
};

/* ── Detail card target position ── */
const CARD_WIDTH = 600;
const CARD_PADDING = 16;
const CARD_TOP_VH = 8;

// ── DEBUG: all timings slowed to ~5 s so the sequence is visible ──
const spring = { type: "tween" as const, duration: 5 };
const EXIT_DURATION = 2;

// Framer Motion variants for staged exit — no CSS transitions
// Header exits last (after tags), card shell exits after everything
const headerVariants: Variants = {
  exit: { opacity: 0, y: -8, transition: { duration: EXIT_DURATION, delay: 0.8 } },
};

const tagsVariants: Variants = {
  exit: { opacity: 0, y: -8, transition: { duration: EXIT_DURATION, delay: 0.4 } },
};

export function ProjectFloatingCard({
  projectKey,
  originRect,
  onCloseStart,
  onClose,
  primaryColor,
  primary40,
}: ProjectFloatingCardProps) {
  const contentControls = useAnimation();
  // Single ref — re-entrancy guard only (not driving any animation state)
  const closingRef = useRef(false);

  const label = PROJECT_LABELS[projectKey] ?? projectKey;
  const iconInfo = PROJECT_ICONS[projectKey];
  const tagInfo = PROJECT_TAGS[projectKey];
  const tagBg = "#F3F3F3";

  const targetLeft = (typeof window !== "undefined" ? window.innerWidth : 1440) / 2 - CARD_WIDTH / 2;
  const targetTop = (typeof window !== "undefined" ? window.innerHeight : 900) * (CARD_TOP_VH / 100);

  // Fires when card finishes expanding to its target position
  const handleExpandComplete = useCallback(() => {
    if (closingRef.current) return; // close triggered before expand finished — don't show content
    void contentControls.start("visible");
  }, [contentControls]);

  // Close sequence: exit content → un-blur background → signal parent
  // Parent (AnimatePresence in V2Canvas) then removes this component, which
  // triggers the exit variants on header, tags, and card shell automatically
  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    await contentControls.start("exit");
    onCloseStart();
    onClose();
  }, [contentControls, onCloseStart, onClose]);

  /* ── ESC to close ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  return (
    <>
      {/* Backdrop — click-to-close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: EXIT_DURATION } }}
        transition={{ duration: EXIT_DURATION }}
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
        }}
      />

      {/* Card — FLIP from originRect to centered position */}
      <motion.div
        initial={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          opacity: 0,
        }}
        animate={{ top: targetTop, left: targetLeft, width: CARD_WIDTH, opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: EXIT_DURATION, delay: EXIT_DURATION * 0.6 } }}
        transition={spring}
        onAnimationComplete={handleExpandComplete}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingBlock: CARD_PADDING,
          paddingInline: CARD_PADDING,
          boxSizing: "border-box",
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 12,
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 11,
        }}
      >
        {/* layout="position" prevents children from distorting during FLIP */}
        <motion.div layout="position" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header: icon + title — exits via Framer Motion variant */}
          <motion.div variants={headerVariants}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingBlock: 8,
                flexShrink: 0,
              }}
            >
              {iconInfo && (
                <motion.div
                  initial={{ width: 12, height: 12 }}
                  animate={{ width: 24, height: 24 }}
                  transition={spring}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconInfo.src}
                    alt={label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      flexShrink: 0,
                      rotate: iconInfo.rotate,
                      transformOrigin: "50% 50%",
                    }}
                  />
                </motion.div>
              )}
              <motion.span
                initial={{ fontSize: 12 }}
                animate={{ fontSize: 20 }}
                transition={spring}
                style={{
                  color: primaryColor,
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </motion.span>
            </div>
          </motion.div>

          {/* Tags row — exits via Framer Motion variant */}
          {tagInfo && (
            <motion.div variants={tagsVariants}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                  flexShrink: 0,
                }}
              >
                {tagInfo.tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      alignItems: "center",
                      backgroundColor: tagBg,
                      borderRadius: 4,
                      display: "flex",
                      height: 18,
                      paddingBlock: 3,
                      paddingInline: 7,
                    }}
                  >
                    <span
                      style={{
                        color: primary40,
                        fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                        fontSize: 9.5,
                        letterSpacing: "0.03em",
                        lineHeight: "12px",
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
                {tagInfo.appStore && <AppStoreBadge active />}
              </div>
            </motion.div>
          )}

          {/* Project-specific inner content — controlled via useAnimation */}
          {projectKey === "uselessNotes" ? (
            <UselessNotesDetail controls={contentControls} />
          ) : (
            <motion.div
              initial="hidden"
              animate={contentControls}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 6 },
              }}
              style={{
                color: primary40,
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 12,
                paddingBlock: 8,
              }}
            >
              Coming soon...
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
