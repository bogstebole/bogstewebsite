"use client";

import { useState } from "react";
import { Attachments, type Attachment } from "inline-chat-kit";

const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/></svg>`
  )}`;

const PICKED: Attachment[] = [
  { id: "kitchen", name: "kitchen.png", type: "image/png", size: 284_112, url: swatch("#d9f99d", "#15803d") },
  { id: "quote", name: "renovation-quote-2026.pdf", type: "application/pdf", size: 482_000 },
  {
    id: "contract",
    name: "a-contractor-agreement-with-a-name-long-enough-to-be-cut.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 92_400,
  },
];

/** A control: with onRemove, each one can be taken back out. Hover a picture for its button. */
export default function AttachmentsRemovable() {
  const [files, setFiles] = useState(PICKED);

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Attachments attachments={files} onRemove={(id) => setFiles((all) => all.filter((file) => file.id !== id))} />
      {files.length === 0 && (
        // Nothing to show draws nothing at all: not an empty row.
        <p style={{ margin: 0, fontSize: 13, color: "var(--ick-ink-faint)" }}>All removed. Press replay to start again.</p>
      )}
    </div>
  );
}
