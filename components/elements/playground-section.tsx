"use client";

import { PlaygroundCard } from "@/components/ui/playground-card";

const labelStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
  fontSize: 10,
  letterSpacing: "0.1em",
  lineHeight: "12px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

export function PlaygroundSection() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 24,
        padding: "0 24px",
        marginTop: 32,
        width: "100%",
      }}
    >
      <div style={labelStyle}>Playground_</div>
      <PlaygroundCard />
    </div>
  );
}
