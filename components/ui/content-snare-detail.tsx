"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation, type Variants } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";

interface ContentSnareDetailProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["Web", "Productivity", "B2B, B2C"];

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

export function ContentSnareDetail({ originRect, onCloseStart, onClose }: ContentSnareDetailProps) {
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

  const ContentSnareLogo = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/content-snare.png"
      alt="Content Snare"
      style={{
        width: 55,
        height: 55,
        objectFit: "cover",
        borderRadius: 8,
        flexShrink: 0,
        transform: "rotate(3.34deg)",
        transformOrigin: "center",
      }}
    />
  );

  return (
    <>
      <style>{`
        .content-snare-scroll::-webkit-scrollbar { display: none; }
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
        className="content-snare-scroll"
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
            <ContentSnareLogo />

            {/* Close button */}
            <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
              </svg>
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
                  <span style={{ color: "#141414" }}>Content Snare</span>
                  <span style={{ color: "rgba(20,20,20,0.4)" }}>
                    {" — Enhanced system led to faster request completion and reduced support tickets through clearer navigation and simplified user experience."}
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
                {`ContentSnare is an Australian productivity platform that helps businesses collect content and information from clients through structured request forms. They came to us needing a full redesign of their end-user request experience — not a blank-slate redesign, but one built directly on top of existing user feedback they had already collected. Discovery started with a planned workshop that went off-script, but the unstructured conversation turned out to surface exactly the insights we needed. The core friction points were clear: users missed submit buttons, got confused by terminology like "reject" and "submit for review," struggled with rigid section structures, and couldn't easily navigate or understand their progress through a form. We restructured field information hierarchically so critical details stood out, and replaced text-heavy status indicators with visual cues — cleaning up the interface without breaking familiar patterns. The sidebar was rebuilt to separate progress tracking from navigation, with color coding and icons that communicate field states without adding visual noise. The comment system got a straightforward but effective fix: alignment and background color now instantly distinguish who said what and in what context. On the creator side, we improved the dashboard layout, filter organization, and tackled the recurring request feature — a deceptively simple concept that required multiple steps to implement properly. Collaboration was fast and direct, coming straight from an owner-developer, which kept decisions quick even if it occasionally meant realigning after missed updates. The main lesson: rigid process isn't a prerequisite for good outcomes — the quality came from collaboration and adaptability, not structure. Results are still being measured as the features roll out, with future iterations tied to actual usage patterns rather than assumptions.`}
              </p>
            </motion.div>

            {/* Bento grid */}
            <motion.div
              variants={fadeUp}
              style={{
                borderRadius: 32,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 16,
                width: "100%",
              }}
            >
              {/* Form layout — full width */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI("/assets/Content snare/Form layout.png")}
                alt="Form layout"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
              />

              {/* Two columns: Sidebar | Comments */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Content snare/sidebar.png")}
                    alt="Sidebar"
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Content snare/comments.png")}
                    alt="Comments"
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
                  />
                </div>
              </div>

              {/* Input section — full width */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI("/assets/Content snare/Input section.png")}
                alt="Input section"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
              />

              {/* Success — full width */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI("/assets/Content snare/success.png")}
                alt="Success"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
              />
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
        <ContentSnareLogo />
        <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </GlassButton>
      </motion.div>
    </>
  );
}
