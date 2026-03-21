"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { UselessNotesDetail } from "./useless-notes-detail";

interface ProjectDetailCardProps {
  projectKey: string;
  sourceRect: DOMRect;
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

const CARD_WIDTH = 600;

export function ProjectDetailCard({
  projectKey,
  sourceRect,
  onClose,
  primaryColor,
  primary40,
}: ProjectDetailCardProps) {
  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Compute transform-based initial position once (stable — sourceRect doesn't change)
  const { initialX, initialY, initialScale } = useMemo(() => {
    const cardLeft = (window.innerWidth - CARD_WIDTH) / 2;
    const cardTop = window.innerHeight * 0.08;
    return {
      initialX: sourceRect.left - cardLeft,
      initialY: sourceRect.top - cardTop,
      initialScale: sourceRect.width / CARD_WIDTH,
    };
  }, [sourceRect]);

  const label = PROJECT_LABELS[projectKey] ?? projectKey;
  const iconInfo = PROJECT_ICONS[projectKey];

  return (
    <>
      {/* Scroll wrapper — fixed fullscreen, handles scrolling and backdrop click */}
      <motion.div
        key="scroll-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          zIndex: 10,
        }}
      >
        {/* Centering wrapper */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "8vh",
            paddingBottom: "80px",
          }}
        >
          {/* Card — transform-animated, no background */}
          <motion.div
            key="card"
            initial={{ x: initialX, y: initialY, scale: initialScale }}
            animate={{ x: 0, y: 0, scale: 1 }}
            exit={{ x: initialX, y: initialY, scale: initialScale, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: CARD_WIDTH,
              position: "relative",
              transformOrigin: "top left",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              paddingBlock: 16,
              paddingInline: 16,
              boxSizing: "border-box",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 12,
            }}
          >
            {/* Header: icon + title */}
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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconInfo.src}
                  alt={label}
                  style={{
                    width: 24,
                    height: 24,
                    objectFit: "cover",
                    flexShrink: 0,
                    rotate: iconInfo.rotate,
                    transformOrigin: "50% 50%",
                  }}
                />
              )}
              <span
                style={{
                  color: primaryColor,
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </div>

            {/* Project-specific content */}
            {projectKey === "uselessNotes" ? (
              <UselessNotesDetail
                primaryColor={primaryColor}
                primary40={primary40}
                isDark={false}
              />
            ) : (
              <div
                style={{
                  color: primary40,
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 12,
                  paddingBlock: 8,
                }}
              >
                Coming soon...
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
