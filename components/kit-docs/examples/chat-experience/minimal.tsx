"use client";

import { ChatExperience, type SendHandler } from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* An async iterable of deltas: each string is appended to the answer as it
   arrives. `signal` aborts when the reader presses stop. */
const reply: SendHandler = async function* (message, { signal }) {
  const answer =
    `You asked: “${message}”. This answer is streamed a word at a time by an async generator: ` +
    "swap it for the stream your API returns and nothing else changes.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(30);
    yield word;
  }
};

export default function ChatExperienceMinimal() {
  return (
    <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
      <ChatExperience
        onSend={reply}
        fill="container"
        title="Chat"
        placeholder="Ask anything…"
        headerActions={false}
      />
    </div>
  );
}
