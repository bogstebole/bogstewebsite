"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Water } from "@paper-design/shaders-react";
import { Logo } from "@/components/ui/logo";
import { ProjectSection } from "@/components/elements/project-section";
import { ProjectFloatingCard } from "@/components/ui/project-floating-card";
import { VorliReceiptDetail } from "@/components/ui/vorli-receipt-detail";
import { EnvelopeOverlay } from "@/components/ui/envelope-overlay";

function getBuildVersion(): string {
  const now = new Date();
  const age = now.getFullYear() - 1993;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `v${age}.${month}.${day}`;
}

const POOL_ITEMS = [
  { label: "Dress Up", image: "/images/notes.png",   width: 31 },
  { label: "Vorli",    image: "/images/receipt.png", width: 32 },
];


const POOL_W = 603;
const POOL_H = 337;
const WALL_PAD = 28;
const ICON_H = 32;
const SPEED = 0.0165;

function usePoolFloat(items: Array<{ width: number }>) {
  const refs = useRef<Array<HTMLImageElement | null>>(items.map(() => null));
  const state = useRef(
    items.map((item, i) => ({
      x: 80 + i * 160,
      y: 100 + i * 60,
      vx: SPEED * (i % 2 === 0 ? 1 : -0.7),
      vy: SPEED * (i % 2 === 0 ? 0.6 : -1),
      rot: i * 5,
      rotV: 0.006 * (i % 2 === 0 ? 1 : -1),
      width: item.width,
    }))
  );

  useEffect(() => {
    let rafId: number;

    function tick() {
      state.current.forEach((s, i) => {
        const el = refs.current[i];
        if (!el) return;

        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.rotV;

        const minX = WALL_PAD;
        const maxX = POOL_W - WALL_PAD - s.width;
        const minY = WALL_PAD;
        const maxY = POOL_H - WALL_PAD - ICON_H;

        if (s.x <= minX) { s.x = minX; s.vx = Math.abs(s.vx); }
        if (s.x >= maxX) { s.x = maxX; s.vx = -Math.abs(s.vx); }
        if (s.y <= minY) { s.y = minY; s.vy = Math.abs(s.vy); }
        if (s.y >= maxY) { s.y = maxY; s.vy = -Math.abs(s.vy); }

        if (s.rot > 12)  { s.rot = 12;  s.rotV = -Math.abs(s.rotV); }
        if (s.rot < -12) { s.rot = -12; s.rotV =  Math.abs(s.rotV); }
      });

      // Icon-icon elastic collision
      const [a, b] = state.current;
      const acx = a.x + a.width / 2;
      const acy = a.y + ICON_H / 2;
      const bcx = b.x + b.width / 2;
      const bcy = b.y + ICON_H / 2;
      const dx = bcx - acx;
      const dy = bcy - acy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = (a.width + b.width) / 2;

      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        // Separate
        const overlap = (minDist - dist) / 2;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;
        // Reflect velocities along collision normal (equal mass elastic)
        const dvDotN = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (dvDotN > 0) {
          a.vx -= dvDotN * nx;
          a.vy -= dvDotN * ny;
          b.vx += dvDotN * nx;
          b.vy += dvDotN * ny;
        }
      }

      // Write to DOM
      state.current.forEach((s, i) => {
        const el = refs.current[i];
        if (!el) return;
        el.style.translate = `${s.x}px ${s.y}px`;
        el.style.rotate = `${s.rot}deg`;
      });

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return refs;
}

const TYPEWRITER_PHRASES = [
  "Product Designer",
  "Design Engineer",
  "Or whatever the industry says",
];

type TypewriterPhase = "typing" | "pause" | "deleting" | "next";

function useTypewriter() {
  const [displayText, setDisplayText] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const phase = useRef<TypewriterPhase>("typing");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const phrase = TYPEWRITER_PHRASES[phraseIndex.current];

      if (phase.current === "typing") {
        setIsIdle(false);
        charIndex.current += 1;
        setDisplayText(phrase.slice(0, charIndex.current));
        if (charIndex.current >= phrase.length) {
          phase.current = "pause";
          setIsIdle(true);
          timer = setTimeout(tick, 1800);
        } else {
          timer = setTimeout(tick, 60);
        }
      } else if (phase.current === "pause") {
        phase.current = "deleting";
        setIsIdle(false);
        timer = setTimeout(tick, 40);
      } else if (phase.current === "deleting") {
        charIndex.current -= 1;
        setDisplayText(phrase.slice(0, charIndex.current));
        if (charIndex.current <= 0) {
          phase.current = "next";
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 40);
        }
      } else {
        phraseIndex.current = (phraseIndex.current + 1) % TYPEWRITER_PHRASES.length;
        phase.current = "typing";
        timer = setTimeout(tick, 60);
      }
    }

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  return { displayText, isIdle };
}


