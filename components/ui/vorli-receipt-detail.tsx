"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";
import { VORLI_APP_STORE_URL } from "@/lib/constants";

interface VorliReceiptDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["iOS", "Finance tracker"];

const VIDEO_SRC = "/assets/Hero/receipt-recording.mp4";

const SCREENSHOTS = [
  { src: "/assets/Vorli/vorli-1.webp", alt: "Monthly balance and spending breakdown" },
  { src: "/assets/Vorli/vorli-2.webp", alt: "Scanned receipt detail with line items" },
  { src: "/assets/Vorli/vorli-3.webp", alt: "Yearly dashboard of spending per month" },
  { src: "/assets/Vorli/vorli-4.webp", alt: "Planning menu" },
  { src: "/assets/Vorli/vorli-5.webp", alt: "Wishlist with savings projections" },
  { src: "/assets/Vorli/vorli-6.webp", alt: "Manual expense entry" },
  { src: "/assets/Vorli/vorli-7.webp", alt: "Fixed monthly costs" },
  { src: "/assets/Vorli/vorli-8.webp", alt: "Receipt search with category filters" },
];

export function VorliReceiptDetail({ onCloseStart, onClose }: VorliReceiptDetailProps) {
  const { isMobile } = useBreakpoint();

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Vorli"
      icon="/images/receipt.png"
      iconRotate="359.41deg"
      tags={TAGS}
      appStore
      downloadUrl={VORLI_APP_STORE_URL}
      shortDescription={
        <>
          <span style={{ color: "var(--color-text-heading)" }}>Vorli</span>
          <span style={{ color: "var(--color-text-subdued)" }}>
            {" — The first app I've built that actually changed how I spend."}
          </span>
        </>
      }
      longDescription="Most financial apps share the same assumption: if you can see your data, you'll change your behavior. I built Vorli because that assumption never worked for me. Existing tools asked me to think about money the way they were designed, not the way I actually do. So Vorli starts from the receipt: scan the QR code on a Serbian fiscal receipt and every item, price and tax comes in on its own. From there it shows where the month's money went, day by day and by category, which products got more expensive since you last bought them, and whether you're on track for the things you're saving for. Everything stays on your phone: no account, no server, no tracking."
    >
      <div style={{ backgroundColor: "var(--color-bg-surface)", borderRadius: 24, padding: 16 }}>
      {isMobile ? (
        // Mobile: single-column stack (video first, then screenshots)
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <video
            src={VIDEO_SRC}
            autoPlay loop muted playsInline
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
          {SCREENSHOTS.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={encodeURI(s.src)} alt={s.alt}
              style={{ width: "100%", height: "auto", borderRadius: 8 }} />
          ))}
        </div>
      ) : (
        // Desktop: 3-column grid (video + 5 screenshots = 2 rows of 3)
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <video
            src={VIDEO_SRC}
            autoPlay loop muted playsInline
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
          {SCREENSHOTS.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.src} src={encodeURI(s.src)} alt={s.alt}
              style={{ width: "100%", height: "auto", borderRadius: 8 }} />
          ))}
        </div>
      )}
      </div>
    </ProjectDetailLayout>
  );
}
