"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NotesToSelf } from "@/components/elements/notes-to-self";
import { AboutMeStack } from "@/components/elements/about-me-stack";

interface EnvelopeOverlayProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const ENVELOPE_ASPECT = 24 / 34; // height / width ratio of the envelope
const NOTES_PAPER_ASPECT = 264 / 435;  // height / width ratio of the notes paper
const ABOUT_PAPER_ASPECT = 480 / 340;  // height / width ratio of the about me stack

const spring = { 
  type: "spring" as const, 
  stiffness: 380, 
  damping: 38,
};

const returnTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

type AnimationPhase =
  | "move-to-center"
  | "open-flap"
  | "pull-paper-up"
  | "pull-paper-down"
  | "open"
  | "return-paper-up"
  | "return-paper-down"
  | "close-flap"
  | "move-to-origin";

export function EnvelopeOverlay({ originRect, onCloseStart, onClose }: EnvelopeOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("move-to-center");

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  const targetWidth = vw * 0.30;
  const targetHeight = targetWidth * ENVELOPE_ASPECT;
  const targetTop = (vh - targetHeight) / 2;
  const targetLeft = (vw - targetWidth) / 2;

  // We position both items relative to a maximum container height
  const aboutWidth = targetWidth * 0.45;
  const aboutHeight = aboutWidth * ABOUT_PAPER_ASPECT;
  
  const notesWidth = targetWidth * 0.8;
  const notesHeight = notesWidth * NOTES_PAPER_ASPECT;

  const maxPaperHeight = Math.max(aboutHeight, notesHeight);
  // Offset the anchor higher since envelope SVG carries a bottom drop-shadow. 
  // A 96% height bound ensures it stays visually tucked into the physical envelope, 
  // keeping the paper top under the folded closed hinge.
  const paperTopRatio = (targetHeight * 0.96 - maxPaperHeight) / targetHeight;

  // Scale ratio so paper fits correctly inside envelope during transit
  const scaleRatio = originRect.width / targetWidth;

  // Peak: paper bottom must clear the envelope top (left/right folds are full envelope height)
  // Add 20% of envelope height as extra clearance above
  const peakY = -((paperTopRatio * targetHeight) + maxPaperHeight + targetHeight * 0.2);

  const initiateClose = () => {
    if (
      phase.includes("return-paper") ||
      phase === "close-flap" ||
      phase === "move-to-origin"
    )
      return;

    // Revert animation exactly from wherever user is
    if (phase === "open" || phase === "pull-paper-up" || phase === "pull-paper-down") {
      setPhase("return-paper-up");
    } else if (phase === "open-flap") {
      setPhase("close-flap");
    } else {
      onCloseStart();
      setPhase("move-to-origin");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const isFlapOpenState =
    phase === "open-flap" ||
    phase.includes("pull-paper") ||
    phase === "open" ||
    phase.includes("return-paper");

  // Retract the flap ONLY when paper is going to slide over it, to prevent visual jank when opening
  const isFlapRetracted =
    phase.includes("pull-paper") ||
    phase === "open" ||
    phase.includes("return-paper");

  return (
    <>
      {/* Backdrop — click to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "move-to-origin" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateClose}
        style={{ position: "fixed", inset: 0, zIndex: 10 }}
      />

      {/* Envelope body — FLIP from footer to center */}
      <motion.div
        initial={{
          top: originRect.top,
          left: originRect.left,
          x: 0,
          width: originRect.width,
          height: originRect.height,
        }}
        animate={
          phase === "move-to-origin"
            ? {
                top: originRect.top,
                left: originRect.left,
                x: 0,
                width: originRect.width,
                height: originRect.height,
              }
            : {
                top: targetTop,
                left: targetLeft,
                x: 0,
                width: targetWidth,
                height: targetHeight,
              }
        }
        transition={phase === "move-to-origin" ? returnTransition : spring}
        onAnimationComplete={() => {
          if (phase === "move-to-center") {
            setPhase("open-flap");
          } else if (phase === "move-to-origin") {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#e4e3de",
          borderRadius: 3,
          boxShadow:
            "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
          overflow: "visible",
          perspective: "600px",
          position: "fixed",
          zIndex: 11,
        }}
      >
        {/* Left fold — z 0, left-aligned */}
        <div style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "38.03%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-left.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Right fold — z 0, right-aligned */}
        <div style={{ height: "100%", position: "absolute", right: 0, top: 0, width: "37.68%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-right.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Bottom fold — z 1 */}
        <div style={{ height: "75.5%", left: "-1.06%", position: "absolute", top: "30.4%", width: "102.82%", zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-bottom.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
        </div>

        {/* Notes to Self - SLIDES SECOND (delayed)
            zIndex logic:
            Phase 1: z -1
            Phase 2: z 1 (behind AboutMeStack) */}
        <motion.div
           initial={{ y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }}
           animate={
             phase === "pull-paper-up"
               ? { y: peakY, rotate: 0, zIndex: -1, scale: 1 }
               : phase === "pull-paper-down"
               ? { y: 0, rotate: 0, zIndex: 1, scale: 1 }
               : phase === "return-paper-up"
               ? { y: peakY, rotate: 0, zIndex: 1, scale: 1 }
               : phase === "return-paper-down"
               ? { y: 0, rotate: 0, zIndex: -1, scale: 1 }
               : phase === "open"
               ? { y: 0, rotate: 0, zIndex: 1, scale: 1 }
               : phase === "move-to-origin"
               ? { y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }
               : { y: 0, rotate: 0, zIndex: -1, scale: 1 }
           }
           transition={
             phase === "pull-paper-up" || phase === "return-paper-up"
               ? { duration: 0.45, ease: "easeOut", delay: 0.1, zIndex: { duration: 0, delay: 0 } }
               : phase === "pull-paper-down" || phase === "return-paper-down"
               ? { duration: 0.45, ease: "easeInOut", delay: 0.1, zIndex: { duration: 0, delay: 0 } }
               : phase === "move-to-origin"
               ? { ...returnTransition, delay: 0.05 }
               : phase === "move-to-center"
               ? spring
               : { duration: 0 }
           }
           // NotesToSelf is delayed by 0.1s, meaning it finishes LAST.
           // It controls the phase state machine.
           onAnimationComplete={() => {
             if (phase === "pull-paper-up") setPhase("pull-paper-down");
             if (phase === "pull-paper-down") setPhase("open");
             if (phase === "return-paper-up") setPhase("return-paper-down");
             if (phase === "return-paper-down") setPhase("close-flap");
           }}
           style={{
             left: 0,
             opacity: phase === "move-to-origin" || phase === "move-to-center" ? 0 : 1,
             position: "absolute",
             right: 0,
             top: `${paperTopRatio * 100}%`,
             height: maxPaperHeight,
             transformOrigin: "bottom center",
             pointerEvents: "none",
           }}
        >
          <motion.div 
            style={{ 
              position: "absolute", 
              bottom: "5%", 
              left: "50%", 
              x: "-50%", 
              rotate: -3, 
              zIndex: 1, 
              pointerEvents: phase === "open" ? "auto" : "none" 
            }}
            whileHover={phase === "open" ? { x: "-60%", rotate: -6 } : {}}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <NotesToSelf envelopeWidth={notesWidth} />
          </motion.div>
        </motion.div>

        {/* About Me Stack - SLIDES FIRST (no delay)
            z-index logic:
            Inside: z -1, Outside: z 4 */}
        <motion.div
           initial={{ y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }}
           animate={
             phase === "pull-paper-up"
               ? { y: peakY, rotate: 0, zIndex: -1, scale: 1 }
               : phase === "pull-paper-down"
               ? { y: 0, rotate: 5, zIndex: 4, scale: 1 }
               : phase === "return-paper-up"
               ? { y: peakY, rotate: 0, zIndex: 4, scale: 1 }
               : phase === "return-paper-down"
               ? { y: 0, rotate: 0, zIndex: -1, scale: 1 }
               : phase === "open"
               ? { y: 0, rotate: 5, zIndex: 4, scale: 1 }
               : phase === "move-to-origin"
               ? { y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }
               : { y: 0, rotate: 0, zIndex: -1, scale: 1 }
           }
           transition={
             phase === "pull-paper-up" || phase === "return-paper-up"
               ? { duration: 0.45, ease: "easeOut" }
               : phase === "pull-paper-down" || phase === "return-paper-down"
               ? { duration: 0.45, ease: "easeInOut" }
               : phase === "move-to-origin"
               ? returnTransition
               : phase === "move-to-center"
               ? spring
               : { duration: 0 }
           }
           // AboutMeStack moves faster so NO onAnimationComplete here, to prevent state double-fire
           style={{
             left: 0,
             opacity: phase === "move-to-origin" || phase === "move-to-center" ? 0 : 1,
             position: "absolute",
             right: 0,
             top: `${paperTopRatio * 100}%`,
             height: maxPaperHeight,
             transformOrigin: "bottom center",
             pointerEvents: "none", // let interactions pass through if needed
           }}
        >
          <motion.div 
            style={{ 
              position: "absolute", 
              bottom: 0, 
              left: "50%", 
              x: "-50%", 
              zIndex: 2, 
              pointerEvents: phase === "open" ? "auto" : "none", // Prevent hover intercepts during transit
              transformOrigin: "bottom center"
            }}
            whileHover={phase === "open" ? { scale: 1.04 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <AboutMeStack paperWidth={aboutWidth} />
          </motion.div>
        </motion.div>



        {/* Top fold — z 2 while closing, drops to z 0 once fully open so paper can pass over it */}
        <motion.div
          animate={{ rotateX: isFlapOpenState ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 28 }}
          onAnimationComplete={() => {
            if (phase === "open-flap") setPhase("pull-paper-up");
            if (phase === "close-flap") {
              onCloseStart();
              setPhase("move-to-origin");
            }
          }}
          style={{
            height: "69.6%",
            left: 0,
            position: "absolute",
            top: 0,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            width: "100%",
            zIndex: isFlapRetracted ? -3 : 2,
          }}
        >
          {/* Front face — visible when closed */}
          <div style={{ backfaceVisibility: "hidden", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}>
            <div style={{ bottom: "-5.02%", left: "-0.7%", position: "absolute", right: "-0.7%", top: "-3.79%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src="/images/envelope-top.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
            </div>
          </div>
          {/* Back face — visible when open (rotateX -180deg on parent) */}
          <div style={{ backfaceVisibility: "hidden", bottom: 0, left: 0, position: "absolute", right: 0, top: 0, transform: "rotateX(180deg) scaleY(-1)" }}>
            <div style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: "-3.79%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src="/images/envelope-top-open.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
