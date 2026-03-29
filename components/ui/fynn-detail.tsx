"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";

interface FynnDetailProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["Web", "HealthTech", "B2B"];

const LEFT_COL_ITEMS: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/edit profile.png", alt: "Edit profile" },
  { src: "/assets/Fynn/Incidents.png", alt: "Incidents" },
];

const RIGHT_COL_ITEMS: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Signature flow.png", alt: "Signature flow" },
  { src: "/assets/Fynn/Temporary warning.png", alt: "Temporary warning" },
];

const SPECS_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-overview.png", alt: "Design system — overview" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-building-blocks.png", alt: "Design system — building blocks" },
];

const SPECS_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-type.png", alt: "Design system — type specs" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-behaviour.png", alt: "Design system — behaviour" },
];

const expandSpring = { type: "spring" as const, stiffness: 300, damping: 34 };
const stickySpring = { type: "spring" as const, stiffness: 400, damping: 36 };

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 32 },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.12 } },
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function FynnDetail({ originRect, onCloseStart, onClose }: FynnDetailProps) {
  const contentControls = useAnimation();
  const closingRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const cardWidth = typeof window !== "undefined" ? window.innerWidth * 0.6 : 1152;
  const targetLeft =
    (typeof window !== "undefined" ? window.innerWidth : 1440) / 2 - cardWidth / 2;
  const targetTop =
    (typeof window !== "undefined" ? window.innerHeight : 900) * 0.06;

  const handleExpandComplete = useCallback(() => {
    if (closingRef.current) return;
    void contentControls.start("visible");
  }, [contentControls]);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    void contentControls.start("exit");
    setIsClosing(true);
    onCloseStart();
    await wait(380);
    onClose();
  }, [contentControls, onCloseStart, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  // Show sticky header when original header scrolls out of viewport
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const FynnLogo = () => (
    <div style={{ transform: "rotate(-9.5deg)", transformOrigin: "center" }}>
      <div
        style={{
          backgroundColor: "#cdebff",
          border: "1.3px solid rgba(255,255,255,0.4)",
          borderRadius: 13,
          boxShadow:
            "0px 1.33px 1.33px rgba(35,79,107,0.20), 0px 4px 4px rgba(35,79,107,0.17), 0px 8px 4px rgba(35,79,107,0.10), 0px 13.33px 5.33px rgba(35,79,107,0.03)",
          display: "flex",
          flexDirection: "column",
          padding: "18px 5px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 12.4,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#0d3752", fontWeight: 700 }}>Fynn</span>
          <span style={{ color: "#1272df", fontWeight: 500 }}>.</span>
          <span style={{ color: "#0d3752", fontWeight: 700 }}>io</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .fynn-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Backdrop — click to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => void initiateClose()}
        style={{ position: "fixed", inset: 0, zIndex: 10 }}
      />

      {/* Card — FLIP from list item origin to expanded position */}
      <motion.div
        className="fynn-scroll"
        initial={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          opacity: 0,
        }}
        animate={
          isClosing
            ? { opacity: 0 }
            : {
              top: targetTop,
              left: targetLeft,
              width: cardWidth,
              opacity: 1,
            }
        }
        transition={expandSpring}
        onAnimationComplete={handleExpandComplete}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-geist-sans), sans-serif",
          bottom: 0,
          overflowX: "hidden",
          overflowY: "auto",
          padding: 24,
          position: "fixed",
          scrollbarWidth: "none",
          zIndex: 11,
        }}
      >
        <motion.div
          layout="position"
          style={{ display: "flex", flexDirection: "column", gap: 24 }}
        >
          {/* ── Header: tilted logo + close ── */}
          <div
            ref={headerRef}
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              paddingInline: 16,
            }}
          >
            <FynnLogo />

            {/* Close button */}
            <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
              ×
            </GlassButton>
          </div>

          {/* ── Staggered content ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={contentControls}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {/* Two columns: headline + tags | description */}
            <motion.div
              variants={fadeUp}
              style={{ alignItems: "flex-start", display: "flex", gap: 32, paddingInline: 16 }}
            >
              {/* Left */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  gap: 16,
                  minWidth: 0,
                }}
              >
                <p
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  <span style={{ color: "#141414" }}>Fynn.io</span>
                  <span style={{ color: "rgba(20,20,20,0.4)" }}>
                    {" — Task completion time cut in half. Development speed doubled, this is how we transformed Fynn's senior living management system."}
                  </span>
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TAGS.map((tag) => (
                    <ProjectTag key={tag} label={tag} variant="light" />
                  ))}
                </div>
              </div>

              {/* Right */}
              <p
                style={{
                  color: "rgba(0,0,0,0.7)",
                  flex: 1,
                  fontSize: 14,
                  lineHeight: "21px",
                  margin: 0,
                  minWidth: 0,
                }}
              >
                {`Fynn is a U.S.-based senior living care management platform that came to us with a fragmented system built on Ionic, Angular, and Bootstrap — all mixing in ways they shouldn't. The goal was to redesign the core "Activities of Daily Living" feature, build a scalable design system, and set the product up for future growth. With no existing Ionic UI kit in Figma, we built one from scratch, establishing root-level tokens for color, typography, and spacing that matched Ionic's structure and made sense to developers immediately. Discovery started with lo-fi wireframes, moved through hi-fi prototypes, and was validated through in-person user testing — which revealed how users physically interacted with devices, directly shaping final decisions. We established a clear workflow from Jira stories through design, refinement, visual QA, and release, with a custom annotation system in Figma that made handoffs clean and reduced back-and-forth. The design system was organized into three layers — foundations, native Ionic components, and custom components — keeping the Figma file navigable as the project scaled. A pattern rulebook covering navigation, filters, drawers, and grid behavior reduced dev meetings and increased team efficiency by 13%. For the resident profile redesign, we moved from a single overloaded page to a tabbed layout with a drawer pattern for complex forms, keeping resident context visible throughout interactions. The drawer approach was a pragmatic call — not perfect, but fast to implement with existing components, and initial user feedback confirmed it worked. The Bulk ADL feature launch cut task completion time by 50%, and the design system accelerated development speed across all ongoing projects. The main lesson: lock in the technical stack before touching the design system — the Ionic vs. Angular split created avoidable complexity throughout. Moving forward, the priority is consolidating to a single framework, deepening design-dev collaboration, and expanding the system for new features.`}
              </p>
            </motion.div>

            {/* Bento grid */}
            <motion.div
              variants={fadeUp}
              style={{
                backgroundColor: "#347eff",
                borderRadius: 32,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 16,
                width: "100%",
              }}
            >
              {/* Dashboard — full width hero */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI("/assets/Fynn/Billing dashboard - Rent roll.png")}
                alt="Billing dashboard — rent roll"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
              />

              {/* Dashboard — 2 flex columns, 2 rows each */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                  {LEFT_COL_ITEMS.map((item) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                      style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                  ))}
                </div>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                  {RIGHT_COL_ITEMS.map((item) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                      style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                  ))}
                </div>
              </div>

              {/* Dashboard — full width footer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI("/assets/Fynn/Resident care.png")}
                alt="Resident care"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
              />

              {/* Design system specs — 2 flex columns, 2 rows each */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                  {SPECS_LEFT.map((item) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                      style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                  ))}
                </div>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                  {SPECS_RIGHT.map((item) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                      style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Sticky floating header — appears when original header scrolls out of view ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: showStickyHeader && !isClosing ? 1 : 0,
          y: showStickyHeader && !isClosing ? 0 : -12,
        }}
        transition={stickySpring}
        style={{
          alignItems: "center",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 9999,
          display: "flex",
          justifyContent: "space-between",
          left: targetLeft,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 16,
          paddingTop: 20,
          pointerEvents: showStickyHeader && !isClosing ? "auto" : "none",
          position: "fixed",
          top: 32,
          width: cardWidth,
          zIndex: 12,
        }}
      >
        <FynnLogo />
        <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
          ×
        </GlassButton>
      </motion.div>
    </>
  );
}
