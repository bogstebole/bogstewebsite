"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { motion, AnimatePresence } from "motion/react";
// import { Water } from "@paper-design/shaders-react"; // POOL_HIDDEN
import { Logo } from "@/components/ui/logo";
import { ProjectSection, SiteFooter } from "@/components/elements/project-section";
import { ProjectFloatingCard } from "@/components/ui/project-floating-card";
import { VorliReceiptDetail } from "@/components/ui/vorli-receipt-detail";
import { EnvelopeOverlay } from "@/components/ui/envelope-overlay";
import { EnvelopeMobileSheet } from "@/components/ui/envelope-mobile-sheet";
import { SectionProjectDetail } from "@/components/ui/section-project-detail";
import { SectionProjectTabBar, SECTION_PROJECT_ORDER, type SectionProjectKey } from "@/components/ui/section-project-tab-bar";
import { HeroSection } from "@/components/elements/hero-section";
import { HeroProjectDetail } from "@/components/ui/hero-project-detail";
import { HeroProjectTabBar, HERO_PROJECT_ORDER, type HeroProjectKey } from "@/components/ui/hero-project-tab-bar";
import { WritingsSection } from "@/components/elements/writings-section";
import { HoverProvider } from "@/components/ui/hover-context";
import type { SubstackPost } from "@/lib/substack";


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


