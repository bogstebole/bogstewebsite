"use client";

import { ProjectDetailLayout } from "./project-detail-layout";

interface PauschalDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["Web", "Earning limit tracker", "Personal Usage"];

const SCREENSHOTS = [
  { src: "/assets/Pauschal tracker/1.png", alt: "Pauschal Tracker — dashboard" },
  { src: "/assets/Pauschal tracker/2.png", alt: "Pauschal Tracker — invoices" },
  { src: "/assets/Pauschal tracker/3.png", alt: "Pauschal Tracker — earnings" },
  { src: "/assets/Pauschal tracker/4.png", alt: "Pauschal Tracker — overview" },
  { src: "/assets/Pauschal tracker/5.png", alt: "Pauschal Tracker — settings" },
];

export function PauschalDetail({ onCloseStart, onClose }: PauschalDetailProps) {
  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Pauschal Tracker"
      icon="/images/pauschal-tracker.png"
      iconRotate="7.68deg"
      tags={TAGS}
      shortDescription={
        <>
          <span style={{ color: "#141414" }}>Pauschal Tracker</span>
          <span style={{ color: "rgba(20,20,20,0.5)" }}>
            {" — Personal SaaS for tracking freelance earning limits, invoices, and bank transactions."}
          </span>
        </>
      }
      longDescription="My personal SaaS for tracking the pauschal limit for my design agency and tracking invoices as well as generating invoices. I have my mail connected to pull each XML file from the bank which then gets parsed and categorised."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        {SCREENSHOTS.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            style={{ borderRadius: 8, display: "block", height: "auto", width: "100%" }}
          />
        ))}
      </div>
    </ProjectDetailLayout>
  );
}
