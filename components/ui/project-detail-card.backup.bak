"use client";

import { useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { UselessNotesDetail } from "./useless-notes-detail";

interface ProjectDetailCardProps {
  projectKey: string;
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

export function ProjectDetailCard({
  projectKey,
  onClose,
  primaryColor,
  primary40,
}: ProjectDetailCardProps) {
  const contentControls = useAnimation();

  const initiateClose = useCallback(async () => {
    await contentControls.start("exit");
    onClose();
  }, [contentControls, onClose]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  const label = PROJECT_LABELS[projectKey] ?? projectKey;
  const iconInfo = PROJECT_ICONS[projectKey];
  const tagInfo = PROJECT_TAGS[projectKey];
  const tagBg = "#F3F3F3";

  return (
    <>
      {/* Scroll wrapper — fixed fullscreen, handles scrolling and backdrop click */}
      <div
        onClick={() => void initiateClose()}
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
          {/* Card — layoutId FLIP animates from entry position */}
          <motion.div
            layoutId={`project-card-${projectKey}`}
            layout
            onLayoutAnimationComplete={() => void contentControls.start("visible")}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            style={{
              width: 600,
              position: "relative",
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
                <motion.div layoutId={`project-icon-${projectKey}`} layout>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                </motion.div>
              )}
              <motion.span
                layoutId={`project-title-${projectKey}`}
                layout
                style={{
                  color: primaryColor,
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {label}
              </motion.span>
            </div>

            {/* Tags row — shared with entry via layoutId */}
            {tagInfo && (
              <motion.div
                layoutId={`project-tags-${projectKey}`}
                layout
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
              </motion.div>
            )}

            {/* Project-specific inner content — staggers in after layoutId settles */}
            {projectKey === "uselessNotes" ? (
              <UselessNotesDetail controls={contentControls} />
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
      </div>
    </>
  );
}
