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
      longDescription="Pauschal Tracker is a personal finance web app built in React and shadcn/ui to solve a specific problem with Serbia's pauschal tax system. Cross the annual income limit and you pay higher taxes the following year, with no native tooling to help you stay aware of where you stand. Before building it, tracking simply wasn't happening. The app covers invoice creation, income logging, and a dashboard that gives a clear picture of cumulative earnings relative to the limit at any point in the year. The stack was chosen for speed, as React and shadcn/ui meant functional, clean UI without fighting the tooling. Invoice generation took the most time to implement, though not because it was technically complex, just detail-heavy work that required getting the output right. The app is live and used daily as a single source of truth for the agency's finances. The main value isn't any single feature but having one place where the limit is always visible, removing the risk of an expensive surprise at year end."
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
