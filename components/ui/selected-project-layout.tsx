"use client";

import { motion, useAnimation } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ProjectTag } from "@/components/ui/project-tag";
import { CARD_SPRING, BADGE_CONTAINER_VARIANTS, BADGE_ITEM_VARIANTS } from "@/components/ui/project-card";

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

const DOWNLOAD_SHADOW =
  '#FFFFFF -2px 2px 2px 1px inset, #00000069 -1px -3px 3px -2px inset, #000000D6 2px 1px 4px -4px inset, #FFFFFF 0px 0px 7px 4px inset, #00000040 0px -9px 14px 4px inset, #0000001A -2px -3px 5px 3px inset, #FFFFFF 0px 20px 8px -9px inset, #0000001A 0px 34px 10px -9px inset, #00000003 0px 27px 8px, #00000003 0px 17px 6px, #0000000D 0px 10px 6px, #0000001A 0px 4px 4px, #0000001A 0px 1px 3px';

const X_ICON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
  </svg>
);

interface SelectedProjectLayoutProps {
  layoutId?: string;
  icon: string;
  iconStyle?: React.CSSProperties;
  title: string;
  tags: string[];
  extraBadge?: React.ReactNode;
  description: React.ReactNode;
  showDownloadButton?: boolean;
  badgeControls: ReturnType<typeof useAnimation>;
  contentControls: ReturnType<typeof useAnimation>;
  gridControls: ReturnType<typeof useAnimation>;
  badgesRef: React.RefObject<HTMLDivElement | null>;
  isClosing: boolean;
  showFloatingHeader: boolean;
  gridStyle?: React.CSSProperties;
  onAnimationComplete?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function SelectedProjectLayout({
  layoutId,
  icon,
  iconStyle,
  title,
  tags,
  extraBadge,
  description,
  showDownloadButton,
  badgeControls,
  contentControls,
  gridControls,
  badgesRef,
  isClosing,
  showFloatingHeader,
  gridStyle,
  onAnimationComplete,
  onClose,
  children,
}: SelectedProjectLayoutProps) {
  const { isMobile, isDesktop } = useBreakpoint();

  return (
    <motion.div
      layoutId={isDesktop ? layoutId : undefined}
      animate={{ y: 0, rotate: 0 }}
      initial={isDesktop ? undefined : { y: "100%" }}
      exit={isDesktop ? undefined : { y: "100%" }}
      transition={{
        layout: CARD_SPRING,
        y: { type: "spring", stiffness: 340, damping: 34 },
        rotate: { type: "spring", stiffness: 400, damping: 30 },
      }}
      onAnimationComplete={onAnimationComplete}
      onClick={(e) => e.stopPropagation()}
      style={{
        alignItems: 'center',
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #EEEEEE 100%)',
        backgroundOrigin: 'padding-box',
        borderTopLeftRadius: isMobile ? 32 : '40px',
        borderTopRightRadius: isMobile ? 32 : '40px',
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
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        margin: "0 auto",
        width: isMobile ? "100%" : 1100,
        height: isMobile ? "95dvh" : "95vh",
        overflowY: "scroll",
        overflowX: "hidden",
        zIndex: 51,
        cursor: "default",
      }}
    >
      {/* Floating sticky header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: showFloatingHeader && !isClosing ? 1 : 0,
          y: showFloatingHeader && !isClosing ? 0 : -12,
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
          pointerEvents: showFloatingHeader && !isClosing ? "auto" : "none",
          position: "fixed",
          top: "calc(5vh + 8px)",
          left: isMobile ? 8 : 0,
          right: isMobile ? 8 : 0,
          margin: isMobile ? undefined : "0 auto",
          width: isMobile ? undefined : 1084,
          zIndex: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={icon}
            alt={`${title} Icon`}
            style={{ width: "24px", height: "24px", objectFit: "cover", borderRadius: 4, ...iconStyle }}
          />
          <span style={{ color: "#111111", fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: "16px", letterSpacing: "-0.01em", lineHeight: "1" }}>
            {title}
          </span>
        </div>
        <GlassButton size="s" onClick={onClose} aria-label="Close">
          {X_ICON}
        </GlassButton>
      </motion.div>

      {/* Absolute close button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        style={{ position: "absolute", top: isMobile ? "calc(env(safe-area-inset-top) + 16px)" : 24, right: 24 }}
      >
        <GlassButton size="s" onClick={onClose} aria-label="Close">
          {X_ICON}
        </GlassButton>
      </motion.div>

      {/* Header section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: isMobile ? '100%' : '480px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={icon}
              alt={`${title} Icon`}
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 8, flexShrink: 0, ...iconStyle }}
            />
            <div style={{ color: '#111111', fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: '20px', letterSpacing: '-0.01em', lineHeight: '1' }}>
              {title}
            </div>
          </div>

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
          <motion.div
            variants={CONTENT_ITEM_VARIANTS}
            style={{ color: '#000000CC', fontFamily: '"Geist", system-ui, sans-serif', fontSize: '14px', lineHeight: '18px', textAlign: 'center', whiteSpace: 'pre-wrap', width: '100%' }}
          >
            {description}
          </motion.div>

          {showDownloadButton && (
            <motion.div
              variants={CONTENT_ITEM_VARIANTS}
              style={{
                alignItems: 'center',
                backdropFilter: 'blur(1px)',
                borderRadius: '9999px',
                boxShadow: DOWNLOAD_SHADOW,
                display: 'flex',
                gap: '4px',
                height: '32px',
                justifyContent: 'center',
                paddingBottom: '9px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '9px',
                cursor: 'progress',
              }}
            >
              <span style={{ color: '#111111', fontFamily: '"JetBrains Mono", system-ui, sans-serif', fontSize: '14px', letterSpacing: '0.03em', lineHeight: '1' }}>
                Download the app
              </span>
            </motion.div>
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
  );
}
