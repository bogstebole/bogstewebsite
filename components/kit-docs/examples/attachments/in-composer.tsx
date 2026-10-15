"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput, formatSize, type Attachment, type ChatInputState } from "inline-chat-kit";

const FLOOR_PLAN: Attachment = {
  id: "floor-plan",
  name: "floor-plan.pdf",
  type: "application/pdf",
  size: 2_140_000,
};

/**
 * The composer keeps attachments itself unless you take over. Here they are
 * controlled: picked files come to `onAttach`, which is where you would upload
 * and attach the URL you get back. This preview uses a local object URL.
 */
export default function AttachmentsInComposer() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ChatInputState>("idle");
  const [attachments, setAttachments] = useState<Attachment[]>([FLOOR_PLAN]);
  const [sent, setSent] = useState<string | null>(null);

  // Object URLs pin the file in memory until revoked: revoke on remove and on unmount.
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const made = urls.current;
    return () => made.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const attach = (files: File[]) => {
    const added = files.map((file) => {
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      return { id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, url };
    });
    setAttachments((all) => [...all, ...added]);
  };

  const remove = (id: string) => {
    const gone = attachments.find((a) => a.id === id);
    if (gone?.url && urls.current.delete(gone.url)) URL.revokeObjectURL(gone.url);
    setAttachments((all) => all.filter((a) => a.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480 }}>
      <ChatInput
        state={state}
        value={value}
        placeholder="Ask about the floor plan…"
        attachments={attachments}
        onAttach={attach}
        onRemoveAttachment={remove}
        accept="image/*,application/pdf"
        multiple
        onChange={(next) => {
          setValue(next);
          setState(next ? "typing" : "idle");
        }}
        onSubmit={(text, files) => {
          const total = files.reduce((sum, file) => sum + (file.size ?? 0), 0);
          const count = `${files.length} ${files.length === 1 ? "attachment" : "attachments"}`;
          setSent(`Sent “${text || "(no text)"}” with ${count}, ${formatSize(total)}`);
          setState("resting");
        }}
        onEdit={() => setState("typing")}
      />
      <div style={{ fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {sent ?? "onSubmit(value, attachments) has not been called yet"}
      </div>
    </div>
  );
}
