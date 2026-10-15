"use client";

import { Loader, type LoaderVariant } from "inline-chat-kit";

const VARIANTS: { variant: LoaderVariant; note: string }[] = [
  { variant: "dots", note: "nothing back yet" },
  { variant: "shimmer", note: "words standing in for something" },
];

export default function LoaderVariants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%", maxWidth: 520 }}>
      {VARIANTS.map(({ variant, note }) => (
        <div
          key={variant}
          style={{
            flex: "1 1 200px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: 20,
            border: "1px solid var(--ick-border)",
            borderRadius: 12,
            background: "var(--ick-surface)",
          }}
        >
          <div style={{ fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
            {variant}: {note}
          </div>
          <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>
            <Loader variant={variant}>{variant === "shimmer" ? "Searching the archive…" : null}</Loader>
          </div>
        </div>
      ))}
    </div>
  );
}
