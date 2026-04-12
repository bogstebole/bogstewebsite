"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";

interface ContentSnareDetailProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["Web", "Productivity", "B2B, B2C"];

const ASSETS = [
  { src: "/assets/Content snare/Form layout.png", alt: "Form layout" },
  { src: "/assets/Content snare/sidebar.png", alt: "Sidebar" },
  { src: "/assets/Content snare/comments.png", alt: "Comments" },
  { src: "/assets/Content snare/Input section.png", alt: "Input section" },
  { src: "/assets/Content snare/success.png", alt: "Success" },
];

export function ContentSnareDetail({ onCloseStart, onClose }: ContentSnareDetailProps) {
  const { isMobile } = useBreakpoint();

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Content Snare"
      icon="/images/content-snare.png"
      iconRotate="3.34deg"
      tags={TAGS}
      shortDescription={
        <>
          <span style={{ color: "var(--color-text-heading)" }}>Content Snare</span>
          <span style={{ color: "var(--color-text-subdued)" }}>
            {" — Enhanced system led to faster request completion and reduced support tickets through clearer navigation and simplified user experience."}
          </span>
        </>
      }
      longDescription={
        "ContentSnare is an Australian productivity platform that helps businesses collect content and information from clients through structured request forms. They came to us needing a full redesign of their end-user request experience — not a blank-slate redesign, but one built directly on top of existing user feedback they had already collected. Discovery started with a planned workshop that went off-script, but the unstructured conversation turned out to surface exactly the insights we needed. The core friction points were clear: users missed submit buttons, got confused by terminology like \"reject\" and \"submit for review,\" struggled with rigid section structures, and couldn't easily navigate or understand their progress through a form. We restructured field information hierarchically so critical details stood out, and replaced text-heavy status indicators with visual cues — cleaning up the interface without breaking familiar patterns. The sidebar was rebuilt to separate progress tracking from navigation, with color coding and icons that communicate field states without adding visual noise. The comment system got a straightforward but effective fix: alignment and background color now instantly distinguish who said what and in what context. On the creator side, we improved the dashboard layout, filter organization, and tackled the recurring request feature — a deceptively simple concept that required multiple steps to implement properly. Collaboration was fast and direct, coming straight from an owner-developer, which kept decisions quick even if it occasionally meant realigning after missed updates. The main lesson: rigid process isn't a prerequisite for good outcomes — the quality came from collaboration and adaptability, not structure. Results are still being measured as the features roll out, with future iterations tied to actual usage patterns rather than assumptions."
      }
    >
      <div style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}>
        {isMobile ? (
          // Mobile: flat single-column stack
          ASSETS.map((item) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={item.src} src={encodeURI(item.src)} alt={item.alt}
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
          ))
        ) : (
          // Desktop: bento grid
          <>
            {/* Form layout — full width */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={encodeURI("/assets/Content snare/Form layout.png")} alt="Form layout"
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />

            {/* Two columns: Sidebar | Comments */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI("/assets/Content snare/sidebar.png")} alt="Sidebar"
                  style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
              </div>
              <div style={{ flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI("/assets/Content snare/comments.png")} alt="Comments"
                  style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
              </div>
            </div>

            {/* Input section — full width */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={encodeURI("/assets/Content snare/Input section.png")} alt="Input section"
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />

            {/* Success — full width */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={encodeURI("/assets/Content snare/success.png")} alt="Success"
              style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
          </>
        )}
      </div>
    </ProjectDetailLayout>
  );
}
