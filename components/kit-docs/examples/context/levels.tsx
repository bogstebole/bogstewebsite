"use client";

import type { ReactNode } from "react";
import { Context } from "inline-chat-kit";

const TOTAL = 200_000;

function Row({ note, children }: { note: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 72, flexShrink: 0 }}>{children}</div>
      <span style={{ fontFamily: "var(--ick-font-mono)", fontSize: 12, color: "var(--ick-ink-faint)" }}>{note}</span>
    </div>
  );
}

/** Quiet, warning, over, and not reported yet. */
export default function ContextLevels() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
      <Row note="24k of 200k: quiet">
        <Context used={24_000} total={TOTAL} />
      </Row>
      <Row note="170k of 200k: past warnAt">
        <Context used={170_000} total={TOTAL} />
      </Row>
      <Row note="240k of 200k: clamped to 100%">
        <Context used={240_000} total={TOTAL} />
      </Row>
      <Row note="total 0: not reported yet, not full">
        <Context used={12_000} total={0} />
      </Row>
      <Row note="124k of 200k, warnAt 0.6">
        <Context used={124_000} total={TOTAL} warnAt={0.6} />
      </Row>
    </div>
  );
}
