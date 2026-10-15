"use client";

import type { ReactNode } from "react";
import { CodeBlock } from "inline-chat-kit";

const CODE = `{
  "distance_km": 5,
  "target": "25:00",
  "pace_s_per_km": 300
}`;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 6, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export default function CodeBlockBar() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 560 }}>
      <Row label="the language, by default">
        <CodeBlock code={CODE} lang="json" />
      </Row>
      <Row label='label="plan.json"'>
        <CodeBlock code={CODE} lang="json" label="plan.json" />
      </Row>
      <Row label="label={false}: still copyable">
        <CodeBlock code={CODE} lang="json" label={false} />
      </Row>
      <Row label="label={false} copyable={false}: no bar at all">
        <CodeBlock code={CODE} lang="json" label={false} copyable={false} />
      </Row>
    </div>
  );
}
