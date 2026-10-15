"use client";

import { SystemMessage } from "inline-chat-kit";

/** A sentence that says what happens next is usually long enough to wrap. */
export default function SystemMessageWraps() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <SystemMessage>
        The model changed partway through this answer, so the first half and the second half were not written by
        the same one.
      </SystemMessage>
    </div>
  );
}
