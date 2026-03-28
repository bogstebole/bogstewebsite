"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { UselessNotesDetail } from "@/components/ui/useless-notes-detail";

interface SelectedProjectsSectionProps {
  /** blurAnim object from V2Canvas — passed straight to motion.div */
  animate: MotionProps["animate"];
  /** blurTransition from V2Canvas */
  transition: MotionProps["transition"];
  /** Called when Notes card starts expanding */
  onNotesExpand?: () => void;
  /** Called the moment Notes close sequence begins (un-blur immediately) */
  onNotesCloseStart?: () => void;
  /** Called after Notes card has fully returned to mini state */
  onNotesClose?: () => void;
  /** Called when Vorli hero card is clicked */
  onVorliClick?: () => void;
}

// 5-layer depth shadow matching Figma spec
const CARD_SHADOW = [
  "0px 5px 11px 0px rgba(0,0,0,0.10)",
  "0px 21px 21px 0px rgba(0,0,0,0.09)",
  "0px 47px 28px 0px rgba(0,0,0,0.05)",
  "0px 83px 33px 0px rgba(0,0,0,0.01)",
  "0px 130px 36px 0px rgba(0,0,0,0)",
].join(", ");

const CARD_STYLE: React.CSSProperties = {
  width: 160,
  height: 220,
  borderRadius: 30,
  background: "linear-gradient(to bottom, #ffffff, #f4f4f4)",
  border: "2.948px solid white",
  boxShadow: CARD_SHADOW,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
};

const CARD_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const BADGE_CONTAINER_VARIANTS = {
  visible: { transition: { staggerChildren: 0.07 } },
  hidden: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05 } },
};

