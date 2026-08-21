"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "motion/react";
import type { PanInfo } from "motion/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useRippleWave } from "@/useRippleWave";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { SelectedProjectLayout, GRID_ITEM_VARIANTS } from "@/components/ui/selected-project-layout";
import { ProjectTag } from "@/components/ui/project-tag";
import { ProjectTabBar, type ProjectKey, PROJECT_ORDER } from "@/components/ui/project-tab-bar";
import {
  ProjectCard,
  CARD_STYLE,
  CARD_SPRING,
  BADGE_CONTAINER_VARIANTS,
  BADGE_ITEM_VARIANTS,
} from "@/components/ui/project-card";

interface SelectedProjectsSectionProps {
  onNotesExpand?: () => void;
  onNotesCloseStart?: () => void;
  onNotesClose?: () => void;
  onStickyExpand?: () => void;
  onStickyCloseStart?: () => void;
  onStickyClose?: () => void;
  isStickyExpanded?: boolean;
}

// ─── Project data ─────────────────────────────────────────────────────────────

const STICKY_ASSETS = [
  { src: "/assets/Sticky/Home screen.png", alt: "Sticky home screen" },
  { src: "/assets/Sticky/Add task.png", alt: "Add task" },
  { src: "/assets/Sticky/Expand.png", alt: "Expand view" },
  { src: "/assets/Sticky/Reorder.png", alt: "Reorder tasks" },
];

const VORLI_VIDEO = "/assets/Hero/receipt-recording.mp4";

const VORLI_SCREENSHOTS = [
  { src: "/assets/Vorli/vorli-1.webp", alt: "Monthly balance and spending breakdown" },
  { src: "/assets/Vorli/vorli-2.webp", alt: "Scanned receipt detail with line items" },
  { src: "/assets/Vorli/vorli-3.webp", alt: "Yearly dashboard of spending per month" },
  { src: "/assets/Vorli/vorli-4.webp", alt: "Planning menu" },
  { src: "/assets/Vorli/vorli-5.webp", alt: "Wishlist with savings projections" },
  { src: "/assets/Vorli/vorli-6.webp", alt: "Manual expense entry" },
  { src: "/assets/Vorli/vorli-7.webp", alt: "Fixed monthly costs" },
  { src: "/assets/Vorli/vorli-8.webp", alt: "Receipt search with category filters" },
];

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

// ─── Mobile card deck ─────────────────────────────────────────────────────────

const DECK_CARDS = [
  { key: "notes" as ProjectKey, image: "/images/notes.png", title: "Notes", tags: ["iOS", "Canvas"] },
  { key: "vorli" as ProjectKey, image: "/images/receipt.png", title: "Vorli", tags: ["iOS", "AI Financial"] },
  { key: "sticky" as ProjectKey, image: "/images/sticky.png", title: "Sticky", tags: ["iOS", "Productivity"] },
] as const;

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY = 400;

const FAN: Record<number, { x: number; y: number; rotate: number; scale: number }> = {
  0: { x: 0, y: 0, rotate: 0, scale: 1 },
  1: { x: 10, y: 6, rotate: 6, scale: 0.95 },
  2: { x: -6, y: 10, rotate: -9, scale: 0.90 },
};

function stackTransform(pos: number) {
  return { ...(FAN[pos] ?? FAN[2]), opacity: 1 };
}

interface MobileDeckProps {
  openedFrom: ProjectKey | null;
  isDesktop: boolean;
  onCardClick: (key: ProjectKey) => void;
  notesRippleRef: React.RefObject<HTMLDivElement | null>;
  notesMiniTagControls: ReturnType<typeof useAnimation>;
  vorliMiniTagControls: ReturnType<typeof useAnimation>;
  stickyMiniTagControls: ReturnType<typeof useAnimation>;
  notesReturningRef: React.RefObject<boolean>;
  vorliReturningRef: React.RefObject<boolean>;
  stickyReturningRef: React.RefObject<boolean>;
}

