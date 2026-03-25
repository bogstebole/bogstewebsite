"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface WearDetailProps {
  originRect: DOMRect;
  onCloseStart: () => void;
  onClose: () => void;
}

export function WearDetail({ originRect, onCloseStart, onClose }: WearDetailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // slight delay to start entrance animation cleanly
    const t = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    onCloseStart();
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 400); // Wait for exit animation
  };

  const CARD_W = 361;
  const gap = 32;

  // Position relative to the clicked item
  let leftPos = originRect.right + 60;
  
  // Guard against overflow on the right side
  if (typeof window !== "undefined") {
    if (leftPos + CARD_W > window.innerWidth - 24) {
      leftPos = window.innerWidth - CARD_W - 24;
    }
  }
  


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: isClosing ? "none" : "auto",
        display: "flex",
      }}
    >
      {/* Transparent Click-away Backdrop Layer */}
      <div 
        onClick={handleClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "transparent",
        }}
      />
      
      {/* Content Layer */}
      <AnimatePresence>
        {!isClosing && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-45%", scale: 0.98 }}
            animate={{ opacity: 1, y: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: "-45%", scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "absolute",
              left: leftPos,
              top: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: gap,
            }}
          >
            {/* 1. Info Card */}
            <div
              style={{
                width: CARD_W,
                backgroundColor: "#2c2c2c",
                borderRadius: 18,
                padding: 12,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ color: "#ebebeb", fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 17, margin: 0, fontWeight: 500 }}>
                  Wear
                </h2>
                <button 
                  onClick={handleClose}
                  style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: "#8a8a8a", display: "flex" }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{ 
                color: "#ebebeb", 
                fontFamily: "var(--font-geist-sans), sans-serif", 
                fontSize: 12,
                lineHeight: "18px",
                margin: 0,
                marginBottom: 16,
                opacity: 0.8
              }}>
                Wear is a simple app that gives you an idea what to wear outside based on the weather
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                {["iOS", "Weather", "In progress.."].map((tag) => (
                  <div key={tag} style={{ 
                    backgroundColor: "#4c4c4c", 
                    color: "#ebebeb", 
                    fontFamily: "var(--font-jetbrains-mono), monospace", 
                    fontSize: 12, 
                    borderRadius: 6,
                    padding: "4px 8px"
                  }}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Phone Mockup */}
            <div
              style={{
                width: 247,
                height: 534,
                backgroundColor: "#fff",
                borderRadius: 30,
                border: "4.4px solid #000",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
              }}
            >
              {/* Top part: Video Loop */}
              <div style={{ 
                width: "100%", 
                flex: 1, 
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 16
              }}>
                <video 
                  src="/assets/Wear/wear.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  style={{ width: "60%", height: "auto", display: "block" }}
                />
              </div>

              {/* Bottom part: Footer Weather Information UI */}
              <div style={{
                height: 140,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                paddingBottom: 24
              }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, color: "#666", marginBottom: 6 }}>
                  Belgrade
                </div>
                <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 42, color: "#000", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 12 }}>
                  18°
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, color: "#666", marginBottom: 4 }}>
                  Light, noticeable wind.
                </div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, color: "#888" }}>
                  H: 20° | L: 14°
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
