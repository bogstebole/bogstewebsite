"use client";

import { useState } from "react";
import { ChatInput, type ChatInputState } from "inline-chat-kit";

/** The idea, alone: type, send, and the pill you typed into becomes the bubble. */
export default function Morph() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <ChatInput
        state={state}
        value={value}
        onChange={(v) => {
          setValue(v);
          setState(v ? "typing" : "idle");
        }}
        onSubmit={() => {
          setState("responding");
          // Stands in for a model; the bubble rests once the answer is in.
          window.setTimeout(() => setState("resting"), 1600);
        }}
        onStop={() => setState("resting")}
        placeholder="Type something and press enter…"
      />
    </div>
  );
}
