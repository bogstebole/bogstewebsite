"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue } from "framer-motion";
import { IDLE_FRAME, PALETTE } from "./PixelCharacter";

const PIXEL_SCALE = 3.0;
const COLS = 32;
const ROWS = 48;
const CHAR_W = COLS * PIXEL_SCALE;
const CHAR_H = ROWS * PIXEL_SCALE;

interface NervousBouleProps {
    scrollY: MotionValue<number>;
    isOpen: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export function NervousBoule({ scrollY, isOpen }: NervousBouleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const updateSize = () => {
                setDimensions({ w: window.innerWidth, h: window.innerHeight });
            };
            updateSize();
            window.addEventListener("resize", updateSize);
            return () => window.removeEventListener("resize", updateSize);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShouldRender(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShouldRender(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.w === 0 || !shouldRender) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            const scroll = scrollY.get();
            let charX = 0;
            let charY = 0;
            let rotation = 0; // Radians
            let isVisible = true;
            let isSweating = false;
            let sweatOrigin = { x: 0, y: 0 };

            // Logic Phases
            // 1. Peeping (Rotated -90deg)
            if (scroll < 200) {
                rotation = -Math.PI / 2;
                // Rotated Dimensions: W = CHAR_H (72), H = CHAR_W (48)
                // Head is Left. Feet Right.
                // Visible Amount: Start with just head (20px).
                // Initial X: dimensions.w - 20.
                // Slide Out (Right): Add to X.

                const slideOut = (scroll / 200) * 100;
                // Start more visible (half body length)
                // Rotated width is CHAR_H (~84px). Half is ~42px.
                charX = dimensions.w - (CHAR_H * 0.6) + slideOut;
                charY = dimensions.h * 0.3; // 30% down screen

                // Nervous Shake
                charX += (Math.random() - 0.5) * 2;
                charY += (Math.random() - 0.5) * 2;

                isSweating = true;

                // Sweat Origin Logic (Rotated)
                // Head Center in Screen Coords:
                // Box Left = charX. Box Center Y = charY + 24.
                // Head is ~15px right of Box Left.
                sweatOrigin = {
                    x: charX + 15,
                    y: charY + (CHAR_W / 2) // Vertical Center of Box
                };

            }
            // 2. Transition (Hidden)
            else if (scroll < 300) {
                isVisible = false;
            }
            // 3. Reappear Bottom (Standard Rotation)
            else {
                rotation = 0;
                // Standard Dimensions: W = 48, H = 72.
                // Position: Right side.
                charX = dimensions.w - 80;

                // Slide Up
                const popProgress = Math.min(1, (scroll - 300) / 50);
                const ease = 1 - Math.pow(1 - popProgress, 3);

                const targetY = dimensions.h - (CHAR_H * 0.85); // 85% visible
                const startY = dimensions.h;

                charY = startY - (startY - targetY) * ease;

                // Shake
                charX += (Math.random() - 0.5) * 1;
                charY += (Math.random() - 0.5) * 1;

                isSweating = true;

                // Sweat Origin Logic (Standard)
                // Head Center: X + W/2, Y + 10.
                sweatOrigin = {
                    x: charX + (CHAR_W / 2),
                    y: charY + (10 * PIXEL_SCALE)
                };
            }

            // Spawn Particles
            if (isSweating && Math.random() < 0.15) {
                particlesRef.current.push({
                    x: sweatOrigin.x + (Math.random() * 10 - 5),
                    y: sweatOrigin.y + (Math.random() * 5),
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: 0,
                    life: 1.0
                });
            }

            // Physics Update
            particlesRef.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.25;
                p.life -= 0.005;

                if (p.y > dimensions.h) {
                    p.y = dimensions.h;
                    p.vy *= -0.6;
                }
            });
            particlesRef.current = particlesRef.current.filter(p => p.life > 0);

            // Draw
            ctx.clearRect(0, 0, dimensions.w, dimensions.h);

            // 1. Draw Particles (Behind checks? No, blue drops visible)
            ctx.fillStyle = "#4da6ff";
            particlesRef.current.forEach(p => {
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 3, 3);
            });

            // 2. Draw Character
            if (isVisible) {
                ctx.save();

                // Pivot Logic
                let pivotX = 0;
                let pivotY = 0;

                if (rotation !== 0) {
                    // Rotated Box Center
                    // Box W = CHAR_H, Box H = CHAR_W
                    const boxW = CHAR_H;
                    const boxH = CHAR_W;
                    pivotX = charX + boxW / 2;
                    pivotY = charY + boxH / 2;
                } else {
                    // Standard Box Center
                    pivotX = charX + CHAR_W / 2;
                    pivotY = charY + CHAR_H / 2;
                }

                ctx.translate(pivotX, pivotY);
                ctx.rotate(rotation);
                // Translate back by Sprite Center
                ctx.translate(-CHAR_W / 2, -CHAR_H / 2);

                // Draw Sprite at 0,0 relative to context
                IDLE_FRAME.forEach((line, row) => {
                    for (let col = 0; col < line.length; col++) {
                        const colorKey = line[col];
                        if (colorKey && colorKey !== "0") {
                            const color = PALETTE[colorKey];
                            if (color) {
                                ctx.fillStyle = color;
                                ctx.fillRect(
                                    Math.floor(col * PIXEL_SCALE),
                                    Math.floor(row * PIXEL_SCALE),
                                    Math.ceil(PIXEL_SCALE),
                                    Math.ceil(PIXEL_SCALE)
                                );
                            }
                        }
                    }
                });

                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, scrollY, shouldRender]);

    if (!shouldRender) return null;

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }}>
            <canvas
                ref={canvasRef}
                width={dimensions.w}
                height={dimensions.h}
                style={{ width: "100%", height: "100%", display: "block" }}
            />
        </div>
    );
}
