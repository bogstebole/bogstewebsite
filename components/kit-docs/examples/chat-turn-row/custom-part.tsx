"use client";

import { useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import {
  Button,
  ChatTurnRow,
  useChatTurns,
  type CustomPart,
  type CustomPartContext,
  type SendHandler,
  type UseChatTurnsResult,
} from "inline-chat-kit";

interface PlanChange {
  from: string;
  to: string;
  applied: boolean;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (_message, { signal }) {
  for (const word of "Move the long run off Saturday, so it is not the day after intervals:".split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(30);
    yield word;
  }
  // Your own card, sent down the stream as data: a stream cannot send a component.
  yield {
    kind: "custom",
    id: "change",
    type: "plan-change",
    data: { from: "Saturday · 18 km long run", to: "Sunday · 18 km long run", applied: false },
  };
};

/* Built once from `updatePart`, which is stable. What the card needs to change
   goes back into the part's `data`, so only this row re-renders. */
function planChangeRenderer(updatePart: UseChatTurnsResult["updatePart"]) {
  return function renderPart(part: CustomPart, { turnId }: CustomPartContext) {
    if (part.type !== "plan-change") return null;
    const change = part.data as PlanChange;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: 16,
          borderRadius: 24,
          background: "var(--ick-card)",
          boxShadow: "var(--ick-shadow-1)",
        }}
      >
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>
          <div style={{ color: "var(--ick-ink-faint)", textDecoration: "line-through" }}>{change.from}</div>
          <div style={{ color: "var(--ick-ink)" }}>{change.to}</div>
        </div>
        <Button
          variant={change.applied ? "ghost" : "primary"}
          size="s"
          icon={change.applied ? <Check size={14} aria-hidden /> : undefined}
          disabled={change.applied}
          onClick={() => updatePart(turnId, { kind: "custom", id: part.id, data: { ...change, applied: true } })}
        >
          {change.applied ? "Applied" : "Apply to plan"}
        </Button>
      </div>
    );
  };
}

export default function ChatTurnRowCustomPart() {
  const { turns, submit, setDraft, stop, updatePart } = useChatTurns({ onSend: reply });
  const renderPart = useMemo(() => planChangeRenderer(updatePart), [updatePart]);

  // Asks once, a moment after mounting, so the preview has an answer to show.
  const firstTurn = turns[0].id;
  useEffect(() => {
    const timer = window.setTimeout(
      () => submit(firstTurn, "Adjust next week’s plan. My legs are dead on Saturdays."),
      300
    );
    return () => window.clearTimeout(timer);
  }, [submit, firstTurn]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 560 }}>
      {turns.map((turn, i) => (
        <ChatTurnRow
          key={turn.id}
          turn={turn}
          isActiveInput={i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing")}
          onDraft={setDraft}
          onSubmit={submit}
          onStop={stop}
          renderPart={renderPart}
        />
      ))}
    </div>
  );
}
