"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useRippleWave } from "@/useRippleWave";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { SelectedProjectLayout, GRID_ITEM_VARIANTS } from "@/components/ui/selected-project-layout";
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
  onStickyExpand?: () => void;
  onStickyCloseStart?: () => void;
  onStickyClose?: () => void;
  isStickyExpanded?: boolean;
}

// ── Mobile card deck ──────────────────────────────────────────────────────────

const DECK_CARDS = [
  { key: "notes", image: "/images/notes.png", title: "Notes", tags: ["iOS", "Canvas"] },
  { key: "vorli", image: "/images/receipt.png", title: "Vorli", tags: ["iOS", "AI Financial"] },
  { key: "sticky", image: "/images/sticky.png", title: "Sticky", tags: ["iOS", "Productivity"] },
] as const;

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 400;

// Random-looking fan offsets for each stack position (pos 0 = front)
// Front card is always neutral; cards behind get organic spread
const FAN: Record<number, { x: number; y: number; rotate: number; scale: number }> = {
  0: { x: 0, y: 0, rotate: 0, scale: 1 },
  1: { x: 10, y: 6, rotate: 6, scale: 0.95 },
  2: { x: -6, y: 10, rotate: -9, scale: 0.90 },
};

function stackTransform(pos: number) {
  const f = FAN[pos] ?? FAN[2];
  return { ...f, opacity: 1 };
}

interface MobileDeckProps {
  isNotesExpanded: boolean;
  isStickyExpanded: boolean;
  isVorliExpanded: boolean;
  isDesktop: boolean;
  onNotesClick: () => void;
  onVorliClick: () => void;
  onStickyClick: () => void;
  stickyIconRef: React.RefObject<HTMLDivElement | null>;
  notesRippleRef: React.RefObject<HTMLDivElement | null>;
  miniTagControls: ReturnType<typeof useAnimation>;
  stickyMiniTagControls: ReturnType<typeof useAnimation>;
  vorliMiniTagControls: ReturnType<typeof useAnimation>;
  returningRef: React.RefObject<boolean>;
  stickyReturningRef: React.RefObject<boolean>;
  vorliReturningRef: React.RefObject<boolean>;
}

