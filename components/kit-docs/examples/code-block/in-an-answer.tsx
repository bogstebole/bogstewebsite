"use client";

import { TextHighlighter } from "inline-chat-kit";

const ANSWER = `Your target is **25 minutes for 5 km**, which is a pace of exactly five minutes a kilometre:

\`\`\`ts
const pace = (25 * 60) / 5; // 300 seconds per km
\`\`\`

Run the 400 m repeats a little faster than that, at about **1:55** each.`;

/** Drag across the prose to mark it. The fence renders whole and takes no marker. */
export default function CodeBlockInAnAnswer() {
  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 14, lineHeight: "var(--ick-answer-leading)" }}>
      <TextHighlighter text={ANSWER} />
    </div>
  );
}
