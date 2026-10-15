"use client";

import { useState, type CSSProperties } from "react";
import { QuestionCard, type Answer, type Question, type QuestionState } from "inline-chat-kit";

const HOUSEHOLD: Question = {
  id: "household",
  type: "single",
  title: "Who else lives in the household?",
  subtitle: "This tells us how much support is already around them",
  shortTitle: "Household",
  options: [
    { id: "alone", title: "They live alone", description: "Nobody else in the home" },
    { id: "partner", title: "With a partner", description: "Two in the household" },
    { id: "family", title: "With family", description: "Children or relatives in the home" },
  ],
};

/** The surface a card stands on. `QuestionGroup` draws this for you. */
const ground: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 520,
  margin: "0 auto",
  padding: "var(--ick-space-6)",
  borderRadius: "var(--ick-question-radius-group)",
  background: "var(--ick-question-surface)",
};

export default function QuestionCardBasic() {
  const [state, setState] = useState<QuestionState>("active");
  const [answer, setAnswer] = useState<Answer>();

  return (
    <div style={ground}>
      <QuestionCard
        question={HOUSEHOLD}
        number={2}
        state={state}
        answer={answer}
        onCommit={(next) => {
          setAnswer(next);
          setState("collapsed");
        }}
        onEdit={() => setState("active")}
      />
    </div>
  );
}
