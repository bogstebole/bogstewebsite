"use client";

import { useState } from "react";
import type { WeatherState } from "./wmo-map";
import { useTheme } from "@/components/providers/theme-provider";

const CONDITION_LABELS: Record<WeatherState, string> = {
  clear_day:     "Clear",
  clear_night:   "Clear",
  partly_cloudy: "Partly Cloudy",
  overcast:      "Overcast",
  rain:          "Rain",
  heavy_rain:    "Heavy Rain",
  snow:          "Snow",
  fog:           "Fog",
  thunderstorm:  "Thunderstorm",
};

interface WeatherReadoutProps {
  tempC: number;
  condition: WeatherState;
  loading: boolean;
}

export function WeatherReadout({ tempC, condition, loading }: WeatherReadoutProps) {
  const { isDark } = useTheme();
  const [isCelsius, setIsCelsius] = useState(true);

  const displayTemp = isCelsius
    ? `${tempC}°C`
    : `${Math.round(tempC * 9 / 5 + 32)}°F`;

  const textColor  = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.38)";
  const toggleColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        bottom: 28,
        left: 28,
        fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
        fontSize: 11,
        lineHeight: "1.6",
        color: textColor,
        transition: "color 0.7s",
      }}
    >
      <div style={{ letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
        Belgrade
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 1 }}>
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", color: textColor, opacity: loading ? 0.3 : 1, transition: "opacity 0.5s" }}>
          {loading ? "--°C" : displayTemp}
        </span>
        <button
          className="pointer-events-auto"
          onClick={() => setIsCelsius((v) => !v)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: toggleColor,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = toggleColor)}
          title={isCelsius ? "Switch to °F" : "Switch to °C"}
        >
          °{isCelsius ? "F" : "C"}
        </button>
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.08em", opacity: loading ? 0.3 : 0.75, transition: "opacity 0.5s" }}>
        {CONDITION_LABELS[condition]}
      </div>
    </div>
  );
}
