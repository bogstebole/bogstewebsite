"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";

interface VorliReceiptDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["iOS", "AI Financial Assistant", "In testing"];

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
      shortDescription={
        <>
          <span style={{ color: "var(--color-text-heading)" }}>Vorli</span>
          <span style={{ color: "var(--color-text-subdued)" }}>
            {" — The first app I've built that actually changed how I spend."}
          </span>
        </>
      }
      longDescription="Most financial apps share the same assumption: if you can see your data, you'll change your behavior. I built Vorli because that assumption never worked for me. Existing tools asked me to think about money the way they were designed — not the way I actually do. Vorli puts AI at the center: it auto-categorizes spending, scans receipts, and reads your financial picture so you can just ask what matters. Not 'show me a chart' — more like 'should I be worried about this month?'"
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
