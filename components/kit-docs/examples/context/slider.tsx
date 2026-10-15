"use client";

import { useState } from "react";
import { Context } from "inline-chat-kit";

const TOTAL = 200_000;

/**
 * Drag past 80% and the meter turns to the danger colour. Hover the ring for
 * the sentence a screen reader hears: it says what happens next.
 */
export default function ContextSlider() {
  const [used, setUsed] = useState(64_000);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 360 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Context used={used} total={TOTAL} />
        <span style={{ fontFamily: "var(--ick-font-mono)", fontSize: 12, color: "var(--ick-ink-faint)" }}>
          {used.toLocaleString("en-US")} / {TOTAL.toLocaleString("en-US")} tokens
        </span>
      </div>
      <input
        type="range"
        aria-label="Tokens used"
        min={0}
        // Past the total on purpose: a host counting its own tokens overshoots.
        max={TOTAL * 1.2}
        step={2_000}
        value={used}
        onChange={(event) => setUsed(Number(event.target.value))}
        style={{ width: "100%", margin: 0, accentColor: "var(--ick-ink)" }}
      />
    </div>
  );
}
