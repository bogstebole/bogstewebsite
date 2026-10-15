"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import "inline-chat-kit/styles.css";
import { Logo } from "@/components/ui/logo";
import { useReviewBase } from "@/hooks/useReviewBase";
import { docsHref } from "@/components/kit-docs/nav";
import { readDocsTheme, writeDocsTheme } from "@/components/kit-docs/theme";

/* Drawn on the client only. The kit gives each turn a random id when it is
   created, so a chat rendered on the server and again in the browser starts
   with two different ids and hydration fails on the first one. The landing
   page used to hide that: the chat was never there on the first render. */
const ChatExperienceDemo = dynamic(
  () => import("inline-chat-kit/demo").then((m) => m.ChatExperienceDemo),
  { ssr: false }
);

/**
 * The inline chat experience, which this page does not define.
 *
 * It used to: 890 lines of it, plus a 306-line stylesheet, a 140-line one for
 * the landing page, a banner, and 537 lines of scripted answers. All of it a
 * copy of what the playground had, and all of it drifting. Every fix went into
 * one copy. The header rendered see-through here because this copy never
 * defined `--bg`. The empty state snapped out of existence because this copy
 * never got the `AnimatePresence`. A sent message stayed pinned to the top for
 * the whole session because this copy never got the released anchor.
 *
 * It comes from the package now (`inline-chat-kit/demo`), so a fix arrives by
 * `npm install` rather than by being made twice. What is left here is what is
 * genuinely this site's: the mark at the top, where "back" goes, and the theme
 * it starts in.
 *
 * The landing page the kit puts in front of the chat is skipped: the docs one
 * level up are that page now, and their "Try the demo" button is the way in.
 * "Back" returns to them.
 */
export default function InlineChatExperienceDemoPage() {
  /* This site's own dark mode is a class on the root element, and the chat is
     drawn in the kit's own theme regardless, so the class is lifted for the
     length of the visit and put back on the way out. Nothing to do with the kit's theme, which is
     `data-theme` and is handed down below. */
  useEffect(() => {
    const wasDark = document.documentElement.classList.contains("dark");
    if (wasDark) document.documentElement.classList.remove("dark");
    return () => {
      if (wasDark) document.documentElement.classList.add("dark");
    };
  }, []);

  /* Starts in whatever the docs were last read in, light if they never were,
     and the header's toggle moves it. It also remembers it, so going back to
     the docs keeps it too. */
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading storage that the server cannot see
    setTheme(readDocsTheme());
  }, []);
  const changeTheme = (next: "light" | "dark") => {
    setTheme(next);
    writeDocsTheme(next);
  };

  // "Back" returns to the docs, in whichever copy of the site this page was reached from.
  const docs = docsHref(useReviewBase(), "");

  return (
    <ChatExperienceDemo
      skipIntro
      logo={<Logo />}
      back={<Link href={docs}>Back to docs</Link>}
      backHref={docs}
      backLabel="Back to docs"
      theme={theme}
      onThemeChange={changeTheme}
    />
  );
}
