"use client";

import { ModalShell } from "@/components/ui/modal-shell";

interface ComingSoonModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

/**
 * What a tile says when there is nothing to open yet. Same shell as the QR
 * modal, so a card that cannot be entered still answers the click instead of
 * dropping the visitor on a route that does not exist.
 */
export function ComingSoonModal({ open, onClose, title, message }: ComingSoonModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} maxWidth={420}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--color-border-soft)",
          borderRadius: 4,
          paddingInline: 6,
          paddingBlock: 1,
        }}
      >
        <span
          style={{
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 10,
            lineHeight: 1.3,
            letterSpacing: "-0.04em",
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          Demo soon
        </span>
      </div>

      <span
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: 20,
          fontWeight: 500,
          lineHeight: 1.3,
          textAlign: "center",
          color: "var(--color-text-heading)",
        }}
      >
        {title}
      </span>

      <span
        style={{
          color: "var(--color-text-tertiary)",
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: 14,
          lineHeight: "21px",
          textAlign: "center",
        }}
      >
        {message}
      </span>
    </ModalShell>
  );
}
