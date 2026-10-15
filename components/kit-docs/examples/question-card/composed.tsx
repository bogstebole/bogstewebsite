"use client";

import { useState, type CSSProperties } from "react";
import { Button, QuestionFieldRow, QuestionOptionRow, QuestionShell } from "inline-chat-kit";

const URGENCY = [
  { id: "now", title: "In the next few days", description: "Something has already changed" },
  { id: "soon", title: "Within a month", description: "It is coming, but there is time" },
  { id: "planning", title: "Just planning ahead", description: "Nothing has happened yet" },
];

const ground: CSSProperties = {
  padding: "var(--ick-space-6)",
  borderRadius: "var(--ick-question-radius-group)",
  background: "var(--ick-question-surface)",
};

/**
 * A fourth kind of question (pick one *and* add a note) that the kit does not
 * ship. The shell draws the card, header and footer; the rows are the kit's own.
 */
export default function ComposedQuestion() {
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const commit = () => {
    if (!picked) return;
    const title = URGENCY.find((option) => option.id === picked)?.title;
    setSent(note.trim() ? `${title}: “${note.trim()}”` : `${title}`);
  };

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <div style={ground}>
        <QuestionShell
          number={3}
          title="How soon do they need this?"
          subtitle="Roughly is fine: it decides what we look at first"
          footer={
            <Button variant="secondary" size="m" disabled={!picked} onClick={commit}>
              Next
            </Button>
          }
        >
          {URGENCY.map((option, i) => (
            <QuestionOptionRow
              key={option.id}
              letter={"abc"[i]}
              title={option.title}
              description={option.description}
              selected={picked === option.id}
              onClick={() => setPicked(option.id)}
            />
          ))}
          <QuestionFieldRow
            letter="d"
            label="Anything we should know"
            placeholder="Optional"
            value={note}
            onChange={setNote}
            onEnter={commit}
          />
        </QuestionShell>
      </div>
      <p style={{ margin: "12px 0 0", fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {sent ? `committed → ${sent}` : "pick one, add a note if you like, press Next"}
      </p>
    </div>
  );
}
