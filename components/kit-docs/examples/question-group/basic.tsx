"use client";

import { useState } from "react";
import { FOLDABLE_FROM, QuestionGroup, type Answer, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "topic",
    type: "single",
    title: "What are we sorting out?",
    subtitle: "It decides what we look at first",
    shortTitle: "Topic",
    options: [
      { id: "home", title: "Care at home", description: "Help coming to them" },
      { id: "move", title: "A place to move to", description: "Assisted living or a care home" },
      { id: "unsure", title: "Not sure yet", description: "We’ll work it out together" },
    ],
  },
  {
    id: "help",
    type: "multi",
    title: "What do they need help with?",
    subtitle: "Pick everything that applies",
    shortTitle: "Support needed",
    allowOther: true,
    otherPlaceholder: "Something else",
    options: [
      { id: "meals", title: "Meals", description: "Cooking and shopping", short: "Meals" },
      { id: "mobility", title: "Getting around", description: "Stairs, walks, appointments", short: "Mobility" },
      { id: "meds", title: "Medication", description: "Reminders and refills", short: "Meds" },
    ],
  },
  {
    id: "about",
    type: "inputs",
    title: "Who are we caring for?",
    subtitle: "Just the basics for now",
    shortTitle: "About them",
    fields: [
      { id: "name", label: "Their name", placeholder: "Milica Stevanović" },
      { id: "age", label: "Age", placeholder: "84" },
      { id: "where", label: "Where they live", placeholder: "Vračar, Beograd", optional: true },
    ],
  },
];

export default function QuestionGroupBasic() {
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [editing, setEditing] = useState<number | null>(null);

  const firstOpen = QUESTIONS.findIndex((question) => !answers[question.id]);
  const done = firstOpen === -1;

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <QuestionGroup
        id="care-setup"
        title="Setting up care"
        questions={QUESTIONS}
        answers={answers}
        activeIndex={editing ?? (done ? null : firstOpen)}
        // Folds itself the moment the last answer lands.
        collapsible={done && QUESTIONS.length >= FOLDABLE_FROM}
        onCommit={(id, answer) => {
          setAnswers((all) => ({ ...all, [id]: answer }));
          setEditing(null);
        }}
        onEdit={setEditing}
      />
    </div>
  );
}
