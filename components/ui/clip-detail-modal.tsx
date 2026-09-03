"use client";

import { ModalShell, MODAL_PADDING, MODAL_RADIUS } from "@/components/ui/modal-shell";

export interface ClipDetail {
  src: string;
  ratio: string;
  /** Native pixel width; the modal never draws the clip larger than this. */
  width: number;
  title: string;
  description: string;
  /** A few real lines from the thing itself, not a rewrite of it. */
  code: string;
  /** Where those lines live, so the snippet can be checked. */
  codeSource: string;
}

interface ClipDetailModalProps {
  clip: ClipDetail | null;
  onClose: () => void;
}

/** The looping tile, opened up: the same recording with room to read it. */
export function ClipDetailModal({ clip, onClose }: ClipDetailModalProps) {
  return (
    <ModalShell open={clip !== null} onClose={onClose} maxWidth={700}>
      {clip && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              width: "100%",
              // Capped at what was recorded. Re-capturing these at 3x to fill
              // the modal costs frames where it matters — the tab switch fell
              // from 71fps to 37 — so the clip is shown at size instead.
              maxWidth: clip.width,
              margin: "0 auto",
              aspectRatio: clip.ratio,
              borderRadius: MODAL_RADIUS - MODAL_PADDING,
              overflow: "hidden",
              backgroundColor: "var(--color-bg-page)",
              border: "1px solid var(--color-border-soft)",
              boxSizing: "border-box",
            }}
          >
            <video
              key={clip.src}
              src={encodeURI(clip.src)}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 20,
                fontWeight: 500,
                lineHeight: 1.3,
                color: "var(--color-text-heading)",
              }}
            >
              {clip.title}
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 14,
                lineHeight: "21px",
                color: "var(--color-text-tertiary)",
              }}
            >
              {clip.description}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: "-0.04em",
                color: "var(--color-text-muted)",
              }}
            >
              {clip.codeSource}
            </span>
            <pre
              style={{
                margin: 0,
                padding: 14,
                borderRadius: MODAL_RADIUS - MODAL_PADDING,
                backgroundColor: "var(--color-bg-page)",
                border: "1px solid var(--color-border-soft)",
                boxSizing: "border-box",
                // Long lines scroll inside the block instead of widening the modal.
                overflowX: "auto",
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 11,
                lineHeight: "18px",
                color: "var(--color-text-body)",
              }}
            >
              <code>{clip.code}</code>
            </pre>
          </div>
        </div>
      )}
    </ModalShell>
  );
}
