"use client";

import { useEffect, useState } from "react";
import { ArtifactCard, type ArtifactState } from "inline-chat-kit";

const CHECKLIST = `Two days out
- Lay out kit: shoes, socks, number, four safety pins
- Last easy run, 20 minutes

Race morning
- Breakfast three hours before the start
- Arrive 45 minutes early; warm up for 10`;

/** The title arrives first and shimmers; the content follows when it is done. */
export default function ArtifactWriting() {
  const [state, setState] = useState<ArtifactState>("writing");

  useEffect(() => {
    const done = window.setTimeout(() => setState("done"), 2400);
    return () => window.clearTimeout(done);
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <ArtifactCard
        id="checklist"
        title="Race-week checklist"
        meta={state === "done" ? "6 items" : undefined}
        kind="text"
        state={state}
        content={state === "done" ? CHECKLIST : undefined}
      />
    </div>
  );
}
