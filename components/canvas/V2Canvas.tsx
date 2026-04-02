"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Water } from "@paper-design/shaders-react"; // POOL_HIDDEN
import { Logo } from "@/components/ui/logo";
import { ProjectSection } from "@/components/elements/project-section";
import { ProjectFloatingCard } from "@/components/ui/project-floating-card";
import { VorliReceiptDetail } from "@/components/ui/vorli-receipt-detail";
import { EnvelopeOverlay } from "@/components/ui/envelope-overlay";
import { ZounDetail } from "@/components/ui/zoun-detail";
import { WearDetail } from "@/components/ui/wear-detail";
import { PauschalDetail } from "@/components/ui/pauschal-detail";
import { FynnDetail } from "@/components/ui/fynn-detail";
import { ContentSnareDetail } from "@/components/ui/content-snare-detail";
import { SelectedProjectsSection } from "@/components/elements/selected-projects-section";

function getBuildVersion(): string {
  const now = new Date();
  const age = now.getFullYear() - 1993;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `v${age}.${month}.${day}`;
}

/* POOL_HIDDEN — restore by uncommenting this block and the Water import above
const POOL_ITEMS = [
  { label: "Dress Up", image: "/images/notes.png",   width: 31 },
  { label: "Vorli",    image: "/images/receipt.png", width: 32 },
];
const POOL_W = 603;
const POOL_H = 337;
const WALL_PAD = 28;
const ICON_H = 32;
const SPEED = 0.0165;
function usePoolFloat(items: Array<{ width: number }>) { ... }
*/

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
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [returningProject, setReturningProject] = useState<string | null>(null);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isEnvelopeClosing, setIsEnvelopeClosing] = useState(false);
  const [envelopeOriginRect, setEnvelopeOriginRect] = useState<DOMRect | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [isNotesClosing, setIsNotesClosing] = useState(false);
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

  const handleNotesExpand = () => {
    setIsNotesExpanded(true);
    setIsNotesClosing(false);
  };
  const handleNotesCloseStart = () => setIsNotesClosing(true);
  const handleNotesClose = () => {
    setIsNotesExpanded(false);
    setIsNotesClosing(false);
  };

  const handleVorliHeroClick = () => {
    setActiveProject("vorli");
    setIsClosing(false);
  };

  // Lock body scroll when detail is open
  useEffect(() => {
    document.body.style.overflow = activeProject || envelopeOpen || isNotesExpanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject, envelopeOpen, isNotesExpanded]);

  // Light mode only for V2
  const primaryColor = "#000000";
  const primary80 = "rgba(0,0,0,0.80)";
  const primary70 = "rgba(0,0,0,0.70)";
  const primary40 = "rgba(0,0,0,0.40)";

  // Un-blur background as soon as close begins
  const shouldBlur =
    (activeProject !== null && !isClosing) ||
    (envelopeOpen && !isEnvelopeClosing);
  const blurAnim = shouldBlur
    ? { scale: 0.93, filter: "blur(10px)", pointerEvents: "none" as const }
    : { scale: 1, filter: "blur(0px)", pointerEvents: "auto" as const };
  const blurTransition = { type: "tween" as const, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
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
          width: "100%",
          maxWidth: 600,
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
            width: "60%",
          }}
        >
          I build things that feel considered — from iOS apps to interactive
          web experiences. This site is a deliberate rejection of one-style
          portfolio design.
        </p>
      </motion.div>

      {/* ── Selected projects ── */}
      <SelectedProjectsSection
        animate={blurAnim}
        transition={blurTransition}
        onNotesExpand={handleNotesExpand}
        onNotesCloseStart={handleNotesCloseStart}
        onNotesClose={handleNotesClose}
        onVorliClick={handleVorliHeroClick}
      />

      {/* ── Projects divider ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          width: "100%",
          maxWidth: 600,
          marginTop: 60,
          alignSelf: "center",
          transformOrigin: "50% 50%",
        }}
      >
        <div style={{ display: "flex", gap: 2, width: 11, flexShrink: 0, opacity: 0.2 }}>
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "#585858", flex: 1, height: "1px" }} />
          ))}
        </div>
        <span
          style={{
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: "-0.04em",
            color: "rgba(0,0,0,0.3)",
            textTransform: "uppercase",
            lineHeight: 1.3,
            flexShrink: 0,
          }}
        >
          Projects
        </span>
        <div style={{ display: "flex", gap: 2, flex: 1, opacity: 0.2 }}>
          {Array.from({ length: 53 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "#585858", flex: 1, height: "1px" }} />
          ))}
        </div>
      </motion.div>

      {/* ── Project section ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{ transformOrigin: "50% 50%", width: "100%", maxWidth: 600 }}
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
          isEnvelopeOpen={envelopeOpen || isEnvelopeClosing}
          style={{ marginTop: 32, marginBottom: 120 }}
        />
      </motion.div>

      {/* ── Zoun detail overlay ── */}
      {activeProject === "zoun" && (
        <ZounDetail
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Wear detail overlay ── */}
      {activeProject === "weatherWear" && originRect && (
        <WearDetail
          originRect={originRect}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Pauschal Tracker detail overlay ── */}
      {activeProject === "pauschalTracker" && (
        <PauschalDetail
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Fynn.io detail overlay ── */}
      {activeProject === "fynn" && !!originRect && (
        <FynnDetail
          originRect={originRect}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Content Snare detail overlay ── */}
      {activeProject === "contentSnare" && !!originRect && (
        <ContentSnareDetail
          originRect={originRect}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
        />
      )}

      {/* ── Project floating card — all projects except Vorli, Zoun, WeatherWear, and PauschalTracker ── */}
      <AnimatePresence>
        {activeProject && activeProject !== "vorli" && activeProject !== "zoun" && activeProject !== "weatherWear" && activeProject !== "pauschalTracker" && activeProject !== "fynn" && activeProject !== "contentSnare"
          && !!originRect && (
            <ProjectFloatingCard
              key={activeProject}
              projectKey={activeProject}
              originRect={originRect}
              onCloseStart={handleCloseStart}
              onClose={handleClose}
              primaryColor={primaryColor}
              primary40={primary40}
            />
          )}
      </AnimatePresence>

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
    </motion.div>
  );
}
