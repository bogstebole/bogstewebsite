"use client";

import { useRef } from "react";
import { ChatTurnRow, useChatTurns, type ChatInputHandle, type SendHandler } from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (message, { signal }) {
  const answer =
    `Noted: “${message}”. Every row above this one is finished, and none of them re-renders while this ` +
    "answer arrives: the hook leaves them untouched, and the row is memoised.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(30);
    yield word;
  }
};

export default function ChatTurnRowLive() {
  const activeInput = useRef<ChatInputHandle>(null);
  const { turns, setDraft, submit, stop, beginEdit, cancelEdit } = useChatTurns({ onSend: reply });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 560 }}>
      {turns.map((turn, i) => {
        // The last turn, while nobody has sent it yet, is the composer.
        const isActive = i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing");
        return (
          <ChatTurnRow
            key={turn.id}
            turn={turn}
            isActiveInput={isActive}
            inputRef={isActive ? activeInput : null}
            placeholder="Ask something, then ask again…"
            // The hook's own functions, passed straight through: they are stable.
            onDraft={setDraft}
            onSubmit={submit}
            onStop={stop}
            onEdit={beginEdit}
            onCancelEdit={cancelEdit}
          />
        );
      })}
    </div>
  );
}
