"use client";

import { forwardRef, useState, type CSSProperties } from "react";
import { LoaderCircle, Share } from "lucide-react";
import { motion } from "motion/react";
import { ChatExperience, type KitButtonProps, type SendHandler } from "inline-chat-kit";

type Look = "default" | "outline" | "secondary" | "ghost";

/* The kit's variant is a hint. The role is what a design system cares about:
   here an opener is an outline chip, and "Allow once" is the primary. */
function pick({ kitRole, variant }: Pick<KitButtonProps, "kitRole" | "variant">): Look {
  switch (kitRole) {
    case "suggestion":
    case "approval-always":
      return "outline";
    case "approval-once":
      return "default";
    case "approval-deny":
    case "answer-action":
    case "header-menu-item":
      return "ghost";
  }
  return variant === "primary" ? "default" : variant === "outline" ? "outline" : "ghost";
}

/* A shadcn-style button: a 6px corner, a solid primary, a ring on keyboard
   focus. The colours read the page's ink and paper so the example follows
   this site's theme; yours come from your design system. */
const ink = "rgb(var(--ick-ink-rgb))";
const paper = "rgb(var(--ick-paper-rgb))";
const wash = (alpha: number) => `rgb(var(--ick-ink-rgb) / ${alpha})`;

const LOOKS: Record<Look, { rest: CSSProperties; hover: CSSProperties }> = {
  default: { rest: { background: ink, color: paper }, hover: { background: wash(0.85) } },
  outline: {
    rest: { background: paper, color: ink, borderColor: wash(0.15), boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)" },
    hover: { background: wash(0.05) },
  },
  secondary: { rest: { background: wash(0.06), color: ink }, hover: { background: wash(0.1) } },
  ghost: { rest: { background: "transparent", color: ink }, hover: { background: wash(0.06) } },
};

/**
 * The adapter you write once: the kit's words in, your button out. It
 * forwards its ref, renders a real <button>, and spreads everything it does
 * not use onto it.
 */
const HostButton = forwardRef<HTMLButtonElement, KitButtonProps>(function HostButton(
  { kitRole, variant, size, shape, icon, iconRight, loading, pressed, children, ...rest },
  ref
) {
  const [hover, setHover] = useState(false);
  const [focusRing, setFocusRing] = useState(false);
  const look = LOOKS[pick({ kitRole, variant })];
  const small = size === "xs" || size === "s";

  return (
    <button
      {...rest}
      ref={ref}
      onPointerEnter={(event) => {
        setHover(true);
        rest.onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHover(false);
        rest.onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        setFocusRing(event.currentTarget.matches(":focus-visible"));
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocusRing(false);
        rest.onBlur?.(event);
      }}
      style={{
        // No height: the kit sizes the box this button fills, and an inline
        // height would win over it.
        display: "inline-flex",
        alignItems: "center",
        justifyContent: kitRole === "header-menu-item" ? "flex-start" : "center",
        gap: small ? 6 : 8,
        padding: shape === "square" ? 0 : kitRole === "header-menu-item" ? "0 8px" : small ? "0 12px" : "0 16px",
        margin: 0,
        border: "1px solid transparent",
        borderRadius: 6,
        font: `500 ${small ? 13 : 14}px/1 ui-sans-serif, system-ui, sans-serif`,
        whiteSpace: "nowrap",
        cursor: rest.disabled ? "not-allowed" : "pointer",
        opacity: rest.disabled && !loading ? 0.5 : 1,
        outline: "none",
        transition: "background-color 150ms, box-shadow 150ms, border-color 150ms",
        ...look.rest,
        ...(pressed ? { background: wash(0.12) } : null),
        ...(hover && !rest.disabled ? look.hover : null),
        ...(focusRing ? { borderColor: wash(0.4), boxShadow: `0 0 0 3px ${wash(0.2)}` } : null),
      }}
    >
      {loading ? (
        <motion.span
          aria-hidden
          style={{ display: "inline-flex" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        >
          <LoaderCircle size={14} />
        </motion.span>
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  );
});

const ANSWERS: Record<string, string> = {
  "Draft a job post":
    "**Senior backend engineer, payments.** You will own the ledger service end to end: its schema, its " +
    "on-call, and the migration off the monolith. Five years with Postgres at scale, and a habit of writing " +
    "things down.",
  "Compare two offers":
    "The second offer is stronger over four years: the base is 4% lower, but the equity vests monthly " +
    "after the first year instead of annually, and the refresh grant is written into the contract.",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const reply: SendHandler = async function* (message, { signal }) {
  const answer = ANSWERS[message] ?? "This preview knows two answers. Press one of the openers.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(28);
    yield word;
  }
};

/* The send glyph stays the kit's, so tell the tokens what the button looks
   like: the same corner, the same primary. The composer around it becomes
   6 + 8 = 14px, concentric. */
const tokens = {
  "--ick-btn-radius": "6px",
  "--ick-btn-primary-bg": "rgb(var(--ick-ink-rgb))",
  "--ick-btn-primary-ink": "rgb(var(--ick-paper-rgb))",
  "--ick-btn-primary-border": "transparent",
  "--ick-btn-primary-shadow": "none",
  "--ick-btn-primary-shadow-hover": "none",
  "--ick-btn-primary-shadow-press": "none",
} as CSSProperties;

/* Declared once, outside any render: a component made inside one is a new
   component every time, and every button in the chat would remount with it. */
const components = { Button: HostButton };

export default function BringYourOwnButtonInTheChat() {
  return (
    <div style={{ ...tokens, position: "relative", height: 560, overflow: "hidden" }}>
      <ChatExperience
        onSend={reply}
        fill="container"
        title="Hiring"
        components={components}
        empty={{
          title: "Plan a hire",
          description: "Openers, header, answer actions and the composer's controls are your button.",
          suggestions: Object.keys(ANSWERS),
        }}
        actions={[{ id: "share", label: "Share", icon: <Share size={16} aria-hidden /> }]}
        // The page around this chat has its own theme switch.
        headerActions={false}
      />
    </div>
  );
}
