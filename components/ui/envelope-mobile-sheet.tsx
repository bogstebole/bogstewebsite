"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import { PaperLogo } from "@/components/elements/notes-to-self";

interface EnvelopeMobileSheetProps {
  onCloseStart: () => void;
  onClose: () => void;
}

type Page = "main" | "timeline";

const TIMELINE_ENTRIES = [
  {
    year: "1996 - Early creativity",
    content: "Ever since I was a little kid, I've been drawn to the creative world. I remember in kindergarten, I'd get these strange looks for the stuff I drew – tons of black circles and other odd things. But by the time I hit preschool, my drawings were actually winning awards! Go figure, right?",
  },
  {
    year: "2007 - A fork in the road",
    content: "Growing up, I was torn between two completely different paths: art school or becoming a veterinarian. I've always loved animals. I remember when I was 5, I accidentally stepped on a sparrow – I still have no idea how it happened! – and I completely freaked out. I was sobbing my eyes out, convinced I'd killed it and would end up in prison! But art... well, that was a different story. It just had this pull on me that I couldn't ignore.",
  },
  {
    year: "2008 - Art school and beyond",
    content: "So, I ended up enrolling in to the High School of Arts, specializing in painting. It was there I met a friend and professor who would later become a key figure in my story and someone who significantly shaped my current career.",
  },
  {
    year: "2011 - New Media Adventures",
    content: "Things moved fast after that. I actually started at the Academy of Arts a year early, and that's where I got hooked on conceptual and new media art. It was so different and exciting!",
  },
  {
    year: "2015 - Master's degree",
    content: "I just had to learn more, so I went on to get my Master's degree in New Media Arts in Novi Sad.",
  },
  {
    year: "2016 - Doughnuts and dreams",
    content: "After all that studying, I needed a break and wanted to see the world. I got a chance to be a model in India, which was an amazing experience. When I came back, I needed to pay the bills, so I started making doughnuts at a friend's shop. Yeah, a bit of a change from the art world, huh?\nAt the same time, I was renting an apartment that had a studio space. I thought, \"Perfect! I'll finally focus on my painting career.\" Well, it didn't quite take off the way I hoped.",
  },
  {
    year: "2017 - A coding detour and product design spark",
    content: "The owner of the apartment ran an agency and offered me a job if I learned some front-end development. I gave it a shot, but coding wasn't really my thing. It was way too boring for me.\nLuckily, around that time, I bumped into an old high school friend. He got me really interested in web design. Honestly, back then, I had no clue what that even involved or how design turned into websites.\nBut I was determined! I quit my doughnut-making gig and dove headfirst into learning everything I could about design. Then, another lucky break — I went to my landlord's birthday party and met a guy who owned a software agency. They were looking for a designer, and he invited me to come learn the ropes. After a month, they actually hired me!",
  },
  {
    year: "2018 - Design beginnings",
    content: "And that's how my product design journey began. I spent three years at that agency. It was tough, and I felt like I wasn't growing as much as I wanted to.\nSo, I started looking for freelance work on the side. I landed some really cool projects, like designing a streaming platform for musicians in Thailand and working on a banking app.",
  },
  {
    year: "2021 - Agency change",
    content: "Eventually, I moved to a different agency called Cinnamon. That place was incredible! I learned so much in just one year – workshops, design processes, you name it. Plus, I got to work with some amazing clients. I even ended up working on AI platforms and improving design systems for fintech companies.",
  },
  {
    year: "2022 - Freelancing and Growth",
    content: "My next adventure came when I was hired as a freelancer by Tenscope agency. I started on just one project, but I guess I did alright because they made me the UX lead and brought me on full-time!\nNow, besides client projects, I'm also responsible for making our design processes better — standardizing documentation, figuring out how we communicate design decisions, and keeping our files organized.",
  },
  {
    year: "2023 - Tenscope and UX Leadership",
    content: "I'm still at Tenscope, and we're constantly trying to improve and find new ways of doing things. Agency life is definitely challenging, but it's also a lot of fun.",
  },
  {
    year: "2025 - Present - Design Engineering",
    content: "This year, the gap between \"designing a concept\" and \"shipping a product\" finally disappeared. By heavily integrating AI into my workflow, I transitioned from being a designer who dreams up interfaces to a creator who builds them. From solving my own financial tracking for my agency to exploring the \"digital hoarding\" of Useless Notes, I've spent the year using AI as a bridge. It's allowed me to return to that raw, childhood curiosity — where an idea doesn't stay on a canvas, but becomes a thing that actually lives.",
  },
];

