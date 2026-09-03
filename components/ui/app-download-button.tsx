"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const X_ICON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
  </svg>
);

interface AppDownloadButtonProps {
  /** Store listing the button sends people to. */
  url: string;
  /** Named in the QR caption, so it reads as an instruction rather than a label. */
  appName: string;
  /** Dropped into the middle of the QR code. */
  appIcon?: string;
  label?: string;
}

/**
 * One button, two jobs. A phone can install straight from the store, so it goes
 * there. A desktop cannot, so it hands over a code to scan with the phone that
 * can — the same split the selected-projects layout has always used.
 */
export function AppDownloadButton({
  url,
  appName,
  appIcon,
  label = "Download the app",
}: AppDownloadButtonProps) {
  const { isMobile } = useBreakpoint();
  const [showQR, setShowQR] = useState(false);

  if (isMobile) {
    return (
      <GlassButton size="l" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
        {label}
      </GlassButton>
    );
  }

  return (
    <>
      <GlassButton size="s" onClick={() => setShowQR(true)}>
        {label}
      </GlassButton>

      {/* Portalled to body: the detail panel it opens from sits inside a blurred,
          scaled stacking context that a fixed overlay cannot escape on its own. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowQR(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  // The detail panel this opens from stacks at 10000-10002, and
                  // the tab bar is portalled up there too; the code has to clear both.
                  zIndex: 10010,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                    boxShadow:
                      "0 237px 66px 0 rgba(0, 0, 0, 0.00), 0 152px 61px 0 rgba(0, 0, 0, 0.01), 0 85px 51px 0 rgba(0, 0, 0, 0.05), 0 38px 38px 0 rgba(0, 0, 0, 0.09), 0 9px 21px 0 rgba(0, 0, 0, 0.10)",
                  }}
                >
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <GlassButton size="s" onClick={() => setShowQR(false)} aria-label="Close">
                      {X_ICON}
                    </GlassButton>
                  </div>

                  <QRCodeSVG
                    value={url}
                    size={220}
                    bgColor="var(--color-bg-modal)"
                    fgColor="var(--color-text-ui)"
                    level="M"
                    imageSettings={
                      appIcon ? { src: appIcon, width: 40, height: 40, excavate: true } : undefined
                    }
                  />

                  <span
                    style={{
                      color: "var(--color-text-label)",
                      fontFamily: '"Geist", system-ui, sans-serif',
                      fontSize: 14,
                      lineHeight: "20px",
                      textAlign: "center",
                      maxWidth: 200,
                    }}
                  >
                    {`Scan with your camera to download ${appName} from the App Store`}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
