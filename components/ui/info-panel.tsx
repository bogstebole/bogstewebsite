"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import type { WeatherState } from "@/components/canvas/weather/wmo-map";
import { LiveClock } from "@/components/ui/live-clock";

const CONDITION_LABELS: Record<WeatherState, string> = {
  clear_day: "Clear",
  clear_night: "Clear",
  partly_cloudy: "Partly Cloudy",
  overcast: "Overcast",
  rain: "Rain",
  heavy_rain: "Heavy Rain",
  snow: "Snow",
  fog: "Fog",
  thunderstorm: "Thunderstorm",
};

interface InfoPanelProps {
  tempC: number;
  condition: WeatherState;
  loading: boolean;
}

// ── Shared hover colors ───────────────────────────────────────────────────────
function hoverBg(isDark: boolean) {
  return isDark ? "rgba(79,115,255,0.16)" : "rgba(79,115,255,0.10)";
}

// ── Reusable highlighted link ─────────────────────────────────────────────────
function HoverLink({
  href,
  color,
  isDark,
  children,
}: {
  href: string;
  color: string;
  isDark: boolean;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto"
      style={{
        color,
        textDecoration: "none",
        cursor: "pointer",
        backgroundColor: hovered ? hoverBg(isDark) : "transparent",
        padding: "1px 4px",
        margin: "0 -4px",
        borderRadius: 2,
        transition: "background-color 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}

// ── Terminal section header ───────────────────────────────────────────────────
function TerminalCommand({
  command,
  isDark,
  suffix,
}: {
  command: string;
  isDark: boolean;
  suffix?: string;
}) {
  const textPrimary = isDark ? "rgba(255,255,255,0.7)" : "rgba(4,4,4,0.7)";
  const textHint = isDark ? "rgba(255,255,255,0.3)" : "rgba(4,4,4,0.3)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingBottom: 4,
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      <span>
        <span style={{ color: "#008bff" }}>~</span>
        <span style={{ color: "#888" }}>{" $ "}</span>
        <span style={{ color: textPrimary }}>{command}</span>
      </span>
      {suffix && <span style={{ color: textHint }}>{suffix}</span>}
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────────────
export function InfoPanel({ tempC, condition, loading }: InfoPanelProps) {
  const { isDark } = useTheme();
  const [isCelsius, setIsCelsius] = useState(true);
  const [tempHovered, setTempHovered] = useState(false);

  const displayTemp = isCelsius ? tempC : Math.round((tempC * 9) / 5 + 32);

  const textPrimary = isDark ? "rgba(255,255,255,0.7)" : "rgba(4,4,4,0.7)";

  return (
    <div
      className="pointer-events-none select-none"
      style={{
        fontFamily: `var(--font-jetbrains-mono), "JetBrains Mono", monospace`,
        fontSize: 12,
        lineHeight: 1.3,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ── whoami + personal projects ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

        {/* ~ $ whoami */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TerminalCommand command="whoami" isDark={isDark} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#888" }}>bogdan v33.2.20</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: textPrimary }}>design engineer</span>
              <span style={{ color: textPrimary }}>
                {"design lead at "}
                <HoverLink href="https://www.tenscope.com/" color="#4f73ff" isDark={isDark}>
                  tenscope [↗]
                </HoverLink>
              </span>
              <span style={{ color: textPrimary }}>
                <span style={{ color: "#4f73ff" }}>10+</span>
                {" years of experience"}
              </span>
              <span style={{ color: textPrimary }}>belgrade, serbia 🇷🇸</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── ~ $ weather -- location current ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TerminalCommand command="weather" isDark={isDark} suffix="-- location current" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              color: textPrimary,
              opacity: loading ? 0.3 : 1,
              transition: "opacity 0.5s",
            }}
          >
            Belgrade, Serbia
          </span>
          <button
            className="pointer-events-auto"
            onClick={() => setIsCelsius((v) => !v)}
            title={isCelsius ? "Switch to °F" : "Switch to °C"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              lineHeight: 1.3,
              opacity: loading ? 0.3 : 1,
              transition: "background-color 0.12s, opacity 0.5s",
              display: "flex",
              alignItems: "baseline",
              gap: 1,
              padding: "1px 4px",
              margin: "0 -4px",
              borderRadius: 2,
              backgroundColor: tempHovered && !loading ? hoverBg(isDark) : "transparent",
            }}
            onMouseEnter={() => setTempHovered(true)}
            onMouseLeave={() => setTempHovered(false)}
          >
            <span style={{ color: "#4f73ff" }}>{loading ? "--" : displayTemp}</span>
            <span
              style={{
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                fontSize: 8,
                lineHeight: 1,
                alignSelf: "flex-start",
                marginTop: 1,
              }}
            >
              °
            </span>
          </button>
          <span
            style={{
              color: "#9b9a95",
              opacity: loading ? 0.3 : 1,
              transition: "opacity 0.5s",
            }}
          >
            {CONDITION_LABELS[condition]}
          </span>
        </div>
      </div>

      {/* ── ~ $ date ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TerminalCommand command="date" isDark={isDark} />
        <LiveClock />
      </div>
    </div>
  );
}
