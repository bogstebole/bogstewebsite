"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { MousePointer2 } from "lucide-react";
import { Button, CustomCursor, TextHighlighter } from "inline-chat-kit";

const FINE_POINTER = "(pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const tile: CSSProperties = {
  display: "grid",
  placeItems: "center",
  gap: 8,
  minHeight: 96,
  padding: 12,
  border: "1px dashed var(--ick-border)",
  borderRadius: 12,
  fontFamily: "var(--ick-font-mono)",
  fontSize: 11,
  color: "var(--ick-ink-faint)",
  textAlign: "center",
};

function Tile({ cursor, children }: { cursor?: "marker" | "text"; children: ReactNode }) {
  return (
    <div data-cursor={cursor} style={tile}>
      {children}
    </div>
  );
}

/**
 * Opt-in: the cursor replaces the pointer on the whole page, so it is only
 * mounted while the toggle is on, and unmounted when it goes off or the page
 * is left. Escape turns it off too.
 */
export default function CustomCursorToggle() {
  // No pointer, nothing to replace: on a touch screen the toggle stays off.
  const finePointer = useSyncExternalStore(subscribe, () => window.matchMedia(FINE_POINTER).matches, () => true);
  const [on, setOn] = useState(false);
  const active = on && finePointer;

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOn(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 560 }}>
      {active && (
        <>
          {/* The component draws the new cursor; hiding the old one is the host's job. */}
          <style>{`* { cursor: none !important; }`}</style>
          <CustomCursor />
        </>
      )}

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Button
          variant={active ? "outline" : "primary"}
          icon={<MousePointer2 size={14} aria-hidden />}
          aria-pressed={active}
          disabled={!finePointer}
          onClick={() => setOn((value) => !value)}
        >
          {active ? "Turn the cursor off" : "Turn the cursor on"}
        </Button>
        <span style={{ fontSize: 12, color: "var(--ick-ink-faint)" }}>
          {!finePointer
            ? "Needs a mouse or a trackpad."
            : active
              ? "On for the whole page. Escape turns it off."
              : "Replaces the pointer on the whole page while it is on."}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <Tile cursor="marker">data-cursor=&quot;marker&quot;</Tile>
        <Tile cursor="text">data-cursor=&quot;text&quot;</Tile>
        <Tile>no attribute</Tile>
        <Tile cursor="marker">
          a button inside a marker
          <Button size="xs" variant="outline">
            Arrow here
          </Button>
        </Tile>
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ick-ink)" }}>
        <TextHighlighter text="Over an answer it is a marker, and it presses down while you draw. Try marking this sentence." />
      </div>
    </div>
  );
}
