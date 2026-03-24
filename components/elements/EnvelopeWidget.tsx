"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  MotionValue,
} from "framer-motion";
import { createPortal } from "react-dom";
import { ENVELOPE_MESSAGES } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

type EnvelopeState =
  | "idle"
  | "floating"       // envelope scaled up, waiting for flap drag
  | "flap-dragging"  // user is dragging the flap
  | "flap-open"      // flap snapped fully open
  | "paper-dragging" // user is dragging the paper out
  | "paper-out"      // paper fully extracted
  | "fold-dragging"  // user is dragging the paper fold
  | "revealed";      // message fully visible

// ─── Constants ────────────────────────────────────────────────────────────────

const FLAP_H_RATIO = 0.696;       // flap height as fraction of envelope height (150/204 ≈ 0.696, matches SVG)
const FLAP_SNAP_THRESHOLD = 72;   // deg (40% of 180)
const PAPER_H_RATIO = 1.0;        // paper height relative to envelope height
const PAPER_SNAP_THRESHOLD = 0.4; // 40% extracted to snap out
const FOLD_H_RATIO = 0.45;        // paper fold = top 45% of paper
const FOLD_SNAP_THRESHOLD = 72;   // deg (40% of 180) — once rotation ≥ 72 snap open

const SPRING_SNAP = { type: "spring" as const, stiffness: 320, damping: 32 };
const SPRING_CLOSE = { type: "spring" as const, stiffness: 260, damping: 30 };

