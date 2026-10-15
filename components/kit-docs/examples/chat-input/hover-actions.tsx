"use client";

import { useState } from "react";
import { HoverActionsRow, defaultInlineAnimConfig } from "inline-chat-kit";

const MESSAGE = "What holds a proton together, and why can’t we pull a single quark out of it?";

/** The row under a settled bubble: copy, edit, and, when the bubble is clamped, read more. */
export default function HoverActionsRowExample() {
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [last, setLast] = useState("Hover the bubble");

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, width: "100%", maxWidth: 400 }}
    >
      <div
        style={{
          padding: "10px 16px",
          borderRadius: 20,
          background: "var(--ick-surface-active)",
          color: "var(--ick-ink)",
          fontSize: 13,
          lineHeight: 1.5,
          ...(isExpanded ? {} : { display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }),
        }}
      >
        {MESSAGE}
      </div>
      <div style={{ width: "100%", minHeight: 32 }}>
        <HoverActionsRow
          showActions={hovered}
          showReadMore
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          value={MESSAGE}
          onCopy={() => setLast("onCopy")}
          onEdit={() => setLast("onEdit")}
          ac={defaultInlineAnimConfig}
        />
      </div>
      <div style={{ fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>{last}</div>
    </div>
  );
}
