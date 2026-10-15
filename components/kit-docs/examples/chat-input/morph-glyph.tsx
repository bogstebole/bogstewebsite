"use client";

import { useState } from "react";
import { MorphGlyph, type MorphGlyphProps } from "inline-chat-kit";

const MODES: MorphGlyphProps["mode"][] = ["send", "stop", "check", "mic"];

/** One slot, four shapes: the outgoing glyph slides up and out, the next slides up from below. */
export default function MorphGlyphExample() {
  const [mode, setMode] = useState<MorphGlyphProps["mode"]>("send");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 48,
          height: 48,
          borderRadius: 999,
          background: "var(--ick-surface-active)",
          color: "var(--ick-ink)",
        }}
      >
        <MorphGlyph mode={mode} size={18} />
      </div>
      <div role="group" aria-label="Glyph" style={{ display: "flex", gap: 4 }}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            style={{
              padding: "6px 12px",
              border: 0,
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: "var(--ick-font-mono)",
              fontSize: 12,
              color: mode === m ? "var(--ick-ink)" : "var(--ick-ink-faint)",
              background: mode === m ? "var(--ick-surface-active)" : "transparent",
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
