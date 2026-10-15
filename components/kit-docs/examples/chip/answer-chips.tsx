"use client";

import { Chip, answerChips, type Answer, type Question } from "inline-chat-kit";

const INTERESTS: Question = {
  id: "interests",
  type: "multi",
  title: "What do you want to fit into the weekend?",
  shortTitle: "Interests",
  options: [
    { id: "food", title: "Food markets" },
    { id: "trams", title: "Old trams" },
    { id: "fado", title: "A fado night" },
    { id: "tiles", title: "The tile museum" },
  ],
};

const TRAVELLERS: Question = {
  id: "travellers",
  type: "inputs",
  title: "Who is coming?",
  shortTitle: "Travellers",
  fields: [
    { id: "adults", label: "Adults" },
    { id: "children", label: "Children", optional: true },
  ],
};

const ROWS: { question: Question; answer: Answer }[] = [
  { question: INTERESTS, answer: { optionIds: ["food", "trams", "fado", "tiles"] } },
  { question: TRAVELLERS, answer: { values: { adults: "2 adults", children: "1 child" } } },
];

/**
 * `answerChips` turns an answer into what a folded question shows: two
 * values at most, then a count.
 */
export default function ChipAnswerChips() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 420 }}>
      {ROWS.map(({ question, answer }) => (
        <div key={question.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 14, color: "var(--ick-ink-soft)" }}>{question.shortTitle}</span>
          <span style={{ display: "flex", gap: 6 }}>
            {answerChips(question, answer).map((text) => (
              <Chip key={text}>{text}</Chip>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