const NOTES = [
  "Deep dive into things that tickle your passion",
  "Don't be a fckn shit!",
  'Start with "What if..."',
  "Be respectful, listen, share...",
  "Respect yourself and your work, but be open to criticism...",
  "Be introspective",
  "Be humble",
  "Be honest",
];

const sheetSpring = { type: "spring" as const, stiffness: 340, damping: 34 };
const slideSpring = { type: "spring" as const, stiffness: 320, damping: 32 };
const stickySpring = { type: "spring" as const, stiffness: 400, damping: 36 };
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function EnvelopeMobileSheet({ onCloseStart, onClose }: EnvelopeMobileSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [page, setPage] = useState<Page>("main");
  const [showStickyMain, setShowStickyMain] = useState(false);
  const [showStickyBack, setShowStickyBack] = useState(false);
  const closingRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const mainSentinelRef = useRef<HTMLDivElement>(null);
  const timelineSentinelRef = useRef<HTMLDivElement>(null);
  const [panelTopPx, setPanelTopPx] = useState(0);

  const measurePanelTop = useCallback(() => {
    if (panelRef.current) {
      setPanelTopPx(panelRef.current.getBoundingClientRect().top);
    }
  }, []);

  useEffect(() => {
    measurePanelTop();
    window.addEventListener("resize", measurePanelTop);
    return () => window.removeEventListener("resize", measurePanelTop);
  }, [measurePanelTop]);

  useEffect(() => {
    const mainSentinel = mainSentinelRef.current;
    const timelineSentinel = timelineSentinelRef.current;
    if (!mainSentinel || !timelineSentinel) return;
    const obsMain = new IntersectionObserver(
      ([entry]) => setShowStickyMain(!entry.isIntersecting),
      { threshold: 0 }
    );
    const obsTimeline = new IntersectionObserver(
      ([entry]) => setShowStickyBack(!entry.isIntersecting),
      { threshold: 0 }
    );
    obsMain.observe(mainSentinel);
    obsTimeline.observe(timelineSentinel);
    return () => { obsMain.disconnect(); obsTimeline.disconnect(); };
  }, [mounted]);

  useEffect(() => { setMounted(true); }, []);

  const navigateToMain = useCallback(() => {
    setPage("main");
    setShowStickyBack(false);
  }, []);

  const navigateToTimeline = useCallback(() => {
    setPage("timeline");
    setShowStickyBack(false);
    setShowStickyMain(false);
    if (timelineScrollRef.current) timelineScrollRef.current.scrollTop = 0;
  }, []);

  const initiateClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    onCloseStart();
    await wait(400);
    onClose();
  }, [onCloseStart, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (page === "timeline") {
          navigateToMain();
        } else {
          void initiateClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [initiateClose, navigateToMain, page]);

  if (!mounted) return null;

  const closeIcon = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
    </svg>
  );

  const backIcon = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,1 2,5 6,9" />
    </svg>
  );

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        onClick={() => void initiateClose()}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "var(--color-bg-backdrop)",
          inset: 0,
          position: "fixed",
          zIndex: 10000,
        }}
      />

      {/* Bottom sheet — overflow hidden, content slides */}
      <motion.div
        ref={panelRef}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={sheetSpring}
        onAnimationComplete={() => { if (!isClosing) measurePanelTop(); }}
        style={{
          backgroundColor: "var(--color-bg-sheet-mobile)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: "0px -8px 24px rgba(0,0,0,0.05)",
          bottom: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          height: "95dvh",
          left: 0,
          overflow: "hidden",
          position: "fixed",
          right: 0,
          width: "100%",
          zIndex: 10001,
        }}
      >
        {/* Sliding content area */}
        <motion.div
          animate={{ x: page === "main" ? 0 : "-100%" }}
          transition={slideSpring}
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Main panel */}
          <div
            ref={mainScrollRef}
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              gap: 0,
              minWidth: "100%",
              overflowY: "auto",
              paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
              paddingInline: 16,
              paddingTop: 16,
              width: "100%",
            }}
          >
            {/* Header — scrolls with content, triggers sticky on scroll */}
            <div style={{
              alignItems: "center",
              boxSizing: "border-box",
              display: "flex",
              flexShrink: 0,
              justifyContent: "space-between",
              paddingBottom: 8,
            }}>
              <PaperLogo size={32} />
              <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
                {closeIcon}
              </GlassButton>
            </div>
            {/* Sentinel — floating header appears when this leaves view */}
            <div ref={mainSentinelRef} style={{ height: 1, flexShrink: 0 }} />

            {/* About Me section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <span style={{
                  color: "var(--color-text-primary)",
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 14,
                  fontWeight: 300,
                  lineHeight: "20px",
                }}>
                  About
                </span>
                <span style={{
                  color: "var(--color-text-secondary)",
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 14,
                  fontWeight: 300,
                  lineHeight: "20px",
                }}>
                  Eerie black circles and beyond
                </span>
              </div>

              <p style={{
                color: "var(--color-text-secondary)",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 300,
                lineHeight: "150%",
                margin: 0,
              }}>
                Childhood fascination with drawing dark circles alarmed my parents but led me to explore conceptual art, product design and eventually AI. AI gave me opportunity to bring to life concepts that were just an idea a while ago. Through the process I learned to harness a child&apos;s innate curiosity. Now as a father, my son&apos;s wonder helps me rediscover that questioning spirit I sometimes lose touch with.
              </p>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/me-and-son.png"
                alt="Me and my son illustration"
                style={{ width: "100%", height: "auto", display: "block" }}
              />

              <GlassButton size="m" onClick={navigateToTimeline}>
                Read more
              </GlassButton>
            </div>

            {/* Dashed divider */}
            <div style={{ alignItems: "start", display: "flex", gap: 2, height: "fit-content", marginTop: 32, opacity: 0.2, width: "100%" }}>
              {Array.from({ length: 56 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: "var(--color-divider)", flex: 1, height: "1px" }} />
              ))}
            </div>

            {/* Note to Self section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32, paddingBottom: 16 }}>
              <span style={{
                color: "var(--color-text-primary)",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 14,
                fontWeight: 300,
                lineHeight: "20px",
              }}>
                Note to self
              </span>
              <div style={{
                color: "var(--color-text-secondary)",
                display: "flex",
                flexDirection: "column",
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 300,
                gap: 8,
                lineHeight: "150%",
              }}>
                {NOTES.map((note, i) => (
                  <span key={i}>{i + 1}. {note}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline panel */}
          <div
            ref={timelineScrollRef}
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              minWidth: "100%",
              overflowY: "auto",
              paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
              paddingInline: 16,
              paddingTop: 16,
              width: "100%",
            }}
          >
            {/* Header — scrolls with content, triggers sticky on scroll */}
            <div style={{
              alignItems: "center",
              boxSizing: "border-box",
              display: "flex",
              flexShrink: 0,
              paddingBottom: 8,
            }}>
              <GlassButton size="s" onClick={navigateToMain} aria-label="Back">
                {backIcon}
              </GlassButton>
            </div>
            {/* Sentinel — floating back pill appears when this leaves view */}
            <div ref={timelineSentinelRef} style={{ height: 1, flexShrink: 0 }} />
            {TIMELINE_ENTRIES.map((entry, i) => (
              <div key={i}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBlock: 24 }}>
                  <span style={{
                    color: "var(--color-text-primary)",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: "18px",
                  }}>
                    {entry.year}
                  </span>
                  <span style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: "150%",
                    whiteSpace: "pre-wrap",
                  }}>
                    {entry.content}
                  </span>
                </div>
                {i < TIMELINE_ENTRIES.length - 1 && (
                  <div style={{ alignItems: "start", display: "flex", gap: 2, height: "fit-content", opacity: 0.2, width: "100%" }}>
                    {Array.from({ length: 56 }).map((_, j) => (
                      <div key={j} style={{ backgroundColor: "var(--color-divider)", flex: 1, height: "1px" }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating main header pill — main page, appears on scroll */}
      <AnimatePresence>
        {page === "main" && showStickyMain && !isClosing && (
          <motion.div
            key="main-pill"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={stickySpring}
            style={{
              alignItems: "center",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: "var(--color-bg-sheet-header)",
              borderRadius: 24,
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              left: 8,
              padding: 16,
              position: "fixed",
              right: 8,
              top: panelTopPx + 8,
              width: "calc(100% - 16px)",
              zIndex: 10002,
            }}
          >
            <PaperLogo size={24} />
            <GlassButton size="s" onClick={() => void initiateClose()} aria-label="Close">
              {closeIcon}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating back pill — timeline page only, appears on scroll */}
      <AnimatePresence>
        {page === "timeline" && showStickyBack && !isClosing && (
          <motion.div
            key="back-pill"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={stickySpring}
            style={{
              alignItems: "center",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: "var(--color-bg-sheet-header)",
              borderRadius: 24,
              boxSizing: "border-box",
              display: "flex",
              left: 8,
              padding: 16,
              position: "fixed",
              right: 8,
              top: panelTopPx + 8,
              width: "calc(100% - 16px)",
              zIndex: 10002,
            }}
          >
            <GlassButton size="s" onClick={navigateToMain} aria-label="Back">
              {backIcon}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
