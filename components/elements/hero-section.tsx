"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ComingSoonModal } from "@/components/ui/coming-soon-modal";
import { ClipDetailModal, type ClipDetail } from "@/components/ui/clip-detail-modal";
import { CARD_SPRING } from "@/components/ui/project-card";
import { type HeroProjectKey } from "@/components/ui/hero-project-tab-bar";

interface HeroSectionProps {
  activeProject: string | null;
  onProjectClick: (key: HeroProjectKey) => void;
}

type HeroCard = {
  key: HeroProjectKey;
  icon?: string;
  iconRotate?: string;
  title: string;
  subtitle: string;
  status: string;
  /** Secondary chip, for what the card is about to become rather than what it is. */
  note?: string;
  media: { type: "video" | "image"; src: string };
};

const HERO_CARDS: HeroCard[] = [
  {
    key: "heroNotes",
    icon: "/images/notes.png",
    title: "Notes",
    subtitle: "Canvas based notes",
    status: "On app store",
    media: { type: "video", src: "/assets/Useless Notes/Da bomb.MP4" },
  },
  {
    key: "heroReceipt",
    icon: "/images/receipt.png",
    iconRotate: "359.41deg",
    title: "Receipt tracker",
    subtitle: "Finance tracker",
    status: "Waiting approval",
    media: { type: "video", src: "/assets/Hero/receipt-recording.mp4" },
  },
  {
    key: "heroRuntronome",
    icon: "/images/runtronome.png",
    title: "Runtronome",
    subtitle: "Running assistant",
    status: "Internal beta",
    media: { type: "video", src: "/assets/Hero/runtronome.mp4" },
  },
];

const PHONE_WIDTH = 171;
const PHONE_HEIGHT = 372;
const CARD_PADDING_X = 30;
const HERO_GAP = 18;

// One column grid carries both card shapes. An app card is a single column; a
// showcase card spans three — and 3 * 231 + 2 * 18 lands on exactly the 729 the
// showcase card already was, so neither shape has to be reproportioned to fit.
const HERO_COL = PHONE_WIDTH + CARD_PADDING_X * 2;
const SHOWCASE_SPAN = 3;
const SHOWCASE_WIDTH = HERO_COL * SHOWCASE_SPAN + HERO_GAP * (SHOWCASE_SPAN - 1);
// The widest row — app + app + showcase — sets the grid's full width.
const BENTO_WIDTH = HERO_COL * 2 + HERO_GAP * 2 + SHOWCASE_WIDTH;

// Widths are expressed against that total so the whole grid scales as one piece
// and every tile holds its ratio. Card padding stays fixed, so below BENTO_WIDTH
// the tiles drift a little off their exact ratio — negligible on a desktop, and
// the mobile branch below never gets here.
const col = (px: number) => `${((px / BENTO_WIDTH) * 100).toFixed(4)}%`;

const INLINE_CHAT_CARD: Omit<HeroCard, "key"> = {
  title: "Inline Chat Input",
  subtitle: "UI showcase",
  status: "Experiment",
  media: { type: "video", src: "/assets/Video inlin chat/showcase2.mp4" },
};

const INSPECTOR_CARD: Omit<HeroCard, "key"> = {
  title: "Visual QA Inspector",
  subtitle: "Visual editor",
  status: "Experiment",
  note: "Demo soon",
  media: { type: "video", src: "/assets/Video inspector/inspector-showcase.mp4" },
};

/**
 * Interaction details that loop next to the showcase cards. Each tile opens
 * into the same recording with room to read it, plus the lines that actually
 * do the work — lifted from the source, not written to look like it.
 */
const DETAIL_CLIPS: ClipDetail[] = [
  {
    src: "/assets/Showcase/project-tab-switch.mp4",
    ratio: "720 / 720",
    title: "Project tab switcher",
    description:
      "Three projects, one panel. The pill is a single element travelling between tabs rather than three fading in and out, so the switch reads as one thing moving. It stretches from whichever edge it left and squashes back on arrival — that overshoot is what makes it feel liquid instead of mechanical.",
    codeSource: "components/ui/hero-project-tab-bar.tsx",
    code: `<motion.div
  layoutId="active-hero-tab-indicator"   // one pill, shared by every tab
  animate={{ scaleY: [1, 1.4, 1] }}      // squash on arrival
  style={{ transformOrigin }}            // set from the direction it came
  transition={{
    scaleY: { duration: 0.35, ease: "easeOut" },
    layout: { type: "spring", stiffness: 350, damping: 25, mass: 1 },
  }}
/>`,
  },
  {
    src: "/assets/Showcase/input-interaction.mp4",
    ratio: "1116 / 416",
    title: "Actions that step aside",
    description:
      "The actions don't sit there waiting to be used. The composer measures the text against the room it has left, and once the line is 92% full they step out so the text can take the whole row — then come back underneath once it wraps. Returning needs the line to fall to 75%, not 92%: the gap between those two numbers is what keeps them from flickering while you type around the edge.",
    codeSource: "inline-chat-kit — src/ChatInput/ChatInput.tsx",
    code: `const textW  = measureSpan.offsetWidth;
const availW = editor.clientWidth - 16;

if (isMultiline || textW >= availW * wrap.nearThreshold) {
  setShowButtons(false);  // 0.92 — the text is crowding them
} else if (!wrappedNow && textW < availW * wrap.exitThreshold) {
  setShowButtons(true);   // 0.75 — clear again, bring them back
}`,
  },
  {
    src: "/assets/Showcase/add-button.mp4",
    ratio: "916 / 702",
    title: "Fan-out menu",
    description:
      "An exploration of what a dropdown could be when it doesn't have to be a list. Each card carries its own angle, springs out on a stagger, and leans toward the pointer on hover. It doesn't scale — past a handful of items a fan is worse than a list — but for a few simple choices it's a nicer thing to open.",
    codeSource: "inline-chat-kit — src/ChatInput/AddCardsOverlay.tsx",
    code: `const angles = [angle1, angle2, angle3];   // 0, -25, -50

<motion.button
  animate={{ rotate: angles[i], width: 160 }}
  whileHover={{ width: 160 + hoverPull }}   // leans toward the pointer
  transition={{
    delay: i * staggerDelay,
    type: "spring", stiffness: 800, damping: 41,
  }}
/>`,
  },
];

