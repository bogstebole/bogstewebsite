"use client";

import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button, ReplyThreadPopup } from "inline-chat-kit";

const CLAUSE =
  "Either party may end this agreement with thirty days’ written notice, provided all invoices issued before the notice date have been paid in full.";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * No highlighter needed: any passage and any box will do. Here the box is
 * the quoted clause, and the reply comes back whole as a Promise. The
 * thread reveals it at the kit's reading pace.
 */
export default function ReplyThreadFromAButton() {
  const clauseRef = useRef<HTMLQuoteElement>(null);
  const [reply, setReply] = useState<{ text: string; rect: DOMRect } | null>(null);

  const open = () => {
    if (!clauseRef.current) return;
    setReply({ text: CLAUSE, rect: clauseRef.current.getBoundingClientRect() });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, width: "100%", maxWidth: 520 }}>
      <blockquote
        ref={clauseRef}
        style={{
          margin: 0,
          padding: "12px 16px",
          borderLeft: "3px solid var(--ick-border)",
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--ick-ink-soft)",
        }}
      >
        {CLAUSE}
      </blockquote>
      <Button variant="outline" icon={<MessageCircle size={14} aria-hidden />} onClick={open}>
        Ask about this clause
      </Button>

      {reply && (
        <ReplyThreadPopup
          activeReply={reply}
          onClose={() => setReply(null)}
          onSendMessage={async (message) => {
            await wait(900);
            return /notice|end|cancel/i.test(message)
              ? "Thirty days, in writing, and only once every invoice dated before the notice is paid. An unpaid invoice keeps the agreement running."
              : "The clause sets two conditions for ending the agreement: thirty days’ written notice, and no unpaid invoices from before that notice.";
          }}
        />
      )}
    </div>
  );
}
