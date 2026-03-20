"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { SunShadow } from "@/lib/sun-shadow";
type ShadowOverrides = {
  strength: number;
  angleOffset: number;
  blurMult: number;
  opacityMult: number;
  forceDay: boolean;
};

const DEFAULT_OVERRIDES: ShadowOverrides = {
  strength: 1,
  angleOffset: 0,
  blurMult: 1,
  opacityMult: 1,
  forceDay: false,
};

const PRESETS = [
  { label: "Dawn 6am", hour: 6 },
  { label: "Morning 9am", hour: 9 },
  { label: "Noon 12pm", hour: 12 },
  { label: "Afternoon 3pm", hour: 15 },
  { label: "Golden 6pm", hour: 18 },
  { label: "Night 9pm", hour: 21 },
];

interface SunDebugPanelProps {
  shadow: SunShadow;
  simulatedHour: number | null;
  overrides: ShadowOverrides;
  onHourChange: (hour: number | null) => void;
  onOverridesChange: (ov: ShadowOverrides) => void;
  effectiveLightPos?: { x: number; y: number; z: number };
}

// ─── tiny shared styles ────────────────────────────────────────────────────
const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 10,
  color: "rgba(0,0,0,0.4)",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};
const VALUE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: 11,
  color: "#1a1a1a",
};
const SECTION_LABEL: React.CSSProperties = {
  ...LABEL,
  fontSize: 9,
  color: "rgba(0,0,0,0.3)",
  marginBottom: 6,
};

// ─── reusable slider row ───────────────────────────────────────────────────
function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
  accent = "#6366f1",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
  accent?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={LABEL}>{label}</span>
        <span style={VALUE}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
      />
    </div>
  );
}

export function SunDebugPanel({
  shadow,
  simulatedHour,
  overrides,
  onHourChange,
  onOverridesChange,
  effectiveLightPos,
}: SunDebugPanelProps) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sliderHour = simulatedHour ?? new Date().getHours() + new Date().getMinutes() / 60;

  const set = <K extends keyof ShadowOverrides>(key: K, val: ShadowOverrides[K]) =>
    onOverridesChange({ ...overrides, [key]: val });

  const isModified =
    overrides.strength !== 1 ||
    overrides.angleOffset !== 0 ||
    overrides.blurMult !== 1 ||
    overrides.opacityMult !== 1 ||
    overrides.forceDay;

  const panel = (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: 264,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── Title bar ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px 9px",
          borderBottom: open ? "1px solid rgba(0,0,0,0.06)" : "none",
          cursor: "pointer",
        }}
      >
        <span style={{ ...LABEL, fontSize: 11, color: "rgba(0,0,0,0.65)" }}>
          ☀ Sun Debug
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {(simulatedHour !== null || isModified) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHourChange(null);
                onOverridesChange(DEFAULT_OVERRIDES);
              }}
              style={{
                ...LABEL,
                fontSize: 9,
                color: "rgba(0,0,0,0.35)",
                background: "rgba(0,0,0,0.05)",
                border: "none",
                borderRadius: 4,
                padding: "2px 7px",
                cursor: "pointer",
              }}
            >
              RESET ALL
            </button>
          )}
          <span style={{ ...LABEL, fontSize: 10 }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── Time ── */}
          <div>
            <div style={SECTION_LABEL}>Time of day</div>
            <SliderRow
              label="Hour"
              value={sliderHour}
              min={0} max={23.99} step={0.25}
              display={`${String(Math.floor(sliderHour)).padStart(2, "0")}:${String(Math.round((sliderHour % 1) * 60)).padStart(2, "0")}${simulatedHour !== null ? " sim" : ""}`}
              onChange={onHourChange}
              accent="#f59e0b"
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => onHourChange(p.hour)}
                  style={{
                    ...LABEL,
                    fontSize: 9,
                    color: simulatedHour === p.hour ? "#fff" : "rgba(0,0,0,0.5)",
                    background: simulatedHour === p.hour ? "#f59e0b" : "rgba(0,0,0,0.05)",
                    border: "none",
                    borderRadius: 4,
                    padding: "3px 7px",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Shadow overrides ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={SECTION_LABEL}>Shadow overrides</div>

            <SliderRow
              label="Strength"
              value={overrides.strength}
              min={0} max={4} step={0.05}
              display={`${overrides.strength.toFixed(2)}×`}
              onChange={(v) => set("strength", v)}
            />
            <SliderRow
              label="Angle offset"
              value={overrides.angleOffset}
              min={-180} max={180} step={1}
              display={`${overrides.angleOffset > 0 ? "+" : ""}${overrides.angleOffset}°`}
              onChange={(v) => set("angleOffset", v)}
              accent="#ec4899"
            />
            <SliderRow
              label="Blur"
              value={overrides.blurMult}
              min={0} max={4} step={0.05}
              display={`${overrides.blurMult.toFixed(2)}× → ${(shadow.blur).toFixed(1)}px`}
              onChange={(v) => set("blurMult", v)}
              accent="#10b981"
            />
            <SliderRow
              label="Opacity"
              value={overrides.opacityMult}
              min={0} max={4} step={0.05}
              display={`${overrides.opacityMult.toFixed(2)}× → ${shadow.opacity.toFixed(3)}`}
              onChange={(v) => set("opacityMult", v)}
              accent="#3b82f6"
            />

            {/* Force day toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={LABEL}>Force day</span>
              <button
                onClick={() => set("forceDay", !overrides.forceDay)}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  background: overrides.forceDay ? "#6366f1" : "rgba(0,0,0,0.12)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: overrides.forceDay ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          </div>

          {/* ── Live readout ── */}
          <div
            style={{
              background: "rgba(0,0,0,0.03)",
              borderRadius: 8,
              padding: "8px 10px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 10px",
            }}
          >
            {([
              ["isDay", shadow.isDay ? "yes" : "no"],
              ["offsetX", `${shadow.offsetX.toFixed(1)}px`],
              ["offsetY", `${shadow.offsetY.toFixed(1)}px`],
              ["blur", `${shadow.blur.toFixed(1)}px`],
              ["opacity", shadow.opacity.toFixed(3)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k}>
                <div style={{ ...LABEL, fontSize: 9 }}>{k}</div>
                <div style={{ ...VALUE, fontSize: 10 }}>{v}</div>
              </div>
            ))}
            {/* Color swatch spans both columns */}
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <div
                style={{
                  width: 40,
                  height: 14,
                  borderRadius: 3,
                  background: shadow.isDay ? shadow.color : "transparent",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
              <span style={{ ...LABEL, fontSize: 9, textTransform: "none" }}>{shadow.color}</span>
            </div>
            {/* Light position rows */}
            {effectiveLightPos && (
              <>
                {(["x", "y", "z"] as const).map((axis) => (
                  <div key={`light.${axis}`}>
                    <div style={{ ...LABEL, fontSize: 9 }}>light.{axis}</div>
                    <div style={{ ...VALUE, fontSize: 10 }}>{effectiveLightPos[axis]}</div>
                  </div>
                ))}
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );

  if (!mounted) return null;
  return createPortal(panel, document.body);
}
