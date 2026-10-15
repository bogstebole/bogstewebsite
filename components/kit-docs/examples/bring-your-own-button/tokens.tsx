"use client";

import { useState, type CSSProperties } from "react";
import { AnswerActions, Approval, ChatInput, EmptyState, type Decision, type Verdict } from "inline-chat-kit";

/* Level 1: tokens on a wrapper. No component, no selector, and every button
   inside follows, the composer's send glyph included. */
const brand = {
  "--ick-btn-radius": "8px",
  "--ick-btn-weight": "600",

  "--ick-btn-primary-bg": "#2563eb",
  "--ick-btn-primary-ink": "#ffffff",
  "--ick-btn-primary-border": "transparent",
  "--ick-btn-primary-shadow": "none",
  "--ick-btn-primary-shadow-hover": "0 2px 8px rgb(37 99 235 / 0.35)",
  "--ick-btn-primary-shadow-press": "none",

  "--ick-btn-outline-border": "rgb(37 99 235 / 0.45)",
  "--ick-btn-outline-border-hover": "#2563eb",

  "--ick-btn-ghost-ink-hover": "#2563eb",
  "--ick-btn-ghost-bg-hover": "rgb(37 99 235 / 0.08)",
} as CSSProperties;

export default function BringYourOwnButtonTokens() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<Verdict | null>(null);
  const [value, setValue] = useState("Which of the two offers is stronger?");

  return (
    <div style={{ ...brand, display: "grid", gap: 20, width: "100%", maxWidth: 480 }}>
      <EmptyState
        title="Plan a hire"
        suggestions={["Draft a job post", "Compare two offers"]}
        onSuggestion={setValue}
      />
      <Approval
        title="Send the offer letter"
        description="To ana.kovac@example.com"
        decision={decision}
        onDecide={setDecision}
      />
      <AnswerActions
        text="Two senior engineers in Q3, one in Q4."
        onRegenerate={() => {}}
        feedback={feedback}
        onFeedback={setFeedback}
        reveal={false}
      />
      {/* An 8px button in a 16px composer: concentric, from the one token. */}
      <ChatInput
        state={value ? "typing" : "idle"}
        value={value}
        onChange={setValue}
        onSubmit={() => setValue("")}
      />
    </div>
  );
}
