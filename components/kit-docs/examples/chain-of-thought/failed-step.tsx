"use client";

import { ChainOfThought } from "inline-chat-kit";

/** A step that failed stays in the chain: the next one follows from it. */
export default function ChainOfThoughtFailedStep() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChainOfThought
        defaultOpen
        duration={6100}
        steps={[
          {
            id: "need",
            label: "Needs today’s timetable, not the published one",
            body: "Saturday services changed when the new line opened.",
          },
          {
            id: "api",
            label: "Couldn’t reach the operator’s live timetable",
            state: "error",
            body: "The request timed out twice after 5 seconds.",
          },
          {
            id: "fallback",
            label: "Used the timetable published on Monday instead",
            body: "It is four days old, so the answer should say so rather than present it as live.",
          },
        ]}
      />
    </div>
  );
}
