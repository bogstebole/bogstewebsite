"use client";

import { motion } from "framer-motion";
import styles from "@/components/ui/GlassButton.module.css";

export type ProjectKey = "notes" | "vorli" | "sticky";

export const PROJECT_ORDER: ProjectKey[] = ["notes", "vorli", "sticky"];

const TABS: Array<{ key: ProjectKey; label: string; icon: string }> = [
  { key: "notes", label: "Notes", icon: "/images/notes.png" },
  { key: "vorli", label: "Vorli", icon: "/images/receipt.png" },
  { key: "sticky", label: "Sticky", icon: "/images/sticky.png" },
];

interface ProjectTabBarProps {
  active: ProjectKey;
  onChange: (key: ProjectKey) => void;
}

export function ProjectTabBar({ active, onChange }: ProjectTabBarProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--color-bg-container)",
        borderRadius: 16,
        padding: 2,
        flexShrink: 0,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <motion.button
            key={tab.key}
            onClick={isActive ? undefined : () => onChange(tab.key)}
            className={isActive ? `${styles.glassBtn} ${styles.sizeS}` : ""}
            whileHover={!isActive ? { opacity: 0.75 } : undefined}
            transition={{ duration: 0.15 }}
            style={
              isActive
                ? {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    paddingLeft: 8,
                    paddingRight: 12,
                    cursor: "default",
                    pointerEvents: "none",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 12,
                    letterSpacing: "0.03em",
                  }
                : {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 9999,
                    height: 32,
                    paddingLeft: 12,
                    paddingRight: 12,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 12,
                    letterSpacing: "0.03em",
                    lineHeight: 1,
                    color: "var(--color-text-label)",
                    whiteSpace: "nowrap" as const,
                    userSelect: "none" as const,
                  }
            }
          >
            {isActive && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tab.icon}
                alt=""
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "cover",
                  borderRadius: 5,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1, whiteSpace: "nowrap", userSelect: "none" }}>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
