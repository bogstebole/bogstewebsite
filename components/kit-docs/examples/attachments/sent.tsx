"use client";

import { Attachments, type Attachment } from "inline-chat-kit";

/* SVG data URLs stand in for photos, so the example needs no files on disk. */
const swatch = (from: string, to: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="120" height="120" fill="url(#g)"/></svg>`
  )}`;

const SENT: Attachment[] = [
  { id: "kitchen", name: "kitchen.png", type: "image/png", size: 284_112, url: swatch("#d9f99d", "#15803d") },
  { id: "hallway", name: "hallway.jpg", type: "image/jpeg", size: 1_284_112, url: swatch("#bae6fd", "#1e3a8a") },
  { id: "quote", name: "renovation-quote-2026.pdf", type: "application/pdf", size: 482_000 },
  { id: "rooms", name: "room-measurements.csv", type: "text/csv", size: 1_204 },
];

/** A record: no onRemove, because the message has gone. Pictures show themselves; files show their name. */
export default function AttachmentsSent() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Attachments attachments={SENT} />
    </div>
  );
}
