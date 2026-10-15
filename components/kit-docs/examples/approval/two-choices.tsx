"use client";

import { useState } from "react";
import { Approval, Button, CodeBlock, type Decision } from "inline-chat-kit";

const CHANGE = ` Tuesday 18:00–22:00
-  Milica
+  Jovana
 Thursday 18:00–22:00
-  (nobody)
+  Jovana`;

/**
 * Applying one change happens once, so a standing permission means nothing.
 * `choices` leaves "Always allow" out; nothing else moves.
 */
export default function ApprovalTwoChoices() {
  const [decision, setDecision] = useState<Decision | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, width: "100%", maxWidth: 520 }}>
      <Approval
        title="Apply the change to the weekly cover"
        description="This week only. Nothing else moves."
        choices={["once", "deny"]}
        decision={decision}
        onDecide={setDecision}
        style={{ width: "100%" }}
      >
        <CodeBlock lang="diff" label="weekly cover" code={CHANGE} />
      </Approval>
      {decision && (
        <Button variant="outline" size="s" onClick={() => setDecision(null)}>
          Ask again
        </Button>
      )}
    </div>
  );
}
