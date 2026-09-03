"use client";

import { useState } from "react";
import { motion } from "motion/react";
import styles from "@/components/ui/GlassButton.module.css";

export type SectionProjectKey = "zoun" | "weatherWear" | "pauschalTracker" | "fynn" | "contentSnare" | "trigify";

export const SECTION_PROJECT_ORDER: SectionProjectKey[] = [
  "zoun",
  "weatherWear",
  "pauschalTracker",
  "fynn",
  "contentSnare",
];

const TABS: Array<{ key: SectionProjectKey; icon: string }> = [
  { key: "zoun", icon: "/images/globe.png" },
  { key: "weatherWear", icon: "/images/puffer.png" },
  { key: "pauschalTracker", icon: "/images/pauschal-tracker.png" },
  { key: "fynn", icon: "/images/fynn.png" },
  { key: "contentSnare", icon: "/images/content-snare.png" },
];

interface SectionProjectTabBarProps {
  active: SectionProjectKey;
  onChange: (key: SectionProjectKey) => void;
}

export function SectionProjectTabBar({ active, onChange }: SectionProjectTabBarProps) {
  const [hovered, setHovered] = useState<SectionProjectKey | null>(null);

  const [prevActive, setPrevActive] = useState<SectionProjectKey>(active);
  const [transformOrigin, setTransformOrigin] = useState("center");

  if (active !== prevActive) {
    const prevIndex = SECTION_PROJECT_ORDER.indexOf(prevActive);
    const currentIndex = SECTION_PROJECT_ORDER.indexOf(active);
    const origin = currentIndex > prevIndex ? "top" : currentIndex < prevIndex ? "bottom" : "center";
    setTransformOrigin(origin);
    setPrevActive(active);
  }

  const dial = {
    stiffness: 350,
    damping: 25,
    mass: 1,
    stretchAmount: 1.4,
    stretchDuration: 0.35,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "var(--color-bg-container)",
        borderRadius: 9999,
        padding: 4,
        width: 48,
        flexShrink: 0,
        pointerEvents: "auto",
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={isActive ? undefined : () => onChange(tab.key)}
            onMouseEnter={() => { if (!isActive) setHovered(tab.key); }}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              padding: 0,
              border: "none",
              backgroundColor: !isActive && hovered === tab.key ? "rgba(0,0,0,0.07)" : "transparent",
              cursor: isActive ? "default" : "pointer",
              borderRadius: 9999,
              flexShrink: 0,
              transition: "background-color 0.15s ease",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="active-section-tab-indicator"
                className={`${styles.glassBtn} ${styles.sizeM}`}
                animate={{
                  scaleY: [1, dial.stretchAmount, 1],
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  padding: 0,
                  borderRadius: 9999,
                  zIndex: 0,
                  pointerEvents: "none",
                  transition: "none",
                  transformOrigin,
                }}
                transition={{
                  scaleY: { duration: dial.stretchDuration, ease: "easeOut" },
                  layout: {
                    type: "spring",
                    stiffness: dial.stiffness,
                    damping: dial.damping,
                    mass: dial.mass,
                  }
                }}
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tab.icon}
              alt=""
              style={{
                width: isActive ? 22 : 18,
                height: isActive ? 22 : 18,
                objectFit: "cover",
                borderRadius: 5,
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
                opacity: isActive ? 1 : 0.4,
                filter: isActive ? "none" : "grayscale(1)",
                transition: "all 0.15s ease",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
