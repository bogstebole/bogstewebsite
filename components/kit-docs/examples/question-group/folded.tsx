"use client";

import { useState } from "react";
import { FOLDABLE_FROM, QuestionGroup, type Answer, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "topic",
    type: "single",
    title: "What are we sorting out?",
    shortTitle: "Topic",
    options: [
      { id: "home", title: "Care at home" },
      { id: "move", title: "A place to move to" },
    ],
  },
  {
    id: "help",
    type: "multi",
    title: "What do they need help with?",
    shortTitle: "Support needed",
    options: [
      { id: "meals", title: "Meals", short: "Meals" },
      { id: "mobility", title: "Getting around", short: "Mobility" },
      { id: "meds", title: "Medication", short: "Meds" },
    ],
  },
  {
    id: "about",
    type: "inputs",
    title: "Who are we caring for?",
    shortTitle: "About them",
    fields: [
      { id: "name", label: "Their name" },
      { id: "age", label: "Age" },
    ],
  },
];

/** A step the conversation has moved past. Press the title to open it. */
export default function QuestionGroupFolded() {
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({
    topic: { optionId: "home" },
    help: { optionIds: ["meals", "meds"] },
    about: { values: { name: "Milica Stevanović", age: "84" } },
  });
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <QuestionGroup
        id="care-folded"
        title="Setting up care"
        questions={QUESTIONS}
        answers={answers}
        activeIndex={editing}
        collapsible={QUESTIONS.length >= FOLDABLE_FROM}
        onCommit={(id, answer) => {
          setAnswers((all) => ({ ...all, [id]: answer }));
          setEditing(null);
        }}
        onEdit={setEditing}
      />
    </div>
  );
}
