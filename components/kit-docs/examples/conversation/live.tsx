"use client";

import { useRef } from "react";
import { ChatTurnRow, Conversation, useChatTurns, type ChatInputHandle, type SendHandler } from "inline-chat-kit";

const ANSWER =
  "Sourdough rises slower in winter because the starter’s yeast and bacteria both slow down below about 24°C. " +
  "Three things help.\n\n**Warmer water.** Mix the dough at 30–32°C so it starts at around 26°C. " +
  "**A warmer spot.** The oven with only the light on sits near 28°C. " +
  "**More starter.** Going from 20% to 30% of the flour weight takes an hour or two off the bulk ferment.\n\n" +
  "Judge it by the dough, not the clock: it is ready when it has grown by about half, feels airy, " +
  "and shows bubbles on the sides of the container.";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (_message, { signal }) {
  for (const word of ANSWER.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(35);
    yield word;
  }
};

/** Ask something, then scroll up while the answer arrives: it stops following you. */
export default function ConversationLive() {
  const activeInput = useRef<ChatInputHandle>(null);
  const { turns, setDraft, submit, stop, beginEdit, cancelEdit } = useChatTurns({ onSend: reply });

  return (
    // Conversation fills its parent, so the parent is a flex column with a height.
    <div style={{ display: "flex", flexDirection: "column", height: 400, width: "100%", maxWidth: 600 }}>
      <Conversation>
        {turns.map((turn, i) => {
          const isActive = i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing");
          return (
            <ChatTurnRow
              key={turn.id}
              turn={turn}
              isActiveInput={isActive}
              inputRef={isActive ? activeInput : null}
              placeholder="Why is my sourdough slow in winter?"
              onDraft={setDraft}
              onSubmit={submit}
              onStop={stop}
              onEdit={beginEdit}
              onCancelEdit={cancelEdit}
            />
          );
        })}
      </Conversation>
    </div>
  );
}
