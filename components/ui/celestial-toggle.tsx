"use client";

import { useState, useCallback, useRef } from "react";

interface CelestialToggleProps {
  /** Controlled mode: current dark state */
  isDark?: boolean;
  /** Callback when toggled */
  onToggle?: (isDark: boolean) => void;
  /** Size multiplier (default 1) */
  scale?: number;
}

export default function CelestialToggle({
  isDark: controlledDark,
  onToggle,
  scale = 1,
}: CelestialToggleProps) {
  const [internalDark, setInternalDark] = useState(false);
  const isDark = controlledDark ?? internalDark;
  const trackRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    const next = !isDark;
    if (controlledDark === undefined) setInternalDark(next);
    onToggle?.(next);
  }, [isDark, controlledDark, onToggle]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Ripple effect
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const ripple = document.createElement("div");
        ripple.style.cssText = `
          position: absolute; border-radius: 50%; width: 20px; height: 20px;
          pointer-events: none; left: ${e.clientX - rect.left - 10}px;
          top: ${e.clientY - rect.top - 10}px;
          background: ${isDark ? "rgba(150,150,220,0.2)" : "rgba(255,200,80,0.3)"};
          animation: celestial-ripple 0.6s ease-out forwards;
        `;
        trackRef.current.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
      handleToggle();
    },
    [handleToggle, isDark]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <>
      <style>{celestialStyles}</style>
      <div
        className="celestial-toggle-wrapper"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        <div
          ref={trackRef}
          className={`celestial-track ${isDark ? "is-dark" : "is-light"}`}
        >
          {/* Clouds (light mode) */}
          <div className="celestial-cloud c1" />
          <div className="celestial-cloud c2" />
          <div className="celestial-cloud c3" />

          {/* Track stars (dark mode) */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`celestial-track-star ts-${i}`} />
          ))}

          {/* Thumb — sun / moon */}
          <div className="celestial-thumb">
            <div className="celestial-glow" />
            <div className="celestial-sun-rays">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="celestial-ray"
                  style={{ transform: `rotate(${i * 45}deg)` }}
                />
              ))}
            </div>
            <div className="celestial-crater cr1" />
            <div className="celestial-crater cr2" />
            <div className="celestial-crater cr3" />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── All styles namespaced to avoid collisions ─── */