export function V2Canvas() {
  const { displayText, isIdle } = useTypewriter();
  const poolRefs = usePoolFloat(POOL_ITEMS);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [returningProject, setReturningProject] = useState<string | null>(null);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isEnvelopeClosing, setIsEnvelopeClosing] = useState(false);
  const [envelopeOriginRect, setEnvelopeOriginRect] = useState<DOMRect | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  const handleProjectClick = (key: string) => {
    const el = entryRefs.current[key];
    if (el) {
      setOriginRect(el.getBoundingClientRect());
      setActiveProject(key);
      setIsClosing(false);
    }
  };

  // Called when the close sequence begins — un-blur background immediately
  const handleCloseStart = () => {
    setIsClosing(true);
  };

  const handleClose = () => {
    const closingKey = activeProject;
    setActiveProject(null);
    setOriginRect(null);
    setIsClosing(false);
    if (closingKey) {
      setReturningProject(closingKey);
      setTimeout(() => setReturningProject(null), 350);
    }
  };

  const handleEnvelopeClick = () => {
    const el = envelopeRef.current;
    if (el) {
      setEnvelopeOriginRect(el.getBoundingClientRect());
      setEnvelopeOpen(true);
      setIsEnvelopeClosing(false);
    }
  };

  const handleEnvelopeCloseStart = () => {
    setIsEnvelopeClosing(true);
  };

  const handleEnvelopeClose = () => {
    setEnvelopeOpen(false);
    setEnvelopeOriginRect(null);
    setIsEnvelopeClosing(false);
  };

  // Lock body scroll when detail is open
  useEffect(() => {
    document.body.style.overflow = activeProject || envelopeOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject, envelopeOpen]);

  // Light mode only for V2
  const primaryColor = "#000000";
  const primary80 = "rgba(0,0,0,0.80)";
  const primary70 = "rgba(0,0,0,0.70)";
  const primary40 = "rgba(0,0,0,0.40)";

  // Un-blur background as soon as close begins
  const shouldBlur = (activeProject !== null && !isClosing) || (envelopeOpen && !isEnvelopeClosing);
  const blurAnim = shouldBlur
    ? { scale: 0.93, filter: "blur(10px)", pointerEvents: "none" as const }
    : { scale: 1, filter: "blur(0px)", pointerEvents: "auto" as const };
  const blurTransition = { type: "tween" as const, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* ── Intro text block ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{
          paddingTop: 80,
          width: 355,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformOrigin: "50% 50%",
        }}
      >
        <Logo />

        {/* Name block */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "18px",
              letterSpacing: "-0.02em",
              color: primaryColor,
            }}
          >
            Hey You
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 500,
              fontSize: 20,
              lineHeight: "24px",
              letterSpacing: "-0.02em",
              color: primaryColor,
            }}
          >
            I&apos;m Bogdan
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              letterSpacing: "-0.02em",
              color: primary70,
            }}
          >
            {getBuildVersion()}
          </div>
        </div>

        {/* Role row */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: primary40 }}>
            {displayText}
            <span
              style={{
                color: primary80,
                animation: isIdle ? "blink 1s step-end infinite" : "none",
              }}
            >
              |
            </span>
          </span>
        </div>

        {/* Body text */}
        <p
          style={{
            marginTop: 12,
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "18px",
            color: primary80,
            textAlign: "center",
            whiteSpace: "pre-wrap",
          }}
        >
          I build things that feel considered — from iOS apps to interactive
          web experiences. This site is a deliberate rejection of one-style
          portfolio design.
        </p>
      </motion.div>

      {/* ── Pool ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{
          marginTop: 60,
          position: "relative",
          width: 603,
          height: 337,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "#00000033 -4px 4px 8px",
          flexShrink: 0,
          transformOrigin: "50% 50%",
        }}
      >
        {/* Water shader — animated pool surface */}
        <Water
          speed={0.28}
          size={0.01}
          highlights={0.06}
          layering={0}
          edges={0.58}
          waves={0.05}
          caustic={0}
          scale={0.93}
          fit="cover"
          image="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KM5BCACYB6D00EJHTVG5P7MV.png"
          colorBack="#00000000"
          colorHighlight="#FFFFFF"
          style={{ backgroundColor: "#138FCD00", height: 337, left: 10, position: "absolute", top: 0, width: 590 }}
        />
        {/* Pool photo overlay — sits above the water shader */}
        <div
          style={{
            backgroundImage: "url(/images/pool-side.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            borderRadius: 24,
            height: 337,
            left: "50%",
            position: "absolute",
            top: 0,
            translate: "-50%",
            width: 603,
            zIndex: 1,
          }}
        />
        {/* Floating project icons */}
        {POOL_ITEMS.map((item, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.label}
            ref={(el) => { poolRefs.current[index] = el; }}
            src={item.image}
            alt={item.label}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: item.width,
              height: 32,
              borderRadius: 6,
              objectFit: "cover" as const,
              boxShadow: "#00000033 0px 6px 3px",
              zIndex: 2,
            }}
          />
        ))}
      </motion.div>

      {/* ── Project section ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{ transformOrigin: "50% 50%" }}
      >
        <ProjectSection
          primaryColor={primaryColor}
          primary40={primary40}
          isDark={false}
          activeProject={activeProject}
          returningProject={returningProject}
          onProjectClick={handleProjectClick}
          entryRefs={entryRefs}
          envelopeRef={envelopeRef}
          onEnvelopeClick={handleEnvelopeClick}
          style={{ marginTop: 80, marginBottom: 120 }}
        />
      </motion.div>

      {/* ── Project floating card — all projects except Vorli ── */}
      {activeProject && originRect && activeProject !== "vorli" && (
        <ProjectFloatingCard
          key={activeProject}
          projectKey={activeProject}
          originRect={originRect}
          entryRef={entryRefs.current[activeProject] ?? null}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
          isDark={false}
          primaryColor={primaryColor}
          primary40={primary40}
        />
      )}

      {/* ── Vorli — receipt bottom sheet ── */}
      {activeProject === "vorli" && (
        <VorliReceiptDetail
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Envelope overlay ── */}
      {envelopeOpen && envelopeOriginRect && (
        <EnvelopeOverlay
          originRect={envelopeOriginRect}
          onCloseStart={handleEnvelopeCloseStart}
          onClose={handleEnvelopeClose}
        />
      )}
    </div>
  );
}
