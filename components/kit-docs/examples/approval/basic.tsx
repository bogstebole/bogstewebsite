"use client";

import { useEffect, useState } from "react";
import { Approval, Button, Tool, type Decision, type ToolState } from "inline-chat-kit";

const COMMAND = { command: "rm -rf Shots/", cwd: "~/Projects/chat" };

/**
 * Ask, decide, and see what the decision did. The approval keeps nothing:
 * `decision` is yours, and once it is set the buttons become a record.
 */
export default function ApprovalBasic() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [run, setRun] = useState<ToolState>("pending");
  const allowed = decision === "once" || decision === "always";

  // Allowed, the command actually runs.
  useEffect(() => {
    if (!allowed) return;
    const start = window.setTimeout(() => setRun("running"), 300);
    const finish = window.setTimeout(() => setRun("done"), 1600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(finish);
    };
  }, [allowed]);

  const reset = () => {
    setDecision(null);
    setRun("pending");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, width: "100%", maxWidth: 520 }}>
      <Approval
        title="Run a command in your shell"
        description="It removes the generated screenshots. Nothing else is touched."
        decision={decision}
        onDecide={setDecision}
        style={{ width: "100%" }}
      >
        <Tool name="bash" state="pending" input={COMMAND} defaultOpen={decision === null} />
      </Approval>

      {allowed && (
        <Tool
          name="bash"
          state={run}
          summary={run === "done" ? "Removed 14 files" : "Removing Shots/"}
          duration={run === "done" ? 1240 : undefined}
          input={COMMAND}
          output={run === "done" ? "removed 14 files (38.2 MB)" : undefined}
          style={{ width: "100%" }}
        />
      )}

      {decision === "denied" && (
        // The answer's prose sits on the kit's answer column, as ChatTurnRow places it.
        <p style={{ margin: 0, marginInline: "var(--ick-answer-column)", fontSize: "var(--ick-answer-size)", lineHeight: "var(--ick-answer-leading)", color: "var(--ick-ink)" }}>
          Understood. I’ll leave <code>Shots/</code> alone.
        </p>
      )}

      {decision && (
        <Button variant="outline" size="s" onClick={reset}>
          Ask again
        </Button>
      )}
    </div>
  );
}