function MobileDeck({
  isNotesExpanded,
  isStickyExpanded,
  isVorliExpanded,
  isDesktop,
  onNotesClick,
  onVorliClick,
  onStickyClick,
  stickyIconRef,
  notesRippleRef,
  miniTagControls,
  stickyMiniTagControls,
  vorliMiniTagControls,
  returningRef,
  stickyReturningRef,
  vorliReturningRef,
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
        const isVorliCard = card.key === "vorli";

        const animateTarget =
          isFront && exitDir !== null
            ? { x: exitDir * 280, y: stackPos * 6, scale: 0.9, rotate: exitDir * 10, opacity: 0 }
            : stackTransform(stackPos);

        const handleClick = () => {
          if (!isFront || exitDir !== null) return;
          if (isNotesCard) { onNotesClick(); return; }
          if (card.key === "vorli") { onVorliClick?.(); return; }
          if (isStickyCard) { onStickyClick(); return; }
        };

        return (
          <motion.div
            key={cardIdx}
            ref={isNotesCard ? notesRippleRef : undefined}
            layoutId={isDesktop ? (isNotesCard ? "notes-card" : isStickyCard ? "sticky-card" : isVorliCard ? "vorli-card" : undefined) : undefined}
            animate={animateTarget}
            transition={
              isFront && exitDir !== null
                ? { type: "tween", duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }
                : { type: "spring", stiffness: 340, damping: 28 }
            }
            drag={isFront && !isNotesExpanded && !isStickyExpanded && !isVorliExpanded && exitDir === null ? "x" : false}
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
                : isStickyCard
                  ? () => {
                    if (stickyReturningRef.current) {
                      stickyReturningRef.current = false;
                      void stickyMiniTagControls.start("visible");
                    }
                  }
                  : isVorliCard
                    ? () => {
                      if (vorliReturningRef.current) {
                        vorliReturningRef.current = false;
                        void vorliMiniTagControls.start("visible");
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
              cursor: isFront && !isNotesExpanded && !isStickyExpanded && !isVorliExpanded ? (isNotesCard || isStickyCard || isVorliCard ? "pointer" : "grab") : "default",
              pointerEvents: isFront ? "auto" : "none",
              overflow: (isNotesCard && isNotesExpanded) || (isStickyCard && isStickyExpanded) || (isVorliCard && isVorliExpanded) ? "visible" : "hidden",
              visibility: ((isNotesCard && isNotesExpanded) || (isStickyCard && isStickyExpanded) || (isVorliCard && isVorliExpanded)) && isDesktop ? "hidden" : "visible",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
            whileDrag={isFront && !isNotesCard && !isStickyCard && !isVorliCard ? { cursor: "grabbing" } : undefined}
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
                  <StickyNotesIcon opacity={isStickyExpanded ? 0 : 1} />
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
            ) : isStickyCard ? (
              <motion.div
                animate={stickyMiniTagControls}
                initial="visible"
                variants={BADGE_CONTAINER_VARIANTS}
                style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center", width: "100%" }}
              >
                {card.tags.map((label) => (
                  <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                    <ProjectTag label={label} variant="glass" />
                  </motion.div>
                ))}
              </motion.div>
            ) : isVorliCard ? (
              <motion.div
                animate={vorliMiniTagControls}
                initial="visible"
                variants={BADGE_CONTAINER_VARIANTS}
                style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center", width: "100%" }}
              >
                {card.tags.map((label) => (
                  <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                    <ProjectTag label={label} variant="glass" />
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Useless Notes assets ───────────────────────────────────────────────────────

const STICKY_ASSETS = [
  { src: "/assets/Sticky/Home screen.png", alt: "Sticky home screen" },
  { src: "/assets/Sticky/Add task.png", alt: "Add task" },
  { src: "/assets/Sticky/Expand.png", alt: "Expand view" },
  { src: "/assets/Sticky/Reorder.png", alt: "Reorder tasks" },
];

const STICKY_DESCRIPTION =
  "Most task apps organize your work into lists that feel like chores. Sticky treats your tasks as a living canvas — notes float, stack, and drift, making the act of planning feel more like thinking than filing. Built for people who want their tools to have personality.";

const VORLI_SCREENSHOTS = [
  { src: "/assets/Vorli/vorli 1.PNG", alt: "Vorli screenshot 1" },
  { src: "/assets/Vorli/vorli 2.PNG", alt: "Vorli screenshot 2" },
  { src: "/assets/Vorli/vorli 3.PNG", alt: "Vorli screenshot 3" },
  { src: "/assets/Vorli/vorli 4.PNG", alt: "Vorli screenshot 4" },
  { src: "/assets/Vorli/vorli 5.PNG", alt: "Vorli screenshot 5" },
];

const VORLI_DESCRIPTION =
  "Most financial apps share the same assumption: if you can see your data, you'll change your behavior. I built Vorli because that assumption never worked for me. Existing tools asked me to think about money the way they were designed — not the way I actually do. Vorli puts AI at the center: it auto-categorizes spending, scans receipts, and reads your financial picture so you can just ask what matters. Not 'show me a chart' — more like 'should I be worried about this month?'";

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
  onStickyExpand,
  onStickyCloseStart,
  onStickyClose,
  isStickyExpanded,
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

  // Sticky state local
  const [internalStickyExpanded, setInternalStickyExpanded] = useState(false);
  const stickyContentControls = useAnimation();
  const stickyGridControls = useAnimation();
  const stickyBadgeControls = useAnimation();
  const stickyMiniTagControls = useAnimation();
  const stickyClosingRef = useRef(false);
  const stickyExpandingRef = useRef(false);
  const [isStickyClosing, setIsStickyClosing] = useState(false);
  const stickyReturningRef = useRef(false);
  const stickyBadgesRef = useRef<HTMLDivElement>(null);
  const [showStickyFloatingHeader, setShowStickyFloatingHeader] = useState(false);
  const [isStickySheetReady, setIsStickySheetReady] = useState(false);

  // Vorli state
  const [isVorliExpanded, setIsVorliExpanded] = useState(false);
  const [isVorliClosing, setIsVorliClosing] = useState(false);
  const [isVorliSheetReady, setIsVorliSheetReady] = useState(false);
  const [showVorliFloatingHeader, setShowVorliFloatingHeader] = useState(false);
  const vorliContentControls = useAnimation();
  const vorliGridControls = useAnimation();
  const vorliBadgeControls = useAnimation();
  const vorliMiniTagControls = useAnimation();
  const vorliClosingRef = useRef(false);
  const vorliExpandingRef = useRef(false);
  const vorliReturningRef = useRef(false);
  const vorliBadgesRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  useEffect(() => { void miniTagControls.start("visible"); }, [miniTagControls]);
  useEffect(() => { void stickyMiniTagControls.start("visible"); }, [stickyMiniTagControls]);
  useEffect(() => { void vorliMiniTagControls.start("visible"); }, [vorliMiniTagControls]);


  const badgesRef = useRef<HTMLDivElement>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false); // Notes floating header
  const [isSheetReady, setIsSheetReady] = useState(false);

  useEffect(() => {
    if (!isNotesExpanded || !isSheetReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // Sticky header observer
  useEffect(() => {
    if (!internalStickyExpanded || !isStickySheetReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowStickyFloatingHeader(false);
      return;
    }
    const el = stickyBadgesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyFloatingHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [internalStickyExpanded, isStickySheetReady]);

  // Vorli header observer
  useEffect(() => {
    if (!isVorliExpanded || !isVorliSheetReady) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowVorliFloatingHeader(false);
      return;
    }
    const el = vorliBadgesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowVorliFloatingHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVorliExpanded, isVorliSheetReady]);

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

  // Vorli Expand/Close Handlers
  const handleVorliExpand = useCallback(async () => {
    if (isVorliExpanded || vorliClosingRef.current || vorliExpandingRef.current) return;
    vorliExpandingRef.current = true;
    setIsVorliExpanded(true);
    await vorliMiniTagControls.start("exit");
    vorliExpandingRef.current = false;
  }, [isVorliExpanded, vorliMiniTagControls]);

  const handleVorliClose = useCallback(async () => {
    if (vorliClosingRef.current || vorliExpandingRef.current) return;
    vorliClosingRef.current = true;
    setIsVorliClosing(true);
    await Promise.all([
      vorliContentControls.start("exit"),
      vorliGridControls.start("exit"),
      vorliBadgeControls.start("exit"),
    ]);
    if (isDesktop) {
      vorliReturningRef.current = true;
    } else {
      void vorliMiniTagControls.start("visible");
    }
    setIsVorliExpanded(false);
    setIsVorliSheetReady(false);
    vorliClosingRef.current = false;
    setIsVorliClosing(false);
  }, [vorliContentControls, vorliGridControls, vorliBadgeControls, isDesktop, vorliMiniTagControls]);

  // Sticky Expand/Close Handlers
  const handleStickyExpandAction = useCallback(async () => {
    if (internalStickyExpanded || stickyClosingRef.current || stickyExpandingRef.current) return;
    stickyExpandingRef.current = true;
    setInternalStickyExpanded(true);
    onStickyExpand?.();
    await stickyMiniTagControls.start("exit");
    stickyExpandingRef.current = false;
  }, [internalStickyExpanded, stickyMiniTagControls, onStickyExpand]);

  const handleStickyCloseAction = useCallback(async () => {
    if (stickyClosingRef.current || stickyExpandingRef.current) return;
    stickyClosingRef.current = true;
    setIsStickyClosing(true);
    onStickyCloseStart?.();
    await Promise.all([
      stickyContentControls.start("exit"),
      stickyGridControls.start("exit"),
      stickyBadgeControls.start("exit"),
    ]);
    if (isDesktop) {
      stickyReturningRef.current = true;
    } else {
      void stickyMiniTagControls.start("visible");
    }
    setInternalStickyExpanded(false);
    onStickyClose?.();
    setIsStickySheetReady(false);
    stickyClosingRef.current = false;
    setIsStickyClosing(false);
  }, [stickyContentControls, stickyGridControls, stickyBadgeControls, onStickyCloseStart, onStickyClose, isDesktop, stickyMiniTagControls]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isNotesExpanded) void handleClose();
        if (internalStickyExpanded) void handleStickyCloseAction();
        if (isVorliExpanded) void handleVorliClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, isNotesExpanded, internalStickyExpanded, handleStickyCloseAction, isVorliExpanded, handleVorliClose]);

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
            isStickyExpanded={internalStickyExpanded}
            isVorliExpanded={isVorliExpanded}
            isDesktop={isDesktop}
            onNotesClick={() => void handleExpand()}
            onVorliClick={() => void handleVorliExpand()}
            onStickyClick={() => void handleStickyExpandAction()}
            stickyIconRef={stickyIconRef}
            notesRippleRef={notesRippleRef}
            miniTagControls={miniTagControls}
            stickyMiniTagControls={stickyMiniTagControls}
            vorliMiniTagControls={vorliMiniTagControls}
            returningRef={returningRef}
            stickyReturningRef={stickyReturningRef}
            vorliReturningRef={vorliReturningRef}
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
              rotate={5}
              overflow={isNotesExpanded ? "visible" : undefined}
              visibility={isNotesExpanded ? "hidden" : undefined}
              animate={isNotesExpanded ? undefined : { rotate: 5, opacity: 1 }}
              whileHover={isNotesExpanded ? undefined : { y: -16, rotate: 0 }}
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
              layoutId="vorli-card"
              rotate={-5}
              zIndex={2}
              overflow={isVorliExpanded ? "visible" : undefined}
              visibility={isVorliExpanded ? "hidden" : undefined}
              animate={isVorliExpanded ? undefined : { rotate: -5, opacity: 1 }}
              whileHover={isVorliExpanded ? undefined : { y: -16, rotate: 0 }}
              transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
              onLayoutAnimationComplete={() => {
                if (vorliReturningRef.current) {
                  vorliReturningRef.current = false;
                  void vorliMiniTagControls.start("visible");
                }
              }}
              cursor={isVorliExpanded ? "default" : "pointer"}
              pointerEvents={isVorliExpanded ? "none" : "auto"}
              onClick={!isVorliExpanded ? () => void handleVorliExpand() : undefined}
              imageStyle={{ rotate: "359.41deg", transformOrigin: "50% 50%" }}
              tagControls={vorliMiniTagControls}
              tagInitial="visible"
            />

            {/* ── Sticky card ── */}
            <ProjectCard
              image="/images/sticky.png"
              alt="Sticky"
              title="Sticky"
              tags={["iOS", "Productivity", "To Do App"]}
              rotate={3}
              marginLeft={-21}
              zIndex={1}
              layoutId="sticky-project-modal"
              overflow={internalStickyExpanded ? "visible" : undefined}
              visibility={internalStickyExpanded ? "hidden" : undefined}
              animate={internalStickyExpanded ? undefined : { rotate: 3, opacity: 1 }}
              whileHover={internalStickyExpanded ? undefined : { y: -16, rotate: 0 }}
              transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
              onLayoutAnimationComplete={() => {
                if (stickyReturningRef.current) {
                  stickyReturningRef.current = false;
                  void stickyMiniTagControls.start("visible");
                }
              }}
              cardRef={stickyCardRef}
              cursor={internalStickyExpanded ? "default" : "pointer"}
              pointerEvents={internalStickyExpanded ? "none" : "auto"}
              onClick={!internalStickyExpanded ? () => void handleStickyExpandAction() : undefined}
              tagControls={stickyMiniTagControls}
              tagInitial="visible"
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
              <SelectedProjectLayout
                key="notes-expanded"
                layoutId={isDesktop ? "notes-card" : undefined}
                icon="/images/notes.png"
                iconStyle={{ transform: 'rotate(-17.2deg)' }}
                title="Notes"
                tags={["iOS", "Canvas"]}
                extraBadge={<AppStoreBadge active={false} />}
                description={
                  <>
                    It&apos;s a conceptual work that visually shows how we clutter our mental space.
                    <br />The main &quot;canvas&quot; gets more &quot;useless&quot; over time, totally packed with notes and links, and the &quot;find&quot; mode is kind of the opposite, showing how we can only find things when we really need them. It&apos;s a reflection on the whole concept of how we deal with information overload today.
                  </>
                }
                showDownloadButton
                badgeControls={badgeControls}
                contentControls={contentControls}
                gridControls={gridControls}
                badgesRef={badgesRef}
                isClosing={isNotesClosing}
                showFloatingHeader={showStickyHeader}
                gridStyle={isMobile
                  ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
                  : { columns: 3, columnGap: 16 }
                }
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
                onClose={() => void handleClose()}
              >
                {USELESS_NOTES_ASSETS.map((asset, i) => (
                  <motion.div
                    key={i}
                    variants={GRID_ITEM_VARIANTS}
                    style={{
                      breakInside: isMobile ? undefined : "avoid",
                      marginBottom: isMobile ? 0 : 16,
                      borderRadius: isMobile ? 12 : 32,
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
                        autoPlay loop muted playsInline
                        style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                      />
                    )}
                  </motion.div>
                ))}
              </SelectedProjectLayout>
            )}
          </AnimatePresence>

          {/* ── Vorli Backdrop ── */}
          <AnimatePresence>
            {isVorliExpanded && (
              <motion.div
                key="vorli-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => void handleVorliClose()}
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

          {/* ── Vorli Expanded Card ── */}
          <AnimatePresence>
            {isVorliExpanded && (
              <SelectedProjectLayout
                key="vorli-expanded"
                layoutId={isDesktop ? "vorli-card" : undefined}
                icon="/images/receipt.png"
                iconStyle={{ rotate: "359.41deg", transformOrigin: "50% 50%" }}
                title="Vorli"
                tags={["iOS", "AI Financial Assistant", "In testing"]}
                description={VORLI_DESCRIPTION}
                badgeControls={vorliBadgeControls}
                contentControls={vorliContentControls}
                gridControls={vorliGridControls}
                badgesRef={vorliBadgesRef}
                isClosing={isVorliClosing}
                showFloatingHeader={showVorliFloatingHeader}
                onAnimationComplete={() => {
                  if (!vorliClosingRef.current) {
                    setIsVorliSheetReady(true);
                    void vorliBadgeControls.start("visible");
                    void vorliContentControls.start("visible");
                    setTimeout(() => {
                      if (!vorliClosingRef.current) void vorliGridControls.start("visible");
                    }, 350);
                  }
                }}
                onClose={() => void handleVorliClose()}
              >
                <motion.div variants={GRID_ITEM_VARIANTS} style={{ backgroundColor: "#F2F2F2", borderRadius: 24, padding: 16 }}>
                  {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <video
                        src={encodeURI("/assets/Vorli/vorli video.MP4")}
                        autoPlay loop muted playsInline
                        style={{ width: "100%", height: "auto", borderRadius: 8 }}
                      />
                      {VORLI_SCREENSHOTS.map((s) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={s.src} src={encodeURI(s.src)} alt={s.alt}
                          style={{ width: "100%", height: "auto", borderRadius: 8 }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <video
                        src={encodeURI("/assets/Vorli/vorli video.MP4")}
                        autoPlay loop muted playsInline
                        style={{ width: "100%", height: "auto", borderRadius: 8 }}
                      />
                      {VORLI_SCREENSHOTS.map((s) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={s.src} src={encodeURI(s.src)} alt={s.alt}
                          style={{ width: "100%", height: "auto", borderRadius: 8 }} />
                      ))}
                    </div>
                  )}
                </motion.div>
              </SelectedProjectLayout>
            )}
          </AnimatePresence>

          {/* ── Sticky Backdrop ── */}
          <AnimatePresence>
            {internalStickyExpanded && (
              <motion.div
                key="sticky-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => void handleStickyCloseAction()}
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

          {/* ── Sticky Expanded Card ── */}
          <AnimatePresence>
            {internalStickyExpanded && (
              <SelectedProjectLayout
                key="sticky-expanded"
                layoutId={isDesktop ? "sticky-project-modal" : undefined}
                icon="/images/sticky.png"
                title="Sticky"
                tags={["iOS", "Productivity"]}
                description={STICKY_DESCRIPTION}
                showDownloadButton
                badgeControls={stickyBadgeControls}
                contentControls={stickyContentControls}
                gridControls={stickyGridControls}
                badgesRef={stickyBadgesRef}
                isClosing={isStickyClosing}
                showFloatingHeader={showStickyFloatingHeader}
                gridStyle={isMobile
                  ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
                  : { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }
                }
                onAnimationComplete={() => {
                  if (!stickyClosingRef.current) {
                    setIsStickySheetReady(true);
                    void stickyBadgeControls.start("visible");
                    void stickyContentControls.start("visible");
                    setTimeout(() => {
                      if (!stickyClosingRef.current) void stickyGridControls.start("visible");
                    }, 350);
                  }
                }}
                onClose={() => void handleStickyCloseAction()}
              >
                {STICKY_ASSETS.map((asset, i) => (
                  <motion.div
                    key={i}
                    variants={GRID_ITEM_VARIANTS}
                    style={{
                      breakInside: isMobile ? undefined : "avoid",
                      marginBottom: 0,
                      borderRadius: isMobile ? 12 : 32,
                      overflow: "hidden",
                      backgroundColor: '#DDDDDD',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={encodeURI(asset.src)}
                      alt={asset.alt}
                      style={{ width: "100%", height: "auto", display: "block" }}
                    />
                  </motion.div>
                ))}
              </SelectedProjectLayout>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </LayoutGroup>
  );
}
