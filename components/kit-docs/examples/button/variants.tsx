"use client";

import { ArrowRight, Copy, Download, MessageCircle } from "lucide-react";
import { Button } from "inline-chat-kit";

/** Five materials, one component. The default is primary at size s. */
export default function ButtonVariants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Button icon={<MessageCircle size={14} aria-hidden />}>Reply in thread</Button>
      <Button variant="secondary" icon={<Copy size={14} aria-hidden />}>
        Copy
      </Button>
      <Button variant="outline" icon={<Download size={14} aria-hidden />}>
        Export
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="glass" iconRight={<ArrowRight size={14} aria-hidden />}>
        Continue
      </Button>
    </div>
  );
}
