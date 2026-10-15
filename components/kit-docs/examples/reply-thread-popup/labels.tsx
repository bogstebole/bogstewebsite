"use client";

import { useState } from "react";
import { LabelsProvider, ReplyThreadPopup, TextHighlighter, type ChatLabels } from "inline-chat-kit";

const ANSWER =
  "The migration adds a nullable `archived_at` column, backfills it from the old `status` field in batches of 5,000, and only then drops `status`, so the table is never locked for longer than one batch.";

// Defined once, outside render. Anything left out stays at its English default.
const LABELS: ChatLabels = {
  highlighter: { reply: "Ask about this" },
  thread: {
    title: "Asking about a passage",
    save: "Pin",
    close: "Close",
    placeholder: "What is unclear here?",
  },
};

/** The popup has no labels prop: its words come from the nearest LabelsProvider. */
export default function ReplyThreadLabels() {
  const [reply, setReply] = useState<{ text: string; rect: DOMRect } | null>(null);

  return (
    <LabelsProvider labels={LABELS}>
      <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
        <TextHighlighter text={ANSWER} onReplyInThread={(text, rect) => setReply({ text, rect })} />
        {reply && (
          <ReplyThreadPopup
            activeReply={reply}
            onClose={() => setReply(null)}
            onSave={() => setReply(null)}
            onSendMessage={() =>
              "Batching keeps each write short, so other queries wait for one batch at most rather than for the whole backfill."
            }
          />
        )}
      </div>
    </LabelsProvider>
  );
}
