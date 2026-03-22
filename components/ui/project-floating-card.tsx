"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { UselessNotesDetail } from "./useless-notes-detail";

interface ProjectFloatingCardProps {
  projectKey: string;
  /** Bounding rect of the list entry at click time */
  originRect: DOMRect;
  /** Ref to the list entry element */
  entryRef: HTMLDivElement | null;
  /** Called when all content has faded out — lets parent un-blur + show list item */
  onCloseStart: () => void;
  onClose: () => void;
  isDark: boolean;
  primaryColor: string;
  primary40: string;
}

const PROJECT_LABELS: Record<string, string> = {
  uselessNotes: "Useless Notes",
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
const CARD_TOP_VH = 8; // 8vh from top

const spring = { type: "spring" as const, stiffness: 420, damping: 42 };

/* ── Close exit stages: which sections are still visible ── */
type ExitStage = "none" | "grid" | "button" | "description" | "tags" | "header" | "done";

/** Promise that resolves after `ms` milliseconds */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function ProjectFloatingCard({
  projectKey,
  originRect,
  onCloseStart,
  onClose,
  // isDark — reserved for future dark mode
  primaryColor,
  primary40,
}: ProjectFloatingCardProps) {
  const contentControls = useAnimation();
  const [phase, setPhase] = useState<"expanding" | "open" | "closing" | "closed">("expanding");
  const [exitStage, setExitStage] = useState<ExitStage>("none");
  const closingRef = useRef(false);

  const label = PROJECT_LABELS[projectKey] ?? projectKey;
  const iconInfo = PROJECT_ICONS[projectKey];
  const tagInfo = PROJECT_TAGS[projectKey];
  const tagBg = "#F3F3F3";

  /* ── Target position ── */
  const targetLeft = (typeof window !== "undefined" ? window.innerWidth : 1440) / 2 - CARD_WIDTH / 2;
  const targetTop = (typeof window !== "undefined" ? window.innerHeight : 900) * (CARD_TOP_VH / 100);

  /* ── Close: sequential fade-out stages ── */
  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setPhase("closing");

    // 1. Grid fades out — fire non-blocking so stagger starts immediately
    void contentControls.start("exit");

    setExitStage("grid");
    await wait(50);

    setExitStage("button");
    await wait(50);

    setExitStage("description");
    await wait(50);

    setExitStage("tags");
    await wait(50);

    setExitStage("header");
    await wait(100);

    setExitStage("done");

    // Everything gone → un-blur background + show list item
    onCloseStart();
    await wait(280);
    setPhase("closed");
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

  /* ── Handle expand animation completion ── */
  const handleExpandComplete = () => {
    if (phase === "expanding") {
      setPhase("open");
      void contentControls.start("visible");
    }
  };

  /* ── Exit stage checks ── */
  const stages: ExitStage[] = ["grid", "button", "description", "tags", "header", "done"];
  const stageIndex = (s: ExitStage) => stages.indexOf(s);
  const isExited = (section: ExitStage) => exitStage !== "none" && stageIndex(exitStage) >= stageIndex(section);

  // CSS transition for the fade-out wrappers
  const fadeStyle = (section: ExitStage): React.CSSProperties => ({
    opacity: isExited(section) ? 0 : 1,
    transform: isExited(section) ? "translateY(-8px)" : "translateY(0)",
    transition: "opacity 0.1s ease, transform 0.1s ease",
    pointerEvents: isExited(section) ? "none" : "auto",
  });

  return (
    <>
      {/* Backdrop — click-to-close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "closing" || phase === "closed" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
        }}
      />

      {/* Scroll container */}
      <div
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          overflowY: phase === "open" ? "auto" : "hidden",
          zIndex: 11,
          pointerEvents: phase === "closed" ? "none" : "auto",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            paddingBottom: 80,
            position: "relative",
          }}
        >
          {/* ── The card ── */}
          <motion.div
            initial={{
              top: originRect.top,
              left: originRect.left,
              width: originRect.width,
              opacity: 0,
            }}
            animate={{
              top: targetTop,
              left: targetLeft,
              width: CARD_WIDTH,
              opacity: 1,
            }}
            transition={spring}
            onAnimationComplete={handleExpandComplete}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              paddingBlock: CARD_PADDING,
              paddingInline: CARD_PADDING,
              boxSizing: "border-box",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 12,
            }}
          >
            {/* Header: icon + title — exits last */}
            <div style={fadeStyle("header")}>
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
            </div>

            {/* Tags row — exits second-to-last */}
            {tagInfo && (
              <div style={fadeStyle("tags")}>
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
              </div>
            )}

            {/* Project-specific inner content — entry animation unchanged */}
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
        </div>
      </div>
    </>
  );
}
