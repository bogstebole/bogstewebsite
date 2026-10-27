"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import GlassButton from "@/components/ui/Glassmorphic Button Breakdown";
import glass from "@/components/ui/GlassButton.module.css";
import { X_ICON } from "@/components/ui/modal-shell";
import styles from "./tripup.module.css";
import type { LinkNote } from "./types";

// Quick to arrive, soft to settle. Out a little faster than in.
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const IN = { duration: 0.2, ease: EASE_OUT };
const OUT = { duration: 0.15, ease: EASE_OUT };

/**
 * A link's button that opens a short note instead of leaving the site: what to
 * know first, then a button on to the link and, when there is one, a button to
 * the video. The card is the site's modal card (modal-shell.tsx), centred at
 * every width; it fades in from a slightly smaller size, and with reduced
 * motion only fades. Esc or a click outside closes it, and focus goes back to
 * the button that opened it.
 */
export function NoteLink({
  href,
  label,
  note,
  className,
  children,
}: {
  href: string;
  label: string;
  note: LinkNote;
  className: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const titleId = useId();
  const from = reduced ? 1 : 0.96;

  useEffect(() => {
    if (!open) return;
    const back = button.current;
    // The way on gets the focus, so Enter goes on
    card.current?.querySelector<HTMLElement>("[data-go]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      // Tab goes round the note, not out to the page behind it
      if (e.key !== "Tab" || !card.current) return;
      const all = [...card.current.querySelectorAll<HTMLElement>("a[href], button")];
      const first = all[0];
      const last = all[all.length - 1];
      const at = document.activeElement;
      if (!card.current.contains(at) || (e.shiftKey ? at === first : at === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      back?.focus({ preventScroll: true });
    };
  }, [open]);

  // Closes the note and plays the video at the top of the page
  const watch = () => {
    setOpen(false);
    const video = document.querySelector<HTMLVideoElement>("#video video");
    if (!video) return;
    video.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    video.play().catch(() => {});
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.noteBackdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: IN }}
                exit={{ opacity: 0, transition: OUT }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  ref={card}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  className={styles.noteCard}
                  initial={{ opacity: 0, scale: from }}
                  animate={{ opacity: 1, scale: 1, transition: IN }}
                  exit={{ opacity: 0, scale: from, transition: OUT }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.noteHead}>
                    <h2 id={titleId} className={styles.noteTitle}>
                      {note.title}
                    </h2>
                    <GlassButton size="s" onClick={() => setOpen(false)} aria-label="Close">
                      {X_ICON}
                    </GlassButton>
                  </div>

                  {note.text && <p className={styles.noteText}>{note.text}</p>}
                  {note.points && (
                    <ul className={styles.notePoints}>
                      {note.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.noteActions}>
                    <a
                      data-go
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${glass.glassBtn} ${glass.sizeM}`}
                      onClick={() => setOpen(false)}
                    >
                      {note.go}
                      <ArrowUpRight size={16} aria-hidden />
                    </a>
                    {note.video && (
                      <button
                        type="button"
                        className={`${glass.glassBtn} ${glass.sizeM} ${glass.ghost}`}
                        onClick={watch}
                      >
                        <Play size={14} aria-hidden />
                        {note.video}
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
