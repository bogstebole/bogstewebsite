"use client";

import { useState } from "react";
import { InlineCitation, Sources, type Source } from "inline-chat-kit";

const SOURCES: Source[] = [
  {
    id: "atlas",
    title: "Combined measurement of the Higgs boson mass",
    origin: "atlas.cern",
    url: "https://example.com/atlas-higgs-mass",
    quote: "125.25 ± 0.17 GeV, combining the ATLAS and CMS datasets.",
  },
  {
    id: "pdg",
    title: "Particle Data Group: Higgs boson",
    origin: "pdg.lbl.gov",
    url: "https://example.com/pdg-higgs",
  },
];

/**
 * Press a number in the text: the entry it points at is marked, not
 * scrolled to: the reader keeps their place in the sentence.
 */
export default function SourcesTogether() {
  const [active, setActive] = useState<string | null>(null);
  const select = (_index: number, source?: Source) => setActive(source?.id ?? null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 560 }}>
      <p
        style={{
          margin: 0,
          // The answer's column, which the list's heading already sits on.
          paddingLeft: "var(--ick-answer-column)",
          fontSize: "var(--ick-answer-size)",
          lineHeight: "var(--ick-answer-leading)",
          letterSpacing: "var(--ick-answer-tracking)",
          color: "var(--ick-ink)",
        }}
      >
        The Higgs boson weighs{" "}
        <InlineCitation index={1} source={SOURCES[0]} onSelect={select}>
          about 125.25 GeV
        </InlineCitation>,{" "}
        roughly 133 protons. It is a point particle, so{" "}
        <InlineCitation index={2} source={SOURCES[1]} onSelect={select}>
          it has no measurable size at all
        </InlineCitation>
        .
      </p>
      <Sources sources={SOURCES} activeId={active} onSelect={(source) => setActive(source.id)} />
    </div>
  );
}
