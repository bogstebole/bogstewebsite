"use client";

import type { ReactNode } from "react";
import { Share2 } from "lucide-react";
import { AnswerActions, Button } from "inline-chat-kit";

const TEXT = "Jog for about 90 seconds between 400 m repeats.";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 6, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** Each control is drawn only when there is a handler for it to call. */
export default function AnswerActionsWhatIsDrawn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 520 }}>
      <Row label="text only: copy">
        <AnswerActions text={TEXT} />
      </Row>
      <Row label="+ onRegenerate">
        <AnswerActions text={TEXT} onRegenerate={() => {}} />
      </Row>
      <Row label="+ onFeedback, + a control of your own">
        <AnswerActions text={TEXT} onRegenerate={() => {}} onFeedback={() => {}}>
          <Button variant="ghost" icon={<Share2 size={14} aria-hidden />} aria-label="Share" title="Share" />
        </AnswerActions>
      </Row>
    </div>
  );
}
