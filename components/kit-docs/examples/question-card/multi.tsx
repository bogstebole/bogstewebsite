"use client";

import { useState, type CSSProperties } from "react";
import { QuestionCard, type Answer, type Question, type QuestionState } from "inline-chat-kit";

const HELP: Question = {
  id: "help",
  type: "multi",
  title: "What do they need help with?",
  subtitle: "Pick everything that applies",
  shortTitle: "Support needed",
  allowOther: true,
  otherPlaceholder: "Something else",
  // With nothing picked, the button reads "None of these" instead of disabling.
  allowEmpty: true,
  options: [
    { id: "meals", title: "Meals", description: "Cooking and shopping", short: "Meals" },
    { id: "mobility", title: "Getting around", description: "Stairs, walks, appointments", short: "Mobility" },
    { id: "meds", title: "Medication", description: "Reminders and refills", short: "Meds" },
  ],
};

const ground: CSSProperties = {
  padding: "var(--ick-space-6)",
  borderRadius: "var(--ick-question-radius-group)",
  background: "var(--ick-question-surface)",
};

export default function QuestionCardMulti() {
  const [state, setState] = useState<QuestionState>("active");
  const [answer, setAnswer] = useState<Answer>();

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <div style={ground}>
        <QuestionCard
          question={HELP}
          number={3}
          state={state}
          answer={answer}
          onCommit={(next) => {
            setAnswer(next);
            setState("collapsed");
          }}
          onEdit={() => setState("active")}
        />
      </div>
      <p style={{ margin: "12px 0 0", fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        onCommit → {answer ? JSON.stringify(answer) : "…"}
      </p>
    </div>
  );
}
