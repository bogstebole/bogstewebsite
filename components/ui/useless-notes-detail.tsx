"use client";

import { motion, type Variants } from "framer-motion";
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

interface UselessNotesDetailProps {
  primaryColor: string;
  primary40: string;
  isDark: boolean;
}

export function UselessNotesDetail({
  primaryColor,
  primary40,
}: UselessNotesDetailProps) {
  const tagBg = "#F3F3F3";

  return (
    <>
      {/* Tags row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {["iOS", "Canvas"].map((tag) => (
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

        {/* Live on App Store */}
        <div
          style={{
            alignItems: "center",
            backgroundColor: tagBg,
            borderRadius: 4,
            display: "flex",
            gap: 4,
            height: 18,
            paddingBottom: 3,
            paddingLeft: 4,
            paddingRight: 6,
            paddingTop: 3,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/receipt.png"
            alt=""
            style={{
              filter: "grayscale(100%)",
              flexShrink: 0,
              height: 12,
              objectFit: "cover",
              rotate: "6.64deg",
              transformOrigin: "50% 50%",
              width: 12,
            }}
          />
          <span
            style={{
              color: primary40,
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: 9.5,
              letterSpacing: "0.03em",
              lineHeight: "12px",
            }}
          >
            Live on App Store
          </span>
        </div>
      </div>

      {/* Description — staggered in first */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
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
      <div style={{ flexShrink: 0 }}>
        <GlassButton>Download the app</GlassButton>
      </div>

      {/* Media grid — stagger driven by gridContainerVariants */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
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
