"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";

interface VorliReceiptDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["iOS", "AI Financial Assistant", "In testing"];

const SCREENSHOTS = [
  { src: "/assets/Vorli/vorli 1.PNG", alt: "Vorli screenshot 1" },
  { src: "/assets/Vorli/vorli 2.PNG", alt: "Vorli screenshot 2" },
  { src: "/assets/Vorli/vorli 3.PNG", alt: "Vorli screenshot 3" },
  { src: "/assets/Vorli/vorli 4.PNG", alt: "Vorli screenshot 4" },
  { src: "/assets/Vorli/vorli 5.PNG", alt: "Vorli screenshot 5" },
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
            src={encodeURI("/assets/Vorli/vorli video.MP4")}
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
            src={encodeURI("/assets/Vorli/vorli video.MP4")}
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
