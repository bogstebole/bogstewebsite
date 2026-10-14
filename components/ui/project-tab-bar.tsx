"use client";

import { Fragment, useState } from "react";
import { motion } from "motion/react";
import styles from "@/components/ui/GlassButton.module.css";
import { HIDDEN_PROJECTS } from "@/lib/case-studies";

export type HeroProjectKey = "heroNotes" | "heroReceipt" | "heroRuntronome" | "heroDayside";
export type SectionProjectKey = "weatherWear" | "pauschalTracker" | "fynn" | "contentSnare" | "trigify" | "bankMigration" | "bankAudit";
/** Every project that opens in the detail panel. */
export type ProjectKey = HeroProjectKey | SectionProjectKey;

// Same order as the Personal_ and Client_ lists, so the tabs read the way the list does.
const ALL_TABS: Array<{ key: ProjectKey; icon: string; group: "personal" | "client" }> = [
  { key: "heroNotes", icon: "/images/notes.png", group: "personal" },
  { key: "heroReceipt", icon: "/images/receipt.png", group: "personal" },
  { key: "heroRuntronome", icon: "/images/runtronome.png", group: "personal" },
  { key: "heroDayside", icon: "/images/globe.png", group: "personal" },
  { key: "weatherWear", icon: "/images/puffer.png", group: "personal" },
  { key: "pauschalTracker", icon: "/images/pauschal-tracker.png", group: "personal" },
  { key: "fynn", icon: "/images/fynn.png", group: "client" },
  { key: "contentSnare", icon: "/images/content-snare.png", group: "client" },
  { key: "trigify", icon: "/images/trigify.svg", group: "client" },
  { key: "bankMigration", icon: "/images/bank-migration.svg", group: "client" },
  { key: "bankAudit", icon: "/images/bank-audit.svg", group: "client" },
];

const TABS = ALL_TABS.filter((tab) => !HIDDEN_PROJECTS.has(tab.key));

export const PROJECT_ORDER: ProjectKey[] = TABS.map((tab) => tab.key);

export const isProjectKey = (key: string | null): key is ProjectKey =>
  PROJECT_ORDER.includes(key as ProjectKey);

interface ProjectTabBarProps {
  active: ProjectKey;
  onChange: (key: ProjectKey) => void;
}

export function ProjectTabBar({ active, onChange }: ProjectTabBarProps) {
  const [hovered, setHovered] = useState<ProjectKey | null>(null);

  const [prevActive, setPrevActive] = useState<ProjectKey>(active);
  const [transformOrigin, setTransformOrigin] = useState("center");

  if (active !== prevActive) {
    const prevIndex = PROJECT_ORDER.indexOf(prevActive);
    const currentIndex = PROJECT_ORDER.indexOf(active);
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
      {TABS.map((tab, i) => {
        const isActive = tab.key === active;
        const startsGroup = i > 0 && TABS[i - 1].group !== tab.group;
        return (
          <Fragment key={tab.key}>
          {/* A hairline where Personal_ ends and Client_ begins */}
          {startsGroup && (
            <div style={{ width: 16, height: 1, marginBlock: 6, backgroundColor: "var(--color-border-soft)", flexShrink: 0 }} />
          )}
          <button
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
                layoutId="active-project-tab-indicator"
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
          </Fragment>
        );
      })}
    </div>
  );
}
