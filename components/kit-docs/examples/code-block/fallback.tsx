"use client";

import { CodeBlock, canHighlight } from "inline-chat-kit";

const RUST = `fn pace(distance_km: f64, target_s: f64) -> f64 {
    target_s / distance_km
}`;

/**
 * Rust is not one of the eleven: the block renders plain instead of throwing.
 * `canHighlight` says so up front, without loading the grammars to find out.
 */
export default function CodeBlockFallback() {
  const lang = "rust";
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <CodeBlock code={RUST} lang={lang} label={canHighlight(lang) ? lang : `${lang} · plain text`} />
    </div>
  );
}
