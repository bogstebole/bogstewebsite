"use client";

import { useState } from "react";
import { DotGrid } from "@paper-design/shaders-react";
import { ProjectEntry } from "@/components/elements/project-entry";

interface ProjectSectionProps {
  primaryColor: string;
  primary40: string;
  isDark: boolean;
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

export function ProjectSection({ primaryColor, primary40, isDark, style }: ProjectSectionProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const entryProps = (key: string) => ({
    entryKey: key,
    isHovered: hoveredKey === key,
    isDimmed: hoveredKey !== null && hoveredKey !== key,
    onMouseEnter: () => setHoveredKey(key),
    onMouseLeave: () => setHoveredKey(null),
    primaryColor,
    primary40,
    isDark,
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
    </div>
  );
}
