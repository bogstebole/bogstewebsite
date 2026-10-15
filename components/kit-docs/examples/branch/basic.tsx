"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerActions, Branch } from "inline-chat-kit";

/** What the model might say, in the order it says it. */
const ATTEMPTS = [
  "Book the 7:40 from Belgrade to Novi Sad. It is the fast train, it gets in at 8:16, and the station is a ten-minute walk from the old town.",
  "Take the Soko at 7:40: 36 minutes, about 690 dinars. Buy the ticket at the station or in the Srbijavoz app; seats are not reserved.",
  "If you want to be in Novi Sad before nine, the 7:40 Soko is the one. The next fast train is at 9:05, which still gets you there by 9:41.",
  "Train, not bus: the 7:40 Soko takes 36 minutes against the bus’s hour and a half, and it leaves from Belgrade Centar rather than the bus station.",
];

export default function BranchBasic() {
  const [versions, setVersions] = useState(ATTEMPTS.slice(0, 2));
  const [index, setIndex] = useState(1);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Regenerating adds a version; it never replaces the one being compared against.
  const regenerate = () => {
    setBusy(true);
    const next = [...versions, ATTEMPTS[versions.length % ATTEMPTS.length]];
    timer.current = window.setTimeout(() => {
      setVersions(next);
      setIndex(next.length - 1);
      setBusy(false);
    }, 1200);
  };

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 14,
          lineHeight: "var(--ick-answer-leading)",
          color: "var(--ick-ink)",
          opacity: busy ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {versions[index]}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ick-space-4)" }}>
        <Branch total={versions.length} index={index} onSelect={setIndex} />
        <AnswerActions text={versions[index]} busy={busy} onRegenerate={regenerate} />
      </div>
    </div>
  );
}
