"use client";

import { useRef, useState } from "react";
import { Button, ChatInput, type ChatInputHandle, type ChatInputState } from "inline-chat-kit";

const PROMPTS = ["Summarise this thread", "Draft a reply to Milica", "What did we decide about pricing?"];

/** Reaching in from outside: fill the composer from a prompt library, then focus it. */
export default function ChatInputHandleExample() {
  const input = useRef<ChatInputHandle>(null);
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");

  const use = (prompt: string) => {
    // setValue writes the editor and calls onChange, so your state follows.
    input.current?.setValue(prompt);
    input.current?.focus();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 480 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PROMPTS.map((prompt) => (
          <Button key={prompt} variant="outline" size="s" onClick={() => use(prompt)}>
            {prompt}
          </Button>
        ))}
      </div>
      <ChatInput
        ref={input}
        state={state}
        value={value}
        placeholder="Pick a prompt, or type your own…"
        onChange={(next) => {
          setValue(next);
          setState(next ? "typing" : "idle");
        }}
        onSubmit={() => setState("resting")}
        onEdit={() => setState("typing")}
      />
    </div>
  );
}
