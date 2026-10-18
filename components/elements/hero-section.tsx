"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ComingSoonModal } from "@/components/ui/coming-soon-modal";
import { ClipDetailModal, type ClipDetail } from "@/components/ui/clip-detail-modal";
import { CARD_SPRING } from "@/components/ui/project-card";
import { type HeroProjectKey } from "@/components/ui/project-tab-bar";
import { useHover } from "@/components/ui/hover-context";
import { useReviewBase } from "@/hooks/useReviewBase";

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
  /** Live on the App Store: the status chip carries the store's mark. */
  appStore?: boolean;
  media: { type: "video" | "image"; src: string };
};

const HERO_CARDS: HeroCard[] = [
  {
    key: "heroNotes",
    icon: "/images/notes.png",
    title: "Notes",
    subtitle: "Canvas based notes",
    status: "On App Store",
    appStore: true,
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

/** A Mac app, so it records as a landscape desktop rather than a phone screen. */
const DAYSIDE_CARD: HeroCard = {
  key: "heroDayside",
  icon: "/images/globe.png",
  title: "Dayside",
  subtitle: "Friends' time zones",
  status: "On App Store",
  appStore: true,
  media: { type: "video", src: "/assets/Dayside/dayside-showcase.mp4" },
};

const DAYSIDE_RATIO = "1520 / 1424";

const PHONE_WIDTH = 171;
const PHONE_HEIGHT = 372;
const PHONE_RATIO = `${PHONE_WIDTH} / ${PHONE_HEIGHT}`;
const CARD_PADDING_X = 30;
const CLIP_PADDING = 14;
const HERO_GAP = 18;
const HERO_MARGIN_X = 32;
// Past this the rows only get taller, so the grid stops growing and centres.
const HERO_MAX_WIDTH = 1200;

// Mobile scrolls the app cards sideways at a fixed width.
const HERO_COL = PHONE_WIDTH + CARD_PADDING_X * 2;

/** "w / h" as a number, so a tile can claim width in proportion to its media. */
const ratioOf = (r: string) => {
  const [w, h] = r.split("/").map(Number);
  return w / h;
};

// Every desktop row is justified. A tile starts from its fixed horizontal padding
// and takes the rest of the row in proportion to its media ratio, so all media in
// a row end up the same height and the row fills the width edge to edge.
const justify = (ratio: string, paddingX: number): React.CSSProperties => ({
  flexGrow: ratioOf(ratio),
  flexShrink: 1,
  flexBasis: paddingX * 2,
  minWidth: 0,
  boxSizing: "border-box",
});

const INLINE_CHAT_CARD: Omit<HeroCard, "key"> = {
  title: "Inline Chat Kit",
  subtitle: "AI chat components",
  status: "Component library",
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
 * do the work, lifted from the source, not written to look like it.
 */
const DETAIL_CLIPS: ClipDetail[] = [
  {
    src: "/assets/Showcase/project-tab-switch.mp4",
    ratio: "720 / 720",
    title: "Project tab switcher",
    description:
      "Three projects, one panel. The pill is a single element travelling between tabs rather than three fading in and out, so the switch reads as one thing moving. It stretches from whichever edge it left and squashes back on arrival, and that overshoot is what makes it feel liquid instead of mechanical.",
    codeSource: "components/ui/project-tab-bar.tsx",
    code: `<motion.div
  layoutId="active-project-tab-indicator" // one pill, shared by every tab
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
      "The actions don't sit there waiting to be used. The composer measures the text against the room it has left, and once the line is 92% full they step out so the text can take the whole row, then come back underneath once it wraps. Returning needs the line to fall to 75%, not 92%: the gap between those two numbers is what keeps them from flickering while you type around the edge.",
    codeSource: "inline-chat-kit, src/ChatInput/ChatInput.tsx",
    code: `const textW  = measureSpan.offsetWidth;
const availW = editor.clientWidth - 16;

if (isMultiline || textW >= availW * wrap.nearThreshold) {
  setShowButtons(false);  // 0.92: the text is crowding them
} else if (!wrappedNow && textW < availW * wrap.exitThreshold) {
  setShowButtons(true);   // 0.75: clear again, bring them back
}`,
  },
  {
    src: "/assets/Vorli/dashboard-months.mp4",
    ratio: "880 / 800",
    title: "Month switcher",
    description:
      "The month sits in a pill above the total. Move to another one and the number, the chart and the pill travel together, while the dots beside the pill show how far back you have gone. Once you leave the current month a tab appears on the right edge and takes you straight back to it.",
  },
  {
    src: "/assets/Showcase/add-button.mp4",
    ratio: "916 / 702",
    title: "Fan-out menu",
    description:
      "An exploration of what a dropdown could be when it doesn't have to be a list. Each card carries its own angle, springs out on a stagger, and leans toward the pointer on hover. It doesn't scale, since past a handful of items a fan is worse than a list, but for a few simple choices it's a nicer thing to open.",
    codeSource: "inline-chat-kit, src/ChatInput/AddCardsOverlay.tsx",
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
  {
    src: "/assets/Dayside/dayside-widget.mp4",
    ratio: "1120 / 852",
    title: "Dayside widget",
    description:
      "Booking a call, written as a sentence: a date, at a time, with you. Each part is a tab, and the active one fuses with the panel beneath it, so the calendar, the time slots and the form each open from the word they belong to.",
  },
  {
    src: "/assets/Showcase/latching-buttons.mp4",
    ratio: "1180 / 878",
    title: "Latching buttons",
    description:
      "Toggle buttons that behave like physical ones. Press one and it stays down and lit, press it again and it rises back up. Only one can be held at a time, so pressing another releases the one that was down.",
  },
];

export type ShowcaseKey = "showcaseInlineChat" | "showcaseInspector";

export type ShowcaseTile = {
  kind: "showcase";
  key: ShowcaseKey;
  card: Omit<HeroCard, "key">;
  ratio: string;
  href?: string;
  comingSoon?: string;
};

/** A tile is either a project card that opens a detail, or a showcase that routes away. */
type HeroTile =
  | { kind: "app"; card: HeroCard; ratio: string }
  | ShowcaseTile
  | { kind: "clip"; clip: ClipDetail };

const INLINE_CHAT_TILE: ShowcaseTile = {
  kind: "showcase",
  key: "showcaseInlineChat",
  card: INLINE_CHAT_CARD,
  href: "/inline-chat-experience",
  ratio: "1120 / 680",
};

const INSPECTOR_TILE: ShowcaseTile = {
  kind: "showcase",
  key: "showcaseInspector",
  card: INSPECTOR_CARD,
  ratio: "1280 / 800",
  comingSoon:
    "A visual editor for designers who are vibecoding. Instead of describing a change to your agent, you make it yourself and copy the config out, and the agent then applies every change in one pass. The side panel works much like Figma's, with extras for the things only the web can do.",
};

export const SHOWCASE_TILES: ShowcaseTile[] = [INLINE_CHAT_TILE, INSPECTOR_TILE];

// The cards the project list can point at. Hovering one of these in the list
// dims every other tile in the grid.
const SPOTLIGHT_KEYS = new Set<string>([
  ...HERO_CARDS.map((c) => c.key),
  DAYSIDE_CARD.key,
  ...SHOWCASE_TILES.map((t) => t.key),
]);
const DIMMED_OPACITY = 0.2;

// One row per kind of work: shipped apps, experiments, then interaction details.
// The details run over two rows, split so both end up a similar height.
const HERO_ROWS: HeroTile[][] = [
  [
    ...HERO_CARDS.map((card): HeroTile => ({ kind: "app", card, ratio: PHONE_RATIO })),
    { kind: "app", card: DAYSIDE_CARD, ratio: DAYSIDE_RATIO },
  ],
  SHOWCASE_TILES,
  DETAIL_CLIPS.slice(0, 3).map((clip): HeroTile => ({ kind: "clip", clip })),
  DETAIL_CLIPS.slice(3).map((clip): HeroTile => ({ kind: "clip", clip })),
];

function HeroProjectCard({
  card,
  interactive,
  onClick,
  dimmed,
  frame,
  style,
}: {
  card: Omit<HeroCard, "key">;
  interactive: boolean;
  onClick: () => void;
  /** Faded back because the project list is pointing at another card. */
  dimmed?: boolean;
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
        opacity: dimmed ? DIMMED_OPACITY : 1,
        transition: "opacity 0.2s ease",
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
              fontWeight: 500,
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
              gap: 4,
              backgroundColor: "var(--color-bg-skeleton)",
              borderRadius: 4,
              paddingLeft: card.appStore ? 3 : 6,
              paddingRight: 6,
              paddingBlock: 2,
            }}
          >
            {card.appStore && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/app-store-icon.png"
                alt=""
                style={{ width: 13, height: 13, objectFit: "cover", flexShrink: 0, rotate: "6.64deg" }}
              />
            )}
            {/* Tertiary ink, not the label grey: 10px text needs 4.5:1, and the
                grey gave 4.2 on this chip (7.4 now, 7.1 in dark). */}
            <span
              style={{
                fontFamily: '"JetBrains Mono", system-ui, sans-serif',
                fontSize: 10,
                lineHeight: 1.3,
                letterSpacing: "-0.04em",
                color: "var(--color-text-tertiary)",
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
                  color: "var(--color-text-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                {card.note}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Media frame, phone-shaped unless the card overrides it */}
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

function ClipTile({
  clip,
  onOpen,
  dimmed,
  style,
}: {
  clip: ClipDetail;
  onOpen: () => void;
  dimmed?: boolean;
  style?: React.CSSProperties;
}) {
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
        padding: CLIP_PADDING,
        width: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
        opacity: dimmed ? DIMMED_OPACITY : 1,
        transition: "opacity 0.2s ease",
        ...style,
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
  const reviewBase = useReviewBase();
  const interactive = activeProject === null;
  const [soon, setSoon] = useState<{ title: string; message: string } | null>(null);
  const [clip, setClip] = useState<ClipDetail | null>(null);

  // A project hovered in the list keeps its own card lit and fades the rest.
  const { hoveredKey } = useHover();
  const spotlight = hoveredKey !== null && SPOTLIGHT_KEYS.has(hoveredKey) ? hoveredKey : null;
  const isDimmed = (key?: string) => spotlight !== null && key !== spotlight;

  const openTile = (t: ShowcaseTile) => () => {
    if (t.href) router.push(reviewBase + t.href);
    else if (t.comingSoon) setSoon({ title: t.card.title, message: t.comingSoon });
  };

  const tile = (t: HeroTile, key: string) =>
    t.kind === "clip" ? (
      <ClipTile
        key={key}
        clip={t.clip}
        onOpen={() => setClip(t.clip)}
        dimmed={isDimmed()}
        style={justify(t.clip.ratio, CLIP_PADDING)}
      />
    ) : t.kind === "app" ? (
      <HeroProjectCard
        key={key}
        card={t.card}
        interactive={interactive}
        onClick={() => onProjectClick(t.card.key)}
        dimmed={isDimmed(t.card.key)}
        style={justify(t.ratio, CARD_PADDING_X)}
        frame={{ aspectRatio: t.ratio }}
      />
    ) : (
      <HeroProjectCard
        key={key}
        card={t.card}
        interactive={interactive}
        onClick={openTile(t)}
        dimmed={isDimmed(t.key)}
        style={justify(t.ratio, CARD_PADDING_X)}
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

        <div style={{ width: "100%", paddingInline: 24, boxSizing: "border-box" }}>
          <HeroProjectCard
            card={DAYSIDE_CARD}
            interactive={interactive}
            onClick={() => onProjectClick(DAYSIDE_CARD.key)}
            style={{ width: "100%", boxSizing: "border-box" }}
            frame={{ aspectRatio: DAYSIDE_RATIO }}
          />
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
        maxWidth: HERO_MAX_WIDTH + HERO_MARGIN_X * 2,
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        rowGap: HERO_GAP,
        paddingInline: HERO_MARGIN_X,
        boxSizing: "border-box",
      }}
    >
      {HERO_ROWS.map((row, i) => (
        <div key={i} style={{ display: "flex", columnGap: HERO_GAP }}>
          {row.map((t, j) => tile(t, `${i}-${j}`))}
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
