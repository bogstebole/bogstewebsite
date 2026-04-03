"use client";

import { PaperTexture } from "@paper-design/shaders-react";

interface AboutMePageFourProps {
  /** Width of the envelope in px — paper scales to match */
  envelopeWidth: number;
}

const TIMELINE_DATA = [
  {
    year: "2021 - Agency change",
    content: "Eventually, I moved to a different agency called Cinnamon.  That place was incredible!  I learned so much in just one year – workshops, design processes, you name it.  Plus, I got to work with some amazing clients.  I really needed that experience to broaden my skills.  I even ended up working on AI platforms and improving design systems for fintech companies."
  },
  {
    year: "2022 - Freelancing and Growth",
    content: "My next adventure came when I was hired as a freelancer by Tenscope agency.  I started on just one project, but I guess I did alright because they made me the UX lead and brought me on full-time!\nNow, besides client projects, I'm also responsible for making our design processes better.  That means things like standardizing documentation, figuring out how we communicate design decisions, and keeping our files organized."
  },
  {
    year: "2023 - Tenscope and UX Leadership",
    content: "I'm still at Tenscope, and we're constantly trying to improve and find new ways of doing things.  Agency life is definitely challenging, but it's also a lot of fun."
  },
  {
    year: "2025 - Present - Design Engineering",
    content: "This year, the gap between \"designing a concept\" and \"shipping a product\" finally disappeared. By heavily integrating AI into my workflow, I transitioned from being a designer who dreams up interfaces to a creator who builds them. From solving my own financial tracking for my agency to exploring the \"digital hoarding\" of Useless Notes, I’ve spent the year using AI as a bridge. It’s allowed me to return to that raw, childhood curiosity—where an idea doesn't stay on a canvas, but becomes a thing that actually lives."
  }
];

export function AboutMePageFour({ envelopeWidth }: AboutMePageFourProps) {
  // Original design: 340 × 480px
  const scale = envelopeWidth / 340;
  const w = envelopeWidth;
  const h = 480 * scale;

  const padding16 = 16 * scale;
  const gap16 = 16 * scale;
  const gap8 = 8 * scale;
  
  const titleSize = 10 * scale;
  const titleLineHeight = 12 * scale;
  const textSize = 8 * scale;

  return (
    <div
      style={{
        boxShadow:
          "#78787803 0px 42px 13px, #78787803 0px 27px 10px, #7878780D 0px 15px 8px, #78787817 0px 6px 6px, #7878781A 0px 2px 4px",
        boxSizing: "border-box",
        height: `${h}px`,
        position: "relative",
        width: `${w}px`,
        flexShrink: 0,
      }}
    >
      <PaperTexture
        contrast={0.3}
        roughness={0.4}
        fiber={0.3}
        fiberSize={0.2}
        crumples={0.3}
        crumpleSize={0.35}
        folds={0.34}
        foldCount={6}
        fade={0}
        drops={0}
        seed={5.8}
        scale={0.6}
        fit="cover"
        colorBack="#00000000"
        colorFront="#FFFFFF"
        style={{
          backgroundColor: "#E3E3E3",
          height: `${h}px`,
          left: 0,
          position: "absolute",
          top: 0,
          width: `${w}px`,
        }}
      />
      
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: `${gap16}px`,
          height: `${h}px`,
          left: 0,
          mixBlendMode: "multiply",
          paddingBlock: `${padding16}px`,
          paddingInline: `${padding16}px`,
          position: "absolute",
          top: 0,
          width: `${w}px`,
        }}
      >
        {TIMELINE_DATA.map((item, index) => (
          <div
            key={index}
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: `${gap8}px`,
              width: "100%",
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                color: "#434343",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: `${titleSize}px`,
                fontWeight: 300,
                lineHeight: `${titleLineHeight}px`,
              }}
            >
              {item.year}
            </div>
            <div
              style={{
                boxSizing: "border-box",
                color: "#434343CC",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: `${textSize}px`,
                fontWeight: 300,
                lineHeight: "150%",
                whiteSpace: "pre-wrap",
                width: "100%",
              }}
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
