"use client";

import { Tool } from "inline-chat-kit";

export default function ToolBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <Tool
        name="search_web"
        state="done"
        summary="3 results"
        duration={412}
        defaultOpen
        input={{ query: "weather in Belgrade", limit: 3 }}
        output={{ results: ["Belgrade, 24°C", "Novi Sad, 22°C", "Niš, 26°C"] }}
      />
    </div>
  );
}
