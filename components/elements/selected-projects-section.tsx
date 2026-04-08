"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useRippleWave } from "@/useRippleWave";
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
  /** Called when Notes card starts expanding */
  onNotesExpand?: () => void;
  /** Called the moment Notes close sequence begins (un-blur immediately) */
  onNotesCloseStart?: () => void;
  /** Called after Notes card has fully returned to mini state */
  onNotesClose?: () => void;
  /** Called when Vorli hero card is clicked */
  onVorliClick?: () => void;
  /** Called when Sticky card is clicked — receives the card's DOMRect as origin */
  onStickyClick?: (rect: DOMRect) => void;
  /** Whether the sticky overlay is currently open */
  isStickyOpen?: boolean;
}

// ── Mobile card deck ──────────────────────────────────────────────────────────

const DECK_CARDS = [
  { key: "notes",  image: "/images/notes.png",   title: "Notes",  tags: ["iOS", "Canvas"] },
  { key: "vorli",  image: "/images/receipt.png", title: "Vorli",  tags: ["iOS", "AI Financial"] },
  { key: "sticky", image: "/images/sticky.png",  title: "Sticky", tags: ["iOS", "Productivity"] },
] as const;

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY  = 400;

// Random-looking fan offsets for each stack position (pos 0 = front)
// Front card is always neutral; cards behind get organic spread
const FAN: Record<number, { x: number; y: number; rotate: number; scale: number }> = {
  0: { x: 0,   y: 0,   rotate: 0,    scale: 1 },
  1: { x: 10,  y: 6,   rotate: 6,    scale: 0.95 },
  2: { x: -6,  y: 10,  rotate: -9,   scale: 0.90 },
};

function stackTransform(pos: number) {
  const f = FAN[pos] ?? FAN[2];
  return { ...f, opacity: 1 };
}

interface MobileDeckProps {
  isNotesExpanded: boolean;
  isDesktop: boolean;
  onNotesClick: () => void;
  onVorliClick?: () => void;
  onStickyClick?: (rect: DOMRect) => void;
  isStickyOpen?: boolean;
  stickyIconRef: React.RefObject<HTMLDivElement | null>;
  notesRippleRef: React.RefObject<HTMLDivElement | null>;
  miniTagControls: ReturnType<typeof useAnimation>;
  returningRef: React.RefObject<boolean>;
}

