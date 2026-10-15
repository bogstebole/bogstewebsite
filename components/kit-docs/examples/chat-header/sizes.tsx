"use client";

import { Bookmark, Share2 } from "lucide-react";
import { ChatHeader, headerIconSize, type ChatHeaderSize } from "inline-chat-kit";

/** 40, 48 and 56px rows. `headerIconSize` keeps your icons in step with the header’s own. */
export default function ChatHeaderSizes() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      {(["s", "m", "l"] as ChatHeaderSize[]).map((size) => (
        <div key={size} style={{ borderRadius: 16, overflow: "hidden", background: "var(--ick-page)" }}>
          <ChatHeader
            title={`size="${size}"`}
            subtitle={`Icons at ${headerIconSize[size]}px`}
            size={size}
            variant="bordered"
            onBack={() => {}}
            landmark={false}
            headingLevel={3}
            actions={[
              { id: "saved", label: "Saved highlights", icon: <Bookmark size={headerIconSize[size]} aria-hidden />, count: 2 },
              { id: "share", label: "Share", icon: <Share2 size={headerIconSize[size]} aria-hidden /> },
            ]}
          />
        </div>
      ))}
    </div>
  );
}
