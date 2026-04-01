"use client";

import { AboutMePageOne } from "./about-me-page-one";
import { AboutMePageTwo } from "./about-me-page-two";
import { AboutMePageThree } from "./about-me-page-three";
import { AboutMePageFour } from "./about-me-page-four";

interface AboutMeStackProps {
  paperWidth: number;
}

export function AboutMeStack({ paperWidth }: AboutMeStackProps) {
  const scale = paperWidth / 340;
  const h = 480 * scale;

  return (
    <div style={{ position: "relative", width: paperWidth, height: h }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-8deg) translateX(-2%)", transformOrigin: "bottom center" }}>
        <AboutMePageFour envelopeWidth={paperWidth} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(4deg) translateX(1%) translateY(-1%)", transformOrigin: "bottom center" }}>
        <AboutMePageThree envelopeWidth={paperWidth} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-4deg) translateX(-1%) translateY(-2%)", transformOrigin: "bottom center" }}>
        <AboutMePageTwo envelopeWidth={paperWidth} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(6deg) translateX(3%) translateY(-1%)", transformOrigin: "bottom center" }}>
        <AboutMePageOne envelopeWidth={paperWidth} />
      </div>
    </div>
  );
}
