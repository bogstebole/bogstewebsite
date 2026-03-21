"use client";

import { motion, useAnimation, type Variants } from "framer-motion";
import GlassButton from "./Glassmorphic Button Breakdown";

const USELESS_NOTES_ASSETS = [
  { type: "video" as const, src: "/assets/Useless Notes/Onboarding.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/Da bomb.MP4" },
  { type: "video" as const, src: "/assets/Useless Notes/Sharing.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/card burn.MP4" },
  { type: "image" as const, src: "/assets/Useless Notes/1Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/2Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/3Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/4Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/5Uslsnts.png" },
];

// Parent container for grid items — drives stagger via variants
const gridContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.32 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

// Each staggered item
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
};

type AnimationControls = ReturnType<typeof useAnimation>;

interface UselessNotesDetailProps {
  controls: AnimationControls;
}

export function UselessNotesDetail({ controls }: UselessNotesDetailProps) {
  return (
    <>
      {/* Description — staggered in first */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={itemVariants}
        transition={{ delay: 0.22 }}
        style={{
          color: "rgba(0,0,0,0.8)",
          fontFamily: '"Geist", system-ui, sans-serif',
          fontSize: 14,
          lineHeight: "18px",
          whiteSpace: "pre-wrap",
          flexShrink: 0,
        }}
      >
        {`It's a conceptual work that visually shows how we clutter our mental space.\nThe main "canvas" gets more "useless" over time, totally packed with notes and links, and the "find" mode is kind of the opposite, showing how we can only find things when we really need them. It's a reflection on the whole concept of how we deal with information overload today.`}
      </motion.div>

      {/* Download button */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={itemVariants}
        transition={{ delay: 0.29 }}
        style={{ flexShrink: 0 }}
      >
        <GlassButton>Download the app</GlassButton>
      </motion.div>

      {/* Media grid — stagger driven by gridContainerVariants */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={gridContainerVariants}
        style={{
          borderRadius: 32,
          padding: 8,
          columns: 3,
          columnGap: 8,
          width: "100%",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        {USELESS_NOTES_ASSETS.map((asset, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              breakInside: "avoid",
              marginBottom: 8,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            }}
          >
            {asset.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={encodeURI(asset.src)}
                alt={`Useless Notes screenshot ${i + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <video
                src={encodeURI(asset.src)}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
