"use client";

import { forwardRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { ProjectTag } from "@/components/ui/project-tag";

interface ProjectEntryProps {
  entryKey: string;
  icon: React.ReactNode;
  label: string;
  tags: string[];
  inProgress?: boolean;
  clickable?: boolean;
  appStore?: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isActive: boolean;
  isReturning?: boolean;
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
      clickable,
      appStore,
      isHovered,
      isDimmed,
      isActive,
      isReturning,
      onMouseEnter,
      onMouseLeave,
      onClick,
      primaryColor,
      primary40,
    },
    ref,
  ) {
    const controls = useAnimation();
    useEffect(() => {
      if (isActive) {
        controls.set("hidden");
      } else if (isReturning) {
        controls.start("visible");
      }
    }, [isActive, isReturning, controls]);

    const handleClick = () => {
      if (!onClick || (inProgress && !clickable)) return;
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
          cursor: (inProgress && !clickable) ? "default" : "pointer",
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
        <motion.div
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
          }}
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
        </motion.div>

        {/* Tags row */}
        <motion.div
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut", delay: 0.07 } },
          }}
          style={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {tags.map((tag) => (
            <ProjectTag key={tag} label={tag} variant="light" />
          ))}
          {appStore && <AppStoreBadge active={isHovered} />}
        </motion.div>
      </div>
    );
  },
);
