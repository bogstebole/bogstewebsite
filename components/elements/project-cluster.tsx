"use client";

import { figmaX, figmaY } from "@/lib/figma-scale";
import { FIGMA_POSITIONS } from "@/lib/constants";
import { ProjectIcon } from "./project-icon";

const PROJECTS = [
  {
    key: "weather" as const,
    color: "#4A90D9",
    label: "Weather Wear",
    videoSrc: "/videos/weather.mp4",
  },
  {
    key: "zouns" as const,
    color: "#7B61B8",
    label: "Zouns",
    videoSrc: "/videos/zone.mp4",
  },
  {
    key: "uselessNote" as const,
    color: "#D4A843",
    label: "Useless Notes",
    videoSrc: "/videos/notes.mp4",
  },
  {
    key: "scanspend" as const,
    color: "#4AAD6B",
    label: "ScanSpend",
    videoSrc: "/videos/receipt.mp4",
  },
];

export function ProjectCluster() {
  const positions = FIGMA_POSITIONS.projects;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {PROJECTS.map((project) => {
        const pos = positions[project.key];
        const transform =
          project.key === "uselessNote" ? "rotate(12deg)" : undefined;

        return (
          <div
            key={project.key}
            className="absolute pointer-events-auto"
            style={{
              left: `${figmaX(pos.x)}%`,
              top: `${figmaY(pos.y)}%`,
              transform,
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
        className="absolute select-none"
        style={{
          left: `${figmaX(positions.label.x)}%`,
          top: `${figmaY(positions.label.y)}%`,
          fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
          fontSize: 14,
          color: "rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        Personal projects
      </span>
    </div>
  );
}