/** A tile is either a project card that opens a detail, or a showcase that routes away. */
type HeroTile =
  | { kind: "app"; card: HeroCard }
  | { kind: "showcase"; card: Omit<HeroCard, "key">; ratio: string; href?: string; comingSoon?: string }
  | { kind: "clips"; clips: ClipDetail[] };

const INLINE_CHAT_TILE: HeroTile = {
  kind: "showcase",
  card: INLINE_CHAT_CARD,
  href: "/inline-chat-experience",
  ratio: "1120 / 680",
};

const INSPECTOR_TILE: HeroTile = {
  kind: "showcase",
  card: INSPECTOR_CARD,
  ratio: "1280 / 800",
  comingSoon:
    "A visual editor for designers who are vibecoding. Instead of describing a change to your agent, you make it yourself and copy the config out — the agent then applies every change in one pass. The side panel works much like Figma's, with extras for the things only the web can do.",
};

const CLIPS_TILE: HeroTile = { kind: "clips", clips: DETAIL_CLIPS };

const SHOWCASE_TILES = [INLINE_CHAT_TILE, INSPECTOR_TILE];

// Four columns over five. Swapping the two showcase tiles is the single edit that
// decides which experiment is visible without scrolling.
const HERO_ROWS: HeroTile[][] = [
  [{ kind: "app", card: HERO_CARDS[0] }, INLINE_CHAT_TILE, CLIPS_TILE],
  [{ kind: "app", card: HERO_CARDS[1] }, { kind: "app", card: HERO_CARDS[2] }, INSPECTOR_TILE],
];

