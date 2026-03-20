"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { SceneSettings } from "./ShadowCanvas";

interface GlassSettingsPanelProps {
  settings: SceneSettings;
  onChange: (s: SceneSettings) => void;
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

// ─── toggle row ───────────────────────────────────────────────────────────
function ToggleRow({
  label,
  value,
  onChange,
  accent = "#6366f1",
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={LABEL}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: value ? accent : "rgba(0,0,0,0.12)",
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
            left: value ? 18 : 2,
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
  );
}

export const DEFAULT_SETTINGS: SceneSettings = {
  lightAzimuth: 225,
  lightAltitude: 12,
  lightIntensity: 1.5,
  lightColor: "#FFB347",
  shadowOpacity: 0.28,
  shadowRadius: 4,
  transmission: 1,
  ior: 1.5,
  roughness: 0.05,
  thickness: 10,
  chromaticAberration: 0.03,
  useBrandColor: true,
  glassCastShadow: false,
};

export function GlassSettingsPanel({ settings: s, onChange }: GlassSettingsPanelProps) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const set = <K extends keyof SceneSettings>(key: K, val: SceneSettings[K]) =>
    onChange({ ...s, [key]: val });

  // Compute live light position for readout
  const r2d = Math.PI / 180;
  const dist = 1384;
  const hDist = dist * Math.cos(s.lightAltitude * r2d);
  const lx = hDist * Math.sin(s.lightAzimuth * r2d);
  const ly = dist * Math.sin(s.lightAltitude * r2d);
  const lz = -hDist * Math.cos(s.lightAzimuth * r2d);

  const isModified = JSON.stringify(s) !== JSON.stringify(DEFAULT_SETTINGS);

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
          ◈ Glass Settings
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isModified && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(DEFAULT_SETTINGS);
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

          {/* ── Light ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={SECTION_LABEL}>Light</div>
            <SliderRow
              label="Azimuth"
              value={s.lightAzimuth}
              min={0} max={360} step={1}
              display={`${s.lightAzimuth}°`}
              onChange={(v) => set("lightAzimuth", v)}
              accent="#f59e0b"
            />
            <SliderRow
              label="Altitude"
              value={s.lightAltitude}
              min={0} max={90} step={0.5}
              display={`${s.lightAltitude}°`}
              onChange={(v) => set("lightAltitude", v)}
              accent="#f59e0b"
            />
            <SliderRow
              label="Intensity"
              value={s.lightIntensity}
              min={0} max={4} step={0.05}
              display={s.lightIntensity.toFixed(2)}
              onChange={(v) => set("lightIntensity", v)}
              accent="#f59e0b"
            />
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={LABEL}>Color</span>
                <span style={{ ...VALUE, fontSize: 10 }}>{s.lightColor.toUpperCase()}</span>
              </div>
              <input
                type="color"
                value={s.lightColor}
                onChange={(e) => set("lightColor", e.target.value)}
                style={{ width: "100%", height: 28, cursor: "pointer", borderRadius: 4, border: "1px solid rgba(0,0,0,0.1)", padding: 2 }}
              />
            </div>
          </div>

          {/* ── Shadow ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={SECTION_LABEL}>Shadow</div>
            <SliderRow
              label="Opacity"
              value={s.shadowOpacity}
              min={0} max={1} step={0.01}
              display={s.shadowOpacity.toFixed(2)}
              onChange={(v) => set("shadowOpacity", v)}
              accent="#3b82f6"
            />
            <SliderRow
              label="Radius"
              value={s.shadowRadius}
              min={1} max={16} step={0.5}
              display={s.shadowRadius.toFixed(1)}
              onChange={(v) => set("shadowRadius", v)}
              accent="#3b82f6"
            />
          </div>

          {/* ── Glass ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={SECTION_LABEL}>Glass</div>
            <SliderRow
              label="Transmission"
              value={s.transmission}
              min={0} max={1} step={0.01}
              display={s.transmission.toFixed(2)}
              onChange={(v) => set("transmission", v)}
              accent="#06b6d4"
            />
            <SliderRow
              label="IOR"
              value={s.ior}
              min={1} max={3} step={0.01}
              display={s.ior.toFixed(2)}
              onChange={(v) => set("ior", v)}
              accent="#06b6d4"
            />
            <SliderRow
              label="Roughness"
              value={s.roughness}
              min={0} max={0.5} step={0.005}
              display={s.roughness.toFixed(3)}
              onChange={(v) => set("roughness", v)}
              accent="#06b6d4"
            />
            <SliderRow
              label="Thickness"
              value={s.thickness}
              min={0} max={20} step={0.5}
              display={s.thickness.toFixed(1)}
              onChange={(v) => set("thickness", v)}
              accent="#06b6d4"
            />
            <SliderRow
              label="Chromatic Ab."
              value={s.chromaticAberration}
              min={0} max={0.2} step={0.002}
              display={s.chromaticAberration.toFixed(3)}
              onChange={(v) => set("chromaticAberration", v)}
              accent="#06b6d4"
            />
          </div>

          {/* ── Toggles ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={SECTION_LABEL}>Toggles</div>
            <ToggleRow
              label="Brand Color"
              value={s.useBrandColor}
              onChange={(v) => set("useBrandColor", v)}
              accent="#a855f7"
            />
            <ToggleRow
              label="Glass Shadow"
              value={s.glassCastShadow}
              onChange={(v) => set("glassCastShadow", v)}
              accent="#ef4444"
            />
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
              ["light.x", lx.toFixed(0)],
              ["light.y", ly.toFixed(0)],
              ["light.z", lz.toFixed(0)],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k}>
                <div style={{ ...LABEL, fontSize: 9 }}>{k}</div>
                <div style={{ ...VALUE, fontSize: 10 }}>{v}</div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );

  if (!mounted) return null;
  return createPortal(panel, document.body);
}
