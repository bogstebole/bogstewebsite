"use client";

import { motion } from "motion/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { CARD_SPRING } from "@/components/ui/project-card";
import { type HeroProjectKey } from "@/components/ui/hero-project-tab-bar";

interface HeroSectionProps {
  activeProject: string | null;
  onProjectClick: (key: HeroProjectKey) => void;
}

type HeroCard = {
  key: HeroProjectKey;
  icon: string;
  iconRotate?: string;
  title: string;
  subtitle: string;
  status: string;
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

function HeroProjectCard({
  card,
  interactive,
  onClick,
}: {
  card: HeroCard;
  interactive: boolean;
  onClick: () => void;
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
        paddingLeft: 30,
        paddingRight: 30,
        flexShrink: 0,
        cursor: interactive ? "pointer" : "default",
        scrollSnapAlign: "center",
      }}
    >
      {/* Header: icon + title + subtitle + status badge */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </div>

      {/* Phone frame */}
      <div
        style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          borderRadius: 18,
          overflow: "hidden",
          backgroundColor: "var(--color-bg-page)",
          border: "1px solid var(--color-border-soft)",
          flexShrink: 0,
          position: "relative",
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

export function HeroSection({ activeProject, onProjectClick }: HeroSectionProps) {
  const { isMobile } = useBreakpoint();
  const interactive = activeProject === null;

  return (
    <div
      style={{
        marginTop: 60,
        width: "100%",
        display: "flex",
        gap: 18,
        alignItems: "center",
        ...(isMobile
          ? {
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingInline: 24,
              boxSizing: "border-box",
            }
          : {
              justifyContent: "center",
              flexWrap: "wrap",
              paddingInline: 24,
              boxSizing: "border-box",
            }),
      }}
    >
      {HERO_CARDS.map((card) => (
        <HeroProjectCard
          key={card.key}
          card={card}
          interactive={interactive}
          onClick={() => onProjectClick(card.key)}
        />
      ))}
    </div>
  );
}
