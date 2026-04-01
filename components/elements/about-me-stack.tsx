"use client";

import { AboutMePageOne } from "./about-me-page-one";
import { AboutMePageTwo } from "./about-me-page-two";
import { AboutMePageThree } from "./about-me-page-three";
import { AboutMePageFour } from "./about-me-page-four";

import { motion } from "framer-motion";

interface AboutMeStackProps {
  paperWidth: number;
  isExpanded?: boolean;
  onReadMoreClick?: () => void;
}

export function AboutMeStack({ paperWidth, isExpanded, onReadMoreClick }: AboutMeStackProps) {
  const scale = paperWidth / 340;
  const h = 480 * scale;

  // A comfortable visual gap between spread pages
  const spreadGap = paperWidth * 0.05;
  const springConfig = { type: "spring" as const, stiffness: 130, damping: 18 };

  return (
    <div style={{ position: "relative", width: paperWidth, height: h }}>
      <motion.div 
        animate={isExpanded ? { x: (paperWidth + spreadGap) * 3, y: 0, rotate: 0 } : { x: "-2%", y: 0, rotate: -8 }}
        transition={springConfig}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transformOrigin: "bottom center" }}
      >
        <AboutMePageFour envelopeWidth={paperWidth} />
      </motion.div>
      <motion.div 
        animate={isExpanded ? { x: (paperWidth + spreadGap) * 2, y: 0, rotate: 0 } : { x: "1%", y: "-1%", rotate: 4 }}
        transition={springConfig}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transformOrigin: "bottom center" }}
      >
        <AboutMePageThree envelopeWidth={paperWidth} />
      </motion.div>
      <motion.div 
        animate={isExpanded ? { x: (paperWidth + spreadGap) * 1, y: 0, rotate: 0 } : { x: "-1%", y: "-2%", rotate: -4 }}
        transition={springConfig}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transformOrigin: "bottom center" }}
      >
        <AboutMePageTwo envelopeWidth={paperWidth} />
      </motion.div>
      <motion.div 
        animate={isExpanded ? { x: 0, y: 0, rotate: 0 } : { x: "3%", y: "-1%", rotate: 6 }}
        transition={springConfig}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transformOrigin: "bottom center", zIndex: 10 }}
      >
        <AboutMePageOne envelopeWidth={paperWidth} onReadMoreClick={onReadMoreClick} />
      </motion.div>
    </div>
  );
}
