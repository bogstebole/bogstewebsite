"use client";

import { useEffect, useState } from "react";
import { Tool, type ToolState } from "inline-chat-kit";

/**
 * A call as it happens: pending, running, done. The state is the only prop
 * that changes: the glyph, the label and the duration follow from it.
 */
export default function ToolLifecycle() {
  const [state, setState] = useState<ToolState>("pending");

  useEffect(() => {
    const running = window.setTimeout(() => setState("running"), 700);
    const done = window.setTimeout(() => setState("done"), 2600);
    return () => {
      window.clearTimeout(running);
      window.clearTimeout(done);
    };
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Tool
        name="read_file"
        state={state}
        summary={state === "done" ? "Read 214 lines" : "Reading src/app.tsx"}
        duration={state === "done" ? 1900 : undefined}
        input={{ path: "src/app.tsx" }}
        output={state === "done" ? "export default function App() { … }" : undefined}
      />
    </div>
  );
}
