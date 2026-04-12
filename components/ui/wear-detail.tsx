"use client";

import { ProjectDetailLayout } from "./project-detail-layout";

interface WearDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const TAGS = ["iOS", "Weather", "In progress.."];

export function WearDetail({ onCloseStart, onClose }: WearDetailProps) {
  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title="Wear"
      icon="/images/puffer.png"
      tags={TAGS}
      shortDescription={
        <>
          <span style={{ color: "var(--color-text-heading)" }}>Wear</span>
          <span style={{ color: "var(--color-text-subdued)" }}>
            {" — A weather app that shows what to wear instead of temperatures."}
          </span>
        </>
      }
      longDescription="Wear reimagines the weather app as a styling tool, showing an invisible figure dressed for the current conditions. The design language is 3D cartoon figures with a matte vinyl aesthetic, rendered per weather state alongside a hand-drawn environment and a body language cue — three expressive layers per condition rather than a simple outfit swap. Mapping outfits to the full iOS weather condition set turned out to be the core design challenge: 30+ states across sky, rain, winter, wind, and severe categories, each requiring a distinct combination of environment illustration, figure pose, and attire. The project is still in production with the 3D asset pipeline as the main bottleneck."
    >
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div
          style={{
            width: 247,
            height: 534,
            backgroundColor: "#fff",
            borderRadius: 30,
            border: "4.4px solid #000",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
            flexShrink: 0,
          }}
        >
          <div style={{ width: "100%", flex: 1, backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: 16 }}>
            <video src="/assets/Wear/wear.mp4" autoPlay loop muted playsInline style={{ width: "60%", height: "auto", display: "block" }} />
          </div>
          <div style={{ height: 140, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingBottom: 24 }}>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, color: "#666", opacity: 0.7, marginBottom: 6 }}>Belgrade</div>
            <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: "#666" }}>Light, noticeable wind.</div>
          </div>
        </div>
      </div>
    </ProjectDetailLayout>
  );
}