function MobileDeck({
  openedFrom,
  isDesktop,
  onCardClick,
  notesRippleRef,
  notesMiniTagControls,
  vorliMiniTagControls,
  stickyMiniTagControls,
  notesReturningRef,
  vorliReturningRef,
  stickyReturningRef,
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

  const reversed = [...order].reverse();

  return (
    <div style={{ position: "relative", width: 184, height: 244, margin: "0 auto" }}>
      {reversed.map((cardIdx) => {
        const stackPos = order.indexOf(cardIdx);
        const isFront = stackPos === 0;
        const card = DECK_CARDS[cardIdx];
        const isExpanded = openedFrom === card.key;

        const miniControls =
          card.key === "notes" ? notesMiniTagControls :
          card.key === "vorli" ? vorliMiniTagControls :
          stickyMiniTagControls;

        const returningRef =
          card.key === "notes" ? notesReturningRef :
          card.key === "vorli" ? vorliReturningRef :
          stickyReturningRef;

        const animateTarget =
          isFront && exitDir !== null
            ? { x: exitDir * 280, y: stackPos * 6, scale: 0.9, rotate: exitDir * 10, opacity: 0 }
            : stackTransform(stackPos);

        return (
          <motion.div
            key={cardIdx}
            ref={card.key === "notes" ? notesRippleRef : undefined}
            layoutId={isDesktop ? `${card.key}-card` : undefined}
            animate={animateTarget}
            transition={
              isFront && exitDir !== null
                ? { type: "tween", duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }
                : { type: "spring", stiffness: 340, damping: 28 }
            }
            drag={isFront && !openedFrom && exitDir === null ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={isFront ? handleDragEnd : undefined}
            onLayoutAnimationComplete={() => {
              if (returningRef.current) {
                returningRef.current = false;
                void miniControls.start("visible");
              }
            }}
            onClick={() => {
              if (!isFront || exitDir !== null || openedFrom) return;
              onCardClick(card.key);
            }}
            style={{
              ...CARD_STYLE,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: order.length - stackPos,
              cursor: isFront && !openedFrom ? "pointer" : "default",
              pointerEvents: isFront ? "auto" : "none",
              overflow: isExpanded ? "visible" : "hidden",
              visibility: isExpanded && isDesktop ? "hidden" : "visible",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
              />
              <span style={{ fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: 16.8, letterSpacing: "-0.04em", color: "var(--color-text-card)", whiteSpace: "nowrap", lineHeight: 1.3 }}>
                {card.title}
              </span>
            </div>
            <motion.div
              animate={miniControls}
              initial="visible"
              variants={BADGE_CONTAINER_VARIANTS}
              style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center", width: "100%" }}
            >
              {card.tags.map((label) => (
                <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                  <ProjectTag label={label} variant="glass" />
                </motion.div>
              ))}
              {card.key === "notes" && (
                <motion.div variants={BADGE_ITEM_VARIANTS}>
                  <AppStoreBadge active={false} />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SelectedProjectsSection({
  onNotesExpand,
  onNotesCloseStart,
  onNotesClose,
  onStickyExpand,
  onStickyCloseStart,
  onStickyClose,
}: SelectedProjectsSectionProps) {
  const { isMobile, isDesktop } = useBreakpoint();

  // ── Unified sheet state ──
  const [openedFrom, setOpenedFrom] = useState<ProjectKey | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectKey | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0);
  const [isSheetReady, setIsSheetReady] = useState(false);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);
  const closingRef = useRef(false);
  const expandingRef = useRef(false);
  const badgesRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // ── Sheet animation controls (single set) ──
  const logoControls = useAnimation();
  const badgeControls = useAnimation();
  const contentControls = useAnimation();
  const gridControls = useAnimation();

  // ── Per-card mini tag controls ──
  const notesMiniTagControls = useAnimation();
  const vorliMiniTagControls = useAnimation();
  const stickyMiniTagControls = useAnimation();
  const notesReturningRef = useRef(false);
  const vorliReturningRef = useRef(false);
  const stickyReturningRef = useRef(false);

  const RIPPLE_CONFIG = { speed: 270, ringWidth: 42, duration: 1000, textStrength: 7, imageStrength: 5 };
  const notesRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;
  const vorliRippleRef = useRippleWave(RIPPLE_CONFIG) as unknown as React.RefObject<HTMLDivElement>;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { void notesMiniTagControls.start("visible"); }, [notesMiniTagControls]);
  useEffect(() => { void vorliMiniTagControls.start("visible"); }, [vorliMiniTagControls]);
  useEffect(() => { void stickyMiniTagControls.start("visible"); }, [stickyMiniTagControls]);

  // ── Floating header observer ──
  useEffect(() => {
    if (!isSheetReady) {
      setShowFloatingHeader(false);
      return;
    }
    const el = badgesRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSheetReady]);

  // ── Tab switch: animate in new content after exit + enter slide completes ──
  // EXIT_MS must cover: exit animation (150ms) + spring enter (~250ms) before controls fire
  useEffect(() => {
    if (!isSheetReady || !activeProject) return;
    logoControls.set("hidden");
    badgeControls.set("hidden");
    contentControls.set("hidden");
    gridControls.set("hidden");
    const AFTER_SLIDE_MS = 320;
    const t1 = setTimeout(() => void logoControls.start("visible"), AFTER_SLIDE_MS);
    const t2 = setTimeout(() => void badgeControls.start("visible"), AFTER_SLIDE_MS + 60);
    const t3 = setTimeout(() => void contentControls.start("visible"), AFTER_SLIDE_MS + 120);
    const t4 = setTimeout(() => void gridControls.start("visible"), AFTER_SLIDE_MS + 220);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  // ── Helpers ──
  const getMiniControls = (k: ProjectKey) =>
    k === "notes" ? notesMiniTagControls :
    k === "vorli" ? vorliMiniTagControls :
    stickyMiniTagControls;

  const getAssetCount = (k: ProjectKey) =>
    k === "notes" ? USELESS_NOTES_ASSETS.length :
    k === "vorli" ? VORLI_SCREENSHOTS.length + 1 :
    STICKY_ASSETS.length;

  // ── Expand ──
  const handleExpand = useCallback(async (project: ProjectKey) => {
    if (openedFrom || closingRef.current || expandingRef.current) return;
    expandingRef.current = true;
    setIsSheetReady(false);
    setOpenedFrom(project);
    setActiveProject(project);
    setSlideDirection(0);
    if (project === "notes") onNotesExpand?.();
    if (project === "sticky") onStickyExpand?.();
    if (!isMobile) {
      await getMiniControls(project).start("exit");
    }
    expandingRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedFrom, isMobile, onNotesExpand, onStickyExpand]);

  // ── Tab switch ──
  const handleTabSwitch = useCallback((project: ProjectKey) => {
    if (!activeProject || project === activeProject || closingRef.current) return;
    const prevIdx = PROJECT_ORDER.indexOf(activeProject);
    const nextIdx = PROJECT_ORDER.indexOf(project);
    setSlideDirection(nextIdx > prevIdx ? 1 : -1);
    setShowFloatingHeader(false);
    setActiveProject(project);
  }, [activeProject]);

  // ── Close ──
  const handleClose = useCallback(async () => {
    if (closingRef.current || !openedFrom) return;
    closingRef.current = true;
    setIsClosing(true);
    setIsSheetReady(false);

    if (isMobile) {
      // Mobile sheet handles its own exit animation
      const wasOpenedFrom = openedFrom;
      setOpenedFrom(null);
      setActiveProject(null);
      setIsSheetReady(false);
      closingRef.current = false;
      if (wasOpenedFrom === "notes") onNotesClose?.();
      if (wasOpenedFrom === "sticky") onStickyClose?.();
      setIsClosing(false);
      return;
    }

    if (openedFrom === "notes") onNotesCloseStart?.();
    if (openedFrom === "sticky") onStickyCloseStart?.();
    void logoControls.start("exit");
    void contentControls.start("exit");
    void gridControls.start("exit");
    void badgeControls.start("exit");
    await new Promise<void>(r => setTimeout(r, (getAssetCount(openedFrom) - 1) * 50));

    const wasOpenedFrom = openedFrom;
    if (wasOpenedFrom === "notes") notesReturningRef.current = true;
    if (wasOpenedFrom === "vorli") vorliReturningRef.current = true;
    if (wasOpenedFrom === "sticky") stickyReturningRef.current = true;

    setOpenedFrom(null);
    setActiveProject(null);
    setIsSheetReady(false);
    setIsClosing(false);
    closingRef.current = false;

    if (wasOpenedFrom === "notes") onNotesClose?.();
    if (wasOpenedFrom === "sticky") onStickyClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedFrom, isMobile, logoControls, contentControls, gridControls, badgeControls]);

  const handleCloseStart = useCallback(() => {
    if (openedFrom === "notes") onNotesCloseStart?.();
    if (openedFrom === "sticky") onStickyCloseStart?.();
  }, [openedFrom, onNotesCloseStart, onStickyCloseStart]);

  // ── Escape key ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openedFrom) void handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, openedFrom]);

  // ── Derived per-project props ──
  const getProjectProps = (k: ProjectKey) => {
    switch (k) {
      case "notes": return {
        icon: "/images/notes.png",
        iconStyle: { transform: "rotate(-17.2deg)" },
        layoutId: "notes-card" as const,
        title: "Notes",
        shortDescription: (
          <>
            <span style={{ color: "var(--color-text-heading)" }}>Notes</span>
            <span style={{ color: "var(--color-text-subdued)" }}>{" — A conceptual app about information overload, built on an infinite canvas."}</span>
          </>
        ),
        description: (
          <>
            It&apos;s a conceptual work that visually shows how we clutter our mental space.
            <br />The main &quot;canvas&quot; gets more &quot;useless&quot; over time, totally packed with notes and links, and the &quot;find&quot; mode is kind of the opposite, showing how we can only find things when we really need them. It&apos;s a reflection on the whole concept of how we deal with information overload today.
          </>
        ),
        tags: ["iOS", "Canvas"],
        extraBadge: <AppStoreBadge active={false} />,
        showDownloadButton: true,
      };
      case "vorli": return {
        icon: "/images/receipt.png",
        iconStyle: { rotate: "359.41deg", transformOrigin: "50% 50%" },
        layoutId: "vorli-card" as const,
        title: "Vorli",
        shortDescription: (
          <>
            <span style={{ color: "var(--color-text-heading)" }}>Vorli</span>
            <span style={{ color: "var(--color-text-subdued)" }}>{" — AI-powered expense tracking that reads your finances so you don’t have to."}</span>
          </>
        ),
        description: "Most financial apps share the same assumption: if you can see your data, you'll change your behavior. I built Vorli because that assumption never worked for me. Existing tools asked me to think about money the way they were designed — not the way I actually do. Vorli puts AI at the center: it auto-categorizes spending, scans receipts, and reads your financial picture so you can just ask what matters. Not 'show me a chart' — more like 'should I be worried about this month?'",
        tags: ["iOS", "AI Financial Assistant", "In testing"],
        extraBadge: undefined,
        showDownloadButton: false,
      };
      case "sticky": return {
        icon: "/images/sticky.png",
        iconStyle: undefined,
        layoutId: "sticky-project-modal" as const,
        title: "Sticky",
        shortDescription: (
          <>
            <span style={{ color: "var(--color-text-heading)" }}>Sticky</span>
            <span style={{ color: "var(--color-text-subdued)" }}>{" — A to-do app where tasks float and drift like actual sticky notes."}</span>
          </>
        ),
        description: "Most task apps organize your work into lists that feel like chores. Sticky treats your tasks as a living canvas — notes float, stack, and drift, making the act of planning feel more like thinking than filing. Built for people who want their tools to have personality.",
        tags: ["iOS", "Productivity", "In progress.."],
        extraBadge: undefined,
        showDownloadButton: false,
      };
    }
  };

  const getProjectGrid = (k: ProjectKey) => {
    const borderR = isMobile ? 12 : 32;
    switch (k) {
      case "notes":
        return USELESS_NOTES_ASSETS.map((asset, i) => (
          <motion.div
            key={i}
            variants={GRID_ITEM_VARIANTS}
            style={{ borderRadius: borderR, overflow: "hidden", backgroundColor: "var(--color-bg-skeleton)" }}
          >
            {asset.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={encodeURI(asset.src)} alt={`Notes screenshot ${i + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
            ) : (
              <video src={encodeURI(asset.src)} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
            )}
          </motion.div>
        ));
      case "vorli":
        return [
          <motion.div key="video" variants={GRID_ITEM_VARIANTS} style={{ borderRadius: borderR, overflow: "hidden", backgroundColor: "var(--color-bg-surface)" }}>
            <video src={VORLI_VIDEO} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          </motion.div>,
          ...VORLI_SCREENSHOTS.map((s) => (
            <motion.div key={s.src} variants={GRID_ITEM_VARIANTS} style={{ borderRadius: borderR, overflow: "hidden", backgroundColor: "var(--color-bg-surface)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI(s.src)} alt={s.alt} style={{ width: "100%", height: "auto", display: "block" }} />
            </motion.div>
          )),
        ];
      case "sticky":
        return STICKY_ASSETS.map((asset, i) => (
          <motion.div
            key={i}
            variants={GRID_ITEM_VARIANTS}
            style={{ breakInside: isMobile ? undefined : "avoid", borderRadius: borderR, overflow: "hidden", backgroundColor: "var(--color-bg-skeleton)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={encodeURI(asset.src)} alt={asset.alt} style={{ width: "100%", height: "auto", display: "block" }} />
          </motion.div>
        ));
    }
  };

  const projectProps = activeProject ? getProjectProps(activeProject) : null;
  const gridStyle = isMobile
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
    : { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 };

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
          background: "var(--color-bg-container)",
          padding: isMobile ? 40 : 64,
          borderRadius: 40,
          ...(isMobile && { marginLeft: 16, marginRight: 16, width: "calc(100% - 32px)", boxSizing: "border-box" }),
        }}
      >
        {isMobile ? (
          <MobileDeck
            openedFrom={openedFrom}
            isDesktop={isDesktop}
            onCardClick={(key) => void handleExpand(key)}
            notesRippleRef={notesRippleRef}
            notesMiniTagControls={notesMiniTagControls}
            vorliMiniTagControls={vorliMiniTagControls}
            stickyMiniTagControls={stickyMiniTagControls}
            notesReturningRef={notesReturningRef}
            vorliReturningRef={vorliReturningRef}
            stickyReturningRef={stickyReturningRef}
          />
        ) : (
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
              overflow={openedFrom === "notes" ? "visible" : undefined}
              visibility={openedFrom === "notes" ? "hidden" : undefined}
              animate={openedFrom === "notes" ? undefined : { rotate: 5, opacity: 1 }}
              whileHover={openedFrom === "notes" ? undefined : { y: -16, rotate: 0 }}
              transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
              onLayoutAnimationComplete={() => {
                if (notesReturningRef.current) {
                  notesReturningRef.current = false;
                  void notesMiniTagControls.start("visible");
                }
              }}
              marginRight={-21}
              zIndex={3}
              cursor={openedFrom === "notes" ? "default" : "pointer"}
              pointerEvents={openedFrom === "notes" ? "none" : "auto"}
              onClick={!openedFrom ? () => void handleExpand("notes") : undefined}
              tagControls={notesMiniTagControls}
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
              overflow={openedFrom === "vorli" ? "visible" : undefined}
              visibility={openedFrom === "vorli" ? "hidden" : undefined}
              animate={openedFrom === "vorli" ? undefined : { rotate: -5, opacity: 1 }}
              whileHover={openedFrom === "vorli" ? undefined : { y: -16, rotate: 0 }}
              transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
              onLayoutAnimationComplete={() => {
                if (vorliReturningRef.current) {
                  vorliReturningRef.current = false;
                  void vorliMiniTagControls.start("visible");
                }
              }}
              cursor={openedFrom === "vorli" ? "default" : "pointer"}
              pointerEvents={openedFrom === "vorli" ? "none" : "auto"}
              onClick={!openedFrom ? () => void handleExpand("vorli") : undefined}
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
              rotate={-1}
              marginLeft={-21}
              zIndex={1}
              layoutId="sticky-project-modal"
              overflow={openedFrom === "sticky" ? "visible" : undefined}
              visibility={openedFrom === "sticky" ? "hidden" : undefined}
              animate={openedFrom === "sticky" ? undefined : { rotate: -1, opacity: 1 }}
              whileHover={openedFrom === "sticky" ? undefined : { y: -16, rotate: 0 }}
              transition={{ opacity: { duration: 0.15 }, y: CARD_SPRING }}
              onLayoutAnimationComplete={() => {
                if (stickyReturningRef.current) {
                  stickyReturningRef.current = false;
                  void stickyMiniTagControls.start("visible");
                }
              }}
              cursor={openedFrom === "sticky" ? "default" : "pointer"}
              pointerEvents={openedFrom === "sticky" ? "none" : "auto"}
              onClick={!openedFrom ? () => void handleExpand("sticky") : undefined}
              tagControls={stickyMiniTagControls}
              tagInitial="visible"
            />
          </>
        )}
      </div>

      {/* ── Expanded sheet — portalled to body ── */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          {!isMobile && (
            <AnimatePresence>
              {openedFrom && (
                <motion.div
                  key="sheet-backdrop"
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
          )}

          {/* Tab bar — fixed above the sheet, outside the layout */}
          <AnimatePresence>
            {!isMobile && openedFrom && isSheetReady && (
              <motion.div
                key="tab-bar-portal"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: "5vh",
                  bottom: 0,
                  left: "calc(50% - 610px)",
                  display: "flex",
                  alignItems: "center",
                  zIndex: 10002,
                  pointerEvents: "none",
                }}
              >
                <ProjectTabBar
                  active={activeProject ?? "notes"}
                  onChange={handleTabSwitch}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded sheet */}
          <AnimatePresence>
            {openedFrom && projectProps && (
              <SelectedProjectLayout
                key="expanded-sheet"
                layoutId={isDesktop ? projectProps.layoutId : undefined}
                icon={projectProps.icon}
                iconStyle={projectProps.iconStyle}
                title={projectProps.title}
                shortDescription={projectProps.shortDescription}
                tags={projectProps.tags}
                extraBadge={projectProps.extraBadge}
                description={projectProps.description}
                showDownloadButton={projectProps.showDownloadButton}
                logoControls={logoControls}
                badgeControls={badgeControls}
                contentControls={contentControls}
                gridControls={gridControls}
                badgesRef={badgesRef}
                isClosing={isClosing}
                showFloatingHeader={showFloatingHeader}
                gridStyle={gridStyle}
                contentKey={activeProject ?? undefined}
                slideDirection={slideDirection}
                onAnimationComplete={() => {
                  if (!closingRef.current) {
                    setIsSheetReady(true);
                    if (!isMobile) {
                      void logoControls.start("visible");
                      setTimeout(() => { if (!closingRef.current) void badgeControls.start("visible"); }, 80);
                      setTimeout(() => { if (!closingRef.current) void contentControls.start("visible"); }, 160);
                      setTimeout(() => { if (!closingRef.current) void gridControls.start("visible"); }, 350);
                    }
                  }
                }}
                onCloseStart={handleCloseStart}
                onClose={() => void handleClose()}
              >
                {getProjectGrid(activeProject!)}
              </SelectedProjectLayout>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </LayoutGroup>
  );
}
