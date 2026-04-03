"use client";

import { motion } from "framer-motion";
import { PaperTexture } from "@paper-design/shaders-react";

interface StickyNotesIconProps {
  isExpanded?: boolean;
  layoutId?: string;
  opacity?: number;
}

/**
 * Sticky-notes stack component — supports both mini (48x48) and 
 * expanded (large) states with layoutId for smooth FLIP.
 */
export function StickyNotesIcon({ isExpanded, layoutId, opacity = 1 }: StickyNotesIconProps) {
  // The full design is ~486×491. 
  const FULLW = 486;
  const FULLH = 491;
  const SCALE = 48 / FULLW;

  return (
    <motion.div
      layoutId={layoutId}
      style={{
        width: isExpanded ? FULLW : 48,
        height: isExpanded ? FULLH : 48,
        position: "relative",
        flexShrink: 0,
        overflow: "visible",
        opacity,
      }}
    >
      {/* 
          Scale the full-size design down when mini. 
          When expanded, we use scale 1.
          Framer Motion will interpolate the scale/position.
      */}
      <div
        style={{
          transform: isExpanded ? "scale(1)" : `scale(${SCALE})`,
          transformOrigin: "top left",
          width: FULLW,
          height: FULLH,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Back note */}
        <div
          style={{
            alignItems: "start",
            boxShadow: "#0000001A 5px 8px 10px, #0000001A 16px 42px 34px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: 2,
            paddingBlock: 0,
            paddingInline: 0,
            position: "absolute",
            top: 15,
          }}
        >
          <PaperTexture
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.39} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{
              backgroundImage: "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0, height: 90, width: FULLW,
            }}
          />
          <PaperTexture
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.18} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{ backgroundColor: "#FFEB9B", flexShrink: 0, height: 386, width: FULLW }}
          />
        </div>

        {/* Middle note */}
        <div
          style={{
            alignItems: "start",
            boxShadow: "#0000001A 5px 8px 10px, #0000001A 16px 42px 34px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            left: 1,
            paddingBlock: 0,
            paddingInline: 0,
            position: "absolute",
            top: 8,
          }}
        >
          <PaperTexture
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.39} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{
              backgroundImage: "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0, height: 90, width: FULLW,
            }}
          />
          <PaperTexture
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.18} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{ backgroundColor: "#FFEB9B", flexShrink: 0, height: 386, width: FULLW }}
          />
        </div>

        {/* Front note */}
        <div
          style={{
            alignItems: "start",
            boxShadow: "#00000033 5px 8px 10px, #00000033 16px 42px 34px",
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
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.39} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{
              backgroundImage: "linear-gradient(in oklab 97.14deg, oklab(93.9% -0.011 0.102) 0.75%, 31.24%, oklab(90.8% 0.007 0.099) 99.1%)",
              flexShrink: 0, height: 90, width: FULLW,
            }}
          />
          <PaperTexture
            contrast={0.54} roughness={0.33} fiber={0.04} fiberSize={0.2}
            crumples={0} crumpleSize={0.01} folds={0.18} foldCount={12}
            fade={0.1} drops={0} seed={0} scale={0.6} fit="cover"
            colorBack="#00000000" colorFront="#FFB400"
            style={{ backgroundColor: "#FFEB9B", flexShrink: 0, height: 386, width: FULLW }}
          />
        </div>
      </div>
    </motion.div>
  );
}
