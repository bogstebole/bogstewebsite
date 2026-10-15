"use client";

import { ChatInput, type ChatInputState } from "inline-chat-kit";

const ROWS: { label: string; state: ChatInputState; busy?: boolean }[] = [
  { label: "idle", state: "idle" },
  { label: "typing", state: "typing" },
  { label: "responding", state: "responding" },
  { label: "resting", state: "resting" },
  // Not a state: a typing composer while an answer arrives somewhere else.
  { label: "typing + busy", state: "typing", busy: true },
];

const noop = () => {};

export default function ChatInputStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 480 }}>
      {ROWS.map(({ label, state, busy }) => (
        <div key={label}>
          <div style={{ marginBottom: 8, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
            {label}
          </div>
          <ChatInput
            state={state}
            busy={busy}
            value={state === "idle" ? "" : "What changed in the October release?"}
            placeholder="Ask about the release…"
            onChange={noop}
            onSubmit={noop}
            onStop={busy || state === "responding" ? noop : undefined}
          />
        </div>
      ))}
    </div>
  );
}
