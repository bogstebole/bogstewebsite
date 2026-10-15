"use client";

import { Tool } from "inline-chat-kit";

/**
 * What you give it decides how it is drawn: a string is text, an object is
 * JSON in a code block, and an element is rendered untouched.
 */
export default function ToolPlainText() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 520 }}>
      <Tool name="get_weather" state="done" summary="Text in, text out" defaultOpen input="Belgrade" output="Belgrade, 24°C and clear" />
      <Tool
        name="render_chart"
        state="done"
        summary="An element, drawn as given"
        defaultOpen
        input={{ series: "temperature", days: 7 }}
        output={
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
            {[18, 21, 24, 26, 23, 20, 22].map((t, i) => (
              <div
                key={i}
                style={{ width: 14, height: t * 1.6, borderRadius: 3, background: "var(--ick-ink-faint)" }}
              />
            ))}
          </div>
        }
      />
    </div>
  );
}
