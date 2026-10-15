"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerActions, type Verdict } from "inline-chat-kit";

const ANSWERS = [
  "Jog for about 90 seconds between 400 m repeats: long enough for your breathing to settle, short enough that your heart rate stays up. If the last two come in slower than the first, lengthen the jog rather than easing off the pace.",
  "Take 60 to 90 seconds of easy jogging between repeats. Walking is fine early in a block; by week four you should be able to jog the whole recovery. Slower repeats at the end mean the rest is too short, not that you are unfit.",
];

export default function AnswerActionsBasic() {
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Verdict | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Stands in for a call to your model.
  const regenerate = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setVersion((v) => (v + 1) % ANSWERS.length);
      setFeedback(null);
      setBusy(false);
    }, 1400);
  };

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 14,
          lineHeight: "var(--ick-answer-leading)",
          color: "var(--ick-ink)",
          opacity: busy ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {ANSWERS[version]}
      </p>
      <AnswerActions
        text={ANSWERS[version]}
        busy={busy}
        onRegenerate={regenerate}
        feedback={feedback}
        onFeedback={setFeedback}
      />
    </div>
  );
}
