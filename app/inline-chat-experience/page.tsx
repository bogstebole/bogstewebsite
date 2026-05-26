"use client";

import { useState, useCallback } from "react";
import { Logo } from "@/components/ui/logo";
import {
  ChatInput,
  type ChatInputState,
  defaultInlineAnimConfig,
} from "@/components/ChatInput/ChatInput";
import styles from "./IntroChatLanding.module.css";

export default function Page() {
  const [value, setValue] = useState("");
  const [inputState, setInputState] = useState<ChatInputState>("idle");
  const animConfig = defaultInlineAnimConfig;

  const handleChange = useCallback((v: string) => {
    setValue(v);
    setInputState(v.length > 0 ? "typing" : "idle");
  }, []);

  const handleSubmit = useCallback((v: string) => {
    if (!v.trim()) return;
    // transition to chat — handled in next phase
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.infoContainer}>
          <Logo />
          <div className={styles.content}>
            <div className={styles.introContent}>
              <div className={styles.nameContent}>
                <span className={styles.welcome}>Welcome</span>
                <span className={styles.title}>This is inline chat experience</span>
              </div>
              <span className={styles.version}>v1.0.0</span>
            </div>
            <p className={styles.description}>
              Exploration of having the input be the same as response. Or better said input
              morphing into chat bubble and maintains the continuous experience.
            </p>
          </div>
        </div>

        <div className={styles.inputSection}>
          <ChatInput
            state={inputState}
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
            variant="inline"
            animationConfig={animConfig}
            placeholder="Ask me about particle physics…"
          />
          <p className={styles.fyi}>
            FYI chat is currently working on several predefined text responses
            <br />
            and has limited functionalities
          </p>
        </div>
      </div>
    </div>
  );
}
