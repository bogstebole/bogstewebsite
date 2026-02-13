"use client";

import { useSyncExternalStore } from "react";

function formatClock(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getDay()];
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${h}:${m}:${s}; ${day} ${d},${y}`;
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot(): string {
  return formatClock(new Date());
}

function getServerSnapshot(): string {
  return "";
}

import { useTheme } from "@/components/providers/theme-provider";

export function LiveClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { isDark } = useTheme();

  if (!time) return null;

  return (
    <span
      className="select-none transition-colors duration-700"
      style={{
        fontFamily: `"SF Mono", "SFMono-Regular", var(--font-geist-mono), monospace`,
        fontSize: 14,
        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
        letterSpacing: "0.02em",
      }}
    >
      {time}
    </span>
  );
}
