"use client";

import { useState } from "react";
import { AnswerActions, type Verdict } from "inline-chat-kit";

/** Press a thumb, then press it again: the second press reports `null`. */
export default function AnswerActionsVerdict() {
  const [feedback, setFeedback] = useState<Verdict | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <AnswerActions
        text="Jog for about 90 seconds between 400 m repeats."
        feedback={feedback}
        onFeedback={setFeedback}
      />
      <p style={{ margin: "10px 0 0", fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        feedback: {feedback ?? "null"}
      </p>
    </div>
  );
}
