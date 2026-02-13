"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { Logo } from "./logo";
import { LiveClock } from "./live-clock";
import CelestialToggle from "./celestial-toggle";

function shouldBeDark(): boolean {
  const hour = new Date().getHours();
  return hour < 6 || hour >= 19;
}

let timeListeners: Array<() => void> = [];
let timeDarkSnapshot = false;

function startTimeSubscription() {
  timeDarkSnapshot = shouldBeDark();
  const id = setInterval(() => {
    const next = shouldBeDark();
    if (next !== timeDarkSnapshot) {
      timeDarkSnapshot = next;
      timeListeners.forEach((l) => l());
    }
  }, 60_000);
  return () => clearInterval(id);
}

// Start immediately on module load (client only)
if (typeof window !== "undefined") {
  startTimeSubscription();
}

function subscribeTime(callback: () => void) {
  timeListeners.push(callback);
  return () => {
    timeListeners = timeListeners.filter((l) => l !== callback);
  };
}

function getTimeSnapshot(): boolean {
  return timeDarkSnapshot;
}

function getServerTimeSnapshot(): boolean {
  return false;
}

export function Header() {
  const timeDark = useSyncExternalStore(subscribeTime, getTimeSnapshot, getServerTimeSnapshot);
  const [manualDark, setManualDark] = useState<boolean | null>(null);

  const isDark = manualDark ?? timeDark;

  const handleToggle = useCallback((next: boolean) => {
    setManualDark(next);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{ paddingTop: 32 }}
    >
      <div
        className="mx-auto flex items-center justify-center"
        style={{ maxWidth: 800, paddingLeft: 24, paddingRight: 24, gap: 16 }}
      >
        {/* Logo */}
        <div className="pointer-events-auto">
          <Logo />
        </div>

        {/* Clock + toggle group */}
        <div className="pointer-events-auto flex items-center" style={{ gap: 16 }}>
          <LiveClock />
          <div
            style={{
              width: 200 * 0.27,
              height: 88 * 0.27,
              overflow: "hidden",
            }}
          >
            <div style={{ transform: "scale(0.27)", transformOrigin: "top left" }}>
              <CelestialToggle isDark={isDark} onToggle={handleToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
