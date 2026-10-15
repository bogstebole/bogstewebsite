"use client";

import { Reasoning } from "inline-chat-kit";

const THOUGHT = `Two numbers matter: the mass, and how precisely it is known.

The combined ATLAS and CMS figure is 125.25 GeV, give or take 0.17. Quote both: “about 125” hides how well this is pinned down.`;

/** Thinking, done, and done but opened again. */
export default function ReasoningStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 560 }}>
      {/* Open on its own while it thinks, and the word shimmers. */}
      <Reasoning state="thinking">{THOUGHT}</Reasoning>

      {/* Folded once it is done, keeping how long it took. */}
      <Reasoning state="done" duration={12400}>
        {THOUGHT}
      </Reasoning>

      {/* Still reachable: the times it matters are the times the answer looks wrong. */}
      <Reasoning state="done" duration={12400} defaultOpen>
        {THOUGHT}
      </Reasoning>
    </div>
  );
}
