"use client";

import { motion } from "framer-motion";

interface AppStoreBadgeProps {
  active: boolean;
  layoutId?: string;
  isGlass?: boolean;
}

const GLASS_BADGE_SHADOW = [
  "#FFFFFF -2px 2px 2px 1px inset",
  "#00000069 -1px -3px 3px -2px inset",
  "#000000D6 2px 1px 4px -4px inset",
  "#FFFFFF 0px 0px 7px 4px inset",
  "#00000040 0px -9px 14px 4px inset",
  "#0000001A -2px -3px 5px 3px inset",
  "#FFFFFF 0px 20px 8px -9px inset",
  "#0000001A 0px 34px 10px -9px inset",
  "#00000003 0px 27px 8px",
  "#00000003 0px 17px 6px",
  "#0000000D 0px 10px 6px",
  "#0000001A 0px 4px 4px",
  "#0000001A 0px 1px 3px",
].join(", ");

export function AppStoreBadge({ active, layoutId, isGlass }: AppStoreBadgeProps) {
  return active ? (
    <motion.div
      layoutId={layoutId}
      style={{
        alignItems: "center",
        backdropFilter: "blur(1px)",
        borderRadius: "calc(infinity * 1px)",
        boxShadow: [
          "#FFFFFF -2px 2px 2px 1px inset",
          "#00000069 -1px -3px 3px -2px inset",
          "#000000D6 2px 1px 4px -4px inset",
          "#FFFFFF 0px 0px 7px 4px inset",
          "#00000040 0px -9px 14px 4px inset",
          "#0000001A -2px -3px 5px 3px inset",
          "#FFFFFF 0px 20px 8px -9px inset",
          "#0000001A 0px 34px 10px -9px inset",
          "#00000003 0px 27px 8px",
          "#00000003 0px 17px 6px",
          "#0000000D 0px 10px 6px",
          "#0000001A 0px 4px 4px",
          "#0000001A 0px 1px 3px",
        ].join(", "),
        display: "flex",
        gap: 4,
        height: 21,
        justifyContent: "space-between",
        paddingBottom: 9,
        paddingLeft: 6,
        paddingRight: 12,
        paddingTop: 9,
        transition: "all 0.25s ease",
        whiteSpace: "nowrap",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/app-store-icon.png"
        alt=""
        style={{
          flexShrink: 0,
          height: 16,
          objectFit: "cover",
          rotate: "6.64deg",
          transformOrigin: "50% 50%",
          transition: "filter 0.25s ease",
          width: 16,
        }}
      />
      <span
        style={{
          color: "#111111",
          display: "inline-block",
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: "0.03em",
          lineHeight: "16px",
        }}
      >
        Live on App Store
      </span>
    </motion.div>
  ) : (
    <motion.div
      layoutId={layoutId}
      style={{
        alignItems: "center",
        backgroundColor: isGlass ? "transparent" : "#F3F3F3",
        backdropFilter: isGlass ? "blur(1px)" : undefined,
        WebkitBackdropFilter: isGlass ? "blur(1px)" : undefined,
        borderRadius: isGlass ? 999 : 4,
        boxShadow: isGlass ? GLASS_BADGE_SHADOW : "none",
        display: "flex",
        gap: 6,
        height: 18,
        paddingBottom: 3,
        paddingLeft: 4,
        paddingRight: 6,
        paddingTop: 3,
        transition: "background-color 0.25s ease, border-radius 0.25s ease, box-shadow 0.25s ease",
        whiteSpace: "nowrap",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/app-store-icon.png"
        alt=""
        style={{
          filter: isGlass ? "none" : "grayscale(100%)",
          flexShrink: 0,
          height: 16,
          objectFit: "cover",
          rotate: "6.64deg",
          transformOrigin: "50% 50%",
          transition: "filter 0.25s ease",
          width: 16,
        }}
      />
      <span
        style={{
          color: isGlass ? "#111111" : "#888888",
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 9.5,
          letterSpacing: "0.03em",
          lineHeight: "12px",
          transition: "color 0.25s ease",
        }}
      >
        Live on App Store
      </span>
    </motion.div>
  );
}
