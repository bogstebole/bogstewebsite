"use client";

import { useState } from "react";
import { Plane } from "lucide-react";
import { EmptyState } from "inline-chat-kit";

/**
 * `title` renders as text. When your page needs it to be a heading, pass one:
 * the level is yours to choose, not the component's. Children go last,
 * under the openers.
 */
export default function EmptyStateHeading() {
  const [sent, setSent] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <EmptyState
        icon={<Plane size={22} aria-hidden />}
        title={<h2 style={{ margin: 0, font: "inherit" }}>Plan a weekend in Lisbon</h2>}
        description="Flights, a place to stay, and what is worth the queue."
        suggestions={["Cheapest flights in May", "Where to stay in Alfama", "Is the tram 28 worth it?"]}
        suggestionsLabel="Ways to start"
        onSuggestion={setSent}
      >
        <p style={{ margin: 0, fontSize: 12, color: "var(--ick-ink-faint)" }}>
          {sent ? `Sent: “${sent}”` : "Prices change hourly; check before you book."}
        </p>
      </EmptyState>
    </div>
  );
}
