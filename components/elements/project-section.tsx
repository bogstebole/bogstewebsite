"use client";

import { useState } from "react";
import { DotGrid } from "@paper-design/shaders-react";
import { ProjectEntry } from "@/components/elements/project-entry";

interface ProjectSectionProps {
  primaryColor: string;
  primary40: string;
  isDark: boolean;
  activeProject: string | null;
  returningProject: string | null;
  onProjectClick: (key: string) => void;
  entryRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
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

export function ProjectSection({ primaryColor, primary40, isDark, activeProject, returningProject, onProjectClick, entryRefs, style }: ProjectSectionProps) {
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

  const iconBtnStyle: React.CSSProperties = {
    alignItems: "center",
    backgroundImage: "linear-gradient(in oklab 180deg, oklab(100% 0 0) 0%, oklab(96.6% 0 0) 100%)",
    backgroundOrigin: "border-box",
    borderColor: "#FFFFFF",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "0.5px",
    boxShadow: "#00000033 0px 2px 3px",
    boxSizing: "border-box",
    display: "flex",
    flexShrink: 0,
    height: "32px",
    justifyContent: "center",
    paddingBottom: 0,
    paddingLeft: "6px",
    paddingRight: "6px",
    paddingTop: 0,
    width: "fit-content",
  };

  return (
    <div style={style}>
      <div
        style={{
          alignItems: "start",
          display: "flex",
          gap: 8,
        }}
      >
        {/* ── Client_ column ── */}
        <div style={{ flexShrink: 0, width: 244 }}>
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
        <div style={{ flexShrink: 0, width: "fit-content" }}>
          <div style={labelStyle}>Personal_</div>

          <ProjectEntry
            {...entryProps("uselessNotes")}
            icon={<ProjectIcon src="/images/notes.png" alt="Useless Notes" rotate="342.8deg" />}
            label="Useless Notes"
            tags={["iOS", "Canvas"]}
            appStore
          />

          <ProjectEntry
            {...entryProps("vorli")}
            icon={<ProjectIcon src="/images/receipt.png" alt="Vorli" rotate="359.41deg" />}
            label="Vorli"
            tags={["iOS", "AI Financial Assistant", "Personal Usage"]}
          />

          <ProjectEntry
            {...entryProps("timezoneGlobe")}
            icon={<ProjectIcon src="/images/globe.png" alt="Timezone Globe" grayscale opacity={0.6} />}
            label="Timezone Globe"
            tags={["iOS", "Time Zone Tracker"]}
            inProgress
          />

          <ProjectEntry
            {...entryProps("weatherWear")}
            icon={<ProjectIcon src="/images/puffer.png" alt="Weather Wear" grayscale opacity={0.6} />}
            label="Weather Wear"
            tags={["iOS", "Weather Through Clothes"]}
            inProgress
          />

          <ProjectEntry
            {...entryProps("svgParticles")}
            icon={
              <DotGrid
                size={2}
                gapY={0}
                gapX={0}
                strokeWidth={0}
                sizeRange={0}
                opacityRange={0.9}
                shape="circle"
                colorFill={isDark ? "#d0d0d0" : "#000000"}
                colorStroke="#FFFFFF"
                colorBack="#00000000"
                style={{ flexShrink: 0, height: 12, width: 12 }}
              />
            }
            label="SVG Particles"
            tags={["Web", "Canvas, Loader Tool", "Personal Usage"]}
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
      <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 24, marginTop: 40, width: "100%" }}>

        {/* Segmented divider */}
        <div style={{ alignItems: "start", display: "flex", gap: 2, height: "fit-content", opacity: 0.2, width: "100%" }}>
          {Array.from({ length: 56 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "#585858", flex: 1, height: "1px" }} />
          ))}
        </div>

        {/* Footer row */}
        <div style={{ alignItems: "center", display: "flex", gap: 24, justifyContent: "space-between", width: "100%" }}>

          {/* Social icon buttons */}
          <div style={{ alignItems: "start", display: "flex" }}>
            {/* Logo */}
            <div style={iconBtnStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KMEAFFJ2SCJ3870JDSYVBYY3.png"
                alt="Logo"
                style={{ filter: "grayscale(100%)", flexShrink: 0, height: 14, width: 14 }}
              />
            </div>
            {/* LinkedIn */}
            <div style={{ ...iconBtnStyle, rotate: "355.39deg", transformOrigin: "50% 50%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KMEAR89PJZFZMEPT1FJH06NQ.png"
                alt="LinkedIn"
                style={{ filter: "grayscale(100%)", flexShrink: 0, height: 12, transformOrigin: "50% 50%", width: 14 }}
              />
            </div>
            {/* X / Twitter */}
            <div style={{ ...iconBtnStyle, rotate: "4.94deg", transformOrigin: "50% 50%", width: 26 }}>
              <svg width="10" height="10" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.694H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="#8A8A8A" />
              </svg>
            </div>
          </div>

          {/* Envelope — 284×204 source, scaled to 34×24 */}
          <div style={{
            backgroundColor: "#e4e3de",
            borderRadius: 3,
            boxShadow: "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
            flexShrink: 0,
            height: 24,
            overflow: "hidden",
            position: "relative",
            width: 34,
          }}>
            {/* Bottom fold: top 30.4% (62/204), height 69.6% (142/204) — no rotation, no inset needed */}
            <div style={{ height: "69.6%", left: 0, position: "absolute", top: "30.4%", width: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src="/images/envelope-bottom.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
            </div>
            {/* Top fold: top 0, height 69.6% — inset lets 150px SVG fill 142px slot */}
            <div style={{ height: "69.6%", left: 0, position: "absolute", top: 0, width: "100%" }}>
              <div style={{ bottom: "-5.02%", left: "-0.7%", position: "absolute", right: "-4.58%", top: "-3.79%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src="/images/envelope-top.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
