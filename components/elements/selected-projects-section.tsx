"use client";

import { useRef, useState } from "react";
import { motion, type MotionProps } from "framer-motion";
import { AppStoreBadge } from "@/components/elements/app-store-badge";
import { useRippleWave } from "@/hooks/useRippleWave";

interface SelectedProjectsSectionProps {
  onNotesClick: (rect: DOMRect) => void;
  onVorliClick: () => void;
  /** blurAnim object from V2Canvas — passed straight to motion.div */
  animate: MotionProps["animate"];
  /** blurTransition from V2Canvas */
  transition: MotionProps["transition"];
}

// 5-layer depth shadow matching Figma spec
const CARD_SHADOW = [
  "0px 5px 11px 0px rgba(0,0,0,0.10)",
  "0px 21px 21px 0px rgba(0,0,0,0.09)",
  "0px 47px 28px 0px rgba(0,0,0,0.05)",
  "0px 83px 33px 0px rgba(0,0,0,0.01)",
  "0px 130px 36px 0px rgba(0,0,0,0)",
].join(", ");

const CARD_STYLE: React.CSSProperties = {
  width: 138,
  height: 188,
  borderRadius: 23.5,
  background: "linear-gradient(to bottom, #ffffff, #f4f4f4)",
  border: "2.948px solid white",
  boxShadow: CARD_SHADOW,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 13.5,
  padding: "47px 11px",
  boxSizing: "border-box",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
};

function Tag({ label }: { label: string }) {
  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        borderRadius: 4,
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: "-0.04em",
          color: "#888",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function SelectedProjectsSection({
  onNotesClick,
  onVorliClick,
  animate,
  transition,
}: SelectedProjectsSectionProps) {
  const [notesHovered, setNotesHovered] = useState(false);
  const [vorliHovered, setVorliHovered] = useState(false);

  // Ripple wave refs
  const notesRippleRef = useRippleWave({ textStrength: 28, imageStrength: 0, speed: 380 });
  const vorliRippleRef = useRippleWave({ textStrength: 28, imageStrength: 0, speed: 380 });

  // Card refs for FLIP origin rect
  const notesCardRef = useRef<HTMLDivElement | null>(null);
  const vorliCardRef = useRef<HTMLDivElement | null>(null);

  // Merge ripple ref + card ref onto the same DOM node
  const setNotesRefs = (el: HTMLDivElement | null) => {
    notesCardRef.current = el;
    (notesRippleRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };
  const setVorliRefs = (el: HTMLDivElement | null) => {
    vorliCardRef.current = el;
    (vorliRippleRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  const hoverSpring = { type: "spring" as const, stiffness: 400, damping: 28 };

  return (
    <motion.div
      animate={animate}
      transition={transition}
      style={{
        marginTop: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transformOrigin: "50% 50%",
        flexShrink: 0,
      }}
    >
      {/* ── Notes card ── */}
      <motion.div
        ref={setNotesRefs}
        animate={{ y: notesHovered ? -6 : 0 }}
        transition={hoverSpring}
        onMouseEnter={() => setNotesHovered(true)}
        onMouseLeave={() => setNotesHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (notesCardRef.current) onNotesClick(notesCardRef.current.getBoundingClientRect());
        }}
        style={{
          ...CARD_STYLE,
          rotate: "5deg",
          marginRight: -21,
          zIndex: 1,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/notes.png"
          alt="Useless Notes"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 8,
            flexShrink: 0,
            rotate: "342.8deg",
            transformOrigin: "50% 50%",
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
          Notes
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Tag label="iOS" />
          <Tag label="Canvas" />
          <AppStoreBadge active={notesHovered} />
        </div>
      </motion.div>

      {/* ── Vorli card ── */}
      <motion.div
        ref={setVorliRefs}
        animate={{ y: vorliHovered ? -6 : 0 }}
        transition={hoverSpring}
        onMouseEnter={() => setVorliHovered(true)}
        onMouseLeave={() => setVorliHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onVorliClick();
        }}
        style={{
          ...CARD_STYLE,
          rotate: "-5deg",
          zIndex: 2,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/receipt.png"
          alt="Vorli"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: 8,
            flexShrink: 0,
            rotate: "359.41deg",
            transformOrigin: "50% 50%",
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
          Vorli
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Tag label="iOS" />
          <Tag label="AI Financial Assistant" />
        </div>
      </motion.div>
    </motion.div>
  );
}
