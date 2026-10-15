"use client";

import { InlineCitation, type Source } from "inline-chat-kit";

const TIMETABLE: Source = { id: "srbvoz", title: "Srbijavoz: Belgrade to Novi Sad timetable", origin: "srbvoz.rs" };
const FARES: Source = { id: "fares", title: "Intercity fares, autumn 2026", origin: "fares.pdf, page 2" };

const answer = {
  margin: 0,
  fontSize: "var(--ick-answer-size)",
  lineHeight: "var(--ick-answer-leading)",
  letterSpacing: "var(--ick-answer-tracking)",
  color: "var(--ick-ink)",
} as const;

/**
 * Given the passage it speaks for, a citation marks it. Given none, the
 * marker stands on its own after the words before it.
 */
export default function SourcesMarkers() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 560 }}>
      <p style={answer}>
        The fast train takes 36 minutes
        <InlineCitation index={1} source={TIMETABLE} /> and costs 690 dinars
        <InlineCitation index={2} source={FARES} />.
      </p>
      <p style={answer}>
        <InlineCitation index={1} source={TIMETABLE}>
          The fast train takes 36 minutes
        </InlineCitation>{" "}
        and{" "}
        <InlineCitation index={2} source={FARES}>
          costs 690 dinars
        </InlineCitation>
        .
      </p>
    </div>
  );
}
