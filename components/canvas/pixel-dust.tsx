"use client";

import { useRef, useEffect } from "react";

interface PixelDustProps {
    /** Center X position of the burst */
    x: number;
    /** Center Y position of the burst */
    y: number;
    /** Base color for the particles */
    color: string;
    /** Whether the burst is active */
    active: boolean;
    /** Called when the burst animation completes */
    onComplete?: () => void;
}

interface DustParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    life: number;
    maxLife: number;
}

const PARTICLE_COUNT = 24;
const MAX_LIFE = 20; // ~330ms at 60fps

export function PixelDust({ x, y, color, active, onComplete }: PixelDustProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const particlesRef = useRef<DustParticle[]>([]);
    const activeRef = useRef(false);

    useEffect(() => {
        if (!active) {
            activeRef.current = false;
            cancelAnimationFrame(animRef.current);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        if (activeRef.current) return;
        activeRef.current = true;

        // Parse base color and create variations
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Initialize particles
        const particles: DustParticle[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
            const speed = 2 + Math.random() * 5;
            // Color variation
            const dr = Math.floor((Math.random() - 0.5) * 60);
            const dg = Math.floor((Math.random() - 0.5) * 60);
            const db = Math.floor((Math.random() - 0.5) * 60);
            const pr = Math.max(0, Math.min(255, r + dr));
            const pg = Math.max(0, Math.min(255, g + dg));
            const pb = Math.max(0, Math.min(255, b + db));

            particles.push({
                x: 0,
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2, // slight upward bias
                size: 2 + Math.random() * 3,
                opacity: 1,
                color: `rgb(${pr},${pg},${pb})`,
                life: 0,
                maxLife: MAX_LIFE + Math.floor(Math.random() * 8),
            });
        }
        particlesRef.current = particles;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function tick() {
            if (!activeRef.current) return;
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

            let allDead = true;
            for (const p of particlesRef.current) {
                p.life++;
                if (p.life > p.maxLife) continue;
                allDead = false;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // mini gravity
                p.vx *= 0.96; // friction
                p.opacity = Math.max(0, 1 - p.life / p.maxLife);

                // Draw as a pixelated square
                ctx!.globalAlpha = p.opacity;
                ctx!.fillStyle = p.color;
                const drawX = canvas!.width / 2 + p.x;
                const drawY = canvas!.height / 2 + p.y;
                ctx!.fillRect(
                    Math.floor(drawX),
                    Math.floor(drawY),
                    Math.ceil(p.size),
                    Math.ceil(p.size)
                );
            }
            ctx!.globalAlpha = 1;

            if (allDead) {
                activeRef.current = false;
                onComplete?.();
                return;
            }

            animRef.current = requestAnimationFrame(tick);
        }

        animRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(animRef.current);
        };
    }, [active, color, onComplete]);

    if (!active) return null;

    const size = 120; // burst radius canvas
    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="absolute pointer-events-none"
            style={{
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
                imageRendering: "pixelated",
            }}
        />
    );
}
