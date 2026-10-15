"use client";

import { Bookmark, Share2 } from "lucide-react";
import { ChatHeader } from "inline-chat-kit";

export default function ChatHeaderBasic() {
  return (
    <div style={{ width: "100%", maxWidth: 640, borderRadius: 16, overflow: "hidden", background: "var(--ick-page)" }}>
      <ChatHeader
        title="Why is the checkout page slow on Mondays?"
        subtitle="Claude Opus 5"
        onBack={() => {}}
        variant="bordered"
        // Inside a card, not the page's banner.
        landmark={false}
        actions={[
          // The count is folded into the name: “Saved highlights, 3”.
          { id: "saved", label: "Saved highlights", icon: <Bookmark size={16} aria-hidden />, count: 3, pinned: true },
          { id: "share", label: "Share", icon: <Share2 size={16} aria-hidden /> },
        ]}
      />
    </div>
  );
}