function HeroProjectCard({
  card,
  interactive,
  onClick,
  frame,
  style,
}: {
  card: Omit<HeroCard, "key">;
  interactive: boolean;
  onClick: () => void;
  /** Overrides the default phone-shaped media frame. */
  frame?: React.CSSProperties;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      whileHover={interactive ? { y: -8 } : undefined}
      whileTap={interactive ? { scale: 0.985 } : undefined}
      transition={CARD_SPRING}
      onClick={interactive ? onClick : undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 19,
        backgroundColor: "var(--color-bg-container)",
        borderRadius: 48,
        paddingTop: 36,
        paddingBottom: 30,
        paddingLeft: CARD_PADDING_X,
        paddingRight: CARD_PADDING_X,
        flexShrink: 0,
        cursor: interactive ? "pointer" : "default",
        scrollSnapAlign: "center",
        ...style,
      }}
    >
      {/* Header: icon + title + subtitle + status badge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {card.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.icon}
            alt={card.title}
            style={{
              width: 20,
              height: 20,
              objectFit: "cover",
              flexShrink: 0,
              rotate: card.iconRotate,
              transformOrigin: "50% 50%",
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: 14,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "var(--color-text-card)",
              whiteSpace: "nowrap",
            }}
          >
            {card.title}
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: 12,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "var(--color-text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {card.subtitle}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-bg-skeleton)",
              borderRadius: 4,
              paddingInline: 6,
              paddingBlock: 2,
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 10,
                lineHeight: 1.3,
                letterSpacing: "-0.04em",
                color: "var(--color-text-label)",
                whiteSpace: "nowrap",
              }}
            >
              {card.status}
            </span>
          </div>

          {/* Outlined rather than filled: the status is what the thing is, the
              note is what it is about to become. */}
          {card.note && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--color-border-soft)",
                borderRadius: 4,
                paddingInline: 6,
                paddingBlock: 1,
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                  fontSize: 10,
                  lineHeight: 1.3,
                  letterSpacing: "-0.04em",
                  color: "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {card.note}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Media frame — phone-shaped unless the card overrides it */}
      <div
        style={{
          width: "100%",
          aspectRatio: `${PHONE_WIDTH} / ${PHONE_HEIGHT}`,
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "var(--color-bg-page)",
          border: "1px solid var(--color-border-soft)",
          flexShrink: 0,
          position: "relative",
          ...frame,
        }}
      >
        {card.media.type === "video" ? (
          <video
            src={encodeURI(card.media.src)}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={encodeURI(card.media.src)}
            alt={card.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
    </motion.div>
  );
}

function ClipTile({ clip, onOpen }: { clip: ClipDetail; onOpen: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={CARD_SPRING}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      aria-label={clip.title}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{
        cursor: "pointer",
        backgroundColor: "var(--color-bg-container)",
        borderRadius: 36,
        padding: 14,
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: clip.ratio,
          borderRadius: 22,
          overflow: "hidden",
          backgroundColor: "var(--color-bg-page)",
          border: "1px solid var(--color-border-soft)",
          boxSizing: "border-box",
        }}
      >
        <video
          src={encodeURI(clip.src)}
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </motion.div>
  );
}

export function HeroSection({ activeProject, onProjectClick }: HeroSectionProps) {
  const { isMobile } = useBreakpoint();
  const router = useRouter();
  const interactive = activeProject === null;
  const [soon, setSoon] = useState<{ title: string; message: string } | null>(null);
  const [clip, setClip] = useState<ClipDetail | null>(null);

  const openTile = (t: Extract<HeroTile, { kind: "showcase" }>) => () => {
    if (t.href) router.push(t.href);
    else if (t.comingSoon) setSoon({ title: t.card.title, message: t.comingSoon });
  };

  const clipColumn = (clips: ClipDetail[], key: string, width: string) => (
    <div
      key={key}
      style={{
        width,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        rowGap: HERO_GAP,
      }}
    >
      {clips.map((c) => (
        <ClipTile key={c.src} clip={c} onOpen={() => setClip(c)} />
      ))}
    </div>
  );

  const tile = (t: HeroTile, key: string, width: string) =>
    t.kind === "clips" ? (
      clipColumn(t.clips, key, width)
    ) : t.kind === "app" ? (
      <HeroProjectCard
        key={key}
        card={t.card}
        interactive={interactive}
        onClick={() => onProjectClick(t.card.key)}
        style={{ width, boxSizing: "border-box" }}
      />
    ) : (
      <HeroProjectCard
        key={key}
        card={t.card}
        interactive={interactive}
        onClick={openTile(t)}
        style={{ width, boxSizing: "border-box" }}
        frame={{ aspectRatio: t.ratio }}
      />
    );

  if (isMobile) {
    return (
      <>
      <div
        style={{
          marginTop: 60,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: HERO_GAP,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: HERO_GAP,
            alignItems: "center",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingInline: 24,
            boxSizing: "border-box",
          }}
        >
          {HERO_CARDS.map((card) => (
            <HeroProjectCard
              key={card.key}
              card={card}
              interactive={interactive}
              onClick={() => onProjectClick(card.key)}
              style={{ width: HERO_COL, boxSizing: "border-box" }}
            />
          ))}
        </div>

        {SHOWCASE_TILES.map((t) => (
          <div
            key={t.card.title}
            style={{ width: "100%", paddingInline: 24, boxSizing: "border-box" }}
          >
            <HeroProjectCard
              card={t.card}
              interactive={interactive}
              onClick={openTile(t)}
              style={{ width: "100%", boxSizing: "border-box" }}
              frame={{ aspectRatio: t.ratio }}
            />
          </div>
        ))}

        {DETAIL_CLIPS.map((c) => (
          <div key={c.src} style={{ width: "100%", paddingInline: 24, boxSizing: "border-box" }}>
            <ClipTile clip={c} onOpen={() => setClip(c)} />
          </div>
        ))}
      </div>

      <ComingSoonModal
        open={soon !== null}
        onClose={() => setSoon(null)}
        title={soon?.title ?? ""}
        message={soon?.message ?? ""}
      />

      <ClipDetailModal clip={clip} onClose={() => setClip(null)} />
      </>
    );
  }

  return (
    <>
    <div
      style={{
        marginTop: 60,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingInline: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: BENTO_WIDTH,
          display: "flex",
          flexDirection: "column",
          rowGap: HERO_GAP,
        }}
      >
        {HERO_ROWS.map((row, i) => (
          <div
            key={i}
            style={{ display: "flex", columnGap: col(HERO_GAP), alignItems: "flex-start" }}
          >
            {row.map((t, j) =>
              tile(t, `${i}-${j}`, t.kind === "showcase" ? col(SHOWCASE_WIDTH) : col(HERO_COL))
            )}
          </div>
        ))}
      </div>
    </div>

      <ComingSoonModal
        open={soon !== null}
        onClose={() => setSoon(null)}
        title={soon?.title ?? ""}
        message={soon?.message ?? ""}
      />

      <ClipDetailModal clip={clip} onClose={() => setClip(null)} />
    </>
  );
}
