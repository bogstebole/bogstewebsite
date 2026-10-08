"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout, CONTENT_ITEM, type AdjacentProject } from "./project-detail-layout";
import { NOTES_APP_STORE_URL } from "@/lib/constants";
import { HERO_PROJECT_ORDER, type HeroProjectKey } from "./hero-project-tab-bar";

interface HeroProjectDetailProps {
  activeProject: HeroProjectKey;
  onCloseStart: () => void;
  onClose: () => void;
  onOpenComplete?: () => void;
  onNavigate?: (key: HeroProjectKey) => void;
}

const NOTES_ASSETS = [
  { type: "video" as const, src: "/assets/Useless Notes/Onboarding.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/Da bomb.MP4" },
  { type: "video" as const, src: "/assets/Useless Notes/Sharing.mp4" },
  { type: "video" as const, src: "/assets/Useless Notes/card burn.MP4" },
  { type: "image" as const, src: "/assets/Useless Notes/1Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/2Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/3Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/4Uslsnts.png" },
  { type: "image" as const, src: "/assets/Useless Notes/5Uslsnts.png" },
];

const DAYSIDE_VIDEO = "/assets/Dayside/dayside.mp4";

const RECEIPT_ASSETS = [
  { type: "video" as const, src: "/assets/Hero/receipt-recording.mp4" },
  { type: "image" as const, src: "/assets/Vorli/vorli-1.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-2.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-3.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-4.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-5.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-6.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-7.webp" },
  { type: "image" as const, src: "/assets/Vorli/vorli-8.webp" },
];

const RUNTRONOME_ASSETS = [
  { type: "video" as const, src: "/assets/Hero/runtronome.mp4" },
  { type: "image" as const, src: "/assets/Runtronome/workout-idle.png" },
  { type: "image" as const, src: "/assets/Runtronome/workout-running.png" },
  { type: "image" as const, src: "/assets/Runtronome/step-picker.png" },
  { type: "image" as const, src: "/assets/Runtronome/plans.png" },
  { type: "image" as const, src: "/assets/Runtronome/garmin-sync.png" },
];

type ProjectConfig = {
  title: string;
  icon: string;
  iconRotate?: string;
  tags: string[];
  appStore?: boolean;
  downloadUrl?: string;
  shortDescription: React.ReactNode;
  longDescription: string;
};

const CONFIGS: Record<HeroProjectKey, ProjectConfig> = {
  heroNotes: {
    title: "Notes",
    icon: "/images/notes.png",
    tags: ["iOS", "Canvas"],
    appStore: true,
    downloadUrl: NOTES_APP_STORE_URL,
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Notes</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A conceptual app about information overload, built on an infinite canvas."}
        </span>
      </>
    ),
    longDescription: "It's a conceptual work that visually shows how we clutter our mental space. The main \"canvas\" gets more \"useless\" over time, totally packed with notes and links, and the \"find\" mode is kind of the opposite, showing how we can only find things when we really need them. It's a reflection on the whole concept of how we deal with information overload today.",
  },
  heroDayside: {
    title: "Dayside",
    icon: "/images/globe.png",
    tags: ["macOS", "Friends' time zones", "Waiting approval"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Dayside</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": Friends' time zones on a real, living globe, right in your menu bar."}
        </span>
      </>
    ),
    longDescription: "Click the globe in the menu bar and Dayside grows out of the notch. Every contact rises from their city as a beam of light, labelled with their name and local time, while sunlight sweeps across the planet in real time, so you can see at a glance who's having breakfast, who's at work and who's fast asleep. Click anyone to see their local time, how far ahead or behind you they are, whether it's a good moment to reach them, their sunrise and sunset, and when your working hours overlap. Scrub the time ruler through the day and watch night roll across the globe as every contact's clock updates with it, which turns planning a call across time zones into a few seconds of dragging. The Earth is rendered live from NASA satellite imagery, with drifting clouds, city lights on the night side and the exact position of the sun. Contacts never leave your Mac: no accounts, no tracking, no ads.",
  },
  heroReceipt: {
    title: "Receipt tracker",
    icon: "/images/receipt.png",
    iconRotate: "359.41deg",
    tags: ["iOS", "AI Financial Assistant", "Waiting approval"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Receipt tracker</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": AI-powered expense tracking that reads your finances so you don’t have to."}
        </span>
      </>
    ),
    longDescription: "Most financial apps share the same assumption: if you can see your data, you'll change your behavior. I built this because that assumption never worked for me. Existing tools asked me to think about money the way they were designed, not the way I actually do. It puts AI at the center: it auto-categorizes spending, scans receipts, and reads your financial picture so you can just ask what matters. Not 'show me a chart', more like 'should I be worried about this month?'",
  },
  heroRuntronome: {
    title: "Runtronome",
    icon: "/images/runtronome.png",
    tags: ["iOS", "Running assistant", "Internal beta"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Runtronome</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A running assistant that turns pacing into something you hear, not something you check."}
        </span>
      </>
    ),
    longDescription: "Runtronome is a running assistant built around cadence. It guides structured workouts (warm-ups, hill repeats, intervals) with a metronome locked to your target steps per minute, so you stay on pace without looking at a screen mid-run. Currently in internal beta.",
  },
};

