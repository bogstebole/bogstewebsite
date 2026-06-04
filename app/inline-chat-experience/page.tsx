"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDialKit, DialRoot } from "dialkit";
import Link from "next/link";
import { ArrowLeft, Share } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import {
  ChatInput,
  type ChatInputState,
  type ChatInputHandle,
  defaultInlineAnimConfig,
} from "@/components/ChatInput/ChatInput";
import { InlineChatBanner } from "@/components/ui/InlineChatBanner";
import { TextHighlighter } from "@/components/ui/text-highlighter";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { INLINE_CHAT_FEATURE_STATUS } from "@/lib/constants";
import introStyles from "./IntroChatLanding.module.css";
import "./ChatExperience.css";

type Phase = "intro" | "chat";

const AI_RESPONSE = [
  "Particle physics studies the most fundamental constituents of matter and the forces that act between them.",
  "The Standard Model organises twelve fermions — six quarks and six leptons — plus the force-carrying bosons into a single coherent framework.",
  "The Higgs boson, found at CERN in 2012, completes the picture by giving elementary particles their mass through interaction with the Higgs field.",
];

const HIGGS_RESPONSE = [
  "The Higgs boson is a point particle — it has no measurable spatial extent at any scale we can currently probe.",
  "Its mass sits at roughly 125 GeV/c², about 133 times heavier than a proton.",
  "So 'how big is it' has only one honest answer: it has no size, only mass and quantum numbers.",
];

interface Turn {
  id: string;
  user: string;
  ai: string;
  state: ChatInputState;
}

interface Highlight {
  turnId: string;
  text: string;
}

const randomId = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const newTurn = (): Turn => ({
  id: randomId(),
  user: "",
  ai: "",
  state: "idle",
});

