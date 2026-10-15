"use client";

import { useEffect, useState } from "react";
import { ChatInput, type ChatInputState } from "inline-chat-kit";

/**
 * Fully controlled: you own `value` and `state`, and moving `state` between
 * its four values is the whole choreography.
 */
export default function ChatInputInteractive() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");

  // Stands in for a model: the answer "arrives" 1.6s after sending.
  useEffect(() => {
    if (state !== "responding") return;
    const timer = window.setTimeout(() => setState("resting"), 1600);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <ChatInput
        state={state}
        value={value}
        placeholder="Type, press enter, then hover the bubble…"
        onChange={(next) => {
          setValue(next);
          setState(next ? "typing" : "idle");
        }}
        onSubmit={() => setState("responding")}
        onStop={() => setState("resting")}
        // Hover actions on the settled bubble: editing puts it back into `typing`.
        onCopy={(text) => navigator.clipboard?.writeText(text)}
        onEdit={() => setState("typing")}
      />
    </div>
  );
}
