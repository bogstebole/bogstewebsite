"use client";

import type { ReactNode } from "react";
import { Context } from "inline-chat-kit";

const TOTAL = 1_000_000;

function Row({ note, children }: { note: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 96, flexShrink: 0 }}>{children}</div>
      <span style={{ fontFamily: "var(--ick-font-mono)", fontSize: 12, color: "var(--ick-ink-faint)" }}>{note}</span>
    </div>
  );
}

/** What is drawn beside the ring, and what is said about it, are both yours. */
export default function ContextLabels() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
      <Row note="default: the percentage">
        <Context used={128_000} total={TOTAL} />
      </Row>
      <Row note="label={false}: the ring alone">
        <Context used={128_000} total={TOTAL} label={false} />
      </Row>
      <Row note="label: your own text">
        <Context used={128_000} total={TOTAL} label="128k / 1M" />
      </Row>
      <Row note="labels: in Serbian">
        <Context
          used={880_000}
          total={TOTAL}
          labels={{
            name: "Iskorišćen kontekst",
            of: "od",
            tokens: "tokena",
            nearlyFull: "Skoro pun: najstarije poruke počinju da otpadaju",
          }}
        />
      </Row>
    </div>
  );
}
