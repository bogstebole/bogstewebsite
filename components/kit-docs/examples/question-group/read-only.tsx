"use client";

import { QuestionGroup, type Answer, type Question } from "inline-chat-kit";

const QUESTIONS: Question[] = [
  {
    id: "household",
    type: "single",
    title: "Who else lives in the household?",
    shortTitle: "Household",
    options: [
      { id: "alone", title: "They live alone" },
      { id: "family", title: "With family" },
    ],
  },
  {
    id: "visits",
    type: "multi",
    title: "When should someone visit?",
    shortTitle: "Visits",
    options: [
      { id: "mornings", title: "Weekday mornings" },
      { id: "evenings", title: "Weekday evenings" },
    ],
  },
];

const ANSWERS: Record<string, Answer | undefined> = {
  household: { optionId: "alone" },
  visits: { optionIds: ["mornings", "evenings"] },
};

/**
 * Last week's answers, shown back. Two questions are under `FOLDABLE_FROM`, so
 * it stays open, and with no title there is no header at all.
 */
export default function QuestionGroupReadOnly() {
  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <QuestionGroup id="care-history" questions={QUESTIONS} answers={ANSWERS} readOnly />
    </div>
  );
}
