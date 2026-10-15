"use client";

import { Sources, type Source } from "inline-chat-kit";

const SOURCES: Source[] = [
  { id: "timetable", title: "Srbijavoz: Belgrade to Novi Sad timetable", origin: "srbvoz.rs", url: "https://example.com/timetable" },
  { id: "fares", title: "Intercity fares, autumn 2026", origin: "fares.pdf, page 2" },
  { id: "bus", title: "Lasta: Saturday departures", origin: "lasta.rs", url: "https://example.com/lasta" },
];

/** Folded to its own row, which keeps the count. Opt in: it is open by default. */
export default function SourcesCollapsible() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <Sources title="Where this came from" sources={SOURCES} collapsible defaultOpen={false} />
    </div>
  );
}
