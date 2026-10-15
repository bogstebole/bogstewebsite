"use client";

import { useState } from "react";
import { QuestionGroup, type Answer, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "about",
    type: "inputs",
    title: "Who are we caring for?",
    shortTitle: "About them",
    fields: [
      { id: "name", label: "Their name", placeholder: "Milica Stevanović" },
      { id: "age", label: "Age", placeholder: "84" },
    ],
  },
  {
    id: "household",
    type: "single",
    title: "Who else lives in the household?",
    shortTitle: "Household",
    options: [
      { id: "alone", title: "They live alone" },
      { id: "partner", title: "With a partner" },
      { id: "family", title: "With family" },
    ],
  },
  {
    id: "help",
    type: "multi",
    title: "What do they need help with?",
    subtitle: "Pick everything that applies",
    shortTitle: "Support needed",
    options: [
      { id: "meals", title: "Meals", short: "Meals" },
      { id: "mobility", title: "Getting around", short: "Mobility" },
      { id: "meds", title: "Medication", short: "Meds" },
    ],
  },
];

/** Two answered, one to go. Press an answered row to change it. */
export default function QuestionGroupEdit() {
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({
    about: { values: { name: "Milica Stevanović", age: "84" } },
    household: { optionId: "alone" },
  });
  const [editing, setEditing] = useState<number | null>(null);

  const firstOpen = QUESTIONS.findIndex((question) => !answers[question.id]);

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <QuestionGroup
        id="care-edit"
        title="Setting up care"
        questions={QUESTIONS}
        answers={answers}
        // An edit takes over; when it is committed, the next open question comes back.
        activeIndex={editing ?? (firstOpen === -1 ? null : firstOpen)}
        onCommit={(id, answer) => {
          setAnswers((all) => ({ ...all, [id]: answer }));
          setEditing(null);
        }}
        onEdit={setEditing}
      />
    </div>
  );
}
