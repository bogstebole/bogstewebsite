"use client";

import { ChatHeader, Context } from "inline-chat-kit";

/** Where it usually lives: in the header, beside the conversation's title. */
export default function ContextInHeader() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        border: "1px solid var(--ick-border)",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--ick-surface)",
      }}
    >
      {/* Not the page's banner, and not a heading in the page's outline. */}
      <ChatHeader title="Higgs boson" subtitle="14 turns" landmark={false} headingLevel={false}>
        <Context used={168_000} total={200_000} />
      </ChatHeader>
    </div>
  );
}
