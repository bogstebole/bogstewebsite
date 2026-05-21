"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "@/components/ui/GlassButton.module.css";

export type ProjectKey = "notes" | "vorli" | "sticky";

export const PROJECT_ORDER: ProjectKey[] = ["notes", "vorli", "sticky"];

const TABS: Array<{ key: ProjectKey; icon: string }> = [
  { key: "notes", icon: "/images/notes.png" },
  { key: "vorli", icon: "/images/receipt.png" },
  { key: "sticky", icon: "/images/sticky.png" },
];

interface ProjectTabBarProps {
  active: ProjectKey;
  onChange: (key: ProjectKey) => void;
}

export function ProjectTabBar({ active, onChange }: ProjectTabBarProps) {
  const [hovered, setHovered] = useState<ProjectKey | null>(null);

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
          <motion.button
            key={tab.key}
            onClick={isActive ? undefined : () => onChange(tab.key)}
            onMouseEnter={() => { if (!isActive) setHovered(tab.key); }}
            onMouseLeave={() => setHovered(null)}
            className={isActive ? `${styles.glassBtn} ${styles.sizeM}` : ""}
            transition={{ duration: 0.15 }}
            style={
              isActive
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    padding: 0,
                    cursor: "default",
                    pointerEvents: "none",
                    flexShrink: 0,
                  }
                : {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    padding: 0,
                    border: "none",
                    backgroundColor: hovered === tab.key ? "rgba(0,0,0,0.07)" : "transparent",
                    cursor: "pointer",
                    borderRadius: 9999,
                    flexShrink: 0,
                    transition: "background-color 0.15s ease",
                  }
            }
          >
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
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
