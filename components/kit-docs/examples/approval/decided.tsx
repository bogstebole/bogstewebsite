"use client";

import { Approval, Tool, type Decision } from "inline-chat-kit";

const DECISIONS: Decision[] = ["once", "always", "denied"];

/** Decided, it stops being a set of buttons and becomes a record. */
export default function ApprovalDecided() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 520 }}>
      {DECISIONS.map((decision) => (
        <Approval
          key={decision}
          title="Run a command in your shell"
          description="It removes the generated screenshots."
          decision={decision}
        >
          <Tool name="bash" state="pending" input={{ command: "rm -rf Shots/" }} />
        </Approval>
      ))}
    </div>
  );
}
