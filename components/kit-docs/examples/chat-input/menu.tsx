"use client";

import { useMemo, useState } from "react";
import { Camera, FileText, Paperclip } from "lucide-react";
import { ChatInput, type ChatInputState, type ComposerMenuItem } from "inline-chat-kit";

export default function ChatInputMenu() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");
  const [picked, setPicked] = useState<string | null>(null);

  // `attach` with no onSelect opens the file picker; the others are yours.
  const menu = useMemo<ComposerMenuItem[]>(
    () => [
      { id: "attach", label: "Upload a file", icon: <Paperclip size={16} aria-hidden /> },
      { id: "screenshot", label: "Screenshot", icon: <Camera size={16} aria-hidden />, onSelect: () => setPicked("Screenshot") },
      { id: "template", label: "Use a template", icon: <FileText size={16} aria-hidden />, onSelect: () => setPicked("Template") },
    ],
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480 }}>
      <ChatInput
        state={state}
        value={value}
        menu={menu}
        placeholder="Press + for the menu…"
        onChange={(next) => {
          setValue(next);
          setState(next ? "typing" : "idle");
        }}
        onSubmit={() => setState("resting")}
        onEdit={() => setState("typing")}
      />
      <div style={{ fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {picked ? `onSelect: ${picked}` : "Nothing picked yet"}
      </div>
    </div>
  );
}
