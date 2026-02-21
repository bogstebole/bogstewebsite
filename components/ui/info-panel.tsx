"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import type { WeatherState } from "@/components/canvas/weather/wmo-map";

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

// ── Project row — whole row highlights when it contains links ─────────────────
interface TagDef {
  label: string;
  color: string;
  href?: string;
}

function ProjectRow({
  name,
  tags,
  textPrimary,
  isDark,
}: {
  name: string;
  tags: TagDef[];
  textPrimary: string;
  isDark: boolean;
}) {
  const hasLinks = tags.some((t) => !!t.href);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={hasLinks ? "pointer-events-auto" : undefined}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        whiteSpace: "nowrap",
        padding: "2px 6px",
        margin: "0 -6px",
        borderRadius: 2,
        backgroundColor: hovered && hasLinks ? hoverBg(isDark) : "transparent",
        transition: "background-color 0.12s",
      }}
      onMouseEnter={() => hasLinks && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: "#666" }}>→</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <span style={{ color: textPrimary }}>{name}</span>
        {tags.map((tag) =>
          tag.href ? (
            <a
              key={tag.label}
              href={tag.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: tag.color, textDecoration: "none", cursor: "pointer" }}
            >
              {tag.label}
            </a>
          ) : (
            <span key={tag.label} style={{ color: tag.color }}>
              {tag.label}
            </span>
          )
        )}
      </div>
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
  const textMuted = isDark ? "rgba(255,255,255,0.29)" : "rgba(0,0,0,0.29)";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        bottom: 28,
        left: 28,
        fontFamily: `var(--font-geist-mono), "SF Mono", "SFMono-Regular", monospace`,
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
                <HoverLink href="https://tenscope.io" color="#4f73ff" isDark={isDark}>
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

        {/* ~ $ personal projects */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TerminalCommand command="personal projects" isDark={isDark} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ProjectRow
              name="useless notes"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[
                { label: "[finished]", color: "#03940d" },
                {
                  label: "[app store]",
                  color: "#4f73ff",
                  href: "https://apps.apple.com/us/app/useless-notes/id6443455183",
                },
                {
                  label: "[↗]",
                  color: "#167fff",
                  href: "https://apps.apple.com/us/app/useless-notes/id6443455183",
                },
              ]}
            />
            <ProjectRow
              name="receipt"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[
                { label: "[finished]", color: "#03940d" },
                { label: "[local]", color: textMuted },
              ]}
            />
            <ProjectRow
              name="weather"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[{ label: "[in progress]", color: "#e57112" }]}
            />
            <ProjectRow
              name="zones"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[{ label: "[in progress]", color: "#e57112" }]}
            />
            <ProjectRow
              name="pacer"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[{ label: "[on hold]", color: textMuted }]}
            />
            <ProjectRow
              name="pauschal tracker"
              textPrimary={textPrimary}
              isDark={isDark}
              tags={[
                { label: "[finished]", color: "#03940d" },
                { label: "[local]", color: textMuted },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── ~ $ last listened to ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TerminalCommand command="last listened to" isDark={isDark} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#666" }}>♫</span>
          <span style={{ color: textPrimary }}>Tool - The pot</span>
          <span style={{ color: "#e57112" }}>[in progress]</span>
        </div>
      </div>

      {/* ── ~ $ weather -- location current ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TerminalCommand command="weather" isDark={isDark} suffix="-- location current" />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#666" }}>♫</span>
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
    </div>
  );
}