const OPEN_STATES: EnvelopeState[] = [
  "flap-open",
  "paper-dragging",
  "paper-out",
  "fold-dragging",
  "revealed",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface EnvelopeWidgetProps {
  onOpen?: () => void;
  onCloseStart?: () => void;
  onClose?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// ─── Small envelope (footer) ──────────────────────────────────────────────────

function SmallEnvelope({
  isOpen,
  isShaking,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  isShaking: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      style={{
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? "none" : "auto",
        transition: "opacity 0.15s",
      }}
    >
      <motion.div
        layoutId="envelope-widget"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          backgroundColor: "#e4e3de",
          borderRadius: 3,
          boxShadow:
            "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
          cursor: "pointer",
          flexShrink: 0,
          height: 24,
          overflow: "hidden",
          position: "relative",
          width: 34,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          animation: isShaking ? "envelope-shake 0.5s ease-in-out" : undefined,
        } as any}
      >
        {/* Left fold — z 0 */}
        <div style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "38.03%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-left.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Right fold — z 0 */}
        <div style={{ height: "100%", position: "absolute", right: 0, top: 0, width: "37.68%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-right.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Bottom fold — z 1 */}
        <div style={{ height: "69.6%", left: 0, position: "absolute", top: "30.4%", width: "100%", zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-bottom.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
        </div>
        {/* Top fold — z 2 */}
        <div style={{ height: "69.6%", left: 0, position: "absolute", top: 0, width: "100%", zIndex: 2 }}>
          <div style={{ bottom: "-5.02%", left: "-0.7%", position: "absolute", right: "-0.7%", top: "-3.79%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src="/images/envelope-top.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EnvelopeWidget({ onOpen, onCloseStart, onClose }: EnvelopeWidgetProps) {
  const [state, setState] = useState<EnvelopeState>("idle");
  const [isShaking, setIsShaking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const messageRef = useRef<string>("");
  const stateRef = useRef<EnvelopeState>("idle");
  stateRef.current = state;

  // Motion values for drag interactions
  const flapRotation = useMotionValue(0);      // 0 = closed, 180 = fully open
  const paperTranslateY = useMotionValue(0);   // 0 = inside, negative = pulled up
  const foldRotation = useMotionValue(0);      // 0 = flat (covering), 180 = open (revealing)

  // Element refs for measuring
  const flapRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const foldRef = useRef<HTMLDivElement>(null);

  // Drag state refs (avoid re-renders during drag)
  const flapDrag = useRef({ active: false, startY: 0 });
  const paperDrag = useRef({ active: false, startY: 0 });
  const foldDrag = useRef({ active: false, startY: 0 });

  // ── Open ──────────────────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (stateRef.current !== "idle") return;
    messageRef.current =
      ENVELOPE_MESSAGES[Math.floor(Math.random() * ENVELOPE_MESSAGES.length)];
    setState("floating");
    onOpen?.();
  }, [onOpen]);

  // ── Close sequence (reverses from whatever state we're in) ────────────────

  const handleClose = useCallback(async () => {
    const s = stateRef.current;
    if (s === "idle") return;

    onCloseStart?.();

    // 1. Fold paper fold back (if revealed or fold-dragging)
    if (s === "revealed" || s === "fold-dragging") {
      await animate(foldRotation, 0, SPRING_CLOSE);
    }

    // 2. Slide paper back in (if paper-out or beyond)
    if (["paper-out", "fold-dragging", "revealed"].includes(s) || s === "paper-dragging") {
      await animate(paperTranslateY, 0, SPRING_CLOSE);
    }

    // 3. Close flap (if flap-open or beyond)
    if (OPEN_STATES.includes(s) || s === "flap-dragging") {
      await animate(flapRotation, 0, SPRING_CLOSE);
    }

    // Reset all motion values synchronously before state change
    flapRotation.set(0);
    paperTranslateY.set(0);
    foldRotation.set(0);
    messageRef.current = "";
    setState("idle");
    onClose?.();
  }, [flapRotation, paperTranslateY, foldRotation, onCloseStart, onClose]);

  // ── Flap drag ─────────────────────────────────────────────────────────────

  const handleFlapMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (stateRef.current !== "floating") return;
      e.preventDefault();
      flapDrag.current = { active: true, startY: e.clientY };
      setState("flap-dragging");
    },
    []
  );

  const handleFlapTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (stateRef.current !== "floating") return;
      e.preventDefault();
      flapDrag.current = { active: true, startY: e.touches[0].clientY };
      setState("flap-dragging");
    },
    []
  );

  useEffect(() => {
    if (state !== "flap-dragging") return;
    const flapH = flapRef.current?.getBoundingClientRect().height ?? 200;

    const onMove = (e: MouseEvent) => {
      if (!flapDrag.current.active) return;
      const deltaY = flapDrag.current.startY - e.clientY;
      flapRotation.set(clamp((deltaY / flapH) * 180, 0, 180));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!flapDrag.current.active) return;
      e.preventDefault();
      const deltaY = flapDrag.current.startY - e.touches[0].clientY;
      flapRotation.set(clamp((deltaY / flapH) * 180, 0, 180));
    };

    const onUp = async () => {
      if (!flapDrag.current.active) return;
      flapDrag.current.active = false;
      const r = flapRotation.get();
      if (r >= FLAP_SNAP_THRESHOLD) {
        await animate(flapRotation, 180, SPRING_SNAP);
        setState("flap-open");
      } else {
        await animate(flapRotation, 0, SPRING_SNAP);
        setState("floating");
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [state, flapRotation]);

  // ── Paper drag ────────────────────────────────────────────────────────────

  const handlePaperMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (stateRef.current !== "flap-open") return;
      e.preventDefault();
      paperDrag.current = { active: true, startY: e.clientY };
      setState("paper-dragging");
    },
    []
  );

  const handlePaperTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (stateRef.current !== "flap-open") return;
      e.preventDefault();
      paperDrag.current = { active: true, startY: e.touches[0].clientY };
      setState("paper-dragging");
    },
    []
  );

  useEffect(() => {
    if (state !== "paper-dragging") return;
    const paperH = paperRef.current?.getBoundingClientRect().height ?? 300;
    const maxPull = paperH * 0.85;
    const threshold = paperH * PAPER_SNAP_THRESHOLD;

    const onMove = (e: MouseEvent) => {
      if (!paperDrag.current.active) return;
      const deltaY = paperDrag.current.startY - e.clientY;
      paperTranslateY.set(-clamp(deltaY, 0, maxPull));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!paperDrag.current.active) return;
      e.preventDefault();
      const deltaY = paperDrag.current.startY - e.touches[0].clientY;
      paperTranslateY.set(-clamp(deltaY, 0, maxPull));
    };

    const onUp = async () => {
      if (!paperDrag.current.active) return;
      paperDrag.current.active = false;
      const pulled = Math.abs(paperTranslateY.get());
      if (pulled >= threshold) {
        await animate(paperTranslateY, -(paperH * 0.75), SPRING_SNAP);
        setState("paper-out");
      } else {
        await animate(paperTranslateY, 0, SPRING_SNAP);
        setState("flap-open");
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [state, paperTranslateY]);

  // ── Paper fold drag ───────────────────────────────────────────────────────

  const handleFoldMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (stateRef.current !== "paper-out") return;
      e.preventDefault();
      foldDrag.current = { active: true, startY: e.clientY };
      setState("fold-dragging");
    },
    []
  );

  const handleFoldTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (stateRef.current !== "paper-out") return;
      e.preventDefault();
      foldDrag.current = { active: true, startY: e.touches[0].clientY };
      setState("fold-dragging");
    },
    []
  );

  useEffect(() => {
    if (state !== "fold-dragging") return;
    const foldH = foldRef.current?.getBoundingClientRect().height ?? 140;

    const onMove = (e: MouseEvent) => {
      if (!foldDrag.current.active) return;
      const deltaY = foldDrag.current.startY - e.clientY;
      foldRotation.set(clamp((deltaY / foldH) * 180, 0, 180));
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!foldDrag.current.active) return;
      e.preventDefault();
      const deltaY = foldDrag.current.startY - e.touches[0].clientY;
      foldRotation.set(clamp((deltaY / foldH) * 180, 0, 180));
    };

    const onUp = async () => {
      if (!foldDrag.current.active) return;
      foldDrag.current.active = false;
      const r = foldRotation.get();
      if (r >= FOLD_SNAP_THRESHOLD) {
        await animate(foldRotation, 180, SPRING_SNAP);
        setState("revealed");
      } else {
        await animate(foldRotation, 0, SPRING_SNAP);
        setState("paper-out");
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [state, foldRotation]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const isOpen = state !== "idle";
  const showXButton = OPEN_STATES.includes(state);
  const paperAbove = ["paper-out", "fold-dragging", "revealed"].includes(state);

  return (
    <>
      <style>{`
        @keyframes envelope-shake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          20%      { transform: translateX(-2px) rotate(-1.5deg); }
          40%      { transform: translateX(2px) rotate(1.5deg); }
          60%      { transform: translateX(-1.5px) rotate(-1deg); }
          80%      { transform: translateX(1.5px) rotate(1deg); }
        }
      `}</style>

      {/* ── Footer (small) ── */}
      <SmallEnvelope
        isOpen={isOpen}
        isShaking={isShaking}
        onClick={handleClick}
        onMouseEnter={() => { if (!isOpen) setIsShaking(true); }}
        onMouseLeave={() => setIsShaking(false)}
      />

      {/* ── Overlay (large, interactive) ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                layoutRoot
                style={{
                  alignItems: "center",
                  display: "flex",
                  inset: 0,
                  justifyContent: "center",
                  position: "fixed",
                  zIndex: 1000,
                  padding: "20px",
                }}
              >
                {/* Visual backdrop (blurs everything behind) */}
                <motion.div
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    inset: 0,
                    position: "fixed",
                  }}
                />

                {/* Backdrop click-to-close */}
                <div
                  onClick={handleClose}
                  style={{ inset: 0, position: "absolute", zIndex: 10 }}
                />

                {/* ── X button — fades in after flap opens ── */}
                <AnimatePresence>
                  {showXButton && (
                    <motion.button
                      key="x-btn"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                      style={{
                        alignItems: "center",
                        background: "rgba(0,0,0,0.08)",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        height: 28,
                        justifyContent: "center",
                        position: "absolute",
                        // Position relative to viewport since it's now fixed
                        right: "clamp(20px, 5vw, 60px)",
                        top: "clamp(20px, 5vh, 60px)",
                        width: 28,
                        zIndex: 50,
                      }}
                    >
                      <svg
                        fill="none"
                        height="10"
                        viewBox="0 0 10 10"
                        width="10"
                      >
                        <path
                          d="M1 1L9 9M9 1L1 9"
                          stroke="#2a2925"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Large envelope wrapper — layoutId FLIP from footer */}
                <motion.div
                  layoutId="envelope-widget"
                  style={{
                    aspectRatio: "284 / 204",
                    position: "relative",
                    width: "100%",
                    maxWidth: 450,
                    zIndex: 1,
                  }}
                >
                  {/* ... contents ... */}
                  {/* Envelope body */}
                  <div
                    style={{
                      backgroundColor: "#e4e3de",
                      borderRadius: "0.5%",
                      boxShadow:
                        "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
                      height: "100%",
                      overflow: "visible",
                      position: "relative",
                      width: "100%",
                    }}
                  >
                    {/* ── Paper ── */}
                    <motion.div
                      ref={paperRef}
                      style={{
                        bottom: "4%",
                        cursor: state === "flap-open" ? "grab" : "default",
                        height: `${PAPER_H_RATIO * 88}%`,
                        left: "6%",
                        position: "absolute",
                        translateY: paperTranslateY as MotionValue<number>,
                        width: "88%",
                        zIndex: paperAbove ? 10 : 0,
                      }}
                      onMouseDown={handlePaperMouseDown}
                      onTouchStart={handlePaperTouchStart}
                    >
                      {/* Paper surface */}
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: 2,
                          boxShadow:
                            "0 1px 2px #7878781A, 0 3px 3px #78787817, 0 7px 4px #7878780D, 0 13px 5px #78787803, 0 20px 6px #78787800",
                          height: "100%",
                          overflow: "hidden",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        {/* Paper fold — top 45%, starts flat/covering (rotateX 0), drags to 180 (open) */}
                        <motion.div
                          ref={foldRef}
                          onMouseDown={handleFoldMouseDown}
                          onTouchStart={handleFoldTouchStart}
                          style={{
                            backfaceVisibility: "hidden",
                            backgroundColor: "#f5f4f0",
                            borderBottom: "1px solid rgba(0,0,0,0.07)",
                            cursor: state === "paper-out" ? "grab" : "default",
                            height: `${FOLD_H_RATIO * 100}%`,
                            left: 0,
                            position: "absolute",
                            rotateX: foldRotation as MotionValue<number>,
                            top: 0,
                            transformOrigin: "50% 100%",
                            width: "100%",
                            zIndex: 2,
                          }}
                        />

                        {/* Message text — always rendered in lower half */}
                        <div
                          style={{
                            alignItems: "center",
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            left: 0,
                            padding: "8% 12%",
                            position: "absolute",
                            right: 0,
                            top: `${FOLD_H_RATIO * 100}%`,
                            zIndex: 1,
                          }}
                        >
                          <p
                            style={{
                              color: "#2a2925",
                              fontFamily:
                                "var(--font-jetbrains-mono), monospace",
                              fontSize: "clamp(10px, 1.6vw, 16px)",
                              fontWeight: 400,
                              lineHeight: 1.6,
                              margin: 0,
                              textAlign: "center",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {messageRef.current}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* ── Left fold — z 1 ── */}
                    <div
                      style={{
                        height: "100%",
                        left: 0,
                        position: "absolute",
                        top: 0,
                        width: "38.03%",
                        zIndex: 1,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        src="/images/envelope-left.svg"
                        style={{ display: "block", height: "100%", width: "100%" }}
                      />
                    </div>

                    {/* ── Right fold — z 1 ── */}
                    <div
                      style={{
                        height: "100%",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        width: "37.68%",
                        zIndex: 1,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        src="/images/envelope-right.svg"
                        style={{ display: "block", height: "100%", width: "100%" }}
                      />
                    </div>

                    {/* ── Bottom fold — z 2 ── */}
                    <div
                      style={{
                        height: "69.6%",
                        left: 0,
                        position: "absolute",
                        top: "30.4%",
                        width: "100%",
                        zIndex: 2,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        src="/images/envelope-bottom.svg"
                        style={{
                          display: "block",
                          height: "100%",
                          maxWidth: "none",
                          width: "100%",
                        }}
                      />
                    </div>

                    {/* ── Top flap — z 3, draggable, card-flip ── */}
                    <motion.div
                      style={{
                        height: `${FLAP_H_RATIO * 100}%`,
                        left: 0,
                        perspective: "800px",
                        position: "absolute",
                        top: 0,
                        transformStyle: "preserve-3d",
                        width: "100%",
                        zIndex: 3,
                      }}
                    >
                      {/* Flap inner — rotates around top edge */}
                      <motion.div
                        ref={flapRef}
                        onMouseDown={handleFlapMouseDown}
                        onTouchStart={handleFlapTouchStart}
                        style={{
                          bottom: "-5.02%",
                          cursor: state === "floating" || state === "flap-dragging" ? "grab" : "default",
                          left: "-0.7%",
                          position: "absolute",
                          right: "-0.7%",
                          rotateX: flapRotation as MotionValue<number>,
                          top: "-3.79%",
                          transformOrigin: "50% 0%",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        {/* Front face — closed state */}
                        <div
                          style={{
                            backfaceVisibility: "hidden",
                            height: "100%",
                            left: 0,
                            position: "absolute",
                            top: 0,
                            width: "100%",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt=""
                            src="/images/envelope-top.svg"
                            style={{
                              display: "block",
                              height: "100%",
                              maxWidth: "none",
                              width: "100%",
                            }}
                          />
                        </div>

                        {/* Back face — open state (pre-rotated 180° so it shows when flap is flipped) */}
                        <div
                          style={{
                            backfaceVisibility: "hidden",
                            height: "100%",
                            left: 0,
                            position: "absolute",
                            top: 0,
                            transform: "rotateX(180deg)",
                            transformOrigin: "50% 0%",
                            width: "100%",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt=""
                            src="/images/envelope-top-open.svg"
                            style={{
                              display: "block",
                              height: "100%",
                              maxWidth: "none",
                              width: "100%",
                            }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
