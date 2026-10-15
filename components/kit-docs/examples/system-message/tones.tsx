"use client";

import { SystemMessage } from "inline-chat-kit";

/** Two tones: something happened, or something went wrong. */
export default function SystemMessageTones() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <SystemMessage>The oldest messages are dropping out of the window.</SystemMessage>
      <SystemMessage tone="danger">Lost the connection. Nothing since your last message was saved.</SystemMessage>
    </div>
  );
}
