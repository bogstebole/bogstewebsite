"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import {
  ChatInput,
  type ChatInputState,
  defaultInlineAnimConfig,
} from "@/components/ChatInput/ChatInput";
import introStyles from "./IntroChatLanding.module.css";
import "./ChatExperience.css";

type Phase = "intro" | "chat";

interface Turn {
  id: string;
  user: string;
  ai: string;
  state: "responding" | "done";
}

const RESPONSES = [
  "That's a fascinating direction. Inline chat explores continuity — the input doesn't disappear, it transforms. The same spatial anchor carries both question and answer.",
  "The thesis here is spatial consistency. When the input morphs into a response bubble, your eye never has to jump. Same place, different state.",
  "Reducing cognitive load through spatial continuity — that's the core idea. The interface becomes a single thread, not two separate zones.",
  "Most chat UIs split the experience in two: a place you type, and a place you read. This explores collapsing that into one flowing element.",
];

let responseIndex = 0;

const introContainerVariants = {
  visible: {},
  exit: {
    transition: {
      staggerChildren: 0.07,
      staggerDirection: -1 as const,
    },
  },
};

const introItemVariants = {
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  exit: {
    opacity: 0,
    filter: "blur(10px)",
    y: -10,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
  },
};

export default function Page() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [value, setValue] = useState("");
  const [inputState, setInputState] = useState<ChatInputState>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const animConfig = defaultInlineAnimConfig;

  const handleChange = useCallback((v: string) => {
    setValue(v);
    setInputState(v.length > 0 ? "typing" : "idle");
  }, []);

  const handleSubmit = useCallback(
    (v: string) => {
      if (!v.trim()) return;
      const trimmed = v.trim();
      const id = `turn-${Date.now()}`;

      setTurns((prev) => [...prev, { id, user: trimmed, ai: "", state: "responding" }]);
      setValue("");
      setInputState("responding");

      if (phase === "intro") {
        setPhase("chat");
      }

      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);

      const response = RESPONSES[responseIndex % RESPONSES.length];
      responseIndex++;

      setTimeout(() => {
        setTurns((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ai: response, state: "done" } : t))
        );
        setInputState("idle");
      }, 1200);
    },
    [phase]
  );

  return (
    <LayoutGroup>
      <AnimatePresence mode="sync">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            className={introStyles.page}
            variants={introContainerVariants}
            initial="visible"
            animate="visible"
            exit="exit"
          >
            <div className={introStyles.container}>
              <motion.div
                className={introStyles.infoContainer}
                variants={introItemVariants}
              >
                <Logo />
                <div className={introStyles.content}>
                  <div className={introStyles.introContent}>
                    <div className={introStyles.nameContent}>
                      <span className={introStyles.welcome}>Welcome</span>
                      <span className={introStyles.title}>
                        This is inline chat experience
                      </span>
                    </div>
                    <span className={introStyles.version}>v1.0.0</span>
                  </div>
                  <p className={introStyles.description}>
                    Exploration of having the input be the same as response. Or better said input
                    morphing into chat bubble and maintains the continuous experience.
                  </p>
                </div>
              </motion.div>

              <div className={introStyles.inputSection}>
                <motion.div layoutId="chat-input">
                  <ChatInput
                    state={inputState}
                    value={value}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    variant="inline"
                    animationConfig={animConfig}
                    placeholder="Ask me about particle physics…"
                  />
                </motion.div>
                <motion.p
                  className={introStyles.fyi}
                  variants={introItemVariants}
                >
                  FYI chat is currently working on several predefined text responses
                  <br />
                  and has limited functionalities
                </motion.p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            className="chatPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            <div className="chatInputBar">
              <motion.div
                layoutId="chat-input"
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <ChatInput
                  state={inputState}
                  value={value}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  variant="inline"
                  animationConfig={animConfig}
                  placeholder="Ask me about particle physics…"
                />
              </motion.div>
            </div>
            <div className="chatFeed">
              {turns.map((turn) => (
                <div key={turn.id} id={turn.id} className="chatTurn">
                  <div className="userRow">
                    <div className="userBubble">{turn.user}</div>
                  </div>
                  {turn.state === "done" && turn.ai && (
                    <motion.p
                      className="aiText"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {turn.ai}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
            <div className="bottomBlur" />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
