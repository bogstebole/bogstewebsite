"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { ModalShell } from "@/components/ui/modal-shell";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface AppDownloadButtonProps {
  /** Store listing the button sends people to. */
  url: string;
  /** Named in the QR caption, so it reads as an instruction rather than a label. */
  appName: string;
  /** Dropped into the middle of the QR code. */
  appIcon?: string;
  label?: string;
  /** A Mac app installs on the computer the visitor is already using, so it skips the QR code. */
  platform?: "ios" | "mac";
}

/**
 * One button, two jobs. A phone can install straight from the store, so it goes
 * there. A desktop cannot, so it hands over a code to scan with the phone that
 * can, the same split the selected-projects layout has always used. A Mac app
 * turns that around: the desktop is where it installs, so the store opens directly.
 */
export function AppDownloadButton({
  url,
  appName,
  appIcon,
  label = "Download the app",
  platform = "ios",
}: AppDownloadButtonProps) {
  const { isMobile } = useBreakpoint();
  const [showQR, setShowQR] = useState(false);

  if (platform === "mac") {
    return (
      <GlassButton size={isMobile ? "l" : "s"} onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
        {label}
      </GlassButton>
    );
  }

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

      <ModalShell open={showQR} onClose={() => setShowQR(false)}>
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
      </ModalShell>
    </>
  );
}
