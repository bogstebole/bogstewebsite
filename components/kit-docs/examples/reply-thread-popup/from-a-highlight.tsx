"use client";

import { useState } from "react";
import { ReplyThreadPopup, TextHighlighter, type SendContext } from "inline-chat-kit";

const ANSWER =
  "The Standard Model organises twelve fermions (six quarks and six leptons) plus the force-carrying bosons into a single framework. It explains three of the four fundamental forces; gravity is the one it leaves out.";

const shorten = (text: string) => (text.length > 48 ? `${text.slice(0, 48).trimEnd()}…` : text);

/**
 * A stand-in for your model. It gets the message and the passage the thread
 * hangs off, and streams its reply as text deltas. The signal aborts when the
 * reader presses stop or closes the thread.
 */
async function* answerAboutPassage(message: string, passage: string, { signal }: SendContext) {
  const reply = `About “${shorten(passage)}”: your handler receives “${message.trim()}” together with that passage, so the model can answer about this sentence rather than the whole reply.`;
  for (const word of reply.match(/\S+\s*/g) ?? []) {
    if (signal.aborted) return;
    await new Promise((resolve) => setTimeout(resolve, 35));
    yield word;
  }
}

/** Highlight a phrase, then choose “Reply in thread” from its menu. */
export default function ReplyThreadFromAHighlight() {
  const [reply, setReply] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [saved, setSaved] = useState(0);

  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
      <TextHighlighter text={ANSWER} onReplyInThread={(text, rect) => setReply({ text, rect })} />
      <p style={{ margin: "20px 0 0", fontSize: 12, color: "var(--ick-ink-faint)" }}>
        {saved > 0
          ? `${saved} thread${saved === 1 ? "" : "s"} saved.`
          : "Mark a phrase, then choose “Reply in thread”."}
      </p>

      {/* Fixed over the whole viewport while it is open: rendered only when there is a thread. */}
      {reply && (
        <ReplyThreadPopup
          activeReply={reply}
          onClose={() => setReply(null)}
          onSave={() => {
            setSaved((n) => n + 1);
            setReply(null);
          }}
          onSendMessage={answerAboutPassage}
        />
      )}
    </div>
  );
}
