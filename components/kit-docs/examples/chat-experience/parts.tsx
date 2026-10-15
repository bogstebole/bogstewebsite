"use client";

import { ChatExperience, type ChatExperienceProps, type SendHandler } from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const THINKING =
  "Two people, Saturday evening. Walter takes bookings for the Dorćol place only. Check that one first, " +
  "and offer the earliest table after 19:30.";

/* A stream can carry more than prose. A string is appended to the answer; an
   object is a part, merged into the turn by its id, so sending the same id
   again updates it in place. */
const reply: SendHandler = async function* (_message, { signal }) {
  let thought = "";
  for (const word of THINKING.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(35);
    thought += word;
    yield { kind: "reasoning", id: "think", text: thought, state: "thinking" };
  }
  yield { kind: "reasoning", id: "think", state: "done" };

  const input = { restaurant: "Walter, Dorćol", date: "2026-10-17", party: 2 };
  yield { kind: "tool", id: "search", name: "check_availability", state: "running", input };
  await wait(900);
  yield {
    kind: "tool",
    id: "search",
    state: "done",
    summary: "2 tables free",
    duration: 880,
    output: { slots: ["19:45", "21:15"] },
  };

  for (const word of "Walter has a table for two at **19:45** on Saturday. Shall I book it?".split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(30);
    yield word;
  }

  yield {
    kind: "approval",
    id: "book",
    title: "Book a table at Walter?",
    description: "Saturday 17 October, 19:45, two people.",
    tool: { name: "book_table", input: { ...input, time: "19:45" } },
    choices: ["once", "deny"],
  };
};

/* The answer has finished by the time somebody decides, so the decision is
   written back with the PartWriter rather than streamed. Defined outside the
   component, so it is the same function on every render. */
const decide: ChatExperienceProps["onDecideApproval"] = (write, turnId, partId, decision) => {
  write(turnId, { kind: "approval", id: partId, decision });
  if (decision !== "denied") {
    write(turnId, { kind: "notice", id: "booked", text: "Booked. The confirmation is in your inbox." });
  }
};

export default function ChatExperienceParts() {
  return (
    <div style={{ position: "relative", height: 640, overflow: "hidden" }}>
      <ChatExperience
        onSend={reply}
        onDecideApproval={decide}
        fill="container"
        title="Concierge"
        placeholder="Ask the concierge…"
        empty={{
          title: "Where are we eating?",
          suggestions: ["Book a table for two at Walter on Saturday"],
        }}
        headerActions={false}
      />
    </div>
  );
}
