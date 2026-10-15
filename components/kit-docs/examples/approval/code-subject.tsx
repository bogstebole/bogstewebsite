"use client";

import { useState } from "react";
import { Approval, CodeBlock, type Decision } from "inline-chat-kit";

const CONFIG = `export const config = {
  retries: 3,
  timeout: 10_000,
  baseUrl: process.env.API_URL ?? "https://api.example.com",
};`;

/** The subject is yours: a command, a diff, a message. Here, the file it wants to write. */
export default function ApprovalCodeSubject() {
  const [decision, setDecision] = useState<Decision | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Approval
        title="Write to src/config.ts"
        description="Five lines, replacing the existing export."
        decision={decision}
        onDecide={setDecision}
      >
        <CodeBlock lang="ts" label="src/config.ts" code={CONFIG} />
      </Approval>
    </div>
  );
}
