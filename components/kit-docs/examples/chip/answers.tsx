"use client";

import { Chip } from "inline-chat-kit";

const ANSWERS = [
  { label: "Destination", values: ["Lisbon"] },
  { label: "Dates", values: ["12–14 May"] },
  { label: "Travellers", values: ["2 adults", "1 child"] },
  { label: "Interests", values: ["Food", "Trams", "+2"] },
];

/** Answers already given, each as a small value at the end of its row. */
export default function ChipAnswers() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        padding: "8px 16px",
        border: "1px solid var(--ick-border)",
        borderRadius: 16,
        background: "var(--ick-surface)",
      }}
    >
      {ANSWERS.map(({ label, values }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 40 }}
        >
          <span style={{ fontSize: 14, color: "var(--ick-ink-soft)" }}>{label}</span>
          <span style={{ display: "flex", gap: 6 }}>
            {values.map((value) => (
              <Chip key={value}>{value}</Chip>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
