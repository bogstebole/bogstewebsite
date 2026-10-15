"use client";

import type { ReactNode } from "react";
import { ChatTurnRow, type ChatTurn } from "inline-chat-kit";

const QUESTION = "Why is the checkout page slow on Mondays?";
const ANSWER =
  "Monday is when the weekly invoice job runs, and it shares a database with checkout. Between 09:00 and 09:40 " +
  "the job holds row locks on the orders table, and checkout waits on them: p95 goes from 420ms to 3.1s.";

const turn = (over: Partial<ChatTurn>): ChatTurn => ({
  id: "t1",
  user: QUESTION,
  ai: "",
  parts: [],
  state: "idle",
  ...over,
});

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 10, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** Built by hand, so nothing here moves: one turn in each of its four states. */
export default function ChatTurnRowStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%", maxWidth: 560 }}>
      <Labelled label="idle: an empty composer">
        <ChatTurnRow turn={turn({ id: "idle", user: "" })} isActiveInput placeholder="Ask about your store…" />
      </Labelled>
      <Labelled label="typing">
        <ChatTurnRow turn={turn({ id: "typing", state: "typing" })} isActiveInput />
      </Labelled>
      <Labelled label="responding: the answer arriving">
        <ChatTurnRow turn={turn({ id: "responding", state: "responding", ai: ANSWER.slice(0, 92) })} />
      </Labelled>
      <Labelled label="resting: settled, with its actions">
        <ChatTurnRow turn={turn({ id: "resting", state: "resting", ai: ANSWER })} />
      </Labelled>
    </div>
  );
}