const BADGE_ITEM_VARIANTS = {
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
  hidden: { opacity: 0, y: 6 },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

function Tag({ label, layoutId }: { label: string; layoutId?: string }) {
  return (
    <motion.div
      layoutId={layoutId}
      style={{
        backgroundColor: "#f3f3f3",
        borderRadius: 4,
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: "-0.04em",
          color: "#888",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function SelectedProjectsSection({
  animate,
  transition,
  onNotesExpand,
  onNotesCloseStart,
  onNotesClose,
  onVorliClick,
}: SelectedProjectsSectionProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const contentControls = useAnimation();
  const badgeControls = useAnimation();
  const miniTagControls = useAnimation();
  const closingRef = useRef(false);
  const returningRef = useRef(false);

  const handleExpand = useCallback(async () => {
    if (isNotesExpanded || closingRef.current) return;
    setIsNotesExpanded(true);
    onNotesExpand?.();
    await miniTagControls.start("exit");
  }, [isNotesExpanded, miniTagControls, onNotesExpand]);

  const handleClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    onNotesCloseStart?.();
    await Promise.all([
      contentControls.start("exit"),
      badgeControls.start("exit"),
    ]);
    // Mark returning so mini card's onLayoutAnimationComplete staggers badges back in
    returningRef.current = true;
    setIsNotesExpanded(false);
    onNotesClose?.();
    closingRef.current = false;
  }, [contentControls, badgeControls, onNotesCloseStart, onNotesClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNotesExpanded) void handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, isNotesExpanded]);

  return (
    <LayoutGroup id="selected-projects">
      <motion.div
        animate={isNotesExpanded
          ? { scale: 1, filter: "blur(0px)", pointerEvents: "auto" as const }
          : animate}
        transition={isNotesExpanded ? { duration: 0 } : transition}
        style={{
          marginTop: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "50% 50%",
          flexShrink: 0,
        }}
      >
        {/* ── Notes card — always mounted, invisible when expanded (stable FLIP target) ── */}
        <motion.div
          layoutId="notes-card"
          // Rotation never changes — keeping it stable prevents FLIP from capturing
          // a mid-animation state. The expanded card handles rotate 5→0 via FLIP.
          animate={{ rotate: 5, opacity: isNotesExpanded ? 0 : 1 }}
          transition={{ opacity: { duration: 0.15 } }}
          onLayoutAnimationComplete={() => {
            if (returningRef.current) {
              returningRef.current = false;
              void miniTagControls.start("visible");
            }
          }}
          style={{
            ...CARD_STYLE,
            marginRight: -21,
            zIndex: 3,
            cursor: isNotesExpanded ? "default" : "pointer",
            pointerEvents: isNotesExpanded ? "none" : "auto",
          }}
          onClick={!isNotesExpanded ? () => void handleExpand() : undefined}
        >
          {/* Icon + title — no layout="position" needed; mini card is invisible during FLIP */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/notes.png"
              alt="Useless Notes"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 8,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 16.8,
                letterSpacing: "-0.04em",
                color: "#434343",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
              }}
            >
              Notes
            </span>
          </div>
          {/* Tags — stagger out before FLIP, stagger in after return FLIP */}
          <motion.div
            animate={miniTagControls}
            initial="visible"
            variants={BADGE_CONTAINER_VARIANTS}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <motion.div variants={BADGE_ITEM_VARIANTS}><Tag label="iOS" /></motion.div>
            <motion.div variants={BADGE_ITEM_VARIANTS}><Tag label="Canvas" /></motion.div>
            <motion.div variants={BADGE_ITEM_VARIANTS}><AppStoreBadge active={false} /></motion.div>
          </motion.div>
        </motion.div>

        {/* ── Vorli card ── */}
        <div
          style={{
            ...CARD_STYLE,
            rotate: "-5deg",
            zIndex: 2,
            cursor: onVorliClick ? "pointer" : "default",
          }}
          onClick={onVorliClick}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/receipt.png"
              alt="Vorli"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 8,
                flexShrink: 0,
                rotate: "359.41deg",
                transformOrigin: "50% 50%",
              }}
            />
            <span
              style={{
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 16.8,
                letterSpacing: "-0.04em",
                color: "#434343",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
              }}
            >
              Vorli
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              width: "100%",
            }}
          >
            <Tag label="iOS" />
            <Tag label="AI Financial Assistant" />
          </div>
        </div>
      </motion.div>

      {/* ── Backdrop — blurs everything behind ── */}
      <AnimatePresence>
        {isNotesExpanded && (
          <motion.div
            key="notes-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => void handleClose()}
            style={{
              position: "fixed",
              inset: 0,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 50,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Expanded card — shares layoutId with the mini card ── */}
      <AnimatePresence>
        {isNotesExpanded && (
          <motion.div
            key="notes-expanded"
            layoutId="notes-card"
            animate={{ rotate: 0 }}
            transition={CARD_SPRING}
            onLayoutAnimationComplete={() => {
              if (!closingRef.current) {
                void badgeControls.start("visible");
                void contentControls.start("visible");
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              ...CARD_STYLE,
              // Override mini-card dimensions and alignment
              width: 600,
              height: "auto",
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
              alignItems: "flex-start",
              // Centered fixed position — marginLeft offsets exactly half of width
              position: "fixed",
              top: "10vh",
              left: "50%",
              marginLeft: -300,
              zIndex: 51,
              padding: 24,
              gap: 16,
              cursor: "default",
            }}
          >
            {/* Close button — fades in after card settles */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              onClick={() => void handleClose()}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 28,
                height: 28,
                borderRadius: 14,
                background: "rgba(0,0,0,0.06)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "#666",
                flexShrink: 0,
              }}
            >
              ✕
            </motion.button>

            {/* Card shell: icon + title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/notes.png"
                alt="Useless Notes"
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 22,
                  letterSpacing: "-0.04em",
                  color: "#434343",
                  lineHeight: 1.2,
                }}
              >
                Notes
              </span>
            </div>

            {/* Tags row — stagger in after FLIP, stagger out on close */}
            <motion.div
              animate={badgeControls}
              initial="hidden"
              variants={BADGE_CONTAINER_VARIANTS}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <motion.div variants={BADGE_ITEM_VARIANTS}><Tag label="iOS" /></motion.div>
              <motion.div variants={BADGE_ITEM_VARIANTS}><Tag label="Canvas" /></motion.div>
              <motion.div variants={BADGE_ITEM_VARIANTS}><AppStoreBadge active={false} /></motion.div>
            </motion.div>

            {/* Detail content — fades in after card settles via contentControls */}
            <UselessNotesDetail controls={contentControls} />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
