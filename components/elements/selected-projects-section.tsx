"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "framer-motion";
import { useRippleWave } from "@/useRippleWave";
import type { MotionProps } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { UselessNotesDetail } from "@/components/ui/useless-notes-detail";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";
import {
  ProjectCard,
  CARD_STYLE,
  CARD_SPRING,
  BADGE_CONTAINER_VARIANTS,
  BADGE_ITEM_VARIANTS,
} from "@/components/ui/project-card";

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

  const RIPPLE_CONFIG = { speed: 270, ringWidth: 42, duration: 1000, textStrength: 7, imageStrength: 5 };
  const notesRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;
  const vorliRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;

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
          width: "100%",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "50% 50%",
          flexShrink: 0,
          background: "#F0F0F0",
          padding: 64,
          borderRadius: 24,
        }}
      >
        {/* ── Notes card — always mounted, invisible when expanded (stable FLIP target) ── */}
        <ProjectCard
          image="/images/notes.png"
          alt="Useless Notes"
          title="Notes"
          tags={["iOS", "Canvas"]}
          extraBadge={<AppStoreBadge active={false} />}
          layoutId="notes-card"
          cardRef={notesRippleRef}
          // Rotation never changes — keeping it stable prevents FLIP from capturing
          // a mid-animation state. The expanded card handles rotate 5→0 via FLIP.
          animate={isNotesExpanded ? { opacity: 0, y: 0 } : { opacity: 1 }}
          whileHover={isNotesExpanded ? undefined : { y: -16 }}
          transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
          onLayoutAnimationComplete={() => {
            if (returningRef.current) {
              returningRef.current = false;
              void miniTagControls.start("visible");
            }
          }}
          marginRight={-21}
          zIndex={3}
          cursor={isNotesExpanded ? "default" : "pointer"}
          pointerEvents={isNotesExpanded ? "none" : "auto"}
          onClick={!isNotesExpanded ? () => void handleExpand() : undefined}
          tagControls={miniTagControls}
          tagInitial="visible"
        />

        {/* ── Vorli card ── */}
        <ProjectCard
          image="/images/receipt.png"
          alt="Vorli"
          title="Vorli"
          tags={["iOS", "AI Financial Assistant"]}
          cardRef={vorliRippleRef}
          rotate={-5}
          zIndex={2}
          onClick={onVorliClick}
          imageStyle={{ rotate: "359.41deg", transformOrigin: "50% 50%" }}
        />

        {/* ── Sticky card ── */}
        <ProjectCard
          image="/images/sticky.png"
          alt="Sticky"
          title="Sticky"
          tags={["iOS", "Productivity", "To Do App"]}
          rotate={5}
          marginLeft={-21}
          zIndex={1}
        />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              style={{ position: "absolute", top: 16, right: 16 }}
            >
              <GlassButton size="s" onClick={() => void handleClose()} aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </GlassButton>
            </motion.div>

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
              {["iOS", "Canvas"].map((label) => (
                <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                  <ProjectTag label={label} variant="glass" />
                </motion.div>
              ))}
              <motion.div variants={BADGE_ITEM_VARIANTS}>
                <AppStoreBadge active={false} />
              </motion.div>
            </motion.div>

            {/* Detail content — fades in after card settles via contentControls */}
            <UselessNotesDetail controls={contentControls} />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
