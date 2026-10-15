"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { QuestionBadge, QuestionOptionRow, QuestionOtherRow, QuestionShell } from "inline-chat-kit";

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

export default function QuestionParts() {
  const [days, setDays] = useState<string[]>(["weekdays"]);
  const [other, setOther] = useState("");
  const toggle = (id: string) =>
    setDays((all) => (all.includes(id) ? all.filter((day) => day !== id) : [...all, id]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 520 }}>
      <div>
        <Caption>QuestionBadge: default · onCard · selected</Caption>
        <div style={{ ...ground, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <QuestionBadge>a</QuestionBadge>
          <QuestionBadge onCard>2</QuestionBadge>
          <QuestionBadge selected>3</QuestionBadge>
        </div>
      </div>

      <div>
        <Caption>QuestionShell card=false · rows without letters · QuestionOtherRow</Caption>
        <div style={ground}>
          {/* No box of its own: it stands straight on the ground. */}
          <QuestionShell title="When should someone visit?" subtitle="Pick any that work" card={false}>
            <QuestionOptionRow
              title="Every weekday"
              selected={days.includes("weekdays")}
              onClick={() => toggle("weekdays")}
            />
            <QuestionOptionRow
              title="Weekends too"
              selected={days.includes("weekends")}
              onClick={() => toggle("weekends")}
            />
            <QuestionOtherRow value={other} placeholder="Something else" onChange={setOther} />
          </QuestionShell>
        </div>
      </div>
    </div>
  );
}
