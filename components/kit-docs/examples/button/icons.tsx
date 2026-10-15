"use client";

import { ArrowRight, ChevronDown, ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "inline-chat-kit";

/** `icon` leads, `iconRight` trails. Size the icons yourself: 14px suits s and m. */
export default function ButtonIcons() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Button size="m" icon={<MessageCircle size={14} aria-hidden />}>
        Reply in thread
      </Button>
      <Button size="m" variant="outline" iconRight={<ArrowRight size={14} aria-hidden />}>
        Next question
      </Button>
      <Button size="m" variant="ghost" iconRight={<ExternalLink size={14} aria-hidden />}>
        Open source
      </Button>
      <Button size="m" variant="secondary" icon={<MessageCircle size={14} aria-hidden />} iconRight={<ChevronDown size={14} aria-hidden />}>
        3 threads
      </Button>
    </div>
  );
}
