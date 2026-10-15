"use client";

import { useEffect, useState } from "react";
import { Button, Conversation } from "inline-chat-kit";

const SCRIPT = [
  {
    question: "How long should the bulk ferment be?",
    answer: [
      "At 24°C, four to five hours.",
      "Go by the dough rather than the clock: it should have grown by about half.",
    ],
  },
  {
    question: "And the cold proof?",
    answer: [
      "Twelve to sixteen hours in the fridge, covered.",
      "It slows the yeast more than the bacteria, which is where the sour comes from.",
      "Longer than a day and the gluten starts to give way.",
    ],
  },
  {
    question: "Can I bake it straight from the fridge?",
    answer: [
      "Yes, a cold loaf is easier to score and holds its shape in the oven.",
      "Give it five more minutes with the lid on.",
      "Nothing else changes.",
    ],
  },
];

/** Send a question: it is brought to the top and held there while its answer grows underneath. */
export default function ConversationAnchored() {
  const [sent, setSent] = useState(1);
  const [lines, setLines] = useState(SCRIPT[0].answer.length);
  const growing = lines < SCRIPT[sent - 1].answer.length;

  // The newest answer arrives a line at a time.
  useEffect(() => {
    if (!growing) return;
    const timer = window.setTimeout(() => setLines((n) => n + 1), 700);
    return () => window.clearTimeout(timer);
  }, [growing, lines]);

  const send = () => {
    setSent((n) => n + 1);
    setLines(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <div style={{ display: "flex", flexDirection: "column", height: 280 }}>
        <Conversation anchorId={`turn-${sent - 1}`} anchorOffset={8}>
          {SCRIPT.slice(0, sent).map((turn, i) => (
            <div key={i} id={`turn-${i}`} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  alignSelf: "flex-end",
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: "var(--ick-surface-active)",
                  color: "var(--ick-ink)",
                  fontSize: 14,
                }}
              >
                {turn.question}
              </div>
              {turn.answer.slice(0, i === sent - 1 ? lines : undefined).map((line) => (
                <p key={line} style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--ick-ink-soft)" }}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </Conversation>
      </div>
      <Button variant="outline" size="s" onClick={send} disabled={growing || sent === SCRIPT.length}>
        {sent === SCRIPT.length ? "That is the whole script" : "Send the next question"}
      </Button>
    </div>
  );
}
