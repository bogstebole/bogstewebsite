"use client";

import { useState } from "react";
import { TextHighlighter, type Source } from "inline-chat-kit";

const ANSWER = `### Tram 28, briefly

It runs from **Martim Moniz** to **Campo de Ourique**, through Graça, Alfama and Baixa.[^1]

- Ride it early: by ten the queue at Martim Moniz is *an hour long*.
- The stretch past the cathedral is the steepest on the network.[^2]

Fares, if you pay on board:

\`\`\`
single ride   3.10 EUR
24h pass      6.80 EUR
\`\`\`
`;

const SOURCES: Source[] = [
  { id: "carris", title: "Tram 28 route", origin: "carris.pt", url: "https://www.carris.pt" },
  { id: "guide", title: "Lisbon’s steepest streets", origin: "Lisbon city guide" },
];

/**
 * The text is markdown. A stroke can start in plain text and end inside
 * bold; the fenced block is preformatted, so it cannot be marked.
 */
export default function TextHighlighterMarkdown() {
  const [cited, setCited] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
      <TextHighlighter
        text={ANSWER}
        sources={SOURCES}
        onSelectSource={(index, source) => setCited(`[${index}] ${source?.title ?? "not loaded yet"}`)}
      />
      <p style={{ margin: "20px 0 0", fontSize: 12, color: "var(--ick-ink-faint)" }}>
        {cited ? `Selected source ${cited}` : "Press a citation number to select its source."}
      </p>
    </div>
  );
}
