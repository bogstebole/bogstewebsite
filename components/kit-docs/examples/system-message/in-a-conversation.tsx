"use client";

import { Context, SystemMessage, Tool } from "inline-chat-kit";

/**
 * The meter has been red for a while; this is the moment the window actually
 * filled. One row on a recessed surface, the same height as a folded tool call.
 */
export default function SystemMessageInAConversation() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <Context used={7960} total={8000} />
      <SystemMessage>The oldest messages are dropping out of the window.</SystemMessage>
      <Tool
        name="search_web"
        state="done"
        summary="3 results"
        duration={412}
        input={{ query: "Belgrade tram network map" }}
      />
    </div>
  );
}
