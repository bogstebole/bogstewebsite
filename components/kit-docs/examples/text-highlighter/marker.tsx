"use client";

import { useState } from "react";
import { TextHighlighter } from "inline-chat-kit";

const ANSWER =
  "Particle physics studies the most fundamental constituents of matter and the forces that act between them. The Standard Model organises twelve fermions (six quarks and six leptons) plus the force-carrying bosons into a single coherent framework.";

/** Drag across the words to mark them. Click a mark to reply to it or remove it. */
export default function TextHighlighterMarker() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
      <TextHighlighter text={ANSWER} onHighlightComplete={setLast} />
      <p style={{ margin: "20px 0 0", fontSize: 12, color: "var(--ick-ink-faint)" }}>
        {last ? `Highlighted: “${last}”` : "Drag across a phrase to mark it."}
      </p>
    </div>
  );
}
