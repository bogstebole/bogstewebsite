"use client";

import { QuestionGroup, defaultFoldMotion, type Answer, type FoldMotion, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "topic",
    type: "single",
    title: "What are we sorting out?",
    shortTitle: "Topic",
    options: [{ id: "home", title: "Care at home" }],
  },
  {
    id: "help",
    type: "multi",
    title: "What do they need help with?",
    shortTitle: "Support needed",
    options: [
      { id: "meals", title: "Meals", short: "Meals" },
      { id: "meds", title: "Medication", short: "Meds" },
    ],
  },
  {
    id: "about",
    type: "inputs",
    title: "Who are we caring for?",
    shortTitle: "About them",
    fields: [{ id: "name", label: "Their name" }],
  },
];

const ANSWERS: Record<string, Answer | undefined> = {
  topic: { optionId: "home" },
  help: { optionIds: ["meals", "meds"] },
  about: { values: { name: "Milica Stevanović" } },
};

/** Every timing four times longer. Counts and distances stay as they are. */
const SLOWER = 4;
const slowly: Partial<FoldMotion> = {
  visualDuration: defaultFoldMotion.visualDuration * SLOWER,
  rowDuration: defaultFoldMotion.rowDuration * SLOWER,
  stagger: defaultFoldMotion.stagger * SLOWER,
  fadeIn: defaultFoldMotion.fadeIn * SLOWER,
  fadeOut: defaultFoldMotion.fadeOut * SLOWER,
  fadeInDelay: defaultFoldMotion.fadeInDelay * SLOWER,
};

export default function QuestionGroupFoldMotion() {
  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <QuestionGroup
        id="care-slow"
        title="Setting up care"
        questions={QUESTIONS}
        answers={ANSWERS}
        collapsible
        readOnly
        foldMotion={slowly}
      />
    </div>
  );
}
