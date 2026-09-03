"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";

const X_ICON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
  </svg>
);

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Horizontal room for the content; the QR sets the default. */
  maxWidth?: number;
}

/**
 * The blurred backdrop and floating card the site's small modals share.
 *
 * Portalled to body because the panels these open from sit inside blurred,
 * scaled stacking contexts that a fixed overlay cannot escape on its own, and
 * stacked above the project detail's 10000-10002 band and the tab bar that
 * portals up alongside it.
 */
export function ModalShell({ open, onClose, children, maxWidth }: ModalShellProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10010,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxSizing: "border-box",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-bg-modal)",
              borderRadius: 24,
              padding: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              position: "relative",
              maxWidth,
              boxSizing: "border-box",
              boxShadow:
                "0 237px 66px 0 rgba(0, 0, 0, 0.00), 0 152px 61px 0 rgba(0, 0, 0, 0.01), 0 85px 51px 0 rgba(0, 0, 0, 0.05), 0 38px 38px 0 rgba(0, 0, 0, 0.09), 0 9px 21px 0 rgba(0, 0, 0, 0.10)",
            }}
          >
            <div style={{ position: "absolute", top: 16, right: 16 }}>
              <GlassButton size="s" onClick={onClose} aria-label="Close">
                {X_ICON}
              </GlassButton>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
