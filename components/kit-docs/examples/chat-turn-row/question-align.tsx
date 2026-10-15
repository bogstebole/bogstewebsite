"use client";

import { ChatTurnRow, type ChatTurn } from "inline-chat-kit";

const EMPTY: ChatTurn = { id: "empty", user: "", ai: "", parts: [], state: "idle" };

/* `end`: a composer about to become your bubble, which sits right.
   `stretch`: the opening composer, lined up with whatever is above it. */
export default function ChatTurnRowQuestionAlign() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%", maxWidth: 560 }}>
      {(["end", "stretch"] as const).map((align) => (
        <div key={align}>
          <div style={{ marginBottom: 10, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
            questionAlign=&quot;{align}&quot;
          </div>
          <ChatTurnRow turn={{ ...EMPTY, id: align }} isActiveInput questionAlign={align} placeholder="Ask anything…" />
        </div>
      ))}
    </div>
  );
}
