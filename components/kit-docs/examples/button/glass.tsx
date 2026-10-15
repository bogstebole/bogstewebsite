"use client";

import { ArrowUp, Mic } from "lucide-react";
import { Button } from "inline-chat-kit";

/**
 * Glass blurs whatever is behind it, so it needs something behind it. Over a
 * flat page it reads as a pale pill; over a picture it reads as glass.
 */
export default function ButtonGlass() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        maxWidth: 520,
        padding: "48px 24px",
        borderRadius: 16,
        background:
          "radial-gradient(circle at 20% 30%, #f59e0b 0, transparent 45%), radial-gradient(circle at 80% 70%, #0ea5e9 0, transparent 50%), linear-gradient(135deg, #7c3aed, #db2777)",
      }}
    >
      <Button variant="glass" size="m">
        Summarise
      </Button>
      <Button variant="glass" size="l" icon={<Mic size={16} aria-hidden />}>
        Dictate
      </Button>
      <Button variant="glass" size="xl" icon={<ArrowUp size={18} aria-hidden />} aria-label="Send" />
    </div>
  );
}
