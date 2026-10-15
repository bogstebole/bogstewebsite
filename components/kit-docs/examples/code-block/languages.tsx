"use client";

import { CodeBlock } from "inline-chat-kit";

const SAMPLES = [
  {
    lang: "bash",
    code: `# install and start
npm install inline-chat-kit
npm run dev -- --port 5173`,
  },
  {
    lang: "python",
    code: `def pace(distance_km: float, target: str) -> float:
    minutes, seconds = (int(part) for part in target.split(":"))
    return (minutes * 60 + seconds) / distance_km`,
  },
  {
    lang: "sql",
    code: `SELECT runner, MIN(finish) AS best
FROM results
WHERE distance_km = 5
GROUP BY runner
ORDER BY best;`,
  },
  {
    lang: "diff",
    code: `- const restSeconds = 60;
+ const restSeconds = 90;
  export default restSeconds;`,
  },
];

/** Ink at four weights rather than a syntax palette; six tokens recolour it. */
export default function CodeBlockLanguages() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      {SAMPLES.map(({ lang, code }) => (
        <CodeBlock key={lang} code={code} lang={lang} />
      ))}
    </div>
  );
}
