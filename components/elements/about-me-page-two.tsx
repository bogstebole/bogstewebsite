"use client";

import { PaperTexture } from "@paper-design/shaders-react";

interface AboutMePageTwoProps {
  /** Width of the envelope in px — paper scales to match */
  envelopeWidth: number;
}

const TIMELINE_DATA = [
  {
    year: "1996 - Early creativity",
    content: "Ever since I was a little kid, I've been drawn to the creative world.  I remember in kindergarten, I'd get these strange looks for the stuff I drew – tons of black circles and other odd things. But by the time I hit preschool, my drawings were actually winning awards! Go figure, right?"
  },
  {
    year: "2007 - A fork in the road",
    content: "Growing up, I was torn between two completely different paths: art school or becoming a veterinarian. I've always loved animals. I remember when I was 5, I accidentally stepped on a sparrow – I still have no idea how it happened! – and I completely freaked out. I was sobbing my eyes out, convinced I'd killed it and would end up in prison!  But art... well, that was a different story. It just had this pull on me that I couldn't ignore."
  },
  {
    year: "2008 - Art school and beyond",
    content: "So, I ended up enrolling in to the High School of Arts, specializing in painting. It was there I met a friend and professor who would later become a key figure in my story and someone who significantly shaped my current career"
  },
  {
    year: "2011 - New Media Adventures",
    content: "Things moved fast after that. I actually started at the Academy of Arts a year early, and that's where I got hooked on conceptual and new media art. It was so different and exciting!"
  },
  {
    year: "2015 - Masters’s degree",
    content: "I just had to learn more, so I went on to get my Master's degree in New Media Arts in Novi Sad."
  }
];

export function AboutMePageTwo({ envelopeWidth }: AboutMePageTwoProps) {
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
        folds={1}
        foldCount={4}
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
