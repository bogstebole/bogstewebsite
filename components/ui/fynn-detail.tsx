"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";

interface FynnDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["Web", "HealthTech", "B2B"];

const LEFT_COL_ITEMS: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/edit profile.png", alt: "Edit profile" },
  { src: "/assets/Fynn/Incidents.png", alt: "Incidents" },
];

const RIGHT_COL_ITEMS: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Signature flow.png", alt: "Signature flow" },
  { src: "/assets/Fynn/Temporary warning.png", alt: "Temporary warning" },
];

const SPECS_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-overview.png", alt: "Design system — overview" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-building-blocks.png", alt: "Design system — building blocks" },
];

const SPECS_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-type.png", alt: "Design system — type specs" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-behaviour.png", alt: "Design system — behaviour" },
];

export function FynnDetail({ onCloseStart, onClose }: FynnDetailProps) {
  const { isMobile } = useBreakpoint();

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Fynn.io"
      icon="/images/fynn.png"
      iconRotate="13.1deg"
      tags={TAGS}
      shortDescription={
        <>
          <span style={{ color: "var(--color-text-heading)" }}>Fynn.io</span>
          <span style={{ color: "var(--color-text-subdued)" }}>
            {" — Task completion time cut in half. Development speed doubled, this is how we transformed Fynn's senior living management system."}
          </span>
        </>
      }
      longDescription={
        "Fynn is a U.S.-based senior living care management platform that came to us with a fragmented system built on Ionic, Angular, and Bootstrap — all mixing in ways they shouldn't. The goal was to redesign the core \"Activities of Daily Living\" feature, build a scalable design system, and set the product up for future growth. With no existing Ionic UI kit in Figma, we built one from scratch, establishing root-level tokens for color, typography, and spacing that matched Ionic's structure and made sense to developers immediately. Discovery started with lo-fi wireframes, moved through hi-fi prototypes, and was validated through in-person user testing — which revealed how users physically interacted with devices, directly shaping final decisions. We established a clear workflow from Jira stories through design, refinement, visual QA, and release, with a custom annotation system in Figma that made handoffs clean and reduced back-and-forth. The design system was organized into three layers — foundations, native Ionic components, and custom components — keeping the Figma file navigable as the project scaled. A pattern rulebook covering navigation, filters, drawers, and grid behavior reduced dev meetings and increased team efficiency by 13%. For the resident profile redesign, we moved from a single overloaded page to a tabbed layout with a drawer pattern for complex forms, keeping resident context visible throughout interactions. The drawer approach was a pragmatic call — not perfect, but fast to implement with existing components, and initial user feedback confirmed it worked. The Bulk ADL feature launch cut task completion time by 50%, and the design system accelerated development speed across all ongoing projects. The main lesson: lock in the technical stack before touching the design system — the Ionic vs. Angular split created avoidable complexity throughout. Moving forward, the priority is consolidating to a single framework, deepening design-dev collaboration, and expanding the system for new features."
      }
    >
      <div
        style={{
          backgroundColor: "#347eff",
          borderRadius: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 12,
          width: "100%",
          marginTop: 12,
        }}
      >
        {isMobile ? (
          // Mobile: flat single-column stack of all assets
          [...[{ src: "/assets/Fynn/Billing dashboard - Rent roll.png", alt: "Billing dashboard — rent roll" }],
            ...LEFT_COL_ITEMS, ...RIGHT_COL_ITEMS,
            { src: "/assets/Fynn/Resident care.png", alt: "Resident care" },
            ...SPECS_LEFT, ...SPECS_RIGHT,
          ].map((item) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
          ))
        ) : (
          // Desktop: bento grid
          <>
            {/* Hero — full width */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={encodeURI("/assets/Fynn/Billing dashboard - Rent roll.png")}
              alt="Billing dashboard — rent roll"
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
            />

            {/* 2 flex columns, 2 rows each */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                {LEFT_COL_ITEMS.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                ))}
              </div>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                {RIGHT_COL_ITEMS.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                ))}
              </div>
            </div>

            {/* Full width footer */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={encodeURI("/assets/Fynn/Resident care.png")}
              alt="Resident care"
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }}
            />

            {/* Design system specs — 2 flex columns, 2 rows each */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                {SPECS_LEFT.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                ))}
              </div>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                {SPECS_RIGHT.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
                    style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ProjectDetailLayout>
  );
}
