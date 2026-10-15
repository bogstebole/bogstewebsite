"use client";

import { useEffect, useState } from "react";
import { AnswerActions, Approval, ChatInput, type Decision, type Verdict } from "inline-chat-kit";

/* Level 2: rules on what a button is for. A role survives a translation; a
   hashed class name or an aria-label does not. */
const CSS = `
  .roles [data-ick-role="stop"] {
    --ick-btn-primary-bg: #dc2626;
    --ick-btn-primary-ink: #ffffff;
    --ick-btn-primary-border: transparent;
  }
  .roles [data-ick-role="approval-deny"] {
    --ick-btn-ghost-ink: #e5484d;
    --ick-btn-ghost-ink-hover: #e5484d;
    --ick-btn-ghost-bg-hover: rgb(229 72 77 / 0.1);
  }
  .roles [data-ick-action="down"][aria-pressed="true"] {
    --ick-btn-ghost-ink: #e5484d;
  }
`;

export default function BringYourOwnButtonPerRole() {
  const [value, setValue] = useState("And the third candidate?");
  // An answer is arriving somewhere else: the composer offers a stop.
  const [busy, setBusy] = useState(true);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<Verdict | null>("down");

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 5000);
    return () => window.clearTimeout(timer);
  }, [busy]);

  return (
    <div className="roles" style={{ display: "grid", gap: 20, width: "100%", maxWidth: 480 }}>
      <style>{CSS}</style>
      <ChatInput
        state={value ? "typing" : "idle"}
        value={value}
        placeholder="Type, then send to see the stop again"
        busy={busy}
        onStop={() => setBusy(false)}
        onChange={setValue}
        onSubmit={() => setBusy(true)}
      />
      <Approval
        title="Delete the draft offers"
        description="Three drafts in Hiring/Offers. This cannot be undone."
        decision={decision}
        onDecide={setDecision}
      />
      <AnswerActions
        text="Both offers are within band; the second has the better equity terms."
        feedback={feedback}
        onFeedback={setFeedback}
        reveal={false}
      />
    </div>
  );
}
