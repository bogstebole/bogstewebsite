"use client";

import { useEffect, useState } from "react";
import { Conversation } from "inline-chat-kit";

const LINES = [
  "Preheat the oven to 250°C with the Dutch oven inside, for a full 45 minutes.",
  "Turn the dough out onto parchment, seam side down.",
  "Score it once, a few millimetres deep, at a shallow angle.",
  "Lower it in on the parchment and put the lid on.",
  "Bake 20 minutes covered, so the crust stays soft while the loaf springs.",
  "Take the lid off and drop the oven to 230°C.",
  "Bake another 20 to 25 minutes, until the crust is deep brown.",
  "Tap the bottom: it should sound hollow.",
  "Cool it on a rack for at least an hour before cutting.",
  "The crumb is still setting while it cools; cut early and it turns gummy.",
  "Store it cut side down on a board, not in plastic.",
  "On day two, revive it in a hot oven for five minutes.",
];

/**
 * A line arrives every 600ms. The view keeps up on its own; scroll up and it
 * lets go at once, and a button offers the way back.
 */
export default function ConversationFollowing() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count >= LINES.length) return;
    const timer = window.setTimeout(() => setCount((n) => n + 1), 600);
    return () => window.clearTimeout(timer);
  }, [count]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 240, width: "100%", maxWidth: 520 }}>
      <Conversation>
        {LINES.slice(0, count).map((line, i) => (
          <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--ick-ink-soft)" }}>
            {i + 1}. {line}
          </p>
        ))}
      </Conversation>
    </div>
  );
}
