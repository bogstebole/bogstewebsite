"use client";

import { useEffect, useState } from "react";
import { Reasoning } from "inline-chat-kit";

const THOUGHT = `The question is about the Higgs boson’s mass, so two numbers matter: the mass itself and how precisely it is known.

ATLAS and CMS both measure it near 125 GeV. The combined figure is 125.25 GeV, give or take 0.17: a fifth of a percent, which is worth saying, because “about 125” hides how well this is pinned down.

Mass is the wrong word for a general reader, though. Better to compare it with something they already have a feel for.`;

const WORDS = THOUGHT.split(" ");
const WORD_MS = 45;

/**
 * Thinking streams in, the answer starts, and the block folds itself away.
 * No `duration` is passed, so it times itself: "Thought for 4s".
 */
export default function ReasoningStreaming() {
  const [count, setCount] = useState(0);
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    const tick = window.setInterval(() => setCount((n) => Math.min(n + 1, WORDS.length)), WORD_MS);
    const answer = window.setTimeout(() => setAnswering(true), WORDS.length * WORD_MS + 500);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(answer);
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <Reasoning state={answering ? "done" : "thinking"}>{WORDS.slice(0, count).join(" ")}</Reasoning>
      {answering && (
        <p
          style={{
            margin: "20px 0 0",
            // The answer's column, which the reasoning block already sits on.
            paddingLeft: "var(--ick-answer-column)",
            fontSize: "var(--ick-answer-size)",
            lineHeight: "var(--ick-answer-leading)",
            letterSpacing: "var(--ick-answer-tracking)",
            color: "var(--ick-ink)",
          }}
        >
          The Higgs boson weighs about 125.25 GeV, roughly 133 times a proton, or about as much as a caesium atom.
          It is known to a fifth of a percent.
        </p>
      )}
    </div>
  );
}
