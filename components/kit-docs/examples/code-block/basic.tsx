"use client";

import { CodeBlock } from "inline-chat-kit";

const CODE = `/** Seconds per kilometre for a target finish time. */
export function pace(distanceKm: number, target: string): number {
  const [minutes, seconds] = target.split(":").map(Number);
  return (minutes * 60 + seconds) / distanceKm;
}

pace(5, "25:00"); // 300, five minutes a kilometre`;

export default function CodeBlockBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <CodeBlock code={CODE} lang="ts" label="pace.ts" />
    </div>
  );
}
