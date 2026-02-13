"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { figmaX, figmaY } from "@/lib/figma-scale";

// Simple pseudo-random generator for consistent star placement
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function Stars() {
    const { isDark } = useTheme();

    // Generate star positions once
    const stars = useMemo(() => {
        const starCount = 150;
        const items = [];
        for (let i = 0; i < starCount; i++) {
            items.push({
                x: seededRandom(i * 123) * 100, // 0-100% width
                y: seededRandom(i * 321) * 65,  // 0-65% height (sky only)
                size: seededRandom(i * 456) > 0.8 ? 2 : 1, // Mostly 1px, some 2px
                opacity: 0.3 + seededRandom(i * 789) * 0.7, // Random brightness
                blinkDelay: seededRandom(i * 999) * 5, // Random blink offset
            });
        }
        return items;
    }, []);

    return (
        <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ opacity: isDark ? 1 : 0 }}
        >
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        boxShadow: star.size > 1 ? "0 0 2px rgba(255,255,255,0.8)" : "none",
                        animation: `twinkle 3s ease-in-out ${star.blinkDelay}s infinite alternate`,
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
}
