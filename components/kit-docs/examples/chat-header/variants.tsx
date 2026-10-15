"use client";

import { Share2 } from "lucide-react";
import { ChatHeader, type ChatHeaderVariant } from "inline-chat-kit";

const PARAGRAPH =
  "Monday is when the weekly invoice job runs, and it shares a database with checkout. Between 09:00 and 09:40 " +
  "the job holds row locks on the orders table";

/** Scroll each column: the three materials only differ once something passes underneath. */
export default function ChatHeaderVariants() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 560 }}>
      {(["plain", "bordered", "glass"] as ChatHeaderVariant[]).map((variant) => (
        <div
          key={variant}
          style={{ height: 180, overflowY: "auto", borderRadius: 16, background: "var(--ick-page)" }}
        >
          <ChatHeader
            title={variant}
            subtitle="Scroll this column"
            variant={variant}
            sticky
            landmark={false}
            headingLevel={3}
            actions={[{ id: "share", label: "Share", icon: <Share2 size={16} aria-hidden /> }]}
          />
          <div style={{ padding: "0 16px 16px" }}>
            {Array.from({ length: 5 }, (_, i) => (
              <p key={i} style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.6, color: "var(--ick-ink-soft)" }}>
                {PARAGRAPH}:{" "}
                <mark style={{ background: "var(--ick-marker)", color: "var(--ick-marker-ink)" }}>
                  p95 goes from 420ms to 3.1s
                </mark>
                .
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
