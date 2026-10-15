"use client";

import { useEffect, useState } from "react";
import { Loader } from "inline-chat-kit";

const STEPS = ["Searching the archive…", "Reading 3 sources…", "Checking the dates…"];

/**
 * A status line that has not settled shimmers. Once it has, it is just text:
 * the shimmer is for provisional words, not for every status.
 */
export default function LoaderStatusLine() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [1, 2, 3].map((n) => window.setTimeout(() => setStep(n), n * 1300));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const settled = step >= STEPS.length;

  return (
    <div style={{ width: "100%", maxWidth: 520, minHeight: 24, display: "flex", alignItems: "center" }}>
      {settled ? (
        <span style={{ fontSize: "var(--ick-text-md)", color: "var(--ick-ink-soft)" }}>
          Found 3 sources from 1998–2004
        </span>
      ) : (
        <Loader variant="shimmer">{STEPS[step]}</Loader>
      )}
    </div>
  );
}
