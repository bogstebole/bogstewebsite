"use client";

import { Sources, type Source } from "inline-chat-kit";

const SOURCES: Source[] = [
  // A link, with the passage that carries the claim.
  {
    id: "atlas",
    title: "Combined measurement of the Higgs boson mass",
    origin: "atlas.cern",
    url: "https://example.com/atlas-higgs-mass",
    quote: "125.25 ± 0.17 GeV, combining the ATLAS and CMS datasets.",
  },
  // A link and where it lives.
  { id: "pdg", title: "Particle Data Group: Higgs boson", origin: "pdg.lbl.gov", url: "https://example.com/pdg-higgs" },
  // No url: a row, not a link (a file the user uploaded, say).
  { id: "notes", title: "Seminar notes, week 9", origin: "notes.md, page 4" },
];

/** Open by default: sources are what lets somebody check an answer instead of trusting it. */
export default function SourcesList() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <Sources sources={SOURCES} />
    </div>
  );
}
