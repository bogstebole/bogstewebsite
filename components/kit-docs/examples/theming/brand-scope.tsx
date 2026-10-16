"use client";

import { useState, type CSSProperties } from "react";
import { Button, ChatInput, InlineCitation, Tool } from "inline-chat-kit";

interface Brand {
  name: string;
  /** The theme the brand paints. Pinned, so the page's own theme cannot reach in. */
  theme: "light" | "dark";
  tokens: Record<string, string>;
}

/** Each brand sets a handful of tokens, and nothing component-specific. */
const BRANDS: Brand[] = [
  {
    name: "Ledger",
    theme: "light",
    tokens: {
      "--ick-ink-rgb": "38 32 26",
      "--ick-paper-rgb": "250 246 238",
      "--ick-marker-rgb": "255 176 46",
      "--ick-font-sans": "'Iowan Old Style', Georgia, serif",
      "--ick-font-mono": "'SF Mono', ui-monospace, monospace",
      "--ick-radius-xl": "10px",
      "--ick-radius-lg": "8px",
      "--ick-radius-pill": "8px",
    },
  },
  {
    name: "Terminal",
    theme: "light",
    tokens: {
      "--ick-ink-rgb": "16 24 40",
      "--ick-paper-rgb": "247 249 252",
      "--ick-marker-rgb": "56 224 255",
      "--ick-font-sans": "ui-monospace, 'SF Mono', monospace",
      "--ick-font-mono": "ui-monospace, 'SF Mono', monospace",
      "--ick-radius-xl": "4px",
      "--ick-radius-lg": "4px",
      "--ick-radius-md": "3px",
      "--ick-radius-pill": "4px",
    },
  },
  {
    name: "After hours",
    theme: "dark",
    tokens: {
      // Only the dark palette moves; light would be untouched.
      "--ick-dark-ink-rgb": "236 232 244",
      "--ick-dark-paper-rgb": "22 18 30",
      "--ick-marker-rgb": "255 64 160",
      "--ick-font-sans": "'Avenir Next', system-ui, sans-serif",
      "--ick-radius-xl": "20px",
    },
  },
];

export default function BrandScope() {
  const [active, setActive] = useState<Brand | null>(BRANDS[0]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      <div role="group" aria-label="Brand" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[null, ...BRANDS].map((brand) => (
          <Button
            key={brand?.name ?? "default"}
            size="s"
            variant={active === brand ? "secondary" : "ghost"}
            aria-pressed={active === brand}
            onClick={() => setActive(brand)}
          >
            {brand?.name ?? "Default"}
          </Button>
        ))}
      </div>

      <section
        // Without the class, the tokens below would set the channels and change nothing:
        // a derived token is resolved where it is declared, and .ick-theme re-declares them here.
        className={active ? "ick-theme" : undefined}
        data-theme={active?.theme}
        style={{
          ...(active?.tokens as CSSProperties),
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: 20,
          borderRadius: "var(--ick-radius-lg)",
          border: "1px solid var(--ick-border)",
          background: "var(--ick-surface)",
          color: "var(--ick-ink)",
          fontFamily: "var(--ick-font-sans)",
        }}
      >
        {/* A sent message: resting, so there is nothing to type and nothing to send.
            Its copy and edit appear under it on hover, so it keeps room for them,
            the way a turn does in a conversation. */}
        <div style={{ paddingBottom: 32 }}>
          <ChatInput
            state="resting"
            value="Will it rain in Belgrade this weekend?"
            onChange={() => {}}
            onSubmit={() => {}}
          />
        </div>

        {/* The answer's prose sits on the kit's answer column, as ChatTurnRow places it. */}
        <p style={{ margin: 0, marginInline: "var(--ick-answer-column)", fontSize: 15, lineHeight: 1.6 }}>
          Saturday stays clear at around 24°C, and{" "}
          <InlineCitation index={1} source={{ id: "radar", title: "Balkans precipitation radar" }}>
            Sunday has a 40% chance of a short shower
          </InlineCitation>{" "}
          after four.
        </p>

        <Tool
          name="get_forecast"
          state="done"
          summary="2 days"
          duration={1084}
          defaultOpen
          input={{ city: "Belgrade", days: ["Sat", "Sun"] }}
        />
      </section>
    </div>
  );
}
