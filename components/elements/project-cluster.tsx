"use client";

import { figmaX, figmaY } from "@/lib/figma-scale";
import { FIGMA_POSITIONS } from "@/lib/constants";
import { ProjectIcon } from "./project-icon";
import { useTheme } from "@/components/providers/theme-provider";
import type { ProjectData } from "@/components/ui/project-detail-window";

/** Project definitions — exported so GameCanvas can access metadata */
export const PROJECTS: ProjectData[] = [
  {
    key: "weather",
    color: "#4A90D9",
    label: "Weather Wear",
    videoSrc: "/videos/weather.mp4",
    tags: "iOS | Weather | Swift",
    description:
      "An app that tells you what to wear based on the weather. It combines real-time forecasts with a smart clothing suggestion engine, so you never overdress or underdress again.",
    downloadUrl: "#",
  },
  {
    key: "zouns",
    color: "#7B61B8",
    label: "Zouns",
    videoSrc: "/videos/zone.mp4",
    tags: "iOS | Music | Swift",
    description:
      "A spatial audio experiment. Zouns maps sounds to physical zones in your space, creating immersive audio landscapes you walk through. Part art installation, part productivity timer.",
  },
  {
    key: "uselessNote",
    color: "#D4A843",
    label: "Useless Notes",
    videoSrc: "/videos/notes.mp4",
    tags: "iOS | Productivity | Swift",
    description:
      "It's a conceptual work that visually shows how we clutter our mental space. The main 'canvas' gets more 'useless' over time, totally packed with notes and links, and the 'find' mode is kind of the opposite, showing how we can only find things when we really need them.",
    downloadUrl: "#",
  },
  {
    key: "scanspend",
    color: "#4AAD6B",
    label: "ScanSpend",
    videoSrc: "/videos/receipt.mp4",
    tags: "iOS | Finance | Swift",
    description:
      "Scan receipts, track spending, see where your money goes. A dead-simple expense tracker that uses OCR to extract totals and categorize purchases automatically.",
  },
];

/** 13-layer glassmorphic box-shadow — light mode */
const GLASS_BOX_SHADOW_LIGHT = [
  "3px -1px 2px 0 #FFF inset",
  "-1px -3px 3px -2px rgba(0, 0, 0, 0.41) inset",
  "2px 1px 5px -5px rgba(0, 0, 0, 0.84) inset",
  "0 0 8px 6px rgba(255, 255, 255, 0.65) inset",
  "0 -10px 16px -4px rgba(0, 0, 0, 0.25) inset",
  "0 3px 6px 1px rgba(0, 0, 0, 0.42) inset",
  "0 21px 10px 0 rgba(255, 255, 255, 0.75) inset",
  "0 40px 42px -10px rgba(0, 0, 0, 0.15) inset",
  "0 32px 9px 0 rgba(0, 0, 0, 0.00)",
  "0 20px 8px 0 rgba(0, 0, 0, 0.01)",
  "0 11px 7px 0 rgba(0, 0, 0, 0.05)",
  "0 5px 5px 0 rgba(0, 0, 0, 0.09)",
  "0 1px 3px 0 rgba(0, 0, 0, 0.10)",
].join(", ");

/** 13-layer glassmorphic box-shadow — dark mode */
const GLASS_BOX_SHADOW_DARK = [
  "3px -1px 2px 0 rgba(255, 255, 255, 0.12) inset",
  "-1px -3px 3px -2px rgba(0, 0, 0, 0.6) inset",
  "2px 1px 5px -5px rgba(0, 0, 0, 0.9) inset",
  "0 0 8px 6px rgba(255, 255, 255, 0.06) inset",
  "0 -10px 16px -4px rgba(0, 0, 0, 0.4) inset",
  "0 3px 6px 1px rgba(0, 0, 0, 0.55) inset",
  "0 21px 10px 0 rgba(255, 255, 255, 0.08) inset",
  "0 40px 42px -10px rgba(0, 0, 0, 0.3) inset",
  "0 32px 9px 0 rgba(0, 0, 0, 0.00)",
  "0 20px 8px 0 rgba(0, 0, 0, 0.04)",
  "0 11px 7px 0 rgba(0, 0, 0, 0.12)",
  "0 5px 5px 0 rgba(0, 0, 0, 0.18)",
  "0 1px 3px 0 rgba(0, 0, 0, 0.22)",
].join(", ");

