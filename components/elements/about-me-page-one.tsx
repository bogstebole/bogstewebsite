"use client";

import { PaperTexture } from "@paper-design/shaders-react";

interface AboutMePageOneProps {
  /** Width of the envelope in px — paper scales to match */
  envelopeWidth: number;
}

export function AboutMePageOne({ envelopeWidth }: AboutMePageOneProps) {
  // Original design: 340 × 480px
  const scale = envelopeWidth / 340;
  const w = envelopeWidth;
  const h = 480 * scale;

  const gap24 = Math.round(24 * scale);
  const gap12 = Math.round(12 * scale);
  const padding16 = Math.round(16 * scale);
  const titleSize = Math.max(10, Math.round(12 * scale));
  const textSize = Math.max(8, Math.round(8 * scale));
  const lineHeight16 = Math.round(16 * scale);
  const readMoreW = Math.round(65 * scale);
  const readMorePBlock = Math.round(4 * scale);
  const readMorePInline = Math.round(8 * scale);

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
        foldCount={14}
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
          gap: `${gap24}px`,
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
        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              color: "#434343",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: `${titleSize}px`,
              fontWeight: 300,
              lineHeight: `${lineHeight16}px`,
            }}
          >
            About
          </div>
          <div
            style={{
              boxSizing: "border-box",
              color: "#43434399",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: `${titleSize}px`,
              fontWeight: 300,
              lineHeight: `${lineHeight16}px`,
            }}
          >
            Eerie black circles and beyond
          </div>
        </div>
        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            gap: `${gap12}px`,
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              color: "#434343CC",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: `${textSize}px`,
              fontWeight: 300,
              lineHeight: "150%",
              whiteSpace: "pre-wrap",
            }}
          >
            Childhood fascination with drawing dark circles alarmed my parents but led me to explore conceptual art, product design and eventually AI.{"  "}AI gave me opportunity to bring to life concepts that were just an idea a while ago. Through the process I learned to harness a child's innate curiosity. Now as a father, my son's wonder helps me rediscover that questioning spirit I sometimes lose touch with.
          </div>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#434343",
              borderRadius: "9999px",
              boxSizing: "border-box",
              display: "flex",
              cursor: "pointer",
              paddingBlock: `${readMorePBlock}px`,
              paddingInline: `${readMorePInline}px`,
              marginTop: "auto"
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                color: "#FFFFFF",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: `${textSize}px`,
                fontWeight: 300,
                lineHeight: `${Math.round(10 * scale)}px`,
                width: `${readMoreW}px`,
                textAlign: "center"
              }}
            >
              Read more
            </div>
          </div>
        </div>
        
        {/* Replace SVG with the image that user provided */}
        <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "flex-start", marginTop: `${gap24}px` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/me-and-son.png"
            alt="Me and my son illustration"
            style={{ 
              width: `${Math.round(305 * scale)}px`, 
              height: "auto",
              display: "block",
              flexShrink: 0
            }}
          />
        </div>
      </div>
    </div>
  );
}