export default function Page() {
  const dial = useDialKit("Animation Setup", {
    "Entrance Animation": {
      staggerDelay: [0.07, 0, 0.5],
      stiffness: [100, 50, 800],
      damping: [36, 5, 100],
      yOffset: [-10, -100, 100],
      blur: [10, 0, 50],
    },
    "Start Experience": {
      staggerDelay: [0.07, 0, 0.5],
      duration: [0.28, 0, 1],
      yOffset: [-10, -100, 100],
      blur: [10, 0, 50],
    },
    "Chat Feed": {
      delay: [0.3, 0, 1.5],
    },
  });

  const introContainerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: dial["Entrance Animation"].staggerDelay,
      },
    },
    exit: {
      transition: {
        staggerChildren: dial["Start Experience"].staggerDelay,
        staggerDirection: -1 as const,
      },
    },
  };

  const introItemVariants: any = {
    hidden: { 
      opacity: 0, 
      filter: `blur(${dial["Entrance Animation"].blur}px)`, 
      y: dial["Entrance Animation"].yOffset 
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)", 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: dial["Entrance Animation"].stiffness, 
        damping: dial["Entrance Animation"].damping 
      }
    },
    exit: {
      opacity: 0,
      filter: `blur(${dial["Start Experience"].blur}px)`,
      y: dial["Start Experience"].yOffset,
      transition: { duration: dial["Start Experience"].duration, ease: [0.4, 0, 1, 1] as const },
    },
  };

  const [phase, setPhase] = useState<Phase>("intro");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showHighlightsModal, setShowHighlightsModal] = useState(false);
  const [activeReply, setActiveReply] = useState<{ text: string, rect: DOMRect } | null>(null);
  const [replyInputValue, setReplyInputValue] = useState("");
  const streamingRef = useRef<number | null>(null);
  const turnCountRef = useRef(0);
  const activeInputRef = useRef<ChatInputHandle>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const animConfig = defaultInlineAnimConfig;

  useEffect(() => {
    return () => {
      if (streamingRef.current) clearTimeout(streamingRef.current);
    };
  }, []);


  const updateTurn = (id: string, patch: Partial<Turn>) => {
    setTurns((t) => t.map((turn) => (turn.id === id ? { ...turn, ...patch } : turn)));
  };

  const handleStart = () => {
    setPhase("chat");
    setTurns([newTurn()]);
  };

  const handleChange = (id: string, value: string) => {
    updateTurn(id, {
      user: value,
      state: value.length > 0 ? "typing" : "idle",
    });
  };

  const handleSubmit = (id: string, value: string) => {
    const trimmed = value.trim();
    updateTurn(id, { user: trimmed, state: "responding" });

    setTimeout(() => {
      const el = document.getElementById(`turn-${id}`);
      const feed = document.querySelector('.chatFeed');
      const header = document.querySelector('.chatHeader');
      if (el && feed) {
        const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
        // Scroll so the element is exactly 16px below the bottom of the header
        feed.scrollTo({ top: el.offsetTop - headerHeight - 16, behavior: "smooth" });
      } else {
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);

    const response = turnCountRef.current % 2 === 0 ? AI_RESPONSE : HIGGS_RESPONSE;
    turnCountRef.current += 1;
    streamAi(id, response);
  };

  const streamAi = (turnId: string, response: string[]) => {
    const fullText = response.join(" ");
    let i = 0;

    const tick = () => {
      if (i >= fullText.length) {
        finishTurn(turnId);
        return;
      }
      setTurns((t) =>
        t.map((turn) =>
          turn.id === turnId ? { ...turn, ai: fullText.slice(0, i + 1) } : turn
        )
      );
      const char = fullText[i];
      i += 1;
      const delay = char === "." ? 40 : char === "," ? 18 : 3;
      streamingRef.current = window.setTimeout(tick, delay);
    };
    streamingRef.current = window.setTimeout(tick, 300);
  };

  const finishTurn = (turnId: string) => {
    streamingRef.current = null;
    setTurns((t) =>
      t.map((turn) => (turn.id === turnId ? { ...turn, state: "resting" } : turn))
    );
    streamingRef.current = window.setTimeout(() => {
      streamingRef.current = null;
      setTurns((t) => [...t, newTurn()]);
    }, 320);
  };

  const handleStop = (turnId: string) => {
    if (streamingRef.current) {
      clearTimeout(streamingRef.current);
      streamingRef.current = null;
    }
    finishTurn(turnId);
  };

  let replyTargetX = 0;
  let replyTargetY = 0;
  let replyTargetWidth = 480;
  
  if (activeReply) {
    // If we're rendering on server (though it's "use client"), window might not be defined. We are safe in useEffect/events, but for render:
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
    replyTargetWidth = Math.max(activeReply.rect.width + 80, 480);
    replyTargetX = activeReply.rect.left + activeReply.rect.width / 2 - replyTargetWidth / 2;
    const padding = 24;
    if (replyTargetX < padding) replyTargetX = padding;
    if (replyTargetX + replyTargetWidth > screenWidth - padding) replyTargetX = screenWidth - padding - replyTargetWidth;
    
    replyTargetY = activeReply.rect.top - 24;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
      <CustomCursor />
      <AnimatePresence mode="wait">
      {phase === "intro" ? (
        <motion.div
          key="intro"
          className={introStyles.page}
          variants={introContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className={introStyles.container}>
            <div className={introStyles.infoContainer}>
              <motion.div variants={introItemVariants}>
                <Logo />
              </motion.div>
              <div className={introStyles.content}>
                <div className={introStyles.introContent}>
                  <motion.div className={introStyles.nameContent} variants={introItemVariants}>
                    <span className={introStyles.welcome}>Welcome</span>
                    <span className={introStyles.title}>This is inline chat experience</span>
                  </motion.div>
                  <motion.span className={introStyles.version} variants={introItemVariants}>v1.0.0</motion.span>
                </div>
                <motion.p className={introStyles.description} variants={introItemVariants}>
                  Exploration of having the input be the same as response. Or better said input
                  morphing into chat bubble and maintains the continuous experience.
                </motion.p>
              </div>
            </div>

            <motion.div variants={introItemVariants} className={introStyles.mobileNotice}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingInline: 4, paddingBottom: 4 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="8" cy="8" r="7" stroke="#111111" strokeWidth="1.2" />
                  <path d="M8 7v4" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="5" r="0.8" fill="#111111" />
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace", fontSize: 12, lineHeight: "16px", letterSpacing: "-0.02em", color: "#111111" }}>
                    Desktop only for now
                  </span>
                  <span style={{ fontFamily: "var(--font-geist-sans), 'Geist', system-ui, sans-serif", fontSize: 12, lineHeight: "18px", color: "rgba(17,17,17,0.7)" }}>
                    Inline chat experience is built for desktop. Mobile support is on the way, check back soon.
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={introItemVariants} className={introStyles.mobileButton}>
              <Link href="/">
                <GlassButton size="s">Back to home</GlassButton>
              </Link>
            </motion.div>

            <motion.div variants={introItemVariants} className={introStyles.bannerWrapper}>
              <InlineChatBanner status={INLINE_CHAT_FEATURE_STATUS} />
            </motion.div>

            {/* Invisible elements to consume stagger slots and create a pause before the button animates */}
            <motion.div variants={introItemVariants} style={{ display: "none" }} />
            <motion.div variants={introItemVariants} style={{ display: "none" }} />
            <motion.div variants={introItemVariants} style={{ display: "none" }} />

            <motion.div variants={introItemVariants} className={introStyles.buttonWrapper}>
              <GlassButton size="s" onClick={handleStart}>
                Start experience
              </GlassButton>
              <Link href="/" className="secondaryBtn">
                Back to home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          className="chatPage"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: (activeReply || showHighlightsModal) ? 0.4 : 1,
            filter: (activeReply || showHighlightsModal) ? "blur(8px)" : "blur(0px)"
          }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => activeInputRef.current?.focus()}
        >
          <div className="topBlur" />
          <header className="chatHeader">
            <div className="chatHeaderLeft">
              <Link href="/" className="secondaryBtn iconBtn" aria-label="Back to home">
                <ArrowLeft size={16} />
              </Link>
              <span className="chatHeaderTitle">inline chat experience</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {highlights.length > 0 && (
                <button 
                  className="secondaryBtn" 
                  onClick={() => setShowHighlightsModal(true)}
                >
                  Highlights ({highlights.length})
                </button>
              )}
              <button 
                className="secondaryBtn iconBtn" 
                onClick={() => navigator.share?.({ title: "Inline chat experience", url: window.location.href })}
                aria-label="Share"
              >
                <Share size={16} />
              </button>
            </div>
          </header>
          <div className="chatFeed" ref={feedRef}>
            <AnimatePresence>
              {turns.map((turn, i) => {
                const isActiveInput =
                  i === turns.length - 1 &&
                  (turn.state === "idle" || turn.state === "typing");
                return (
                  <motion.article
                    key={turn.id}
                    id={`turn-${turn.id}`}
                    className={`chatTurn${isActiveInput ? " activeInput" : ""}`}
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: [0.22, 1, 0.36, 1],
                      delay: i === 0 ? dial["Chat Feed"].delay : 0
                    }}
                  >
                    <div className="userRow">
                      <ChatInput
                        ref={isActiveInput ? activeInputRef : null}
                        state={turn.state}
                        value={turn.user}
                        onChange={(v) => handleChange(turn.id, v)}
                        onSubmit={(v) => handleSubmit(turn.id, v)}
                        onStop={() => handleStop(turn.id)}
                        onCopy={(v) => navigator.clipboard.writeText(v)}
                        onEdit={() => updateTurn(turn.id, { state: "typing" })}
                        variant="inline"
                        animationConfig={animConfig}
                        placeholder="Ask me about particle physics…"
                      />
                    </div>
                    {turn.ai && (
                      <p className="aiText">
                        <TextHighlighter 
                          text={turn.ai} 
                          onHighlightComplete={(text) => {
                            if (text.trim().length > 0) {
                              setHighlights(prev => [...prev, { turnId: turn.id, text: text.trim() }]);
                            }
                          }}
                          onReplyInThread={(text, rect) => {
                            setActiveReply({ text, rect });
                          }}
                        />
                      </p>
                    )}
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="bottomBlur" />
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showHighlightsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px"
            }}
            onClick={() => setShowHighlightsModal(false)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "var(--color-bg-page, #fff)",
                borderRadius: "24px",
                padding: "32px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontFamily: "var(--font-geist-mono), monospace", fontSize: "16px", color: "var(--color-text, #111)" }}>Highlights</h2>
                <button className="secondaryBtn iconBtn" onClick={() => setShowHighlightsModal(false)}>
                  Close
                </button>
              </div>
              
              {Array.from(new Set(highlights.map(h => h.turnId))).map((turnId, index) => (
                <div key={turnId} style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "12px", color: "rgba(17,17,17,0.5)", marginBottom: "8px", fontFamily: "var(--font-geist-mono), monospace" }}>
                    Paragraph {index + 1}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {highlights.filter(h => h.turnId === turnId).map((h, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setShowHighlightsModal(false);
                          setTimeout(() => {
                            const el = document.getElementById(`turn-${turnId}`);
                            const feed = document.querySelector('.chatFeed');
                            const header = document.querySelector('.chatHeader');
                            if (el && feed) {
                              const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
                              feed.scrollTo({ top: el.offsetTop - headerHeight - 16, behavior: "smooth" });
                            } else {
                              el?.scrollIntoView({ behavior: "smooth", block: "center" });
                            }
                          }, 100);
                        }}
                        style={{ 
                          padding: "12px 16px", 
                          backgroundColor: "rgba(204, 255, 0, 0.2)", 
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                          lineHeight: 1.5,
                          color: "var(--color-text, #111)",
                          cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(204, 255, 0, 0.4)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(204, 255, 0, 0.2)"}
                      >
                        {h.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeReply && (
          <div 
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 200,
              display: "block",
              pointerEvents: "auto",
            }}
            onClick={() => setActiveReply(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ 
                x: activeReply.rect.left, 
                y: activeReply.rect.top, 
                width: activeReply.rect.width, 
                height: activeReply.rect.height,
                borderRadius: 12,
                opacity: 0,
                scale: 0.95
              }}
              animate={{ 
                x: replyTargetX, 
                y: replyTargetY, 
                width: replyTargetWidth, 
                height: "auto",
                borderRadius: 24,
                opacity: 1,
                scale: 1,
                backgroundColor: "var(--color-bg-page, #fff)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.05)"
              }}
              exit={{ 
                x: activeReply.rect.left, 
                y: activeReply.rect.top, 
                width: activeReply.rect.width, 
                height: activeReply.rect.height,
                opacity: 0,
                borderRadius: 12,
                scale: 0.95
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                position: "absolute",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflow: "hidden"
              }}
            >
              <div 
                style={{ 
                  backgroundColor: "rgba(204, 255, 0, 0.2)", 
                  padding: "16px", 
                  borderRadius: "12px",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  color: "var(--color-text, #111)",
                  border: "1px solid rgba(204, 255, 0, 0.3)"
                }}
              >
                {activeReply.text}
              </div>
              
              <div style={{ pointerEvents: "auto" }}>
                <ChatInput
                  state={replyInputValue.length > 0 ? "typing" : "idle"}
                  value={replyInputValue}
                  onChange={setReplyInputValue}
                  onSubmit={(v) => {
                    console.log("Thread replied:", v);
                    setReplyInputValue("");
                    setActiveReply(null);
                  }}
                  onStop={() => {}}
                  onCopy={() => {}}
                  onEdit={() => {}}
                  variant="inline"
                  animationConfig={animConfig}
                  placeholder="Ask me about this text..."
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
