"use client";

import { ChatTurnRow, Conversation, useChatTurns, type SendHandler } from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (message, { signal }) {
  const answer =
    `On “${message}”: the box you typed into has travelled up to become this question, and a fresh one is ` +
    "already waiting at the bottom. You can type into it now; it sends once this answer has finished.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(45);
    yield word;
  }
};

export default function ConversationDocked() {
  // "at-send": the next composer appears the moment a message goes, not when the answer settles.
  const { turns, setDraft, submit, stop, isStreaming } = useChatTurns({ onSend: reply, nextTurn: "at-send" });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 420, width: "100%", maxWidth: 600 }}>
      {/* `dock`: the last child (the live composer) is pinned to the bottom edge. */}
      <Conversation dock>
        {turns.map((turn, i) => {
          const live = i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing");
          return (
            <ChatTurnRow
              key={turn.id}
              turn={turn}
              isActiveInput={live}
              questionAlign={live ? "stretch" : "end"}
              placeholder="Ask, then ask again while it answers…"
              onDraft={setDraft}
              onSubmit={submit}
              // The stop lives on the composer, which is always in view.
              busy={live ? isStreaming : undefined}
              onStop={live ? stop : undefined}
            />
          );
        })}
      </Conversation>
    </div>
  );
}
