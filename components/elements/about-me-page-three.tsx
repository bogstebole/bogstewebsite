"use client";

import { PaperTexture } from "@paper-design/shaders-react";

interface AboutMePageThreeProps {
  /** Width of the envelope in px — paper scales to match */
  envelopeWidth: number;
}

const TIMELINE_DATA = [
  {
    year: "2016 - Doughnuts and dreams",
    content: "After all that studying, I needed a break and wanted to see the world.  I got a chance to be a model in India, which was an amazing experience.  When I came back, I needed to pay the bills, so I started making doughnuts at a friend's shop.  Yeah, a bit of a change from the art world, huh?\nAt the same time, I was renting an apartment that had a studio space. I thought, \"Perfect! I'll finally focus on my painting career.\"  Well, it didn't quite take off the way I hoped."
  },
  {
    year: "2017 - A coding detour and product design spark",
    content: "The owner of the apartment ran an agency and offered me a job if I learned some front-end development.  I gave it a shot, but coding wasn't really my thing. It was way too boring for me.\nLuckily, around that time, I bumped into an old high school friend. We hadn't seen each other in ages. He got me really interested in web design.  Honestly, back then, I had no clue what that even involved or how design turned into websites.\nBut I was determined!  I quit my doughnut-making gig and dove headfirst into learning everything I could about design.  I read books, watched tutorials, the whole nine yards.\nThen, another lucky break!  I went to my landlord's birthday party and met a guy who owned a software agency.  They were looking for a designer, and he invited me to come learn the ropes.  After a month, they actually hired me!"
  },
  {
    year: "2018 - Design beginnings",
    content: "And that's how my product design journey began. I spent three years at that agency. It was tough, and I felt like I wasn't growing as much as I wanted to.\nSo, I started looking for freelance work on the side. I landed some really cool projects, like designing a streaming platform for musicians in Thailand and working on a banking app."
  }
];

export function AboutMePageThree({ envelopeWidth }: AboutMePageThreeProps) {
  // Original design: 340 × 480px
  const scale = envelopeWidth / 340;
  const w = envelopeWidth;
  const h = 480 * scale;

  const padding16 = Math.round(16 * scale);
  const gap16 = Math.round(16 * scale);
  const gap8 = Math.round(8 * scale);
  
  const titleSize = Math.max(8, Math.round(10 * scale));
  const titleLineHeight = Math.round(12 * scale);
  const textSize = Math.max(6, Math.round(8 * scale));

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
        folds={1}
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