const celestialStyles = `
  @keyframes celestial-ripple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(8); opacity: 0; }
  }
  @keyframes celestial-float-cloud {
    0% { transform: translateX(0); }
    100% { transform: translateX(6px); }
  }
  @keyframes celestial-twinkle {
    0% { opacity: 0.2; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes celestial-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes celestial-pulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.15); opacity: 1; }
  }

  .celestial-toggle-wrapper {
    position: relative;
    width: 200px;
    height: 88px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform-origin: center;
  }

  .celestial-track {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    position: relative;
    overflow: visible;
    transition: background 0.7s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.7s cubic-bezier(0.4,0,0.2,1);
  }

  .celestial-track.is-light {
    background: linear-gradient(135deg, #87CEEB 0%, #5BA3D9 40%, #4A90C4 100%);
    box-shadow:
      0 0 0 2px rgba(255,255,255,0.3),
      0 8px 32px rgba(90,130,180,0.35),
      inset 0 -4px 12px rgba(0,0,0,0.08);
  }

  .celestial-track.is-dark {
    background: linear-gradient(135deg, #1a1f3a 0%, #0f1229 40%, #151a35 100%);
    box-shadow:
      0 0 0 2px rgba(100,120,200,0.15),
      0 8px 32px rgba(0,0,0,0.5),
      inset 0 -4px 12px rgba(0,0,0,0.3);
  }

  /* ── Clouds ── */
  .celestial-cloud {
    position: absolute;
    background: rgba(255,255,255,0.6);
    border-radius: 999px;
    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1),
                transform 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .is-dark .celestial-cloud { opacity: 0; transform: translateX(20px); }

  .c1 { width: 40px; height: 14px; bottom: 18px; left: 14px; animation: celestial-float-cloud 6s ease-in-out infinite alternate; }
  .c2 { width: 30px; height: 10px; bottom: 28px; left: 22px; animation: celestial-float-cloud 5s ease-in-out 0.5s infinite alternate; }
  .c3 { width: 35px; height: 12px; top: 22px; right: 14px; animation: celestial-float-cloud 7s ease-in-out 1s infinite alternate; }

  /* ── Track stars ── */
  .celestial-track-star {
    position: absolute;
    width: 2px; height: 2px;
    background: #fff;
    border-radius: 50%;
    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .is-light .celestial-track-star { opacity: 0; }
  .is-dark .celestial-track-star { opacity: 1; }

  .ts-0 { top: 18px; left: 20px; animation: celestial-twinkle 2.5s ease-in-out infinite alternate; }
  .ts-1 { top: 30px; left: 35px; width: 1.5px; height: 1.5px; animation: celestial-twinkle 3s 0.5s ease-in-out infinite alternate; }
  .ts-2 { top: 15px; left: 50px; animation: celestial-twinkle 2s 1s ease-in-out infinite alternate; }
  .ts-3 { top: 40px; left: 25px; width: 1px; height: 1px; animation: celestial-twinkle 4s 0.3s ease-in-out infinite alternate; }
  .ts-4 { top: 55px; left: 45px; width: 1.5px; height: 1.5px; animation: celestial-twinkle 2.8s 0.8s ease-in-out infinite alternate; }
  .ts-5 { top: 22px; left: 65px; width: 1px; height: 1px; animation: celestial-twinkle 3.5s 1.2s ease-in-out infinite alternate; }

  /* ── Thumb ── */
  .celestial-thumb {
    position: absolute;
    width: 64px; height: 64px;
    border-radius: 50%;
    top: 12px; left: 14px;
    transition: transform 0.7s cubic-bezier(0.34,1.56,0.64,1),
                background 0.7s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.7s cubic-bezier(0.4,0,0.2,1);
  }

  .is-light .celestial-thumb {
    transform: translateX(0);
    background: linear-gradient(135deg, #FFE484 0%, #FFCC33 50%, #FFAA00 100%);
    box-shadow: 0 0 24px rgba(255,180,50,0.5), 0 0 60px rgba(255,180,50,0.2), inset 0 -3px 6px rgba(200,120,0,0.2);
  }

  .is-dark .celestial-thumb {
    transform: translateX(110px);
    background: linear-gradient(135deg, #e8e2d9 0%, #d4cdc0 50%, #c8c0b2 100%);
    box-shadow: 0 0 20px rgba(200,200,220,0.15), 0 0 50px rgba(150,150,180,0.08), inset 0 -3px 6px rgba(100,95,85,0.15);
  }

  /* ── Sun rays ── */
  .celestial-sun-rays {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    animation: celestial-rotate 20s linear infinite;
    transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1);
  }
  .is-light .celestial-sun-rays { opacity: 1; transform: scale(1); }
  .is-dark .celestial-sun-rays { opacity: 0; transform: scale(0.5); }

  .celestial-ray {
    position: absolute;
    width: 2px; height: 10px;
    background: rgba(255,200,80,0.6);
    border-radius: 999px;
    left: 50%; top: -4px;
    transform-origin: 50% calc(50% + 36px);
  }

  /* ── Craters ── */
  .celestial-crater {
    position: absolute;
    border-radius: 50%;
    background: rgba(0,0,0,0.06);
    transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .is-light .celestial-crater { opacity: 0; }
  .is-dark .celestial-crater { opacity: 1; }

  .cr1 { width: 14px; height: 14px; top: 16px; left: 18px; }
  .cr2 { width: 8px; height: 8px; top: 34px; left: 34px; }
  .cr3 { width: 10px; height: 10px; top: 12px; left: 38px; background: rgba(0,0,0,0.04); }

  /* ── Glow ── */
  .celestial-glow {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    animation: celestial-pulse 3s ease-in-out infinite alternate;
    pointer-events: none;
    transition: background 0.7s cubic-bezier(0.4,0,0.2,1);
  }
  .is-light .celestial-glow { background: radial-gradient(circle, rgba(255,200,80,0.2) 0%, transparent 70%); }
  .is-dark .celestial-glow { background: radial-gradient(circle, rgba(180,180,220,0.08) 0%, transparent 70%); }

  /* ── Focus ring ── */
  .celestial-toggle-wrapper:focus-visible {
    outline: 2px solid #5BA3D9;
    outline-offset: 4px;
    border-radius: 999px;
  }
`;
