"use client";

import { CodeBlock } from "inline-chat-kit";

const CODE = `export const week1 = { mon: "rest", tue: "4 km easy", wed: "cross-train 30 min", thu: "5 × 400 m at 5k effort, 90 s jog", fri: "rest", sat: "6 km easy", sun: "20 min walk" };`;

/** The block scrolls sideways; the column around it stays the width it was. */
export default function CodeBlockLongLines() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <CodeBlock code={CODE} lang="ts" />
    </div>
  );
}
