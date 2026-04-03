"use client";

import { PaperTexture } from "@paper-design/shaders-react";

/**
 * Mini sticky-notes icon — 48×48 scaled-down version of the full
 * sticky stack design from Paper Design.
 */
export function StickyNotesIcon() {
  // The full design is ~486×476. We fit it into 48×50 (≈ 0.0988× scale).
  // We use a scale wrapper so the inner layout stays pixel-accurate.
  const SCALE = 48 / 486;

  return (
    <div
      style={{
        width: 48,
        height: 48,
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
        borderRadius: 6,
      }}
    >
      {/* Scale the full-size design down */}
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: 486,
          height: 476,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Stack of sticky notes — three layers matching the original design */}

        {/* Back-right note */}
        <div
          style={{
            alignItems: "start",
            boxShadow:
              "#0000001A 5px 8px 10px, #0000001A 16px 42px 34px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: 8,
            paddingBlock: 0,
            paddingInline: 0,
            position: "absolute",
            top: 4,
          }}
        >
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.39}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0,
              height: 90,
              width: 486,
            }}
          />
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.18}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundColor: "#FFEB9B",
              flexShrink: 0,
              height: 386,
              width: 486,
            }}
          />
        </div>

        {/* Back-left note */}
        <div
          style={{
            alignItems: "start",
            boxShadow:
              "#0000001A 5px 8px 10px, #0000001A 16px 42px 34px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: -8,
            paddingBlock: 0,
            paddingInline: 0,
            position: "absolute",
            top: 8,
          }}
        >
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.39}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0,
              height: 90,
              width: 486,
            }}
          />
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.18}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundColor: "#FFEB9B",
              flexShrink: 0,
              height: 386,
              width: 486,
            }}
          />
        </div>

        {/* Front (top) note */}
        <div
          style={{
            alignItems: "start",
            boxShadow:
              "#00000033 5px 8px 10px, #00000033 16px 42px 34px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: 0,
            paddingBlock: 0,
            paddingInline: 0,
            position: "absolute",
            top: 0,
          }}
        >
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.39}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundImage:
                "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0,
              height: 90,
              width: 486,
            }}
          />
          <PaperTexture
            contrast={0.54}
            roughness={0.33}
            fiber={0.04}
            fiberSize={0.2}
            crumples={0}
            crumpleSize={0.01}
            folds={0.18}
            foldCount={12}
            fade={0.1}
            drops={0}
            seed={0}
            scale={0.6}
            fit="cover"
            colorBack="#00000000"
            colorFront="#FFB400"
            style={{
              backgroundColor: "#FFEB9B",
              flexShrink: 0,
              height: 386,
              width: 486,
            }}
          />
        </div>
      </div>
    </div>
  );
}
