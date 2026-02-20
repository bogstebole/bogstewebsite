"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition } from "framer-motion";
import { IDLE_FRAME, PALETTE, DISPLAY_H, DISPLAY_W } from "./PixelCharacter";
import { CHARACTER } from "@/lib/constants";
import { IntroBubble } from "./intro-bubble";

type IntroPhase =
    | "sitting"
    | "wakeup"
    | "airborne"
    | "landing"
    | "settled"
    | "bubble"
    | "exiting";

interface IntroSequenceProps {
    characterX: number;
    groundY: number;
    onDismiss: () => void;
}

const PX = CHARACTER.PIXEL_SIZE;
const COLS = CHARACTER.SPRITE_COLS;
const ROWS = CHARACTER.SPRITE_ROWS;
const CANVAS_W = COLS * PX;
const CANVAS_H = ROWS * PX;

const PHASE_TRANSFORMS: Record<IntroPhase, { scaleX: number; scaleY: number; y: number }> = {
    sitting:  { scaleX: 1,    scaleY: 1,    y: 0 },
    wakeup:   { scaleX: 1.2,  scaleY: 0.55, y: 0 },
    airborne: { scaleX: 0.78, scaleY: 1.3,  y: -180 },
    landing:  { scaleX: 1.2,  scaleY: 0.62, y: 0 },
    settled:  { scaleX: 1,    scaleY: 1,    y: 0 },
    bubble:   { scaleX: 1,    scaleY: 1,    y: 0 },
    exiting:  { scaleX: 1,    scaleY: 1,    y: 0 },
};

const PHASE_TRANSITIONS: Record<IntroPhase, Transition> = {
    sitting:  { duration: 0 },
    wakeup:   { duration: 0.14, ease: "easeIn" },
    airborne: { duration: 0.42, ease: [0.2, 0, 0.1, 1] as [number, number, number, number] },
    landing:  { duration: 0.1,  ease: "easeIn" },
    settled:  { type: "spring", stiffness: 220, damping: 30 },
    bubble:   { duration: 0 },
    exiting:  { duration: 0 },
};

export function IntroSequence({ characterX, groundY, onDismiss }: IntroSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [phase, setPhase] = useState<IntroPhase>("sitting");

    // Draw character once — static sleeping pose
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        for (let row = 0; row < ROWS; row++) {
            const line = IDLE_FRAME[row];
            if (!line) continue;
            for (let col = 0; col < line.length; col++) {
                const colorKey = line[col];
                if (!colorKey || colorKey === "0") continue;
                const color = PALETTE[colorKey];
                if (!color || color === "transparent") continue;
                ctx.fillStyle = color;
                ctx.fillRect(col * PX, row * PX, PX, PX);
            }
        }
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.ellipse(CANVAS_W / 2, CANVAS_H - 2, CANVAS_W * 0.35, 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    // 2s pause before waking up
    useEffect(() => {
        const timer = setTimeout(() => setPhase("wakeup"), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Brief pause after settling before bubble appears
    useEffect(() => {
        if (phase !== "settled") return;
        const timer = setTimeout(() => setPhase("bubble"), 350);
        return () => clearTimeout(timer);
    }, [phase]);

    const handleAnimationComplete = useCallback(() => {
        setPhase((prev) => {
            switch (prev) {
                case "wakeup":   return "airborne";
                case "airborne": return "landing";
                case "landing":  return "settled";
                default:         return prev;
            }
        });
    }, []);

    const handleDismiss = useCallback(() => {
        setPhase("exiting");
    }, []);

    // Any click/scroll outside the bubble dismisses it
    useEffect(() => {
        if (phase !== "bubble") return;
        const dismiss = () => handleDismiss();
        // Delay so the settle animation's final frame doesn't immediately trigger dismiss
        const timer = setTimeout(() => {
            window.addEventListener("click", dismiss);
            window.addEventListener("wheel", dismiss, { passive: true });
            window.addEventListener("scroll", dismiss, { passive: true });
        }, 150);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("click", dismiss);
            window.removeEventListener("wheel", dismiss);
            window.removeEventListener("scroll", dismiss);
        };
    }, [phase, handleDismiss]);

    return (
        <>
            {/* Squash/stretch character — sits at the exact ground position */}
            <motion.div
                style={{
                    position: "absolute",
                    left: characterX - DISPLAY_W / 2,
                    top: `calc(${groundY}% - ${DISPLAY_H}px)`,
                    width: DISPLAY_W,
                    height: DISPLAY_H,
                    transformOrigin: "bottom center",
                    pointerEvents: "none",
                    zIndex: 20,
                }}
                initial={PHASE_TRANSFORMS["sitting"]}
                animate={PHASE_TRANSFORMS[phase]}
                transition={PHASE_TRANSITIONS[phase]}
                onAnimationComplete={handleAnimationComplete}
            >
                {/* Pixel canvas */}
                <canvas
                    ref={canvasRef}
                    width={CANVAS_W}
                    height={CANVAS_H}
                    style={{
                        width: "100%",
                        height: "100%",
                        imageRendering: "pixelated",
                    }}
                />
            </motion.div>

            {/* Speech bubble — outside the transform wrapper so it stays at normal scale */}
            <div
                style={{
                    position: "absolute",
                    left: characterX,
                    top: `calc(${groundY}% - ${DISPLAY_H}px - 210px)`,
                    transform: "translateX(-50%)",
                    pointerEvents: "none",
                    zIndex: 21,
                }}
            >
                <AnimatePresence onExitComplete={onDismiss}>
                    {phase === "bubble" && <IntroBubble onClose={handleDismiss} />}
                </AnimatePresence>
            </div>
        </>
    );
}
