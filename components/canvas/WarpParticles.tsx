"use client";

import { useRef, useEffect, useCallback } from "react";
import { CHARACTER } from "@/lib/constants";
import { IDLE_FRAME, PALETTE, DISPLAY_W, DISPLAY_H } from "./PixelCharacter";

// ── 2D Value Noise ──────────────────────────────────────────────────────
function hash2d(x: number, y: number): number {
    const h = Math.sin(x * 127.1 + y * 311.7 + 43758.5453) * 43758.5453;
    return h - Math.floor(h);
}

function valueNoise(x: number, y: number): number {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const a = hash2d(ix, iy);
    const b = hash2d(ix + 1, iy);
    const c = hash2d(ix, iy + 1);
    const d = hash2d(ix + 1, iy + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

// ── Particle type ───────────────────────────────────────────────────────
interface Particle {
    row: number;
    col: number;
    x: number;
    y: number;
    color: string;
    shedThreshold: number;
    shed: boolean;
    consumed: boolean;
    scale: number;
    opacity: number;
    angleOffset: number;
}

// ── Component ───────────────────────────────────────────────────────────
interface WarpParticlesProps {
    active: boolean;
    /** Character X in screen pixels */
    characterX: number;
    /** Ground Y as viewport percentage (e.g., 84.4) */
    groundYPercent: number;
    /** Portal center X as viewport percentage */
    portalXPercent: number;
    /** Portal center Y as viewport percentage */
    portalYPercent: number;
    onAllConsumed: () => void;
    onShedUpdate: (shed: Set<string>) => void;
}

const PIXEL_DISPLAY_SIZE = DISPLAY_W / CHARACTER.SPRITE_COLS;

export function WarpParticles({
    active,
    characterX,
    groundYPercent,
    portalXPercent,
    portalYPercent,
    onAllConsumed,
    onShedUpdate,
}: WarpParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const shedProgressRef = useRef(0);
    const doneRef = useRef(false);
    const activeRef = useRef(false);

    const initParticles = useCallback(
        (charX: number, viewH: number) => {
            const particles: Particle[] = [];
            const charGroundY = (groundYPercent / 100) * viewH;
            const charLeft = charX - DISPLAY_W / 2;
            const charTop = charGroundY - DISPLAY_H;

            for (let row = 0; row < CHARACTER.SPRITE_ROWS; row++) {
                const line = IDLE_FRAME[row];
                if (!line) continue;
                for (let col = 0; col < line.length; col++) {
                    const key = line[col];
                    if (!key || key === "0") continue;
                    const color = PALETTE[key];
                    if (!color || color === "transparent") continue;

                    const screenX = charLeft + col * PIXEL_DISPLAY_SIZE;
                    const screenY = charTop + row * PIXEL_DISPLAY_SIZE;

                    // Multi-octave noise for organic shedding order
                    const n1 = valueNoise(col * 0.25, row * 0.25);
                    const n2 = valueNoise(col * 0.5 + 50, row * 0.5 + 50) * 0.5;
                    const shedThreshold = Math.min(1, Math.max(0, (n1 + n2) / 1.5));

                    particles.push({
                        row,
                        col,
                        x: screenX,
                        y: screenY,
                        color,
                        shedThreshold,
                        shed: false,
                        consumed: false,
                        scale: 1,
                        opacity: 1,
                        angleOffset: (hash2d(col * 7, row * 13) - 0.5) * 0.8,
                    });
                }
            }
            return particles;
        },
        [groundYPercent]
    );

    useEffect(() => {
        if (!active) {
            if (activeRef.current) {
                cancelAnimationFrame(animRef.current);
                particlesRef.current = [];
                shedProgressRef.current = 0;
                doneRef.current = false;
                activeRef.current = false;
                onShedUpdate(new Set());
            }
            return;
        }

        if (activeRef.current) return;
        activeRef.current = true;
        doneRef.current = false;
        shedProgressRef.current = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Size canvas to viewport
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w;
        canvas.height = h;

        // Initialize particles with real viewport dimensions
        particlesRef.current = initParticles(characterX, h);

        // Compute portal center in actual screen pixels
        const portalCX = (portalXPercent / 100) * w;
        const portalCY = (portalYPercent / 100) * h;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let lastTime = 0;
        let frameCount = 0;

        function tick(timestamp: number) {
            if (!activeRef.current || doneRef.current) return;

            const dt =
                lastTime === 0 ? 0.016 : Math.min((timestamp - lastTime) / 1000, 0.05);
            lastTime = timestamp;
            frameCount++;

            // Advance shed progress
            shedProgressRef.current += 1 / CHARACTER.WARP_SHED_DURATION;
            const shedProgress = Math.min(1, shedProgressRef.current);

            const particles = particlesRef.current;
            const newShed = new Set<string>();
            let allConsumed = true;
            let anyAlive = false;

            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            for (const p of particles) {
                if (p.consumed) {
                    newShed.add(`${p.row},${p.col}`);
                    continue;
                }

                allConsumed = false;

                // Check if this pixel should shed
                if (!p.shed && shedProgress >= p.shedThreshold) {
                    p.shed = true;
                }

                if (p.shed) {
                    newShed.add(`${p.row},${p.col}`);
                    anyAlive = true;

                    // Vector toward portal center
                    const dx = portalCX - p.x;
                    const dy = portalCY - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 20) {
                        p.consumed = true;
                        p.opacity = 0;
                        p.scale = 0;
                        continue;
                    }

                    // Normalized direction toward portal
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Strong radial pull — dominant force (14-22 px/frame)
                    const radialSpeed = 14 + Math.max(0, 1 - dist / 150) * 8;

                    // Subtle tangential offset — only near portal for spiral feel
                    const tangentialStrength = Math.max(0, 1 - dist / 150) * radialSpeed * 0.35;
                    const tangentSign = p.angleOffset > 0 ? 1 : -1;
                    const tx = -ny * tangentSign;
                    const ty = nx * tangentSign;

                    const vx = nx * radialSpeed + tx * tangentialStrength;
                    const vy = ny * radialSpeed + ty * tangentialStrength;

                    p.x += vx * dt * 60;
                    p.y += vy * dt * 60;

                    // Shrink and fade near portal
                    p.scale = Math.min(1, dist / 80);
                    p.opacity = Math.min(1, dist / 50);

                    // Draw the particle
                    const size = Math.max(0.5, PIXEL_DISPLAY_SIZE * p.scale);
                    ctx!.globalAlpha = p.opacity;
                    ctx!.fillStyle = p.color;
                    ctx!.fillRect(
                        Math.floor(p.x - size / 2),
                        Math.floor(p.y - size / 2),
                        Math.ceil(size),
                        Math.ceil(size)
                    );
                }
            }

            ctx!.globalAlpha = 1;

            onShedUpdate(newShed);

            // Force-complete after shed + travel time (WARP_SHED_DURATION + 90 frames ≈ 2s total)
            const forceCompleteFrame = CHARACTER.WARP_SHED_DURATION + 90;
            if (allConsumed || (!anyAlive && shedProgress >= 1) || frameCount >= forceCompleteFrame) {
                doneRef.current = true;
                onAllConsumed();
                return;
            }

            animRef.current = requestAnimationFrame(tick);
        }

        animRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-20"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
