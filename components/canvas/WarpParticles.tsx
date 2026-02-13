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
    targetX?: number;
    targetY?: number;
}

// ── Component ───────────────────────────────────────────────────────────
interface WarpParticlesProps {
    active: boolean;
    mode?: "shed" | "integrate";
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
    mode = "shed",
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
        (charX: number, viewH: number, portalCX: number, portalCY: number) => {
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

                    let x, y, opacity, scale;
                    if (mode === "integrate") {
                        // Start at portal, fly to screenX/Y
                        // Randomize start pos slightly around portal center
                        const angle = Math.random() * Math.PI * 2;
                        const dist = Math.random() * 20;
                        x = portalCX + Math.cos(angle) * dist;
                        y = portalCY + Math.sin(angle) * dist;
                        opacity = 0;
                        scale = 0;
                    } else {
                        // Start at character, fly to portal
                        x = screenX;
                        y = screenY;
                        opacity = 1;
                        scale = 1;
                    }

                    particles.push({
                        row,
                        col,
                        x,
                        y,
                        targetX: screenX, // Used for integration
                        targetY: screenY, // Used for integration
                        color,
                        shedThreshold,
                        shed: false,
                        consumed: false,
                        scale,
                        opacity,
                        angleOffset: (hash2d(col * 7, row * 13) - 0.5) * 0.8,
                    });
                }
            }
            return particles;
        },
        [groundYPercent, mode]
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

                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    ctx?.clearRect(0, 0, canvas.width, canvas.height);
                }
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

        // Compute portal center in actual screen pixels
        const portalCX = (portalXPercent / 100) * w;
        const portalCY = (portalYPercent / 100) * h;

        // Initialize particles with real viewport dimensions
        particlesRef.current = initParticles(characterX, h, portalCX, portalCY);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let lastTime = 0;
        let frameCount = 0;

        // Integration-specific: initially all pixels are "shed" (missing from character)
        if (mode === "integrate") {
            const allKeys = new Set<string>();
            particlesRef.current.forEach(p => allKeys.add(`${p.row},${p.col}`));
            onShedUpdate(allKeys);
        }

        function tick(timestamp: number) {
            if (!activeRef.current || doneRef.current) return;

            const dt =
                lastTime === 0 ? 0.016 : Math.min((timestamp - lastTime) / 1000, 0.05);
            lastTime = timestamp;
            frameCount++;

            // Advance shed/integrate progress
            // Use same duration constant for symmetry
            shedProgressRef.current += 1 / CHARACTER.WARP_SHED_DURATION;
            const progress = Math.min(1, shedProgressRef.current);

            const particles = particlesRef.current;
            const currentShed = new Set<string>(); // For integration: pixels NOT yet arrived
            let allFinished = true; // Consumed (shed) or Arrived (integrate)

            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            for (const p of particles) {
                if (mode === "shed") {
                    // ── SHED MODE ───────────────────────────────────────────
                    if (p.consumed) {
                        currentShed.add(`${p.row},${p.col}`);
                        continue;
                    }

                    allFinished = false;

                    // Check if this pixel should shed
                    if (!p.shed && progress >= p.shedThreshold) {
                        p.shed = true;
                    }

                    if (p.shed) {
                        currentShed.add(`${p.row},${p.col}`);

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
                } else {
                    // ── INTEGRATE MODE ──────────────────────────────────────
                    if (p.consumed) {
                        // "Consumed" here means "Arrived at target"
                        // It is NOT in the shed set anymore (character draws it)
                        continue;
                    }

                    // For integration, we want REVERSE order of shedding.
                    // Last ones to shed (high threshold) should integrate first.
                    // So we trigger when progress >= (1 - p.shedThreshold)
                    // ...actually, wait.
                    // If p.shedThreshold is 0.1 (early shed), it was one of the first to leave.
                    // If p.shedThreshold is 0.9 (late shed), it was one of the last to leave.
                    //
                    // To "rewind", the last to leave (0.9) must return FIRST.
                    // So we want pixels with HIGH threshold to start moving when progress is LOW.
                    //
                    // Let invThreshold = 1 - p.shedThreshold.
                    // If threshold=0.9, inv=0.1. Starts early. Correct.
                    // If threshold=0.1, inv=0.9. Starts late. Correct.

                    const triggerPoint = 1 - p.shedThreshold;

                    if (!p.shed && progress >= triggerPoint) {
                        p.shed = true;
                    }

                    if (p.shed) {
                        allFinished = false;
                        currentShed.add(`${p.row},${p.col}`); // Still in flight, so shed from char

                        // Vector toward target (home position)
                        const tx = p.targetX!;
                        const ty = p.targetY!;
                        const dx = tx - p.x;
                        const dy = ty - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 5) {
                            p.consumed = true; // Arrived
                            continue;
                        }

                        // Normalized direction toward target
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // ── REVERSE SWIRL PHYSICS ──
                        // We want them to spiral OUT of the portal.
                        // Calculate distance from portal to see "how far out" we are
                        const portalDx = p.x - portalCX;
                        const portalDy = p.y - portalCY;
                        const distFromPortal = Math.sqrt(portalDx * portalDx + portalDy * portalDy);

                        // 1. Attraction Force to Target
                        // Moves faster as it gets closer to target (magnetic snap)
                        // But also needs to be fast initially to escape portal
                        const baseSpeed = 20;
                        const snapSpeed = Math.max(0, 1 - dist / 100) * 15;
                        const speed = baseSpeed + snapSpeed;

                        // 2. Swirl Force (Tangential to Portal)
                        // Strongest near portal, fades as it approaches character
                        // We want them to spin out, so we use the tangent of the vector FROM portal
                        const pNx = portalDx / (distFromPortal || 1);
                        const pNy = portalDy / (distFromPortal || 1);

                        const tangentSign = p.angleOffset > 0 ? 1 : -1;
                        // Tangent vector
                        const tanX = -pNy * tangentSign;
                        const tanY = pNx * tangentSign;

                        // Swirl strength decays as we get closer to target OR further from portal
                        // logic: if distToTarget is large, we are just starting -> high swirl
                        // if distToTarget is small, we are landing -> no swirl
                        const swirlFade = Math.min(1, dist / 100);
                        const swirlStrength = 12 * swirlFade;

                        const vx = nx * speed + tanX * swirlStrength;
                        const vy = ny * speed + tanY * swirlStrength;

                        p.x += vx * dt * 60;
                        p.y += vy * dt * 60;

                        // Grow and fade in
                        // It should start small/transparent near portal, become excessive near target
                        const journey = Math.min(1, distFromPortal / 150); // 0..1 as it leaves portal
                        p.scale = Math.min(1, journey + 0.1);
                        p.opacity = Math.min(1, journey + 0.2);

                        const size = Math.max(0.5, PIXEL_DISPLAY_SIZE * p.scale);
                        ctx!.globalAlpha = p.opacity;
                        ctx!.fillStyle = p.color;
                        ctx!.fillRect(
                            Math.floor(p.x - size / 2),
                            Math.floor(p.y - size / 2),
                            Math.ceil(size),
                            Math.ceil(size)
                        );
                    } else {
                        // Waiting to start - still shed
                        currentShed.add(`${p.row},${p.col}`);
                        allFinished = false; // Not done yet
                    }
                }
            }

            ctx!.globalAlpha = 1;

            if (mode === "integrate") {
                // If integrate, we update shed set with everything still flying/waiting
                onShedUpdate(currentShed);
            } else {
                onShedUpdate(currentShed);
            }

            // Force-complete logic
            const forceCompleteFrame = CHARACTER.WARP_SHED_DURATION + 90;
            if (allFinished || frameCount >= forceCompleteFrame) {
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
    }, [active, mode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-20"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
