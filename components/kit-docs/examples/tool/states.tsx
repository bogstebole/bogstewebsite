"use client";

import { Tool } from "inline-chat-kit";

const SEARCH_INPUT = { query: "weather in Belgrade this weekend", limit: 3 };
const SEARCH_OUTPUT = {
  results: [
    { title: "Belgrade: 7 day forecast", url: "https://example.com/rs/belgrade" },
    { title: "Weekend outlook, Serbia", url: "https://example.com/rs/weekend" },
  ],
  took_ms: 412,
};

/** The four states a call can be in. Shut by default, open when it failed. */
export default function ToolStates() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 520 }}>
      <Tool name="send_email" state="pending" summary="Waiting on the draft" input={{ to: "milica@example.com" }} />
      <Tool name="search_web" state="running" summary="Searching the web" input={SEARCH_INPUT} />
      <Tool
        name="search_web"
        state="done"
        summary="3 results"
        duration={412}
        input={SEARCH_INPUT}
        output={SEARCH_OUTPUT}
      />
      <Tool
        name="run_sql"
        state="error"
        summary="Query rejected"
        duration={1173}
        input={{ statement: "select * from residents where id = $1", params: [null] }}
        error='ERROR: null value in column "id" violates not-null constraint'
      />
    </div>
  );
}
