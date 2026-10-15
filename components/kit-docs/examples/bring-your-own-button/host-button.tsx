"use client";

import { forwardRef, useState, type CSSProperties } from "react";
import { LoaderCircle, Share, SquarePen, Star } from "lucide-react";
import { motion } from "motion/react";
import {
  AnswerActions,
  Approval,
  ChatHeader,
  ComponentsProvider,
  EmptyState,
  type Decision,
  type KitButtonProps,
  type Verdict,
} from "inline-chat-kit";

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

function Pieces() {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<Verdict | null>("up");

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <ChatHeader
        title="Q3 hiring plan"
        size="s"
        landmark={false}
        collapseActionsAt={false}
        actions={[
          // `variant` on an action: the one that should stand out.
          { id: "new", label: "New chat", icon: <SquarePen size={14} aria-hidden />, variant: "primary" },
          { id: "star", label: "Favourite", icon: <Star size={14} aria-hidden />, active: true },
          { id: "share", label: "Share", icon: <Share size={14} aria-hidden /> },
        ]}
      />
      <EmptyState
        title="Plan a hire"
        suggestions={["Draft a job post", "Compare two offers"]}
        onSuggestion={() => {}}
      />
      <Approval
        title="Send the offer letter"
        description="To ana.kovac@example.com"
        decision={decision}
        onDecide={setDecision}
      />
      <AnswerActions
        text="Two senior engineers in Q3, one in Q4."
        onRegenerate={() => {}}
        feedback={feedback}
        onFeedback={setFeedback}
        reveal={false}
      />
    </div>
  );
}

const label: CSSProperties = {
  margin: "0 0 12px",
  fontFamily: "var(--ick-font-mono)",
  fontSize: 11,
  color: "var(--ick-ink-faint)",
};

export default function BringYourOwnButtonHost() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 32,
        width: "100%",
      }}
    >
      <section>
        <p style={label}>Your button, from ComponentsProvider</p>
        <ComponentsProvider components={{ Button: HostButton }}>
          <Pieces />
        </ComponentsProvider>
      </section>
      <section>
        <p style={label}>Nothing provided</p>
        <Pieces />
      </section>
    </div>
  );
}
