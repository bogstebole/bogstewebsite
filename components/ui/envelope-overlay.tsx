"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EnvelopeOverlayProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

const ENVELOPE_ASPECT = 24 / 34; // height / width ratio of the envelope

const spring = { type: "spring" as const, stiffness: 380, damping: 38 };

export function EnvelopeOverlay({ originRect, onCloseStart, onClose }: EnvelopeOverlayProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);

  const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  const targetWidth = vw * 0.30;
  const targetHeight = targetWidth * ENVELOPE_ASPECT;
  const targetLeft = vw / 2 - targetWidth / 2;
  const targetTop = vh * 0.10;

  const initiateClose = () => {
    if (isClosing) return;
    setFlapOpen(false);
    setIsClosing(true);
    onCloseStart();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop — click to close */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateClose}
        style={{ position: "fixed", inset: 0, zIndex: 10 }}
      />

      {/* Envelope body — FLIP from footer to top */}
      <motion.div
        initial={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          opacity: 0,
        }}
        animate={
          isClosing
            ? {
                top: originRect.top,
                left: originRect.left,
                width: originRect.width,
                height: originRect.height,
                opacity: 0,
              }
            : {
                top: targetTop,
                left: targetLeft,
                width: targetWidth,
                height: targetHeight,
                opacity: 1,
              }
        }
        transition={spring}
        onAnimationComplete={() => {
          if (isClosing) onClose();
          else setFlapOpen(true);
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#e4e3de",
          borderRadius: 3,
          boxShadow:
            "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
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
        {/* Top fold — z 2, rotates open around top edge */}
        <motion.div
          animate={{ rotateX: flapOpen ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 28 }}
          style={{ height: "69.6%", left: 0, position: "absolute", top: 0, transformOrigin: "top center", transformStyle: "preserve-3d", width: "100%", zIndex: 2 }}
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
