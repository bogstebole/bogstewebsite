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
import { StickyNotesIcon } from "@/components/ui/sticky-notes-icon";

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

const USELESS_NOTES_ASSETS = [
  { type: "video" as const, src: "/assets/Useless Notes/Onboarding.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/Da bomb.MP4" },
  { type: "video" as const, src: "/assets/Useless Notes/Sharing.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/card burn.MP4" },
  { type: "image" as const, src: "/assets/Useless Notes/1Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/2Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/3Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/4Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/5Uslsnts.png" },
];

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
  
  const headerRef = useRef<HTMLDivElement>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  useEffect(() => {
    if (!isNotesExpanded) {
      setShowStickyHeader(false);
      return;
    }
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNotesExpanded]);

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
          borderRadius: 40,
        }}
      >
        {/* ── Notes card ── */}
        <ProjectCard
          image="/images/notes.png"
          alt="Useless Notes"
          title="Notes"
          tags={["iOS", "Canvas"]}
          extraBadge={<AppStoreBadge active={false} />}
          layoutId="notes-card"
          cardRef={notesRippleRef}
          // The mini card stays structurally mounted, passing its layoutId to the bottom-sheet
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
          imageNode={<StickyNotesIcon />}
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

      {/* ── Expanded card — Bottom Sheet Anchored ── */}
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
              // Explicit Paper layout
              alignItems: 'center',
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #EEEEEE 100%)', // simplified safe hex gradient
              backgroundOrigin: 'border-box',
              borderColor: '#FFFFFF',
              borderStyle: 'solid',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              borderWidth: '4px',
              boxShadow: '#00000003 0px 400px 165px, #0000000D 0px 105px 140px, #0000001A 0px 105px 105px, #0000001A 0px 25px 55px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '48px',
              paddingTop: 48,
              paddingInline: 16,
              
              // Structural positioning (Bottom Sheet, 70% height)
              position: "fixed",
              bottom: 0,
              left: "50%",
              marginLeft: -438.5,
              width: 877,
              height: "95vh",
              overflowY: "auto",
              overflowX: "hidden",
              zIndex: 51,
              cursor: "default",
            }}
          >
            {/* ── Sticky floating header ── */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{
                opacity: showStickyHeader && !closingRef.current ? 1 : 0,
                y: showStickyHeader && !closingRef.current ? 0 : -12,
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
                pointerEvents: showStickyHeader && !closingRef.current ? "auto" : "none",
                position: "fixed",
                top: "calc(5vh + 16px)",
                left: "50%",
                marginLeft: -422.5, // half of 845 (16px inset from both sides)
                width: 845, // 877 - 32
                zIndex: 52,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src="/images/notes.png"
                  alt="Notes Icon"
                  style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: 4, transform: 'rotate(-17.2deg)' }}
                />
                <span style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "16px", letterSpacing: "-0.01em", lineHeight: "1" }}>
                  Notes
                </span>
              </div>
              <GlassButton size="s" onClick={() => void handleClose()} aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </GlassButton>
            </motion.div>

            {/* Close button — absolute positioned */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              style={{ position: "absolute", top: 24, right: 24 }}
            >
              <GlassButton size="s" onClick={() => void handleClose()} aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </GlassButton>
            </motion.div>

            {/* Header section (Icon, Title, Tags) - exactly mimicking mini-card visual column */}
            <div ref={headerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '480px', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                
                {/* Icon & Title */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <img
                    src="/images/notes.png"
                    alt="Notes Icon"
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 8, flexShrink: 0, transform: 'rotate(-17.2deg)' }}
                  />
                  <div style={{ color: '#111111', fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: '20px', letterSpacing: '-0.01em', lineHeight: '1' }}>
                    Notes
                  </div>
                </div>

                {/* Animated Tags replacing the raw Paper tags to maintain orchestration */}
                <motion.div
                  animate={badgeControls}
                  initial="hidden"
                  variants={BADGE_CONTAINER_VARIANTS}
                  style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center" }}
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
              </div>

              {/* Staggered Lower Details (Description, Button, Grid) */}
              <motion.div
                animate={contentControls}
                initial="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                  hidden: { transition: { staggerChildren: 0.05 } },
                  exit: { transition: { staggerChildren: 0.05 } }
                }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}
              >
                {/* Description */}
                <motion.div
                  variants={{
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                    hidden: { opacity: 0, y: 15 },
                    exit: { opacity: 0, y: 10, transition: { duration: 0.15 } }
                  }}
                  style={{ color: '#000000CC', fontFamily: '"Geist", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textAlign: 'center', whiteSpace: 'pre-wrap', width: '100%' }}
                >
                  It's a conceptual work that visually shows how we clutter our mental space.
                  <br />The main "canvas" gets more "useless" over time, totally packed with notes and links, and the "find" mode is kind of the opposite, showing how we can only find things when we really need them. It's a reflection on the whole concept of how we deal with information overload today.
                </motion.div>

                {/* Styled Download Button from Paper */}
                <motion.div
                  variants={{
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                    hidden: { opacity: 0, y: 15 },
                    exit: { opacity: 0, y: 10, transition: { duration: 0.15 } }
                  }}
                  style={{
                    alignItems: 'center', backdropFilter: 'blur(1px)', borderRadius: '9999px',
                    boxShadow: '#FFFFFF -2px 2px 2px 1px inset, #00000069 -1px -3px 3px -2px inset, #000000D6 2px 1px 4px -4px inset, #FFFFFF 0px 0px 7px 4px inset, #00000040 0px -9px 14px 4px inset, #0000001A -2px -3px 5px 3px inset, #FFFFFF 0px 20px 8px -9px inset, #0000001A 0px 34px 10px -9px inset, #00000003 0px 27px 8px, #00000003 0px 17px 6px, #0000000D 0px 10px 6px, #0000001A 0px 4px 4px, #0000001A 0px 1px 3px',
                    display: 'flex', gap: '4px', height: '32px', justifyContent: 'center',
                    paddingBottom: '9px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '9px',
                    cursor: 'progress'
                  }}
                >
                  <span style={{ color: '#111111', fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: '14px', letterSpacing: '0.03em', lineHeight: '1' }}>
                    Download the app
                  </span>
                </motion.div>

              </motion.div>
            </div>

            {/* Staggered Grid Container */}
            <motion.div
              animate={contentControls}
              initial="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05 } },
                exit: { transition: { staggerChildren: 0.05 } }
              }}
              style={{ columns: 3, columnGap: 16, width: '100%', paddingBottom: 48, boxSizing: "border-box" }}
            >
              {USELESS_NOTES_ASSETS.map((asset, i) => (
                <motion.div
                  key={i}
                  variants={{
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } }
                  }}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 16,
                    borderRadius: 32,
                    overflow: "hidden",
                    backgroundColor: '#DDDDDD',
                  }}
                >
                  {asset.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={encodeURI(asset.src)}
                      alt={`Useless Notes screenshot ${i + 1}`}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  ) : (
                    <video
                      src={encodeURI(asset.src)}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
