"use client";

import { useEffect, useState } from "react";
import {
  ArtifactCard,
  ArtifactPane,
  ChatLayout,
  Conversation,
  useArtifacts,
  type ArtifactState,
} from "inline-chat-kit";

const PLAN = `Week 1: base
Mon  rest
Tue  4 km easy, conversational
Wed  cross-train, 30 min
Thu  5 × 400 m at 5k effort, 90 s jog between
Fri  rest
Sat  6 km easy
Sun  20 min walk

Week 2: build
Mon  rest
Tue  5 km easy
Wed  cross-train, 35 min
Thu  6 × 400 m, 90 s jog between
Fri  rest
Sat  7 km easy, last kilometre at pace
Sun  20 min walk`;

/**
 * The kit's own placement. Under 760px of its own width (as here), the pane
 * is a sheet over the conversation; above it, a column beside it.
 */
export default function ArtifactChatLayout() {
  const artifacts = useArtifacts();
  const [state, setState] = useState<ArtifactState>("writing");
  const done = state === "done";

  // The plan takes a few seconds to write. Open it early to see the skeleton.
  useEffect(() => {
    const finish = window.setTimeout(() => setState("done"), 4000);
    return () => window.clearTimeout(finish);
  }, []);

  return (
    // ChatLayout fills its parent: give it a box with a height.
    <div style={{ display: "flex", height: 560, position: "relative", overflow: "hidden", background: "var(--ick-page)" }}>
      <ChatLayout
        onDismiss={artifacts.close}
        pane={({ narrow, expanded, toggleExpanded }) =>
          artifacts.openId ? (
            <ArtifactPane
              title="5k training plan"
              meta={done ? "8 weeks · 4 runs a week" : "Being written"}
              modal={narrow}
              expanded={expanded}
              onToggleExpanded={toggleExpanded}
              onClose={artifacts.close}
            >
              {done ? <pre style={{ margin: 0, font: "inherit", whiteSpace: "pre-wrap" }}>{PLAN}</pre> : undefined}
            </ArtifactPane>
          ) : null
        }
      >
        <Conversation scrollButton={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--ick-ink)" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p style={{ margin: 0, maxWidth: "80%", padding: "8px 14px", borderRadius: 16, background: "var(--ick-ground)", fontSize: 14 }}>
                Can you put together a plan for my first 5k?
              </p>
            </div>
            {/* The answer's prose sits on the kit's answer column, as ChatTurnRow places it. */}
            <p style={{ margin: 0, marginInline: "var(--ick-answer-column)", fontSize: 14, lineHeight: "var(--ick-answer-leading)" }}>
              Eight weeks, four runs a week, building to 5 km without stopping.
            </p>
            <ArtifactCard
              id="plan"
              title="5k training plan"
              meta={done ? "8 weeks" : undefined}
              kind="text"
              state={state}
              content={done ? PLAN : undefined}
              open={artifacts.openId === "plan"}
              onOpen={artifacts.toggle}
            />
          </div>
        </Conversation>
      </ChatLayout>
    </div>
  );
}
