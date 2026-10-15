"use client";

import { useState } from "react";
import { Highlighter, Share2, TextCursor } from "lucide-react";
import { ChatHeader, headerIconSize } from "inline-chat-kit";

const MODES = [
  { value: "marker", label: "Freeform marker", Icon: Highlighter },
  { value: "precise", label: "Precise text selection", Icon: TextCursor },
] as const;

/* A segmented control has no icon-and-label shape to fold into a menu, so it
   goes in as children: it sits before the actions and never collapses. */
function SelectionMode() {
  const [mode, setMode] = useState<"marker" | "precise">("marker");
  return (
    <div
      role="group"
      aria-label="Selection mode"
      style={{ display: "flex", gap: 2, padding: 2, borderRadius: 999, background: "var(--ick-surface-sunken)" }}
    >
      {MODES.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setMode(value)}
          aria-pressed={mode === value}
          aria-label={label}
          title={label}
          style={{
            display: "grid",
            placeItems: "center",
            width: 28,
            height: 28,
            border: 0,
            borderRadius: 999,
            cursor: "pointer",
            color: mode === value ? "var(--ick-ink)" : "var(--ick-ink-faint)",
            background: mode === value ? "var(--ick-surface-raised)" : "transparent",
          }}
        >
          <Icon size={headerIconSize.m} aria-hidden />
        </button>
      ))}
    </div>
  );
}

export default function ChatHeaderCustomControls() {
  return (
    <div style={{ width: "100%", maxWidth: 640, borderRadius: 16, overflow: "hidden", background: "var(--ick-page)" }}>
      <ChatHeader
        title="Sourdough in winter"
        align="center"
        variant="bordered"
        onBack={() => {}}
        landmark={false}
        actions={[{ id: "share", label: "Share", icon: <Share2 size={headerIconSize.m} aria-hidden /> }]}
      >
        <SelectionMode />
      </ChatHeader>
    </div>
  );
}
