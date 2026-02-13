"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Logo } from "./logo";
import { LiveClock } from "./live-clock";
import CelestialToggle from "./celestial-toggle";

export function Header() {
  const { isDark, setManual } = useTheme();

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        paddingTop: 32,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
      }}
    >
      <div
        className="mx-auto flex items-center justify-center"
        style={{
          width: "100%",
          paddingLeft: 24,
          paddingRight: 24,
          gap: 0,
          maxWidth: 800,
          minWidth: 640,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div className="pointer-events-auto">
          <Logo />
        </div>

        {/* Clock + toggle group */}
        <div className="pointer-events-auto flex items-center" style={{ gap: 16 }}>
          <LiveClock />
          <div
            style={{
              width: 200 * 0.27,
              height: 88 * 0.27,
              overflow: "visible",
            }}
          >
            <div style={{ transform: "scale(0.27)", transformOrigin: "top left" }}>
              <CelestialToggle isDark={isDark} onToggle={setManual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
