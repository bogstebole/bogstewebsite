"use client";

import { ChatTurnRow } from "inline-chat-kit";

/**
 * Sent, and nothing back yet. ChatTurnRow draws the dots on its own between
 * the question landing and the first word of the answer.
 */
export default function LoaderInATurn() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChatTurnRow
        turn={{
          id: "t1",
          user: "Which tram lines still run through the old town?",
          ai: "",
          parts: [],
          state: "responding",
        }}
      />
    </div>
  );
}
