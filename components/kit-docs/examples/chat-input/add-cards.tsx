"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddCardsOverlay, Button, defaultInlineAnimConfig } from "inline-chat-kit";

/**
 * The "+" menu on its own, inside a composer of your own. The cards fan out
 * from the right-hand end of the nearest positioned box (here, the pill).
 */
export default function AddCardsOverlayExample() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 420, height: 240 }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 44,
          padding: "0 6px 0 16px",
          borderRadius: 999,
          background: "var(--ick-surface-active)",
          color: "var(--ick-ink-faint)",
          fontSize: 13,
        }}
      >
        <span>Your own composer</span>
        <Button
          variant="ghost"
          icon={<Plus size={16} aria-hidden />}
          aria-label="Add"
          onClick={() => setIsAddOpen(true)}
          style={{ opacity: isAddOpen ? 0 : 1 }}
        />
        <AddCardsOverlay
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          // Called with the entry's label and its id. Match on the id; the label is translated.
          onAdd={(_label, id) => setPicked(id ?? null)}
          showInlineGlyph={false}
          showButtons
          ac={defaultInlineAnimConfig}
        />
      </div>
      <div style={{ fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {picked ? `onAdd: "${picked}"` : "Press + to open the menu"}
      </div>
    </div>
  );
}
