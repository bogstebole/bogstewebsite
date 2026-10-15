"use client";

import type { CSSProperties, ReactNode } from "react";
import { QuestionCard, type Question } from "inline-chat-kit";

const ABOUT: Question = {
  id: "about",
  type: "inputs",
  title: "Who are we caring for?",
  shortTitle: "About them",
  fields: [
    { id: "name", label: "Their name" },
    { id: "age", label: "Age" },
  ],
};

const HOUSEHOLD: Question = {
  id: "household",
  type: "single",
  title: "Who else lives in the household?",
  subtitle: "This tells us how much support is already around them",
  shortTitle: "Household",
  options: [
    { id: "alone", title: "They live alone" },
    { id: "partner", title: "With a partner" },
    { id: "family", title: "With family" },
  ],
};

const HELP: Question = {
  id: "help",
  type: "multi",
  title: "What do they need help with?",
  shortTitle: "Support needed",
  options: [
    { id: "meals", title: "Meals" },
    { id: "meds", title: "Medication" },
  ],
};

const ground: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--ick-space-5)",
  padding: "var(--ick-space-6)",
  borderRadius: "var(--ick-question-radius-group)",
  background: "var(--ick-question-surface)",
};

function Caption({ children }: { children: ReactNode }) {
  return (
    <div style={{ marginBottom: 8, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
      {children}
    </div>
  );
}

/** collapsed, active, upcoming: in the order they sit in a real step. */
export default function QuestionCardStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 520 }}>
      <div>
        <Caption>collapsed · active · upcoming</Caption>
        <div style={ground}>
          <QuestionCard
            question={ABOUT}
            number={1}
            state="collapsed"
            answer={{ values: { name: "Milica Stevanović", age: "84" } }}
          />
          <QuestionCard question={HOUSEHOLD} number={2} state="active" />
          <QuestionCard question={HELP} number={3} state="upcoming" />
        </div>
      </div>
      <div>
        <Caption>collapsed, readOnly: a record, not a control</Caption>
        <div style={ground}>
          <QuestionCard question={HOUSEHOLD} number={2} state="collapsed" readOnly answer={{ optionId: "family" }} />
        </div>
      </div>
    </div>
  );
}
