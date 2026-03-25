"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ZounDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const spring = { type: "spring" as const, stiffness: 340, damping: 36 };

const SCREENSHOTS = [
  { src: "/assets/Zoun/home.png",    alt: "Zoun — globe view" },
  { src: "/assets/Zoun/compare.png", alt: "Zoun — compare time zones" },
  { src: "/assets/Zoun/search.png",  alt: "Zoun — select country" },
];

const TAGS = ["iOS", "Time Zone Tracker", "In progress.."];

export function ZounDetail({ onCloseStart, onClose }: ZounDetailProps) {
  const [isClosing, setIsClosing] = useState(false);

  const initiateClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    onCloseStart();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") initiateClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

  const child = (delay: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: isClosing ? { opacity: 0, y: 4 } : { opacity: 1, y: 0 },
    transition: { ...spring, delay: isClosing ? 0 : delay },
  });

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        onClick={initiateClose}
        style={{ inset: 0, position: "fixed", zIndex: 10 }}
      />

      {/* Centering shell */}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          inset: 0,
          justifyContent: "center",
          pointerEvents: "none",
          position: "fixed",
          zIndex: 11,
        }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={isClosing
            ? { opacity: 0, scale: 0.94, y: 14 }
            : { opacity: 1, scale: 1, y: 0 }
          }
          transition={spring}
          onAnimationComplete={() => { if (isClosing) onClose(); }}
          onClick={(e) => e.stopPropagation()}
          style={{
            alignItems: "start",
            backdropFilter: "blur(3px) hue-rotate(180deg)",
            WebkitBackdropFilter: "blur(3px) hue-rotate(180deg)",
            backgroundImage:
              "linear-gradient(in oklab 122.24deg, oklab(20.9% 0.0005 -0.002) 7.63%, oklab(45.5% 0 -0.0001 / 60%) 102.21%)",
            backgroundOrigin: "border-box",
            border: "1px solid #FFFFFF4A",
            borderRadius: 24,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            fontSynthesis: "none",
            gap: 16,
            MozOsxFontSmoothing: "grayscale",
            outline: "1px solid #565656",
            paddingBlock: 16,
            paddingInline: 16,
            pointerEvents: "auto",
            WebkitFontSmoothing: "antialiased",
            width: 600,
          }}
        >
          {/* ── Header ── */}
          <motion.div
            {...child(0.08)}
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              paddingInline: 12,
              width: "100%",
            }}
          >
            {/* Icon + title */}
            <div style={{ alignItems: "center", display: "flex", gap: 6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/globe.png"
                alt=""
                style={{ borderRadius: 4, flexShrink: 0, height: 24, objectFit: "cover", width: 24 }}
              />
              <span
                style={{
                  color: "#FFFFFF",
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                Zoun
              </span>
            </div>

            {/* Tags */}
            <div style={{ alignItems: "center", display: "flex", gap: 6 }}>
              {TAGS.map((tag) => (
                <div
                  key={tag}
                  style={{
                    alignItems: "center",
                    backgroundColor: "#000000",
                    borderRadius: 4,
                    display: "flex",
                    height: 18,
                    justifyContent: "center",
                    paddingInline: 7,
                  }}
                >
                  <span
                    style={{
                      color: "#D0D0D0",
                      fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                      fontSize: "9.5px",
                      letterSpacing: "0.03em",
                      lineHeight: "12px",
                    }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Description ── */}
          <motion.div {...child(0.16)} style={{ paddingInline: 12, width: "100%" }}>
            <p
              style={{
                color: "#FFFFFFCC",
                fontFamily: '"Geist-Regular", "Geist", system-ui, sans-serif',
                fontSize: 12,
                lineHeight: "16px",
                margin: 0,
              }}
            >
              Zoun is a simple app that visually displays your desired contact on the earth.
              Instead of only focusing on the time itself, you can clearly see whether it is
              night or dark where they are. You can quickly compare different time zones at
              the same time and schedule a call quickly.
            </p>
          </motion.div>

          {/* ── Screenshots ── */}
          <div style={{ display: "flex", gap: 16 }}>
            {SCREENSHOTS.map((s, i) => (
              <motion.div
                key={s.src}
                {...child(0.26 + i * 0.1)}
                style={{ borderRadius: 8, flexShrink: 0, height: 385, overflow: "hidden", width: 178 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  style={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
