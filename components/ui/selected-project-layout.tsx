"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";
import { CARD_SPRING, BADGE_CONTAINER_VARIANTS, BADGE_ITEM_VARIANTS } from "@/components/ui/project-card";

const NOTES_APP_STORE_URL = "https://apps.apple.com/us/app/useless-notes/id6757185511";

export const GRID_ITEM_VARIANTS = {
  visible: { opacity: 1, y: 0, scale: 1 as const, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } },
};

const CONTENT_ITEM_VARIANTS = {
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  hidden: { opacity: 0, y: 15 },
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};

const STAGGER_VARIANTS = {
  visible: { transition: { staggerChildren: 0.1 } },
  hidden: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05 } },
};


const X_ICON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
  </svg>
);

const sheetSpring = { type: "spring" as const, stiffness: 340, damping: 34 };
const stickySpring = { type: "spring" as const, stiffness: 400, damping: 36 };
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface SelectedProjectLayoutProps {
  layoutId?: string;
  icon: string;
  iconStyle?: React.CSSProperties;
  title: string;
  shortDescription?: React.ReactNode;
  tags: string[];
  extraBadge?: React.ReactNode;
  description: React.ReactNode;
  showDownloadButton?: boolean;
  logoControls: ReturnType<typeof useAnimation>;
  badgeControls: ReturnType<typeof useAnimation>;
  contentControls: ReturnType<typeof useAnimation>;
  gridControls: ReturnType<typeof useAnimation>;
  badgesRef: React.RefObject<HTMLDivElement | null>;
  isClosing: boolean;
  showFloatingHeader: boolean;
  gridStyle?: React.CSSProperties;
  onAnimationComplete?: () => void;
  onCloseStart?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function SelectedProjectLayout({
  layoutId,
  icon,
  iconStyle,
  title,
  shortDescription,
  tags,
  extraBadge,
  description,
  showDownloadButton,
  logoControls,
  badgeControls,
  contentControls,
  gridControls,
  badgesRef,
  isClosing,
  showFloatingHeader,
  gridStyle,
  onAnimationComplete,
  onCloseStart,
  onClose,
  children,
}: SelectedProjectLayoutProps) {
  const { isMobile } = useBreakpoint();
  const [showQR, setShowQR] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelTopPx, setPanelTopPx] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight * 0.05 : 0
  );

  // Mobile-only internal close state
  const [mobileClosing, setMobileClosing] = useState(false);
  const mobileClosingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [showMobileStickyHeader, setShowMobileStickyHeader] = useState(false);
  const [mobileSheetReady, setMobileSheetReady] = useState(false);

  const measurePanelTop = useCallback(() => {
    if (panelRef.current) {
      setPanelTopPx(panelRef.current.getBoundingClientRect().top);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!isMobile) {
      const onResize = () => setPanelTopPx(window.innerHeight * 0.05);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    } else {
      measurePanelTop();
      window.addEventListener("resize", measurePanelTop);
      return () => window.removeEventListener("resize", measurePanelTop);
    }
  }, [isMobile, measurePanelTop]);

  // Mobile: sticky header observer
  useEffect(() => {
    if (!isMobile || !mobileSheetReady) {
      setShowMobileStickyHeader(false);
      return;
    }
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileStickyHeader(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, mobileSheetReady]);

  // Mobile: Escape key
  useEffect(() => {
    if (!isMobile) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void mobileInitiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const mobileInitiateClose = useCallback(async () => {
    if (mobileClosingRef.current) return;
    mobileClosingRef.current = true;
    setMobileClosing(true);
    onCloseStart?.();
    await wait(400);
    onClose();
  }, [onCloseStart, onClose]);

  // ── MOBILE: Self-contained bottom sheet (same pattern as ProjectDetailLayout) ──
  if (isMobile) {
    if (typeof document === "undefined") return null;

    return createPortal(
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mobileClosing ? 0 : 1 }}
          transition={{ duration: 0.25 }}
          onClick={() => void mobileInitiateClose()}
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
          animate={{ y: mobileClosing ? "100%" : 0 }}
          transition={sheetSpring}
          onAnimationComplete={() => {
            if (!mobileClosing) {
              setMobileSheetReady(true);
              measurePanelTop();
            }
          }}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 32, flex: 1, position: "relative", zIndex: 1 }}>
            {/* Header: icon (left) + close (right) */}
            <div ref={headerRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon}
                alt={`${title} Icon`}
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0, ...iconStyle }}
              />
              <GlassButton size="s" onClick={() => void mobileInitiateClose()} aria-label="Close">
                {X_ICON}
              </GlassButton>
            </div>

            {/* Short description + Description + tags */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {shortDescription && (
                <div style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}>
                  {shortDescription}
                </div>
              )}

              <div style={{
                color: "var(--color-text-secondary)",
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: 14,
                lineHeight: "18px",
                whiteSpace: "pre-wrap",
              }}>
                {description}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                {tags.map((label) => (
                  <ProjectTag key={label} label={label} variant="glass" />
                ))}
                {extraBadge}
              </div>

              {showDownloadButton && (
                <GlassButton
                  size="s"
                  onClick={() => window.open(NOTES_APP_STORE_URL, "_blank")}
                >
                  Download the app
                </GlassButton>
              )}
            </div>

            {/* Grid content */}
            <div style={{ width: "100%", boxSizing: "border-box", ...gridStyle }}>
              {children}
            </div>
          </div>
        </motion.div>

        {/* Mobile Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{
            opacity: showMobileStickyHeader && !mobileClosing ? 1 : 0,
            y: showMobileStickyHeader && !mobileClosing ? 0 : -12,
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
            pointerEvents: showMobileStickyHeader && !mobileClosing ? "auto" : "none",
            position: "fixed",
            top: panelTopPx + 8,
            width: "calc(100% - 16px)",
            zIndex: 10002,
            backgroundColor: "var(--color-bg-sheet-header)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt={`${title} Icon`}
              style={{ width: 24, height: 24, objectFit: "cover", borderRadius: 4, ...iconStyle }}
            />
            <span style={{ color: "var(--color-text-ui)", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: 16, letterSpacing: "-0.01em", lineHeight: 1 }}>
              {title}
            </span>
          </div>
          <GlassButton size="s" onClick={() => void mobileInitiateClose()} aria-label="Close">
            {X_ICON}
          </GlassButton>
        </motion.div>
      </>,
      document.body
    );
  }

  // ── DESKTOP: Existing layout (unchanged) ──
  return (
    <>
      <motion.div
        layoutId={layoutId}
        animate={{ y: 0, rotate: 0 }}
        transition={{
          layout: CARD_SPRING,
          y: { type: "spring", stiffness: 340, damping: 34 },
          rotate: { type: "spring", stiffness: 400, damping: 30 },
        }}
        onAnimationComplete={() => {
          onAnimationComplete?.();
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          alignItems: 'center',
          backgroundImage: 'var(--color-bg-layout)',
          backgroundOrigin: 'padding-box',
          borderTopLeftRadius: '40px',
          borderTopRightRadius: '40px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          boxShadow: 'inset 0 0 0 4px var(--color-card-rim), #00000003 0px 400px 165px, #0000000D 0px 105px 140px, #0000001A 0px 105px 105px, #0000001A 0px 25px 55px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          paddingTop: 48,
          paddingBottom: 32,
          paddingInline: 16,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          width: 1100,
          height: "95vh",
          overflowY: "scroll",
          overflowX: "hidden",
          zIndex: 10000,
          cursor: "default",
        }}
      >
        {/* Absolute close button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          style={{ position: "absolute", top: 24, right: 24 }}
        >
          <GlassButton size="s" onClick={onClose} aria-label="Close">
            {X_ICON}
          </GlassButton>
        </motion.div>

        {/* Header section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '480px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <motion.div
              animate={logoControls}
              initial="hidden"
              variants={CONTENT_ITEM_VARIANTS}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={icon}
                alt={`${title} Icon`}
                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 8, flexShrink: 0, ...iconStyle }}
              />
              <div style={{ color: 'var(--color-text-ui)', fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: '20px', letterSpacing: '-0.01em', lineHeight: '1' }}>
                {title}
              </div>
            </motion.div>

            <motion.div
              ref={badgesRef}
              animate={badgeControls}
              initial="hidden"
              variants={BADGE_CONTAINER_VARIANTS}
              style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "center" }}
            >
              {tags.map((label) => (
                <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
                  <ProjectTag label={label} variant="glass" />
                </motion.div>
              ))}
              {extraBadge && (
                <motion.div variants={BADGE_ITEM_VARIANTS}>
                  {extraBadge}
                </motion.div>
              )}
            </motion.div>
          </div>

          <motion.div
            animate={contentControls}
            initial="hidden"
            variants={STAGGER_VARIANTS}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}
          >
            {shortDescription && (
              <motion.div
                variants={CONTENT_ITEM_VARIANTS}
                style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 20, fontWeight: 500, lineHeight: 1.3, textAlign: 'center', width: '100%' }}
              >
                {shortDescription}
              </motion.div>
            )}
            <motion.div
              variants={CONTENT_ITEM_VARIANTS}
              style={{ color: 'var(--color-text-secondary)', fontFamily: '"Geist", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textAlign: 'center', whiteSpace: 'pre-wrap', width: '100%' }}
            >
              {description}
            </motion.div>

            {showDownloadButton && (
              <>
                <motion.div variants={CONTENT_ITEM_VARIANTS}>
                  <GlassButton
                    size="s"
                    onClick={() => setShowQR(true)}
                  >
                    Download the app
                  </GlassButton>
                </motion.div>

                {/* QR modal — desktop only */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setShowQR(false)}
                      style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: "var(--color-bg-modal)",
                          borderRadius: 24,
                          padding: 64,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 20,
                          position: "relative",
                          boxShadow: "0 237px 66px 0 rgba(0, 0, 0, 0.00), 0 152px 61px 0 rgba(0, 0, 0, 0.01), 0 85px 51px 0 rgba(0, 0, 0, 0.05), 0 38px 38px 0 rgba(0, 0, 0, 0.09), 0 9px 21px 0 rgba(0, 0, 0, 0.10)",
                        }}
                      >
                        <div style={{ position: "absolute", top: 16, right: 16 }}>
                          <GlassButton size="s" onClick={() => setShowQR(false)} aria-label="Close">
                            {X_ICON}
                          </GlassButton>
                        </div>
                        <QRCodeSVG
                          value={NOTES_APP_STORE_URL}
                          size={220}
                          bgColor="var(--color-bg-modal)"
                          fgColor="var(--color-text-ui)"
                          level="M"
                          imageSettings={{
                            src: "/images/notes.png",
                            width: 40,
                            height: 40,
                            excavate: true,
                          }}
                        />
                        <span style={{
                          color: "var(--color-text-label)",
                          fontFamily: '"Geist", system-ui, sans-serif',
                          fontSize: 14,
                          lineHeight: "20px",
                          textAlign: "center",
                          maxWidth: 200,
                        }}>
                          Scan with your camera to download Notes from the App Store
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </div>

        {/* Grid section */}
        <motion.div
          animate={gridControls}
          initial="hidden"
          variants={STAGGER_VARIANTS}
          style={{ width: "100%", paddingBottom: 48, boxSizing: "border-box", ...gridStyle }}
        >
          {children}
        </motion.div>
      </motion.div>

      {mounted && createPortal(
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{
            opacity: showFloatingHeader && !isClosing ? 1 : 0,
            y: showFloatingHeader && !isClosing ? 0 : -12,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 36 }}
          style={{
            alignItems: "center",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 24,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 24px",
            pointerEvents: showFloatingHeader && !isClosing ? "auto" : "none",
            position: "fixed",
            top: panelTopPx + 16,
            left: 0,
            right: 0,
            margin: "0 auto",
            width: 1068,
            zIndex: 10001,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt={`${title} Icon`}
              style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: 4, ...iconStyle }}
            />
            <span style={{ color: "var(--color-text-ui)", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "16px", letterSpacing: "-0.01em", lineHeight: "1" }}>
              {title}
            </span>
          </div>
          <GlassButton size="s" onClick={onClose} aria-label="Close">
            {X_ICON}
          </GlassButton>
        </motion.div>,
        document.body
      )}
    </>
  );
}
