"use client";

import { AnswerActions } from "inline-chat-kit";

const TEXT =
  "Jog for about 90 seconds between 400 m repeats: long enough for your breathing to settle, short enough that your heart rate stays up.";

/** Point at the space under the answer, or Tab into it: the row was there all along. */
export default function AnswerActionsReveal() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: "var(--ick-answer-leading)", color: "var(--ick-ink)" }}>
        {TEXT}
      </p>
      <AnswerActions text={TEXT} reveal onRegenerate={() => {}} onFeedback={() => {}} />
    </div>
  );
}
