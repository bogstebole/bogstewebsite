"use client";

import { useEffect, useState } from "react";
import { Loader } from "inline-chat-kit";

const HISTORY = ["Lisbon weekend, three options", "Tram lines in the old town", "What a boson is"];

/**
 * Loading a list of past conversations, outside any chat: nothing else is
 * telling a screen reader that something is on its way, so the loader does.
 */
export default function LoaderWithLabel() {
  const [items, setItems] = useState<string[] | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setItems(HISTORY), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        minHeight: 132,
        padding: 16,
        border: "1px solid var(--ick-border)",
        borderRadius: 12,
        background: "var(--ick-surface)",
      }}
    >
      <div style={{ marginBottom: 12, fontSize: 12, color: "var(--ick-ink-faint)" }}>Recent</div>
      {items ? (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8, fontSize: 14 }}>
          {items.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      ) : (
        <Loader label="Loading your conversations" />
      )}
    </div>
  );
}