const IMAGES_STAGGER = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function HeroProjectDetail({ activeProject, onCloseStart, onClose, onOpenComplete, onNavigate }: HeroProjectDetailProps) {
  const { isMobile } = useBreakpoint();
  const [prevProject, setPrevProject] = useState<HeroProjectKey>(activeProject);
  const [slideDirection, setSlideDirection] = useState(0);

  if (activeProject !== prevProject) {
    const prevIdx = HERO_PROJECT_ORDER.indexOf(prevProject);
    const currIdx = HERO_PROJECT_ORDER.indexOf(activeProject);
    setSlideDirection(currIdx > prevIdx ? 1 : -1);
    setPrevProject(activeProject);
  }

  const renderAssetGrid = (assets: Array<{ type: "video" | "image"; src: string }>) => (
    <motion.div
      variants={IMAGES_STAGGER}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)",
        gap: isMobile ? 12 : 16,
        width: "100%",
      }}
    >
      {assets.map((asset) => (
        <motion.div
          key={asset.src}
          variants={CONTENT_ITEM}
          style={{ borderRadius: isMobile ? 12 : 32, overflow: "hidden", backgroundColor: "var(--color-bg-skeleton)" }}
        >
          {asset.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={encodeURI(asset.src)} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
          ) : (
            <video src={encodeURI(asset.src)} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  const renderChildren = () => {
    switch (activeProject) {
      case "heroNotes":
        return renderAssetGrid(NOTES_ASSETS);

      case "heroDayside":
        // A Mac app records as a whole desktop, so it gets the full width rather than a grid cell.
        return (
          <motion.div
            variants={CONTENT_ITEM}
            style={{ borderRadius: isMobile ? 12 : 32, overflow: "hidden", backgroundColor: "var(--color-bg-skeleton)", width: "100%" }}
          >
            <video src={DAYSIDE_VIDEO} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block" }} />
          </motion.div>
        );

      case "heroReceipt":
        return renderAssetGrid(RECEIPT_ASSETS);

      case "heroRuntronome":
        return renderAssetGrid(RUNTRONOME_ASSETS);
    }
  };

  const config = CONFIGS[activeProject];

  const activeIdx = HERO_PROJECT_ORDER.indexOf(activeProject);
  const adjacent = (key: HeroProjectKey | undefined): AdjacentProject | undefined =>
    key && onNavigate
      ? { title: CONFIGS[key].title, icon: CONFIGS[key].icon, iconRotate: CONFIGS[key].iconRotate, onSelect: () => onNavigate(key) }
      : undefined;

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title={config.title}
      icon={config.icon}
      iconRotate={config.iconRotate}
      tags={config.tags}
      appStore={config.appStore}
      downloadUrl={config.downloadUrl}
      shortDescription={config.shortDescription}
      longDescription={config.longDescription}
      contentKey={activeProject}
      slideDirection={slideDirection}
      onOpenComplete={onOpenComplete}
      prevProject={adjacent(HERO_PROJECT_ORDER[activeIdx - 1])}
      nextProject={adjacent(HERO_PROJECT_ORDER[activeIdx + 1])}
    >
      {renderChildren()}
    </ProjectDetailLayout>
  );
}
