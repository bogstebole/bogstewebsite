"use client";

import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout } from "./project-detail-layout";

interface ZounDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["iOS", "Time Zone Tracker", "In progress.."];

const SCREENSHOTS = [
  { src: "/assets/Zoun/home.png", alt: "Zoun — globe view" },
  { src: "/assets/Zoun/compare.png", alt: "Zoun — compare time zones" },
  { src: "/assets/Zoun/search.png", alt: "Zoun — select country" },
];

export function ZounDetail({ onCloseStart, onClose }: ZounDetailProps) {
  const { isMobile } = useBreakpoint();

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Zoun"
      icon="/images/globe.png"
      tags={TAGS}
      shortDescription={
        <>
          <span style={{ color: "#141414" }}>Zoun</span>
          <span style={{ color: "rgba(20,20,20,0.5)" }}>
            {" — Time zones should feel spatial and immediate, not like reading a spreadsheet."}
          </span>
        </>
      }
      longDescription="Zoun is a personal iOS app built around the idea that comparing time zones across a global team should feel spatial and immediate, not like reading a spreadsheet. Existing world clock tools get the job done but look dated, and that gap was enough reason to build something better. The concept centers on a photorealistic 3D globe that reflects real-time daylight conditions, with contacts pinned to their locations and a list view below showing local times, UTC offsets, and day/night status at a glance. A time scrubber lets you simulate what everyone's clock looks like at any given hour, which is useful for scheduling calls across multiple zones. Built in SwiftUI, with an MVP already running using MapKit as a placeholder renderer. The final globe is still being evaluated between Metal, RealityKit, and SpriteKit, since MapKit does not deliver the visual fidelity the concept needs, and getting that right is the blocker between concept and release. Planned additions include calendar integrations for booking directly into Google Meet or similar. The app is intended for public release once the visuals meet the standard the concept sets."
    >
      {isMobile ? (
        // Mobile: 2-column grid
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", width: "100%" }}>
          {SCREENSHOTS.map((s) => (
            <div key={s.src} style={{ borderRadius: 12, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.alt}
                style={{ display: "block", height: "auto", objectFit: "cover", width: "100%" }} />
            </div>
          ))}
        </div>
      ) : (
        // Desktop: 3 screenshots side by side
        <div style={{ display: "flex", gap: 8 }}>
          {SCREENSHOTS.map((s) => (
            <div key={s.src} style={{ borderRadius: 12, flex: 1, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.alt}
                style={{ display: "block", height: "auto", objectFit: "cover", width: "100%" }} />
            </div>
          ))}
        </div>
      )}
    </ProjectDetailLayout>
  );
}
