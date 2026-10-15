"use client";

import { useEffect, useState } from "react";
import { ChatInput, defaultInlineAnimConfig, type ChatInputState, type InlineAnimConfig } from "inline-chat-kit";

// Start from the defaults and override what you need: here, a looser, slower bubble.
const SOFT: InlineAnimConfig = {
  ...defaultInlineAnimConfig,
  bubble: { stiffness: 220, damping: 14, mass: 0.8 },
};

function Composer({ label, config }: { label: string; config?: InlineAnimConfig }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");

  useEffect(() => {
    if (state !== "responding") return;
    const timer = window.setTimeout(() => setState("resting"), 1200);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div>
      <div style={{ marginBottom: 8, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </div>
      <ChatInput
        state={state}
        value={value}
        animationConfig={config}
        placeholder="Type and send…"
        onChange={(next) => {
          setValue(next);
          setState(next ? "typing" : "idle");
        }}
        onSubmit={() => setState("responding")}
        onEdit={() => setState("typing")}
      />
    </div>
  );
}

export default function ChatInputMotion() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 480 }}>
      <Composer label="defaultInlineAnimConfig" />
      <Composer label="bubble: { stiffness: 220, damping: 14, mass: 0.8 }" config={SOFT} />
    </div>
  );
}