interface ProjectClusterProps {
  /** Key of the icon currently hidden (e.g. during window phase) */
  launchedIconKey?: string | null;
  /** Key of the icon being impacted (squash-stretch on headbutt hit) */
  impactIconKey?: string | null;
  /** Key of the icon popping up after impact (translateY(-40px) scale(1.1)) */
  poppedIconKey?: string | null;
  /** Callback when a project icon is clicked */
  onIconClick?: (project: ProjectData, rect: DOMRect) => void;
}

export function ProjectCluster({ launchedIconKey, impactIconKey, poppedIconKey, onIconClick }: ProjectClusterProps) {
  const { isDark } = useTheme();
  const positions = FIGMA_POSITIONS.projects;

  // Container center — midpoint of the icon cluster
  const containerX = (positions.weather.x + positions.scanspend.x + 48) / 2;
  const containerY = (positions.weather.y + positions.uselessNote.y + 48) / 2;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Dock bounce keyframe */}
      <style>{`
        @keyframes dockBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          50% { transform: scale(0.9); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Glass container — gradient border via background trick */}
      <div
        className="absolute pointer-events-auto transition-all duration-700"
        onClick={(e) => e.stopPropagation()}
        style={{
          left: `${figmaX(containerX)}%`,
          top: `${figmaY(containerY)}%`,
          transform: "translate(-50%, -50%)",
          borderRadius: 24,
          padding: 1,
          background: isDark
            ? "linear-gradient(132deg, rgba(255, 255, 255, 0.12) 7%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25) 97%)"
            : "linear-gradient(132deg, rgba(0, 0, 0, 0.21) 7%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.15) 97%)",
        }}
      >
        <div
          className="transition-all duration-700"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
            height: "fit-content",
            padding: 16,
            borderRadius: 23,
            background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0)",
            boxShadow: isDark ? GLASS_BOX_SHADOW_DARK : GLASS_BOX_SHADOW_LIGHT,
            backdropFilter: "blur(2.5px)",
            WebkitBackdropFilter: "blur(2.5px)",
          }}
        >
        {/* Label */}
        <span
          className="select-none transition-colors duration-700"
          style={{
            fontFamily: `var(--font-silkscreen), "Silkscreen", cursive`,
            fontSize: 14,
            lineHeight: "1.36em",
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.8)",
            whiteSpace: "nowrap",
          }}
        >
          Personal projects
        </span>

        {/* Icons row — overlapping by 16px */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {PROJECTS.map((project, index) => {
            // Hide icon if it's been launched into the detail window
            if (project.key === launchedIconKey) return null;

            const rotation = index % 2 === 0 ? -8 : 8;
            const baseTransform = `rotate(${rotation}deg)`;

            const isImpacted = project.key === impactIconKey;
            const isPopped = project.key === poppedIconKey;

            // Priority: impact (squash) > popped (pop up) > normal
            let iconTransform = baseTransform;
            let iconTransition = "transform 0.3s ease";
            if (isImpacted) {
              iconTransform = `${baseTransform} scaleX(1.3) scaleY(0.7)`;
              iconTransition = "transform 0.1s ease-out";
            } else if (isPopped) {
              iconTransform = `${baseTransform} translateY(-40px) scale(1.1)`;
              iconTransition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
            }

            return (
              <div
                key={project.key}
                style={{
                  marginLeft: 0,
                  transform: iconTransform,
                  transition: iconTransition,
                  zIndex: index,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  onIconClick?.(project, rect);
                }}
              >
                <ProjectIcon
                  color={project.color}
                  size={48}
                  label={project.label}
                  videoSrc={project.videoSrc}
                />
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}
