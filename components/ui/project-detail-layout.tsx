"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface ProjectDetailLayoutProps {
  onCloseStart: () => void;
  onClose: () => void;
  title: string | React.ReactNode;
  icon?: string;
  iconRotate?: string;
  tags?: string[];
  appStore?: boolean;
  shortDescription?: React.ReactNode;
  longDescription?: React.ReactNode;
  children: React.ReactNode;
  primaryColor?: string;
  contentKey?: string;
  slideDirection?: number;
  onOpenComplete?: () => void;
}

const EXIT_DURATION = 0.4;
const sheetSpring = { type: "spring" as const, stiffness: 340, damping: 34 };
const desktopSpring = { type: "spring" as const, stiffness: 300, damping: 30 };
const stickySpring = { type: "spring" as const, stiffness: 400, damping: 36 };

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir === 0 ? 0 : dir * 56,
    opacity: dir === 0 ? 1 : 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
  exit: (dir: number) => ({
    x: dir === 0 ? 0 : dir * -56,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" as const },
  }),
};

const CONTENT_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export const CONTENT_ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

// Transparent stagger wrapper: no self-animation, just staggers children
const CHILDREN_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};


const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function ProjectDetailLayout({
  onCloseStart,
  onClose,
  title,
  icon,
  iconRotate,
  tags,
  appStore,
  shortDescription,
  longDescription,
  children,
  primaryColor = "#000000",
  contentKey,
  slideDirection,
  onOpenComplete,
}: ProjectDetailLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const closingRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const { isMobile } = useBreakpoint();

  const headerRef = useRef<HTMLDivElement>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [cardAnimationComplete, setCardAnimationComplete] = useState(false);
  const [stickyReady, setStickyReady] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const [panelTopPx, setPanelTopPx] = useState(0);

  const measurePanelTop = useCallback(() => {
    if (panelRef.current) {
      setPanelTopPx(panelRef.current.getBoundingClientRect().top);
    }
  }, []);

  useEffect(() => {
    measurePanelTop();
    window.addEventListener("resize", measurePanelTop);
    return () => window.removeEventListener("resize", measurePanelTop);
  }, [measurePanelTop]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    onCloseStart();
    await wait(400); // Wait for animations to finish
    onClose();
  }, [onCloseStart, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);


  // Reset sticky state on tab switch so the old observer doesn't fire a false negative
  // when AnimatePresence removes the old headerRef from the DOM
  useEffect(() => {
    setStickyReady(false);
    setShowStickyHeader(false);
  }, [contentKey]);

  // Intersection Observer — only attaches when stickyReady, so tab-switch gaps are clean
  useEffect(() => {
    if (!stickyReady) return;
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stickyReady]);


  if (!mounted) return null;

  const cardWidth = 1100;

  const renderHeaderContent = (variant: 'main' | 'sticky') => {
    const isMain = variant === 'main';
    const iconSize = isMain ? 48 : 24;
    const fontSize = isMain ? 20 : 16;
    const gap = isMain ? 15 : 6;
    const flexDirection = isMain ? "column" : "row";

    return (
      <div style={{ display: "flex", flexDirection, alignItems: "center", gap, flexShrink: 0 }}>
        {icon && (
          <div style={{ width: iconSize, height: iconSize, flexShrink: 0, aspectRatio: "1/1" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                rotate: iconRotate,
                transformOrigin: "50% 50%",
                borderRadius: 8,
              }}
            />
          </div>
        )}
        {typeof title === "string" ? (
          <span style={{
            color: primaryColor,
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: fontSize,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>
            {title}
          </span>
        ) : (
          <div style={{ flexShrink: 0 }}>
            {title}
          </div>
        )}
      </div>
    );
  };


  // -------------------------
  // MOBILE: Bottom Sheet
  // -------------------------
  if (isMobile) {
    return createPortal(
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          onClick={() => void initiateClose()}
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: "var(--color-bg-backdrop)",
            inset: 0,
            position: "fixed",
            zIndex: 10000,
          }}
        />

        {/* Bottom sheet */}
        <motion.div
          ref={panelRef}
          initial={{ y: "100%" }}
          animate={{ y: isClosing ? "100%" : 0 }}
          transition={sheetSpring}
          onAnimationComplete={() => { if (!isClosing) { setCardAnimationComplete(true); setStickyReady(true); measurePanelTop(); onOpenComplete?.(); } }}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "var(--color-bg-sheet-mobile)",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: "0px -8px 24px rgba(0,0,0,0.05)",
            bottom: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: "95dvh",
            left: 0,
            overflowX: "hidden",
            overflowY: "auto",
            paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
            paddingInline: 16,
            paddingTop: 16,
            position: "fixed",
            right: 0,
            width: "100%",
            zIndex: 10001,
          }}
        >

          {/* Main Content */}
          <motion.div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 32, flex: 1, position: "relative", zIndex: 1 }}>

            {/* Header: icon (left) + close (right) */}
            <div ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              {icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={icon}
                  alt=""
                  style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, rotate: iconRotate, transformOrigin: "50% 50%", flexShrink: 0 }}
                />
              )}
              <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </GlassButton>
            </div>

            {/* Standardized 2-Column Description + Tags */}
            {(shortDescription || longDescription) && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignItems: "flex-start"
              }}>
                {(shortDescription || tags) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>
                    {shortDescription && (
                      <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, margin: 0, fontFamily: "var(--font-geist-sans), sans-serif", color: "var(--color-text-heading)" }}>
                        {shortDescription}
                      </div>
                    )}

                    {/* Tags below short description */}
                    {tags && tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {tags.map((tag) => (
                          <ProjectTag key={tag} label={tag} variant="light" />
                        ))}
                        {appStore && <AppStoreBadge active />}
                      </div>
                    )}
                  </div>
                )}

                {longDescription && (
                  <div style={{ flex: 1.2, minWidth: 0, color: "var(--color-text-tertiary)", fontSize: 14, lineHeight: "21px", fontFamily: "var(--font-geist-sans), sans-serif" }}>
                    {longDescription}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 14 }}>
              {children}
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{
            opacity: showStickyHeader && !isClosing ? 1 : 0,
            y: showStickyHeader && !isClosing ? 0 : -12,
          }}
          transition={stickySpring}
          style={{
            alignItems: "center",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 24,
            display: "flex",
            justifyContent: "space-between",
            left: 8,
            right: 8,
            padding: 16,
            pointerEvents: showStickyHeader && !isClosing ? "auto" : "none",
            position: "fixed",
            top: panelTopPx + 8,
            width: "calc(100% - 16px)",
            zIndex: 10002,
            backgroundColor: "var(--color-bg-sheet-header)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            boxSizing: 'border-box'
          }}
        >
          {renderHeaderContent('sticky')}
          <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
            </svg>
          </GlassButton>
        </motion.div>

      </>,
      document.body
    );
  }

  // -------------------------
  // DESKTOP: Centered layout (Notes wrapper style) docked at bottom
  // -------------------------
  return createPortal(
    <>
      <style>{`
        .layout-scroll::-webkit-scrollbar { display: none; }
        .layout-scroll { scrollbar-width: none; }
      `}</style>

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: EXIT_DURATION }}
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end" // Align to bottom
        }}
      >
        {/* Card Container - 95vh, Bottom Sheet */}
        <motion.div
          ref={panelRef}
          className="layout-scroll"
          initial={{ opacity: 0, y: "100%" }}
          animate={isClosing ? { opacity: 0, y: "100%" } : { opacity: 1, y: 0 }}
          transition={desktopSpring}
          onAnimationComplete={() => { if (!isClosing) { setCardAnimationComplete(true); setStickyReady(true); measurePanelTop(); onOpenComplete?.(); } }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: cardWidth,
            height: "95vh", // Takes up ~95vh as requested
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 24,
            boxSizing: "border-box",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "var(--color-bg-sheet)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0px -8px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.04)",
            borderBottom: "none",
            overflowY: "auto",
            position: "relative",
          }}
        >

          {/* Main Content — stagger on open, slide on tab switch */}
          <AnimatePresence mode="wait" custom={slideDirection ?? 0}>
            <motion.div
              key={contentKey ?? "default"}
              custom={slideDirection ?? 0}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              onAnimationComplete={(definition) => {
                if (definition === "center") setStickyReady(true);
              }}
            >
              <motion.div
                variants={CONTENT_STAGGER}
                initial="hidden"
                animate="visible"
                style={{ display: "flex", flexDirection: "column", gap: 48, paddingBottom: 32, position: "relative", zIndex: 1 }}
              >
                {/* Header: icon (left) + close (right) */}
                <motion.div variants={CONTENT_ITEM} style={{ flexShrink: 0 }}>
                  <div ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: 16, paddingBlock: 8 }}>
                    {icon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={icon}
                        alt=""
                        style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, rotate: iconRotate, transformOrigin: "50% 50%", flexShrink: 0 }}
                      />
                    )}
                    <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                      </svg>
                    </GlassButton>
                  </div>
                </motion.div>

                {/* Standardized 2-Column Description + Tags */}
                {(shortDescription || longDescription) && (
                  <motion.div variants={CONTENT_ITEM} style={{ paddingInline: 16 }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: 32, alignItems: "flex-start" }}>
                      {(shortDescription || tags) && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 0 }}>
                          {shortDescription && (
                            <div style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.3, margin: 0, fontFamily: "var(--font-geist-sans), sans-serif", color: "var(--color-text-heading)" }}>
                              {shortDescription}
                            </div>
                          )}
                          {tags && tags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {tags.map((tag) => (
                                <ProjectTag key={tag} label={tag} variant="light" />
                              ))}
                              {appStore && <AppStoreBadge active />}
                            </div>
                          )}
                        </div>
                      )}
                      {longDescription && (
                        <div style={{ flex: 1.2, minWidth: 0, color: "var(--color-text-tertiary)", fontSize: 14, lineHeight: "21px", fontFamily: "var(--font-geist-sans), sans-serif" }}>
                          {longDescription}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Children — transparent stagger wrapper; each child animates individually */}
                <motion.div variants={CHILDREN_STAGGER} style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 14 }}>
                  {children}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Desktop Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: showStickyHeader && !isClosing ? 1 : 0,
          y: showStickyHeader && !isClosing ? 0 : -12,
        }}
        transition={stickySpring}
        style={{
          alignItems: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 24,
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          pointerEvents: showStickyHeader && !isClosing ? "auto" : "none",
          position: "fixed",
          top: panelTopPx + 16,
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "calc(100% - 32px)",
          maxWidth: cardWidth - 32,
          zIndex: 10002,
          boxShadow: "0px 8px 32px rgba(0,0,0,0.06)",
          backgroundColor: "var(--color-bg-sheet-header)",
          boxSizing: "border-box"
        }}
      >
        {renderHeaderContent('sticky')}
        <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </GlassButton>
      </motion.div>
    </>,
    document.body
  );
}