function MobileDeck({
  isNotesExpanded,
  isDesktop,
  onNotesClick,
  onVorliClick,
  onStickyClick,
  isStickyOpen,
  stickyIconRef,
  notesRippleRef,
  miniTagControls,
  returningRef,
}: MobileDeckProps) {
  const [order, setOrder] = useState([0, 1, 2]);
  const [exitDir, setExitDir] = useState<number | null>(null);
  const animatingRef = useRef(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (animatingRef.current) return;
    const { offset, velocity } = info;
    if (Math.abs(offset.x) < SWIPE_THRESHOLD && Math.abs(velocity.x) < SWIPE_VELOCITY) return;

    animatingRef.current = true;
    setExitDir(offset.x > 0 ? 1 : -1);

    setTimeout(() => {
      setOrder(prev => [...prev.slice(1), prev[0]]);
      setExitDir(null);
      animatingRef.current = false;
    }, 200);
  };

  // Render back-to-front so front card sits on top
  const reversed = [...order].reverse();

  return (
    <div
      style={{
        position: "relative",
        // 160px card + 24px max stack offset; 220px card + 24px stack offset
        width: 184,
        height: 244,
        margin: "0 auto",
      }}
    >
      {reversed.map((cardIdx) => {
        const stackPos = order.indexOf(cardIdx);
        const isFront = stackPos === 0;
        const card = DECK_CARDS[cardIdx];
        const isNotesCard = card.key === "notes";
        const isStickyCard = card.key === "sticky";

        const animateTarget =
          isFront && exitDir !== null
            ? { x: exitDir * 280, y: stackPos * 6, scale: 0.9, rotate: exitDir * 10, opacity: 0 }
            : stackTransform(stackPos);

        const handleClick = () => {
          if (!isFront || exitDir !== null) return;
          if (isNotesCard) { onNotesClick(); return; }
          if (card.key === "vorli") { onVorliClick?.(); return; }
          if (isStickyCard) {
            const el = stickyIconRef.current;
            if (el) onStickyClick?.(el.getBoundingClientRect());
          }
        };

        return (
          <motion.div
            key={cardIdx}
            ref={isNotesCard ? notesRippleRef : undefined}
            layoutId={isNotesCard && isDesktop ? "notes-card" : undefined}
            animate={animateTarget}
            transition={
              isFront && exitDir !== null
                ? { type: "tween", duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }
                : { type: "spring", stiffness: 340, damping: 28 }
            }
            drag={isFront && !isNotesExpanded && exitDir === null ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={isFront ? handleDragEnd : undefined}
            onLayoutAnimationComplete={
              isNotesCard
                ? () => {
                    if (returningRef.current) {
                      returningRef.current = false;
                      void miniTagControls.start("visible");
                    }
                  }
                : undefined
            }
            onClick={handleClick}
            style={{
              ...CARD_STYLE,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: order.length - stackPos,
              cursor: isFront && !isNotesExpanded ? (isNotesCard ? "pointer" : "grab") : "default",
              pointerEvents: isFront ? "auto" : "none",
              overflow: isNotesCard && isNotesExpanded ? "visible" : "hidden",
              // On desktop the FLIP source must disappear; on mobile the sheet slides over the deck
              visibility: isNotesCard && isNotesExpanded && isDesktop ? "hidden" : "visible",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            whileDrag={isFront && !isNotesCard ? { cursor: "grabbing" } : undefined}
          >
            {/* Icon area */}
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
              {isStickyCard ? (
                <div ref={stickyIconRef}>
                  <StickyNotesIcon opacity={isStickyOpen ? 0 : 1} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                />
              )}
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
                {card.title}
              </span>
            </div>

            {/* Tags */}
            {isNotesCard ? (
              <motion.div
                animate={miniTagControls}
                initial="visible"
                variants={BADGE_CONTAINER_VARIANTS}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center", width: "100%" }}
              >
                {card.tags.map((label) => (
                  <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                    <ProjectTag label={label} variant="glass" />
                  </motion.div>
                ))}
                <motion.div variants={BADGE_ITEM_VARIANTS}>
                  <AppStoreBadge active={false} />
                </motion.div>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", width: "100%" }}>
                {card.tags.map((label) => (
                  <ProjectTag key={label} label={label} variant="glass" />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Useless Notes assets ───────────────────────────────────────────────────────

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
  onNotesExpand,
  onNotesCloseStart,
  onNotesClose,
  onVorliClick,
  onStickyClick,
  isStickyOpen,
}: SelectedProjectsSectionProps) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const stickyCardRef = useRef<HTMLDivElement>(null);
  const stickyIconRef = useRef<HTMLDivElement>(null);
  const contentControls = useAnimation();
  const gridControls = useAnimation();
  const badgeControls = useAnimation();
  const miniTagControls = useAnimation();
  const closingRef = useRef(false);
  const expandingRef = useRef(false);
  const [isNotesClosing, setIsNotesClosing] = useState(false);
  const returningRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Ensure mini-card tags start visible (animation controls don't auto-propagate initial variant)
  useEffect(() => { void miniTagControls.start("visible"); }, [miniTagControls]);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  // Only start observing after the sheet has fully animated in
  const [isSheetReady, setIsSheetReady] = useState(false);

  useEffect(() => {
    if (!isNotesExpanded || !isSheetReady) {
      setShowStickyHeader(false);
      return;
    }
    const el = badgesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNotesExpanded, isSheetReady]);

  const RIPPLE_CONFIG = { speed: 270, ringWidth: 42, duration: 1000, textStrength: 7, imageStrength: 5 };
  const notesRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;
  const vorliRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;

  const handleExpand = useCallback(async () => {
    if (isNotesExpanded || closingRef.current || expandingRef.current) return;
    expandingRef.current = true;
    setIsNotesExpanded(true);
    onNotesExpand?.();
    await miniTagControls.start("exit");
    expandingRef.current = false;
  }, [isNotesExpanded, miniTagControls, onNotesExpand]);

  const handleClose = useCallback(async () => {
    if (closingRef.current || expandingRef.current) return;
    closingRef.current = true;
    setIsNotesClosing(true);
    onNotesCloseStart?.();
    await Promise.all([
      contentControls.start("exit"),
      gridControls.start("exit"),
      badgeControls.start("exit"),
    ]);
    if (isDesktop) {
      // On desktop: FLIP animates the card back; onLayoutAnimationComplete staggers badges in
      returningRef.current = true;
    } else {
      // On mobile: no FLIP, no layoutId — restore badges directly
      void miniTagControls.start("visible");
    }
    setIsNotesExpanded(false);
    onNotesClose?.();
    setIsSheetReady(false);
    closingRef.current = false;
    setIsNotesClosing(false);
  }, [contentControls, gridControls, badgeControls, onNotesCloseStart, onNotesClose, isDesktop, miniTagControls]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isNotesExpanded) void handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, isNotesExpanded]);

  return (
    <LayoutGroup id="selected-projects">
      <div
        style={{
          marginTop: 60,
          width: "100%",
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "#F0F0F0",
          padding: isMobile ? 40 : 64,
          borderRadius: 40,
          ...(isMobile && { marginLeft: 16, marginRight: 16, width: "calc(100% - 32px)", boxSizing: "border-box" }),
        }}
      >
        {isMobile ? (
          /* ── Mobile: swipeable card deck ── */
          <MobileDeck
            isNotesExpanded={isNotesExpanded}
            isDesktop={isDesktop}
            onNotesClick={() => void handleExpand()}
            onVorliClick={onVorliClick}
            onStickyClick={onStickyClick}
            isStickyOpen={isStickyOpen}
            stickyIconRef={stickyIconRef}
            notesRippleRef={notesRippleRef}
            miniTagControls={miniTagControls}
            returningRef={returningRef}
          />
        ) : (
          /* ── Desktop: three fanned cards side by side ── */
          <>
            {/* ── Notes card ── */}
            <ProjectCard
              image="/images/notes.png"
              alt="Useless Notes"
              title="Notes"
              tags={["iOS", "Canvas"]}
              extraBadge={<AppStoreBadge active={false} />}
              layoutId="notes-card"
              cardRef={notesRippleRef}
              overflow={isNotesExpanded ? "visible" : undefined}
              visibility={isNotesExpanded ? "hidden" : undefined}
              animate={isNotesExpanded ? undefined : { opacity: 1 }}
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
              imageNode={
                <div ref={stickyIconRef}>
                  <StickyNotesIcon opacity={isStickyOpen ? 0 : 1} />
                </div>
              }
              overflow="visible"
              cardRef={stickyCardRef}
              cursor="pointer"
              onClick={() => {
                const el = stickyIconRef.current;
                if (el) onStickyClick?.(el.getBoundingClientRect());
              }}
            />
          </>
        )}
      </div>

      {/* ── Backdrop + Expanded sheet — portalled to body to escape filter stacking context ── */}
      {mounted && createPortal(
        <>
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
            layoutId={isDesktop ? "notes-card" : undefined}
            layoutScroll={isDesktop}
            animate={{ y: 0, rotate: 0 }}
            initial={isDesktop ? undefined : { y: "100%" }}
            exit={isDesktop ? undefined : { y: "100%" }}
            transition={{
              layout: CARD_SPRING,
              y: { type: "spring", stiffness: 340, damping: 34 },
              rotate: { type: "spring", stiffness: 400, damping: 30 },
            }}
            onAnimationComplete={() => {
              if (!closingRef.current) {
                setIsSheetReady(true);
                void badgeControls.start("visible");
                void contentControls.start("visible");
                setTimeout(() => {
                  if (!closingRef.current) void gridControls.start("visible");
                }, 350);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              // Explicit Paper layout
              alignItems: 'center',
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #EEEEEE 100%)',
              backgroundOrigin: 'padding-box',
              borderTopLeftRadius: isMobile ? 0 : '40px',
              borderTopRightRadius: isMobile ? 0 : '40px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: 'inset 0 0 0 4px #FFFFFF, #00000003 0px 400px 165px, #0000000D 0px 105px 140px, #0000001A 0px 105px 105px, #0000001A 0px 25px 55px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '24px' : '48px',
              paddingTop: isMobile ? 'calc(48px + env(safe-area-inset-top))' : 48,
              paddingBottom: isMobile ? 'calc(32px + env(safe-area-inset-bottom))' : 32,
              paddingInline: 16,

              // Structural positioning (Bottom Sheet, 70% height)
              position: "fixed",
              bottom: 0,
              left: isMobile ? 0 : "50%",
              marginLeft: isMobile ? 0 : -438.5,
              width: isMobile ? "100%" : 877,
              height: isMobile ? "100dvh" : "95vh",
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
                opacity: showStickyHeader && !isNotesClosing ? 1 : 0,
                y: showStickyHeader && !isNotesClosing ? 0 : -12,
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
                pointerEvents: showStickyHeader && !isNotesClosing ? "auto" : "none",
                position: "fixed",
                top: "calc(5vh + 16px)",
                left: isMobile ? 16 : "50%",
                marginLeft: isMobile ? 0 : -422.5,
                width: isMobile ? "calc(100% - 32px)" : 845,
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
              style={{ position: "absolute", top: isMobile ? "calc(env(safe-area-inset-top) + 16px)" : 24, right: 24 }}
            >
              <GlassButton size="s" onClick={() => void handleClose()} aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </GlassButton>
            </motion.div>

            {/* Header section (Icon, Title, Tags) - exactly mimicking mini-card visual column */}
            <div ref={headerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: isMobile ? '100%' : '480px' }}>
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
                  ref={badgesRef}
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
              animate={gridControls}
              initial="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: { transition: { staggerChildren: 0.05 } },
                exit: { transition: { staggerChildren: 0.05 } }
              }}
              style={{ columns: isMobile ? 1 : 3, columnGap: 16, width: '100%', paddingBottom: 48, boxSizing: "border-box" }}
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
        </>,
        document.body
      )}
    </LayoutGroup>
  );
}
