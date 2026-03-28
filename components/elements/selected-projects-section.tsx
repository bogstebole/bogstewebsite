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

function Tag({ label }: { label: string }) {
  return (
    <div
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
    </div>
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
  const expandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);

  const handleExpand = useCallback(() => {
    if (isNotesExpanded || closingRef.current) return;
    setIsNotesExpanded(true);
    onNotesExpand?.();
    expandTimerRef.current = setTimeout(() => {
      void contentControls.start("visible");
    }, 450);
  }, [isNotesExpanded, onNotesExpand, contentControls]);

  const handleClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (expandTimerRef.current) {
      clearTimeout(expandTimerRef.current);
      expandTimerRef.current = null;
    }
    onNotesCloseStart?.();
    await contentControls.start("exit");
    setIsNotesExpanded(false);
    onNotesClose?.();
    closingRef.current = false;
  }, [contentControls, onNotesCloseStart, onNotesClose]);

  // Cancel timer on unmount
  useEffect(() => {
    return () => { if (expandTimerRef.current) clearTimeout(expandTimerRef.current); };
  }, []);

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
        {/* ── Notes card — only rendered when collapsed ── */}
        {!isNotesExpanded && (
          <motion.div
            layoutId="notes-card"
            animate={{ rotate: 5 }}
            transition={CARD_SPRING}
            style={{
              ...CARD_STYLE,
              marginRight: -21,
              zIndex: 3,
              cursor: "pointer",
            }}
            onClick={handleExpand}
          >
            {/* Icon + title — layout="position" prevents stretch during morph */}
            <motion.div
              layout="position"
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
                Notes
              </span>
            </motion.div>
            {/* Tags — layout="position" prevents stretch */}
            <motion.div
              layout="position"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Tag label="iOS" />
              <Tag label="Canvas" />
              <AppStoreBadge active={false} />
            </motion.div>
          </motion.div>
        )}

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

            {/* Card shell: icon + title — layout="position" prevents stretch */}
            <motion.div
              layout="position"
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
                  transformOrigin: "50% 50%",
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
                Useless Notes
              </span>
            </motion.div>

            {/* Tags row — layout="position" prevents stretch */}
            <motion.div
              layout="position"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Tag label="iOS" />
              <Tag label="Canvas" />
              <AppStoreBadge active />
            </motion.div>

            {/* Detail content — fades in after card settles via contentControls */}
            <UselessNotesDetail controls={contentControls} />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
