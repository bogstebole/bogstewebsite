"use client";

import { useState } from "react";

import { ProjectEntry } from "@/components/elements/project-entry";
import { EnvelopeWidget } from "@/components/elements/EnvelopeWidget";
import glassStyles from "@/components/ui/GlassButton.module.css";

interface ProjectSectionProps {
  primaryColor: string;
  primary40: string;
  isDark: boolean;
  activeProject: string | null;
  returningProject: string | null;
  onProjectClick: (key: string) => void;
  entryRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  envelopeRef?: React.RefObject<HTMLDivElement | null>;
  onEnvelopeClick?: () => void;
  isEnvelopeOpen?: boolean;
  style?: React.CSSProperties;
}

function ProjectIcon({
  src,
  alt,
  rotate,
  grayscale,
  opacity,
  width = 12,
  height = 12,
}: {
  src: string;
  alt: string;
  rotate?: string;
  grayscale?: boolean;
  opacity?: number;
  width?: number;
  height?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        filter: grayscale ? "grayscale(100%)" : undefined,
        flexShrink: 0,
        height,
        objectFit: "cover",
        opacity,
        rotate,
        transformOrigin: "50% 50%",
        width,
      }}
    />
  );
}

function SocialIconButton({
  href,
  label,
  hoverColor,
  filterOverride,
  children,
}: {
  href: string;
  label: string;
  /** Brand color applied to the icon on hover */
  hoverColor: string;
  /** CSS filter to colorize img-based icons (e.g. LinkedIn) on hover */
  filterOverride?: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const iconFilter = hovered
    ? (filterOverride ?? "none")
    : "grayscale(100%) opacity(0.45)";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={glassStyles.socialIconBtn}
      style={{ color: hovered ? hoverColor : "#8A8A8A" } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          alignItems: "center",
          display: "flex",
          filter: iconFilter,
          transition: "filter 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {children}
      </span>
    </a>
  );
}

export function ProjectSection({ primaryColor, primary40, isDark, activeProject, returningProject, onProjectClick, entryRefs, envelopeRef, onEnvelopeClick, isEnvelopeOpen, style }: ProjectSectionProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const entryProps = (key: string) => ({
    entryKey: key,
    isHovered: hoveredKey === key,
    isDimmed: hoveredKey !== null && hoveredKey !== key,
    isActive: activeProject === key,
    isReturning: returningProject === key,
    onMouseEnter: () => setHoveredKey(key),
    onMouseLeave: () => setHoveredKey(null),
    onClick: onProjectClick,
    primaryColor,
    primary40,
    isDark,
    ref: (el: HTMLDivElement | null) => { entryRefs.current[key] = el; },
  });

  const labelStyle: React.CSSProperties = {
    color: primary40,
    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
    fontSize: 10,
    letterSpacing: "0.1em",
    lineHeight: "12px",
    marginBottom: 10,
    textTransform: "uppercase",
  };


  return (
    <div style={style}>
      <div
        style={{
          alignItems: "start",
          display: "flex",
          gap: 8,
          padding: "0 16px",
          width: "100%",
        }}
      >
        {/* ── Client_ column ── */}
        <div style={{ flexShrink: 0, width: "50%" }}>
          <div style={labelStyle}>Client_</div>

          <ProjectEntry
            {...entryProps("fynn")}
            icon={<ProjectIcon src="/images/fynn.png" alt="Fynn.io" rotate="13.1deg" width={12} height={12} />}
            label="Fynn.io"
            tags={["Web", "HealthTech", "B2B"]}
          />

          <ProjectEntry
            {...entryProps("contentSnare")}
            icon={<ProjectIcon src="/images/content-snare.png" alt="Content Snare" rotate="3.34deg" width={12} height={12} />}
            label="Content Snare"
            tags={["Web", "Productivity", "B2B, B2C"]}
          />
        </div>

        {/* ── Personal_ column ── */}
        <div style={{ flexShrink: 0, width: "50%" }}>
          <div style={labelStyle}>Personal_</div>

          <ProjectEntry
            {...entryProps("zoun")}
            icon={<ProjectIcon src="/images/globe.png" alt="Zoun" grayscale={false} opacity={1} />}
            label="Zoun"
            tags={["iOS", "Time Zone Tracker"]}
          />

          <ProjectEntry
            {...entryProps("weatherWear")}
            icon={<ProjectIcon src="/images/puffer.png" alt="Weather Wear" grayscale opacity={0.6} />}
            label="Weather Wear"
            tags={["iOS", "Weather Through Clothes"]}
            inProgress
            clickable
          />


          <ProjectEntry
            {...entryProps("pauschalTracker")}
            icon={<ProjectIcon src="/images/pauschal-tracker.png" alt="Pauschal Tracker" rotate="7.68deg" />}
            label="Pauschal Tracker"
            tags={["Web", "Earning limit tracker", "Personal Usage"]}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 24, marginTop: 32, width: "100%" }}>

        {/* Segmented divider */}
        <div style={{ alignItems: "start", display: "flex", gap: 2, height: "fit-content", opacity: 0.2, width: "100%" }}>
          {Array.from({ length: 56 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "#585858", flex: 1, height: "1px" }} />
          ))}
        </div>

        {/* Footer row */}
        <div style={{ alignItems: "center", display: "flex", padding: "0 16px", gap: 24, justifyContent: "space-between", width: "100%" }}>

          {/* Social icon buttons */}
          <div style={{ alignItems: "center", display: "flex", gap: 0 }}>

            {/* Twitter / X */}
            <SocialIconButton
              href="https://x.com/bgstdsgn"
              label="Twitter / X"
              hoverColor="#000000"
            >
              <svg width="14" height="14" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, transition: "fill 0.2s ease" }}>
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.694H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
              </svg>
            </SocialIconButton>

            {/* LinkedIn */}
            <SocialIconButton
              href="https://linkedin.com/in/bogdan-stefanovic"
              label="LinkedIn"
              hoverColor="#2867B2"
              filterOverride="invert(27%) sepia(89%) saturate(502%) hue-rotate(190deg) brightness(92%) contrast(91%)"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KMEAR89PJZFZMEPT1FJH06NQ.png"
                alt="LinkedIn"
                style={{ flexShrink: 0, height: 14, width: 14 }}
              />
            </SocialIconButton>

            {/* Substack */}
            <SocialIconButton
              href="https://substack.com/@bogste?utm_campaign=profile&utm_medium=profile-page"
              label="Substack"
              hoverColor="#FF6719"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" fill="currentColor" />
              </svg>
            </SocialIconButton>

          </div>

          {/* Envelope widget — interactive, FLIP-animates from footer to overlay */}
          <div style={{ opacity: isEnvelopeOpen ? 0 : 1 }}>
            <EnvelopeWidget ref={envelopeRef} onClick={onEnvelopeClick} />
          </div>

        </div>
      </div>
    </div>
  );
}