export function V2Canvas({ latestPost }: { latestPost: SubstackPost | null }) {
  const { displayText, isIdle } = useTypewriter();
  const { isMobile, isTablet } = useBreakpoint();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [returningProject, setReturningProject] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [isEnvelopeClosing, setIsEnvelopeClosing] = useState(false);
  const [envelopeOriginRect, setEnvelopeOriginRect] = useState<DOMRect | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const [isDetailFullyOpen, setIsDetailFullyOpen] = useState(false);
  const handleProjectClick = (key: string) => {
    const el = entryRefs.current[key];
    if (el) {
      setOriginRect(el.getBoundingClientRect());
      setActiveProject(key);
      setIsClosing(false);
      setIsDetailFullyOpen(false);
    }
  };

  const SECTION_PROJECT_KEYS: SectionProjectKey[] = SECTION_PROJECT_ORDER;
  const isSectionProject = (key: string | null): key is SectionProjectKey =>
    SECTION_PROJECT_KEYS.includes(key as SectionProjectKey);

  const isHeroProject = (key: string | null): key is HeroProjectKey =>
    HERO_PROJECT_ORDER.includes(key as HeroProjectKey);

  const handleSectionTabSwitch = (key: SectionProjectKey) => {
    if (key === activeProject) return;
    setActiveProject(key);
    setOriginRect(null);
    setIsClosing(false);
  };

  const handleHeroProjectClick = (key: HeroProjectKey) => {
    setActiveProject(key);
    setOriginRect(null);
    setIsClosing(false);
    setIsDetailFullyOpen(false);
  };

  const handleHeroTabSwitch = (key: HeroProjectKey) => {
    if (key === activeProject) return;
    setActiveProject(key);
    setOriginRect(null);
    setIsClosing(false);
  };

  // Called when the close sequence begins — un-blur background immediately
  const handleCloseStart = () => {
    setIsClosing(true);
    setIsDetailFullyOpen(false);
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

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when detail is open
  useEffect(() => {
    document.body.style.overflow = activeProject || envelopeOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeProject, envelopeOpen]);


  // Un-blur background as soon as close begins
  const shouldBlur =
    (activeProject !== null && !isClosing) ||
    (envelopeOpen && !isEnvelopeClosing);
  const blurAnim = shouldBlur
    ? { scale: 0.93, filter: "blur(10px)", pointerEvents: "none" as const }
    : { scale: 1, filter: "blur(0px)", pointerEvents: "auto" as const };
  const blurTransition = { type: "tween" as const, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] };

  return (
    <HoverProvider>
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

      {/* ── Blurred background group (intro + divider + projects) ── */}
      <motion.div
        animate={blurAnim}
        transition={blurTransition}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformOrigin: "50% 50%",
        }}
      >
        {/* ── Intro text block ── */}
        <div
          style={{
            paddingTop: isMobile ? 32 : isTablet ? 56 : 80,
            paddingLeft: isMobile ? 24 : 0,
            paddingRight: isMobile ? 24 : 0,
            width: "100%",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
                color: "var(--color-text-primary)",
              }}
            >
              Hey You
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontWeight: 500,
                fontSize: isMobile ? 18 : 20,
                lineHeight: isMobile ? "22px" : "24px",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
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
                color: "var(--color-text-tertiary)",
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
            <span style={{ color: "var(--color-text-muted)" }}>
              {displayText}
              <span
                style={{
                  color: "var(--color-text-secondary)",
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
              paddingLeft: isMobile ? 16 : 0,
              paddingRight: isMobile ? 16 : 0,
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "18px",
              color: "var(--color-text-secondary)",
              textAlign: "center",
              whiteSpace: "pre-wrap",
              width: isMobile ? "100%" : "80%",
            }}
          >
            I build things that feel considered, from iOS apps to interactive web experiences. Ten years in, mostly 0-to-1 B2B SaaS products built from scratch or completely reimagined. I'm most interested in products where craft is treated as a requirement, not an afterthought.
          </p>
        </div>

        {/* ── Hero — selected projects ── */}
        <HeroSection
          activeProject={activeProject}
          onProjectClick={handleHeroProjectClick}
        />

        {/* ── Projects divider (hidden) ── */}

        {/* ── Project section ── */}
        <div style={{ width: "100%", maxWidth: 600, paddingLeft: isMobile ? 24 : 0, paddingRight: isMobile ? 24 : 0 }}>
          <ProjectSection
            primaryColor="var(--color-text-card)"
            primary40="var(--color-text-muted)"
            isDark={false}
            activeProject={activeProject}
            returningProject={returningProject}
            onProjectClick={handleProjectClick}
            entryRefs={entryRefs}
            style={{ marginTop: isMobile ? 20 : 32 }}
          />
        </div>

        {/* ── Latest writing section ── */}
        {latestPost && (
          <div style={{ width: "100%", maxWidth: 600, paddingLeft: isMobile ? 24 : 0, paddingRight: isMobile ? 24 : 0 }}>
            <WritingsSection post={latestPost} />
          </div>
        )}

        {/* ── Footer section ── */}
        <div style={{ width: "100%", maxWidth: 600, paddingLeft: isMobile ? 24 : 0, paddingRight: isMobile ? 24 : 0, marginBottom: isMobile ? 60 : 120, marginTop: 32 }}>
          <SiteFooter
            envelopeRef={envelopeRef}
            onEnvelopeClick={handleEnvelopeClick}
            isEnvelopeOpen={envelopeOpen || isEnvelopeClosing}
          />
        </div>
      </motion.div>

      {/* ── Section project detail overlay (single instance for all 5, enables tab slide transitions) ── */}
      {isSectionProject(activeProject) && (
        <SectionProjectDetail
          activeProject={activeProject}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
          onOpenComplete={() => setIsDetailFullyOpen(true)}
        />
      )}

      {/* ── Hero project detail overlay (single instance for all 3, enables tab slide transitions) ── */}
      {isHeroProject(activeProject) && (
        <HeroProjectDetail
          activeProject={activeProject}
          onCloseStart={handleCloseStart}
          onClose={handleClose}
          onOpenComplete={() => setIsDetailFullyOpen(true)}
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
              primaryColor="var(--color-text-primary)"
              primary40="var(--color-text-muted)"
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

      {/* ── Section project tab bar (portalled to body to escape blur/scale stacking context) ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {!isMobile && isSectionProject(activeProject) && isDetailFullyOpen && (
            <motion.div
              key="section-tab-bar"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: "5vh",
                bottom: 0,
                left: "calc(50% - 610px)",
                display: "flex",
                alignItems: "center",
                zIndex: 10002,
                pointerEvents: "none",
              }}
            >
              <SectionProjectTabBar
                active={activeProject}
                onChange={handleSectionTabSwitch}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Hero project tab bar (portalled to body to escape blur/scale stacking context) ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {!isMobile && isHeroProject(activeProject) && isDetailFullyOpen && (
            <motion.div
              key="hero-tab-bar"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: "5vh",
                bottom: 0,
                left: "calc(50% - 610px)",
                display: "flex",
                alignItems: "center",
                zIndex: 10002,
                pointerEvents: "none",
              }}
            >
              <HeroProjectTabBar
                active={activeProject}
                onChange={handleHeroTabSwitch}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Envelope — mobile bottom sheet ── */}
      {envelopeOpen && isMobile && (
        <EnvelopeMobileSheet
          onCloseStart={handleEnvelopeCloseStart}
          onClose={handleEnvelopeClose}
        />
      )}

      {/* ── Envelope overlay (desktop) ── */}
      {envelopeOpen && !isMobile && envelopeOriginRect && (
        <EnvelopeOverlay
          originRect={envelopeOriginRect}
          onCloseStart={handleEnvelopeCloseStart}
          onClose={handleEnvelopeClose}
        />
      )}

      </motion.div>
    </HoverProvider>
  );
}
