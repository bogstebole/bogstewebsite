"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChatTurnRow,
  Conversation,
  EmptyState,
  useChatTurns,
  type Attachment,
  type Verdict,
} from "inline-chat-kit";

const ANSWERS = [
  "Mostly it is not drying out. The starch in the crumb, which gelatinised in the oven, slowly " +
    "crystallises again as the loaf cools (**retrogradation**) and that is what makes it firm.\n\n" +
    "It is why bread stales faster in the fridge than on the counter, and why a few minutes in a hot " +
    "oven brings a day-old loaf back: the heat undoes the crystals, for a while.",
  "Two things happen at once:\n\n" +
    "- moisture moves from the crumb to the crust, so the crust turns leathery;\n" +
    "- the starch crystallises back into a firmer structure.\n\n" +
    "The second matters more. Freezing halts it, refrigerating speeds it up, so the freezer keeps bread " +
    "better than the fridge does.",
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HandAssembled() {
  // Stands in for a model: a complete answer, a different one each time a turn is regenerated.
  const attempts = useRef(new Map<string, number>());
  const { turns, setDraft, submit, showVersion, stop, beginEdit, cancelEdit } = useChatTurns({
    onSend: async (message, { turnId }) => {
      const attempt = attempts.current.get(turnId) ?? 0;
      attempts.current.set(turnId, attempt + 1);
      await wait(600);
      // A string is revealed at a readable pace, rather than landing all at once.
      return ANSWERS[attempt % ANSWERS.length];
    },
  });

  // The turn the view holds at the top while its answer arrives. Recorded on send,
  // released once the answer settles, so the next composer comes back into view.
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const anchored = turns.find((turn) => turn.id === anchorId);
  const held = anchored && anchored.state !== "resting" ? anchorId : null;

  const send = useCallback(
    (id: string, value: string, attachments?: Attachment[]) => {
      setAnchorId(id);
      submit(id, value, attachments);
    },
    [submit]
  );
  // Regenerating is the same submit, with no new text: the turn gets a second version.
  const regenerate = useCallback(
    (id: string) => {
      setAnchorId(id);
      submit(id);
    },
    [submit]
  );

  const [verdicts, setVerdicts] = useState<Record<string, Verdict | null>>({});
  const rate = useCallback(
    (id: string, verdict: Verdict | null) => setVerdicts((all) => ({ ...all, [id]: verdict })),
    []
  );

  const isEmpty = turns.length === 1 && !turns[0].user && !turns[0].ai;

  return (
    <div
      style={{
        height: 560,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--ick-surface)",
      }}
    >
      <Conversation anchorId={held ? `turn-${held}` : undefined} anchorOffset={24} endOffset={24}>
        {isEmpty && (
          <EmptyState
            title="Ask about bread"
            description="Then regenerate the answer, step through both versions, or edit the question."
            suggestions={["Why does bread go stale?"]}
            onSuggestion={(text) => send(turns[0].id, text)}
          />
        )}
        {turns.map((turn, i) => (
          <ChatTurnRow
            key={turn.id}
            turn={turn}
            isActiveInput={i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing")}
            questionAlign={isEmpty ? "stretch" : "end"}
            placeholder="Ask about bread…"
            // Every callback is stable and takes the turn's id, so finished rows skip rendering.
            onDraft={setDraft}
            onSubmit={send}
            onStop={stop}
            onEdit={beginEdit}
            onCancelEdit={cancelEdit}
            onRegenerate={regenerate}
            onShowVersion={showVersion}
            onFeedback={rate}
            feedback={verdicts[turn.id] ?? null}
          />
        ))}
      </Conversation>
    </div>
  );
}
