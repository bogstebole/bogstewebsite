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

      {PROJECTS.map((project) => {
        const pos = positions[project.key as keyof typeof positions];
        if (!pos || !("size" in pos)) return null;

        const baseTransform =
          project.key === "uselessNote" ? "rotate(12deg)" : "";

        // Hide icon if it's been launched into the detail window
        if (project.key === launchedIconKey) return null;

        const isImpacted = project.key === impactIconKey;
        const isPopped = project.key === poppedIconKey;

        // Priority: impact (squash) > popped (pop up) > normal
        let iconTransform = baseTransform || undefined;
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
            className="absolute pointer-events-auto"
            style={{
              left: `${figmaX(pos.x)}%`,
              top: `${figmaY(pos.y)}%`,
              transform: iconTransform,
              transition: iconTransition,
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent bubbling to GameCanvas
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

      {/* "Personal projects" label — centered under the icon grid */}
      <span
        className="absolute select-none transition-colors duration-700"
        style={{
          left: `${figmaX(positions.label.x)}%`,
          top: `${figmaY(positions.label.y)}%`,
          fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
          fontSize: 14,
          color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        Personal projects
      </span>
    </div>
  );
}
