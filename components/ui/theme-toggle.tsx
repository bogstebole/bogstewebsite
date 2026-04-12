"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        cursor: "pointer",
        background: isDark ? "#1E1E1E" : "#F3F3F3",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 9999,
        color: isDark ? "#F0F0F0" : "#111111",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        letterSpacing: "0.02em",
        padding: "6px 12px",
        transition: "background 0.2s ease, color 0.2s ease",
      }}
    >
      {isDark ? "light" : "dark"}
    </button>
  );
}
