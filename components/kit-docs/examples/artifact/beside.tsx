"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArtifactCard, ArtifactPane, CodeBlock, Conversation, useArtifacts, type ArtifactKind } from "inline-chat-kit";

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

const PACE = `def pace(distance_km: float, target: str) -> float:
    """Seconds per kilometre for a target finish time."""
    minutes, seconds = (int(part) for part in target.split(":"))
    return (minutes * 60 + seconds) / distance_km


print(pace(5, "25:00"))  # 300.0`;

interface Doc {
  id: string;
  title: string;
  meta: string;
  kind: ArtifactKind;
  lang?: string;
  content: string;
}

const DOCS: Doc[] = [
  { id: "plan", title: "5k training plan", meta: "8 weeks · 4 runs a week", kind: "text", content: PLAN },
  { id: "pace", title: "pace.py", meta: "Python", kind: "code", lang: "python", content: PACE },
];

function Bubble({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <p style={{ margin: 0, maxWidth: "80%", padding: "8px 14px", borderRadius: 16, background: "var(--ick-ground)", fontSize: 14 }}>
        {children}
      </p>
    </div>
  );
}

/** True while the element is narrower than `width`. */
function useNarrowerThan(width: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const watch = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < width));
    watch.observe(element);
    return () => watch.disconnect();
  }, [width]);
  return [ref, narrow] as const;
}

/**
 * The pane placed by the host, beside its own chat column. `ChatLayout` does
 * this for you. This is the version for a host with a layout of its own.
 */
export default function ArtifactBeside() {
  const artifacts = useArtifacts();
  const [expanded, setExpanded] = useState(false);
  const [frame, narrow] = useNarrowerThan(560);
  const open = DOCS.find((doc) => doc.id === artifacts.openId);

  // Beside the chat while there is room for both; over it when there is not.
  const slot: CSSProperties = narrow
    ? { position: "absolute", inset: 0, display: "flex", padding: 12 }
    : {
        display: "flex",
        flexShrink: 0,
        width: expanded ? "68%" : "52%",
        padding: "12px 12px 12px 0",
        transition: "width var(--ick-duration-slow) var(--ick-ease)",
      };

  return (
    <div ref={frame} style={{ display: "flex", height: 520, position: "relative", overflow: "hidden", background: "var(--ick-page)" }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Conversation scrollButton={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, color: "var(--ick-ink)" }}>
            <Bubble>Can you put together a plan for my first 5k? I can run four days a week.</Bubble>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "var(--ick-answer-leading)" }}>
              Here is an eight-week plan, and a small script for working out your pace.
            </p>
            {DOCS.map((doc) => (
              <ArtifactCard
                key={doc.id}
                id={doc.id}
                title={doc.title}
                meta={doc.meta}
                kind={doc.kind}
                lang={doc.lang}
                content={doc.content}
                lines={5}
                open={artifacts.openId === doc.id}
                onOpen={artifacts.toggle}
              />
            ))}
          </div>
        </Conversation>
      </div>

      {open && (
        <div style={slot}>
          {/* Keyed by id: opening another one is a new pane, and focus moves to its title.
              Covering the chat makes it modal: it holds focus and Escape closes it. */}
          <ArtifactPane
            key={open.id}
            title={open.title}
            meta={open.meta}
            modal={narrow}
            expanded={expanded}
            onToggleExpanded={() => setExpanded((wide) => !wide)}
            onClose={artifacts.close}
            style={{ flex: 1, minWidth: 0 }}
          >
            {open.kind === "code" ? (
              <CodeBlock code={open.content} lang={open.lang} />
            ) : (
              <pre style={{ margin: 0, font: "inherit", whiteSpace: "pre-wrap" }}>{open.content}</pre>
            )}
          </ArtifactPane>
        </div>
      )}
    </div>
  );
}
