"use client";

import { useEffect, useState } from "react";
import { ChainOfThought, type Thought } from "inline-chat-kit";

// Each step is worded twice: while it runs, and once it has happened.
const STEPS = [
  {
    id: "read",
    doing: "Reading the question",
    did: "The question is about size, not mass",
    body: "A point particle has no size, so the honest answer starts by saying so.",
  },
  {
    id: "check",
    doing: "Checking the measured value",
    did: "Checked the measured value",
    body: "ATLAS and CMS combine to 125.25 GeV, give or take 0.17.",
  },
  {
    id: "frame",
    doing: "Looking for something to compare it to",
    did: "Found something to compare it to",
    body: "133 protons, or roughly one caesium atom.",
  },
];

const STEP_MS = 1500;

/**
 * A derivation grows: each step arrives, runs, and is done before the next.
 * While it thinks, the header names the step it is on; once it is done, it
 * folds to a count and a time.
 */
export default function ChainOfThoughtLive() {
  // How many steps have arrived. One past the end means the chain is done.
  const [arrived, setArrived] = useState(1);

  useEffect(() => {
    const timers = STEPS.map((_, i) => window.setTimeout(() => setArrived(i + 2), STEP_MS * (i + 1)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const done = arrived > STEPS.length;
  const steps: Thought[] = STEPS.slice(0, arrived).map((step, i) => {
    const running = !done && i === arrived - 1;
    return running
      ? { id: step.id, label: step.doing, state: "running" }
      : { id: step.id, label: step.did, body: step.body, state: "done" };
  });

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChainOfThought state={done ? "done" : "thinking"} duration={done ? 4500 : undefined} steps={steps} />
    </div>
  );
}
