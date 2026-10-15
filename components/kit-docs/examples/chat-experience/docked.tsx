"use client";

import { ChatExperience, type SendHandler } from "inline-chat-kit";

const ANSWERS: Record<string, string> = {
  "Summarise this week’s support tickets":
    "**142 tickets**, down 18% on last week. Most were about the new billing page: invoices showing the wrong " +
    "currency for customers in Switzerland. Three are still open and all three are waiting on finance.",
  "Which customers are at risk?":
    "**Northwind** and **Tallinn Freight** both opened four tickets this week and neither renewed in October. " +
    "Northwind’s admin also removed six seats on Tuesday.",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (message, { signal }) {
  const answer = ANSWERS[message] ?? "Try one of the openers. This preview only knows two answers.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(40);
    yield word;
  }
};

export default function ChatExperienceDocked() {
  return (
    <div style={{ position: "relative", height: 560, overflow: "hidden" }}>
      <ChatExperience
        onSend={reply}
        // The box stays at the bottom; a sent message travels up into the conversation.
        composer="docked"
        fill="container"
        title="Support desk"
        placeholder="Ask about your tickets…"
        empty={{
          title: "What do you want to know?",
          suggestions: Object.keys(ANSWERS),
        }}
        headerActions={false}
      />
    </div>
  );
}
