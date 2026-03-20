"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { Logo } from "./logo";
import CelestialToggle from "./celestial-toggle";

export function Header() {
  const { isDark, setManual } = useTheme();
  const pathname = usePathname();
  const isV2 = pathname === "/v2";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{
        paddingTop: 32,
        paddingLeft: 24,
        paddingRight: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <div className="pointer-events-auto">
        <Logo />
      </div>

      {/* Version switcher */}
      <div
        className="pointer-events-auto"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        <Link
          href="/"
          style={{
            padding: "3px 8px",
            borderRadius: 4,
            textDecoration: "none",
            color: !isV2 ? (isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)") : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
            border: !isV2 ? `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}` : "1px solid transparent",
            background: !isV2 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          v1
        </Link>
        <Link
          href="/v2"
          style={{
            padding: "3px 8px",
            borderRadius: 4,
            textDecoration: "none",
            color: isV2 ? (isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)") : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"),
            border: isV2 ? `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)"}` : "1px solid transparent",
            background: isV2 ? (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)") : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          v2
        </Link>
      </div>

      {/* Toggle */}
      <div
        className="pointer-events-auto"
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
  );
}
