"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PaperTexture } from "@paper-design/shaders-react";

interface VorliReceiptDetailProps {
  onCloseStart: () => void;
  onClose: () => void;
}

const enterSpring = { type: "spring" as const, stiffness: 380, damping: 38 };
const exitEase = { duration: 0.42, ease: [0.32, 0.72, 0, 1] as const };

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function DashedLine() {
  return (
    <div
      style={{
        width: "100%",
        height: 1,
        backgroundImage:
          "repeating-linear-gradient(90deg, #585858 0, #585858 3px, transparent 3px, transparent 7px)",
        flexShrink: 0,
      }}
    />
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: 8, width: "100%" }}>
      <div
        style={{
          color: "#888888",
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 12,
          letterSpacing: "0.03em",
          lineHeight: "16px",
          width: 132,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#111111",
          fontFamily: '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 12,
          letterSpacing: "0.03em",
          lineHeight: "16px",
          textAlign: "right",
          width: "100%",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function VorliReceiptDetail({ onCloseStart, onClose }: VorliReceiptDetailProps) {
  const closingRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;

    onCloseStart();
    setIsClosing(true);
    await wait(460);
    onClose();
  }, [onCloseStart, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") void initiateClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose]);

  return (
    <>
      {/* Backdrop — transparent, click-outside-to-close only */}
      <div
        onClick={() => void initiateClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
        }}
      />

      {/* Sheet container — full width, anchored to bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 11,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Sheet panel */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: isClosing ? "100%" : 0 }}
          transition={isClosing ? exitEase : enterSpring}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 480,
            height: "85vh",
            overflowY: "auto",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            filter: "drop-shadow(rgba(0,0,0,0.2) 0px 2px 20px)",
            position: "relative",
            pointerEvents: "auto",
            overscrollBehavior: "contain",
          }}
        >
          {/* Content wrapper — PaperTexture spans this full height */}
          <div
            style={{
              position: "relative",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Paper texture — covers full content height */}
            <PaperTexture
              contrast={1}
              roughness={0.11}
              fiber={0}
              fiberSize={0.01}
              crumples={0}
              crumpleSize={0.01}
              folds={0.65}
              foldCount={3}
              fade={0}
              drops={0}
              seed={0}
              scale={0.68}
              fit="cover"
              colorBack="#00000000"
              colorFront="#FFFFFF"
              style={{
                backgroundImage:
                  "linear-gradient(in oklab 180deg, oklab(99.1% 0 0) 0%, 65.58%, oklab(67.9% 0 0) 100%)",
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            />

            {/* Receipt content */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                paddingBlock: 16,
                paddingInline: 16,
                boxSizing: "border-box",
                flex: 1,
              }}
            >
              {/* ── Header section ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  paddingBlock: 8,
                  width: "100%",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/receipt.png"
                  alt="Vorli"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 2,
                    objectFit: "cover",
                    rotate: "359.41deg",
                    transformOrigin: "50% 50%",
                  }}
                />

                <div
                  style={{
                    color: "#111111",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 20,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Vorli
                </div>

                <div
                  style={{
                    color: "rgba(17,17,17,0.7)",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 12,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  AI Financial Assistant · iOS
                </div>

                <div
                  style={{
                    color: "#888888",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 9.5,
                    letterSpacing: "0.03em",
                    lineHeight: "12px",
                  }}
                >
                  REF #2025-PERSONAL-001
                </div>

                <DashedLine />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                    paddingInline: 12,
                    boxSizing: "border-box",
                  }}
                >
                  <MetaRow label="Type" value="AI Financial Assistant" />
                  <MetaRow label="Platform" value="iOS" />
                  <MetaRow label="Status" value="In testing" />
                  <MetaRow label="Published" value="No" />
                </div>

                <DashedLine />

                <div
                  style={{
                    color: "#2A2A2A",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 12,
                    lineHeight: "20px",
                    width: "100%",
                    paddingInline: 12,
                  }}
                >
                  Most financial apps share the same assumption: if you can see your data, you&apos;ll
                  change your behavior. I built Vorli because that assumption never worked for me.
                  Existing tools asked me to think about money the way they were designed — not the
                  way I actually do. Vorli puts AI at the center: it auto-categorizes spending, scans
                  receipts, and reads your financial picture so you can just ask what matters. Not
                  &ldquo;show me a chart&rdquo; — more like &ldquo;should I be worried about this month?&rdquo; The first
                  app I&apos;ve built that actually changed how I spend.
                </div>

                {/* Media label with flanking dashes */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1, height: 1, backgroundImage: "repeating-linear-gradient(90deg, #585858 0, #585858 3px, transparent 3px, transparent 7px)" }} />
                  <span
                    style={{
                      color: "#585858",
                      fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                      fontSize: 9.5,
                      letterSpacing: "0.03em",
                      lineHeight: "12px",
                      flexShrink: 0,
                    }}
                  >
                    Media
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundImage: "repeating-linear-gradient(90deg, #585858 0, #585858 3px, transparent 3px, transparent 7px)" }} />
                </div>
              </div>

              {/* ── Media grid: 3 rows × 2 columns ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <video
                    src={encodeURI("/assets/Vorli/vorli video.MP4")}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Vorli/vorli 1.PNG")}
                    alt="Vorli screenshot 1"
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Vorli/vorli 2.PNG")}
                    alt="Vorli screenshot 2"
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Vorli/vorli 3.PNG")}
                    alt="Vorli screenshot 3"
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Vorli/vorli 4.PNG")}
                    alt="Vorli screenshot 4"
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI("/assets/Vorli/vorli 5.PNG")}
                    alt="Vorli screenshot 5"
                    style={{ flex: 1, minWidth: 0, height: "auto", borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                </div>
              </div>

              <div style={{ height: 32 }} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
