"use client";

import { useState } from "react";
import { Button, Reasoning, type ReasoningState } from "inline-chat-kit";

const THOUGHT = `The user wants the cheapest way to get from Belgrade to Novi Sad on Saturday morning.

The train is faster since the new line opened, but the 7:05 bus is cheaper by a few hundred dinars. Worth giving both and letting them pick.`;

/**
 * Folding is the block's preference, not an order. Toggle it while it thinks,
 * then press Finish: whatever you chose survives the change of state.
 */
export default function ReasoningStaysOpen() {
  const [state, setState] = useState<ReasoningState>("thinking");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, width: "100%", maxWidth: 560 }}>
      <Reasoning state={state}>{THOUGHT}</Reasoning>
      <Button variant="outline" size="s" onClick={() => setState((s) => (s === "thinking" ? "done" : "thinking"))}>
        {state === "thinking" ? "Finish thinking" : "Think again"}
      </Button>
    </div>
  );
}
