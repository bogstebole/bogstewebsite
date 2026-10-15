"use client";

import type { ReactNode } from "react";
import { EmptyState } from "inline-chat-kit";

const OPENERS = ["Summarise this thread", "Draft a reply", "List the action items"];

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 6, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </div>
      <div style={{ border: "1px dashed var(--ick-border)", borderRadius: 12 }}>{children}</div>
    </div>
  );
}

/** Every piece is optional, and nothing is drawn in place of what is left out. */
export default function EmptyStateSparse() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%", maxWidth: 520 }}>
      <Frame label="title only">
        <EmptyState title="Ask me anything about this inbox" />
      </Frame>

      <Frame label="openers only">
        <EmptyState suggestions={OPENERS} onSuggestion={(text) => console.log("send", text)} />
      </Frame>

      <Frame label="suggestions, but no onSuggestion">
        {/* An opener with nowhere to report would be a button that does nothing, so none are drawn. */}
        <EmptyState title="Ask me anything about this inbox" suggestions={OPENERS} />
      </Frame>
    </div>
  );
}
