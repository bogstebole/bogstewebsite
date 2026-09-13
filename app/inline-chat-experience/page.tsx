"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatExperienceDemo } from "inline-chat-kit/demo";
import "inline-chat-kit/styles.css";
import { Logo } from "@/components/ui/logo";

/**
 * The inline chat experience, which this page does not define.
 *
 * It used to: 890 lines of it, plus a 306-line stylesheet, a 140-line one for
 * the landing page, a banner, and 537 lines of scripted answers — all of it a
 * copy of what the playground had, and all of it drifting. Every fix went into
 * one copy. The header rendered see-through here because this copy never
 * defined `--bg`. The empty state snapped out of existence because this copy
 * never got the `AnimatePresence`. A sent message stayed pinned to the top for
 * the whole session because this copy never got the released anchor.
 *
 * It comes from the package now — `inline-chat-kit/demo` — so a fix arrives by
 * `npm install` rather than by being made twice. What is left here is what is
 * genuinely this site's: the mark at the top, where "back" goes, and the fact
 * that this page is read in light.
 */
export default function InlineChatExperiencePage() {
  /* This site's own dark mode is a class on the root element, and the chat is
     read in light regardless — so it is lifted for the length of the visit and
     put back on the way out. Nothing to do with the kit's theme, which is
     `data-theme` and is handed down below. */
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    if (wasDark) document.documentElement.classList.remove("dark");
    return () => {
      if (wasDark) document.documentElement.classList.add("dark");
    };
  }, []);

  /* Starts light, and the header's toggle moves it. Held here rather than left
     to the kit because the starting value is this page's decision; handing the
     value down without a way to change it would make the toggle a button that
     does nothing. */
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <ChatExperienceDemo
      logo={<Logo />}
      back={<Link href="/">Back to home</Link>}
      backHref="/"
      backLabel="Back to home"
      theme={theme}
      onThemeChange={setTheme}
    />
  );
}
