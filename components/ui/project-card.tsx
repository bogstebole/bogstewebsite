"use client";

import { motion } from "framer-motion";
import type { AnimationControls } from "framer-motion";
import { ProjectTag } from "@/components/ui/project-tag";

// 5-layer depth shadow matching Figma spec
const CARD_SHADOW = [
  "0px 5px 11px 0px rgba(0,0,0,0.10)",
  "0px 21px 21px 0px rgba(0,0,0,0.09)",
  "0px 47px 28px 0px rgba(0,0,0,0.05)",
  "0px 83px 33px 0px rgba(0,0,0,0.01)",
  "0px 130px 36px 0px rgba(0,0,0,0)",
].join(", ");

export const CARD_STYLE: React.CSSProperties = {
  width: 160,
  height: 220,
  borderRadius: 30,
  background: "linear-gradient(to bottom, #ffffff, #f4f4f4)",
  border: "2.948px solid white",
  boxShadow: CARD_SHADOW,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
  boxSizing: "border-box",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
};

export const CARD_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
  mass: 0.3,
};

export const BADGE_CONTAINER_VARIANTS = {
  visible: { transition: { staggerChildren: 0.07 } },
  hidden: { transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05 } },
};

export const BADGE_ITEM_VARIANTS = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
  hidden: { opacity: 0, y: 6 },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

interface ProjectCardProps {
  image: string;
  alt: string;
  title: string;
  tags: string[];
  /** Fixed rotation angle — maintained on hover */
  rotate?: number;
  zIndex?: number;
  marginLeft?: number;
  marginRight?: number;
  onClick?: () => void;
  cursor?: React.CSSProperties["cursor"];
  pointerEvents?: React.CSSProperties["pointerEvents"];
  imageStyle?: React.CSSProperties;
  // Motion overrides (used by Notes card for FLIP and opacity animations)
  layoutId?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  animate?: object;
  whileHover?: object;
  transition?: object;
  onLayoutAnimationComplete?: () => void;
  // Animated tag controls (Notes card)
  tagControls?: AnimationControls;
  tagInitial?: string;
  // Extra slot after tags (e.g. AppStoreBadge)
  extraBadge?: React.ReactNode;
}

export function ProjectCard({
  image,
  alt,
  title,
  tags,
  rotate,
  zIndex,
  marginLeft,
  marginRight,
  onClick,
  cursor,
  pointerEvents,
  imageStyle,
  layoutId,
  cardRef,
  animate,
  whileHover,
  transition,
  onLayoutAnimationComplete,
  tagControls,
  tagInitial,
  extraBadge,
}: ProjectCardProps) {
  const defaultAnimate = rotate !== undefined ? { rotate } : undefined;
  const defaultWhileHover =
    rotate !== undefined ? { y: -16, rotate } : { y: -16 };

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      animate={animate ?? defaultAnimate}
      whileHover={whileHover ?? defaultWhileHover}
      transition={transition ?? CARD_SPRING}
      onLayoutAnimationComplete={onLayoutAnimationComplete}
      style={{
        ...CARD_STYLE,
        ...(zIndex !== undefined && { zIndex }),
        ...(marginLeft !== undefined && { marginLeft }),
        ...(marginRight !== undefined && { marginRight }),
        cursor: cursor ?? (onClick ? "pointer" : "default"),
        ...(pointerEvents !== undefined && { pointerEvents }),
      }}
      onClick={onClick}
    >
      {/* Icon + title */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 8,
            flexShrink: 0,
            ...imageStyle,
          }}
        />
        <span
          style={{
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 16.8,
            letterSpacing: "-0.04em",
            color: "#434343",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
        >
          {title}
        </span>
      </div>

      {/* Tags — animated (Notes) or static (all others) */}
      {tagControls ? (
        <motion.div
          animate={tagControls}
          initial={tagInitial ?? "visible"}
          variants={BADGE_CONTAINER_VARIANTS}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {tags.map((label) => (
            <motion.div key={label} variants={BADGE_ITEM_VARIANTS}>
              <ProjectTag label={label} variant="glass" />
            </motion.div>
          ))}
          {extraBadge && (
            <motion.div variants={BADGE_ITEM_VARIANTS}>{extraBadge}</motion.div>
          )}
        </motion.div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            width: "100%",
          }}
        >
          {tags.map((label) => (
            <ProjectTag key={label} label={label} variant="glass" />
          ))}
          {extraBadge}
        </div>
      )}
    </motion.div>
  );
}
