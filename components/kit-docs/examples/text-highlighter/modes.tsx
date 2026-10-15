"use client";

import { useState } from "react";
import { Highlighter, TextCursor } from "lucide-react";
import { Button, TextHighlighter } from "inline-chat-kit";

const ANSWER =
  "The Higgs field gives elementary particles their mass: the more strongly a particle interacts with it, the heavier it is. Most of the mass of a proton, though, is not Higgs mass at all: it is the energy binding its quarks together.";

type Mode = "marker" | "precise";

/**
 * `marker` draws a freeform stroke and snaps it to the words it crossed.
 * `precise` hands the pointer back to the browser's own text selection.
 */
export default function TextHighlighterModes() {
  const [mode, setMode] = useState<Mode>("marker");

  return (
    <div style={{ width: "100%", maxWidth: 520, fontSize: 15, lineHeight: 1.65 }}>
      <div role="group" aria-label="Selection mode" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Button
          variant={mode === "marker" ? "primary" : "ghost"}
          icon={<Highlighter size={14} aria-hidden />}
          aria-pressed={mode === "marker"}
          onClick={() => setMode("marker")}
        >
          Marker
        </Button>
        <Button
          variant={mode === "precise" ? "primary" : "ghost"}
          icon={<TextCursor size={14} aria-hidden />}
          aria-pressed={mode === "precise"}
          onClick={() => setMode("precise")}
        >
          Precise
        </Button>
      </div>
      <TextHighlighter text={ANSWER} selectionMode={mode} />
    </div>
  );
}
