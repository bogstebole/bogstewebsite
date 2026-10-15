"use client";

import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { Button, type ButtonVariant } from "inline-chat-kit";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "outline", "ghost", "glass"];
const caption = { width: 72, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" };

type SaveState = "idle" | "saving" | "saved";

/**
 * Loading swaps the content for a spinner, keeps the button's width, and
 * refuses clicks. The label stays in the accessibility tree, so the button
 * is never announced without a name.
 */
export default function ButtonStates() {
  const [save, setSave] = useState<SaveState>("idle");

  useEffect(() => {
    if (save !== "saving") return;
    const timer = window.setTimeout(() => setSave("saved"), 1500);
    return () => window.clearTimeout(timer);
  }, [save]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={caption}>{variant}</span>
          <Button variant={variant}>Rest</Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
          <Button variant={variant} loading>
            Loading
          </Button>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <span style={caption}>try it</span>
        <Button
          size="m"
          icon={save === "saved" ? <Check size={14} aria-hidden /> : <Save size={14} aria-hidden />}
          loading={save === "saving"}
          onClick={() => setSave(save === "saved" ? "idle" : "saving")}
        >
          {save === "saved" ? "Saved" : "Save thread"}
        </Button>
      </div>
    </div>
  );
}
