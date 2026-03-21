"use client";

import { ArrowUpRight } from "lucide-react";
import { AppStoreBadge } from "@/components/elements/app-store-badge";

interface ProjectEntryProps {
  entryKey: string;
  icon: React.ReactNode;
  label: string;
  tags: string[];
  inProgress?: boolean;
  appStore?: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  primaryColor: string;
  primary40: string;
  isDark: boolean;
}

export function ProjectEntry({
  icon,
  label,
  tags,
  inProgress,
  appStore,
  isHovered,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  primaryColor,
  primary40,
  isDark,
}: ProjectEntryProps) {
  const tagBg = isDark ? "rgba(255,255,255,0.08)" : "#F3F3F3";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        alignItems: "start",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        gap: 8,
        height: "fit-content",
        opacity: isDimmed ? 0.5 : 1,
        paddingBlock: 8,
        paddingInline: 0,
        transition: "opacity 0.2s ease",
        width: "fit-content",
      }}
    >
      {/* Icon + name row */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexShrink: 0,
          gap: 6,
          height: "fit-content",
        }}
      >
        {icon}
        <span
          style={{
            color: primaryColor,
            display: "inline-block",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 12,
            letterSpacing: "-0.01em",
            lineHeight: "16px",
          }}
        >
          {label}
        </span>
        <ArrowUpRight
          size={12}
          color={primaryColor}
          style={{
            flexShrink: 0,
            opacity: isHovered ? 0.7 : 0,
            transition: "opacity 0.15s ease",
          }}
        />
        {inProgress && (
          <span
            style={{
              color: primary40,
              flexShrink: 0,
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 9.5,
              letterSpacing: "0.03em",
              lineHeight: "12px",
            }}
          >
            In progress...
          </span>
        )}
      </div>

      {/* Tags row */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {tags.map((tag) => (
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
                display: "inline-block",
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
        {appStore && <AppStoreBadge active={isHovered} />}
      </div>
    </div>
  );
}
