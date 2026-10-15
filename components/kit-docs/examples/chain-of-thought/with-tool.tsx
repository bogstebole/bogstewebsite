"use client";

import { ChainOfThought, Tool } from "inline-chat-kit";

/** A step's working is whatever you put there, including the tool call it made. */
export default function ChainOfThoughtWithTool() {
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <ChainOfThought
        defaultOpen
        duration={3800}
        steps={[
          {
            id: "read",
            label: "The question is about size, not mass",
            body: "A point particle has no size, so the honest answer starts by saying so.",
          },
          {
            id: "check",
            label: "Checked the current measured value",
            body: (
              <Tool
                name="search_web"
                state="done"
                summary="2 results"
                duration={412}
                input={{ query: "higgs boson mass combined measurement" }}
                output={{ combined_gev: 125.25, uncertainty: 0.17 }}
              />
            ),
          },
          {
            id: "frame",
            label: "Found something to compare it to",
            body: "133 protons, or roughly one caesium atom.",
          },
        ]}
      />
    </div>
  );
}
