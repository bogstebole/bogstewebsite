"use client";

import { TextHighlighter } from "inline-chat-kit";

const ANSWER =
  "Spin is an intrinsic angular momentum. Nothing is **literally rotating**: it is a quantum property that comes in fixed amounts and decides how a particle behaves in a magnetic field.";

/**
 * `marking={false}`: the answer is drawn and nothing else. Select and copy it
 * the way you would any text on a page.
 */
export default function TextHighlighterMarkingOff() {
  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
      <TextHighlighter text={ANSWER} marking={false} />
    </div>
  );
}
