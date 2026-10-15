"use client";

import { Chip, answerChips, type Answer, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "about",
    type: "inputs",
    title: "Who are we caring for?",
    shortTitle: "About them",
    fields: [
      { id: "name", label: "Their name" },
      { id: "age", label: "Age" },
      { id: "where", label: "Where they live" },
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
    id: "extra",
    type: "multi",
    title: "Anything else they need?",
    shortTitle: "Also",
    allowOther: true,
    options: [{ id: "company", title: "Company in the afternoons" }],
  },
];

const ANSWERS: Record<string, Answer> = {
  // Three values: two chips, then a count.
  about: { values: { name: "Milica Stevanović", age: "84", where: "Vračar, Beograd" } },
  // Several picks that all have a `short`: joined into one chip.
  help: { optionIds: ["meals", "mobility", "meds"] },
  // A pick and a typed "something else": one chip each.
  extra: { optionIds: ["company"], other: "Lifts to church on Sundays" },
};

/** A recap of your own, drawn from the same function the folded row uses. */
export default function QuestionCardSummaries() {
  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 14, color: "var(--ick-ink)" }}>
      <p style={{ margin: "0 0 12px" }}>Here’s what I have so far:</p>
      <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", margin: 0, alignItems: "center" }}>
        {QUESTIONS.map((question) => (
          <div key={question.id} style={{ display: "contents" }}>
            <dt style={{ color: "var(--ick-ink-faint)", fontSize: 13 }}>{question.shortTitle}</dt>
            <dd style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: 0, minWidth: 0 }}>
              {answerChips(question, ANSWERS[question.id]).map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
