"use client";

import type { ReactNode } from "react";
import { Branch } from "inline-chat-kit";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 28 }}>
      <span style={{ width: 150, flexShrink: 0, fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

/** The ends disable rather than wrap, and one answer draws nothing at all. */
export default function BranchEnds() {
  const ignore = () => {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
      <Row label="first of 3">
        <Branch total={3} index={0} onSelect={ignore} />
      </Row>
      <Row label="last of 3">
        <Branch total={3} index={2} onSelect={ignore} />
      </Row>
      <Row label="9 of 10">
        <Branch total={10} index={8} onSelect={ignore} />
      </Row>
      <Row label="1 of 1: nothing">
        <Branch total={1} index={0} onSelect={ignore} />
      </Row>
    </div>
  );
}
