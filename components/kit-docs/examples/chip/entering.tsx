"use client";

import { useEffect, useState } from "react";
import { Chip } from "inline-chat-kit";

const TAGS = ["Lisbon", "May", "2 adults", "Food", "Trams"];

/**
 * Each chip springs in as it mounts: a value arriving, not a layout shift.
 * With reduced motion it only fades. Press replay to watch it again.
 */
export default function ChipEntering() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timers = TAGS.map((_, i) => window.setTimeout(() => setCount(i + 1), 400 + i * 350));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, minHeight: 24, width: "100%", maxWidth: 420 }}>
      {TAGS.slice(0, count).map((tag) => (
        <Chip key={tag}>{tag}</Chip>
      ))}
    </div>
  );
}
