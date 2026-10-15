"use client";

import { ChainOfThought, type Thought } from "inline-chat-kit";

const STEPS: Thought[] = [
  {
    id: "read",
    label: "The question is about size, not mass",
    body: "A point particle has no size, so answering the question as asked would mean answering it wrongly.",
  },
  {
    id: "check",
    label: "Checked the current measured value",
    body: "ATLAS and CMS combine to 125.25 GeV, give or take 0.17. Worth quoting: “about 125” hides how well this is pinned down.",
  },
  {
    id: "frame",
    label: "Found something to compare it to",
    body: "133 protons, or roughly one caesium atom. A number nobody has a feel for becomes one they do.",
  },
];

export default function ChainOfThoughtBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChainOfThought steps={STEPS} duration={4200} defaultOpen />
    </div>
  );
}
