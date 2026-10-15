"use client";

import {
  ChatTurnRow,
  Conversation,
  EmptyState,
  useChatTurns,
  type SendHandler,
  type Source,
} from "inline-chat-kit";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SOURCES: Source[] = [
  {
    id: "forecast",
    title: "Belgrade: 7-day forecast",
    url: "https://example.com/forecast/belgrade",
    origin: "example.com",
  },
  {
    id: "radar",
    title: "Balkans precipitation radar, Friday 18:00",
    url: "https://example.com/radar/balkans",
    origin: "example.com",
  },
];

const ANSWER =
  "Mostly dry. Saturday stays clear at around 24°C[^1], and Sunday clouds over in the afternoon " +
  "with a 40% chance of a short shower after 16:00[^2].\n\n" +
  "If you are planning something outdoors, **Saturday is the safer day**.";

/**
 * Stands in for a model: every message gets the same scripted answer. What
 * matters is the shape: a string is prose, an object is a part, merged by id.
 */
const send: SendHandler = async function* () {
  // The same id every time, so each send replaces the text rather than adding a block.
  yield { kind: "reasoning", id: "r", text: "Two days to check, so one forecast call covers both.", state: "thinking" };
  await wait(700);

  yield {
    kind: "tool",
    id: "t",
    name: "get_forecast",
    state: "running",
    summary: "Fetching the forecast",
    input: { city: "Belgrade", days: ["Sat", "Sun"] },
  };
  await wait(1100);

  // Only what changed. The name and the input sent above are kept.
  yield {
    kind: "tool",
    id: "t",
    state: "done",
    summary: "2 days",
    duration: 1084,
    output: { sat: { high: 24, rain: 0.05 }, sun: { high: 21, rain: 0.4 } },
  };
  yield { kind: "reasoning", id: "r", state: "done" };

  // The list before the prose that cites it, so [^1] arrives knowing what it points at.
  yield { kind: "sources", id: "s", sources: SOURCES };

  for (const word of ANSWER.split(/(\s+)/)) {
    await wait(28);
    yield word;
  }
};

export default function StreamingParts() {
  const { turns, setDraft, submit, stop, beginEdit, cancelEdit } = useChatTurns({ onSend: send });
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
      <Conversation>
        {isEmpty && (
          <EmptyState
            title="Ask about the weekend"
            description="The answer streams reasoning, a tool call and its sources before the prose."
            suggestions={["Will it rain in Belgrade this weekend?"]}
            onSuggestion={(text) => submit(turns[0].id, text)}
          />
        )}
        {turns.map((turn, i) => (
          <ChatTurnRow
            key={turn.id}
            turn={turn}
            isActiveInput={i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing")}
            // Before anything is asked, the composer lines up with the opener above it.
            questionAlign={isEmpty ? "stretch" : "end"}
            placeholder="Ask about the weekend…"
            // The hook's own functions, straight through: they are stable, so the rows' memo holds.
            onDraft={setDraft}
            onSubmit={submit}
            onStop={stop}
            onEdit={beginEdit}
            onCancelEdit={cancelEdit}
          />
        ))}
      </Conversation>
    </div>
  );
}
