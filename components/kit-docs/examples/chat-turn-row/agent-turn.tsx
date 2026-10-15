"use client";

import { ChatTurnRow, type ChatTurn } from "inline-chat-kit";

const INTRO =
  "The invoice job and checkout share the orders table, and on Mondays the job holds row locks on it for " +
  "about forty minutes. Here is what I would do:";

/* Everything under the question that is not prose is a part. Each is drawn by
   the component that owns it (a Reasoning, a Tool, a TaskList), and `at`
   says how much of the prose came before it, which is where it sits. */
const TURN: ChatTurn = {
  id: "slow-checkout",
  user: "Why is the checkout page slow on Mondays?",
  state: "resting",
  ai: `${INTRO}\n\nNone of this needs a deploy freeze; the first step alone should bring p95 back under 500ms.`,
  parts: [
    {
      kind: "reasoning",
      id: "think",
      state: "done",
      duration: 3200,
      text: "Mondays only, so something scheduled. Check what runs weekly and what it touches before guessing at traffic.",
    },
    {
      kind: "tool",
      id: "logs",
      name: "query_logs",
      state: "done",
      summary: "Lock waits on orders, Mondays 09:00–09:40",
      duration: 1240,
      input: { service: "checkout", metric: "lock_wait_ms", window: "28d" },
      output: { peak: "Mon 09:12", p95_ms: 3100, blocking_job: "invoices.weekly" },
    },
    {
      kind: "tasks",
      id: "plan",
      title: "Plan",
      at: INTRO.length,
      tasks: [
        { id: "replica", label: "Point the invoice job at the read replica", state: "pending" },
        { id: "batch", label: "Write invoices in batches of 500", state: "pending" },
        { id: "move", label: "Move the job to 03:00 on Sunday", state: "pending" },
      ],
    },
  ],
};

export default function ChatTurnRowAgentTurn() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChatTurnRow turn={TURN} />
    </div>
  );
}
