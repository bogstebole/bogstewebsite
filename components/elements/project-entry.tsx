"use client";

import { forwardRef } from "react";
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
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick?: (key: string) => void;
  primaryColor: string;
  primary40: string;
  isDark: boolean;
}

export const ProjectEntry = forwardRef<HTMLDivElement, ProjectEntryProps>(
  function ProjectEntry(
    {
      entryKey,
      icon,
      label,
      tags,
      inProgress,
      appStore,
      isHovered,
      isDimmed,
      isActive,
      onMouseEnter,
      onMouseLeave,
      onClick,
      primaryColor,
      primary40,
    },
    ref,
  ) {
    const tagBg = "#F3F3F3";

    const handleClick = () => {
      if (!onClick || inProgress) return;
      onClick(entryKey);
    };

    return (
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
        style={{
          alignItems: "start",
          cursor: inProgress ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          gap: 8,
          height: "fit-content",
          opacity: isDimmed ? 0.5 : 1,
          paddingBlock: 8,
          paddingInline: 0,
          transition: "opacity 0.2s ease",
          visibility: isActive ? "hidden" : "visible",
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
  },
);
