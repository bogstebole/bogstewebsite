"use client";

import { Bookmark, Download, Settings, Share2 } from "lucide-react";
import { ChatHeader, type ChatHeaderAction } from "inline-chat-kit";

const ACTIONS: ChatHeaderAction[] = [
  // Pinned: the one action that stays when the rest fold away.
  { id: "saved", label: "Saved highlights", icon: <Bookmark size={16} aria-hidden />, count: 3, pinned: true },
  { id: "share", label: "Share", icon: <Share2 size={16} aria-hidden /> },
  { id: "download", label: "Download transcript", icon: <Download size={16} aria-hidden /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} aria-hidden /> },
];

/** Drag the corner. Below 520px of header (not of window), the unpinned actions fold into a menu. */
export default function ChatHeaderCollapsing() {
  return (
    <div
      style={{
        resize: "horizontal",
        overflow: "auto",
        width: 600,
        minWidth: 260,
        maxWidth: "100%",
        // Room under the header for the menu to open into.
        height: 220,
        borderRadius: 16,
        background: "var(--ick-page)",
      }}
    >
      <ChatHeader
        title="Q3 churn review"
        subtitle="4 sources"
        variant="bordered"
        onBack={() => {}}
        landmark={false}
        collapseActionsAt={520}
        actions={ACTIONS}
      />
      <p style={{ margin: 0, padding: 16, fontSize: 14, lineHeight: 1.6, color: "var(--ick-ink-soft)" }}>
        Churn rose to 4.1% in September, almost all of it on the monthly plan.
      </p>
    </div>
  );
}
