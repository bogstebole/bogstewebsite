"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NotesToSelf } from "@/components/elements/notes-to-self";

interface EnvelopeOverlayProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const ENVELOPE_ASPECT = 24 / 34; // height / width ratio of the envelope
const PAPER_ASPECT = 264 / 435;  // height / width ratio of the paper

const spring = { type: "spring" as const, stiffness: 380, damping: 38 };

type AnimationPhase =
  | "move-to-center"
  | "open-flap"
  | "pull-paper"
  | "open"
  | "return-paper"
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

  // Paper dimensions and centered position within the envelope
  const paperWidth = targetWidth * 0.8;
  const paperHeight = paperWidth * PAPER_ASPECT;
  const paperTopRatio = (targetHeight - paperHeight) / 2 / targetHeight;

  // Scale ratio so paper fits correctly inside envelope during transit
  const scaleRatio = originRect.width / targetWidth;

  // Peak: paper bottom must clear the envelope top (left/right folds are full envelope height)
  // Add 20% of envelope height as extra clearance above
  const peakY = -((paperTopRatio * targetHeight) + paperHeight + targetHeight * 0.2);

  const initiateClose = () => {
    if (
      phase === "return-paper" ||
      phase === "close-flap" ||
      phase === "move-to-origin"
    )
      return;

    // Revert animation exactly from wherever user is
    if (phase === "open" || phase === "pull-paper") {
      setPhase("return-paper");
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
    phase === "pull-paper" ||
    phase === "open" ||
    phase === "return-paper";

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
        transition={spring}
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

        {/* Notes to self paper
            Phase 1 (inside envelope): z -1 — behind all folds
            Phase 2 (above envelope, falling back): z 3 — on top of all folds
            z flips at the peak of the arc (times[1]) */}
        <motion.div
          initial={{ y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }}
          animate={
            phase === "pull-paper"
              ? { y: [0, peakY, 0], rotate: [0, 0, 5], zIndex: [-1, 3, 3], scale: 1 }
              : phase === "return-paper"
              ? { y: [0, peakY, 0], rotate: [5, 0, 0], zIndex: [3, -1, -1], scale: 1 }
              : phase === "open"
              ? { y: 0, rotate: 5, zIndex: 3, scale: 1 }
              : phase === "move-to-origin"
              ? { y: 0, rotate: 0, zIndex: -1, scale: scaleRatio }
              : { y: 0, rotate: 0, zIndex: -1, scale: 1 }
          }
          transition={
            phase === "pull-paper" || phase === "return-paper"
              ? {
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                  times: [0, 0.45, 1],
                }
              : phase === "move-to-center" || phase === "move-to-origin"
              ? spring
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (phase === "pull-paper") setPhase("open");
            if (phase === "return-paper") setPhase("close-flap");
          }}
          style={{
            left: 0,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: phase === "move-to-origin" || phase === "move-to-center" ? 0 : 1,
            position: "absolute",
            right: 0,
            top: `${paperTopRatio * 100}%`,
            width: "fit-content",
            transformOrigin: "top center",
          }}
        >
          <NotesToSelf envelopeWidth={paperWidth} />
        </motion.div>

        {/* Top fold — z 2 while closing, drops to z 0 once fully open so paper can pass over it */}
        <motion.div
          animate={{ rotateX: isFlapOpenState ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 28 }}
          onAnimationComplete={() => {
            if (phase === "open-flap") setPhase("pull-paper");
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
            zIndex: isFlapOpenState ? -2 : 2,
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
