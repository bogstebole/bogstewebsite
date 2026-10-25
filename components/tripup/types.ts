// The shape of the TripUp case study's content. The content itself is not in
// this repo: it lives in private/tripup/content.json (gitignored), is sealed
// into content/tripup/ by `npm run tripup:seal`, and is only decrypted on the
// server for someone who has the password (lib/tripup-content.ts).

/**
 * One picture or video in a section. With no `src` it renders as a labelled
 * placeholder that says what should go there; `file` is the name it should get
 * in private/tripup/media/ once it exists. `src` is a file name in that folder.
 */
export interface MediaItem {
  type: "image" | "video";
  src?: string;
  file?: string;
  caption: string;
  /** A video's still, shown until it plays: a file in private/tripup/media/. */
  poster?: string;
  /** Width / height, e.g. "390 / 844" for a phone screen. */
  aspect: string;
  /** "phone" sits in a row of phones; "half" is two per row; "wide" takes the row. */
  size: "phone" | "half" | "wide";
  width?: number;
  height?: number;
}

export type StepKind = "problem" | "looked" | "found" | "tried" | "dropped" | "chose" | "skipped" | "tradeoff" | "open";

export const STEP_LABEL: Record<StepKind, string> = {
  problem: "Problem",
  looked: "Looked at",
  found: "Found",
  tried: "Tried",
  dropped: "Didn't work",
  chose: "Chose",
  skipped: "Left out",
  tradeoff: "Trade-off",
  open: "Still open",
};

export interface Step {
  kind: StepKind;
  text: string;
}

export type Extra = "coverage" | "money-stats" | "motion-rules" | "perf";

export interface CaseSection {
  id: string;
  title: string;
  summary: string;
  steps: Step[];
  /** A visual built from data, shown before the media. */
  extra?: Extra;
  media?: MediaItem[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface Coverage {
  columns: string[];
  /** Marks: 2 = yes, 1 = partly, 0 = no, -1 = not confirmed. */
  rows: { app: string; marks: number[]; goal?: boolean }[];
  note: string;
}

export interface FrameTimes {
  budgetMs: number;
  note: string;
  rows: { scenario: string; before: number; after: number }[];
}

/** Which logo a link's button shows: Figma, the web build on Vercel, Android, or iPhone. */
export type LinkIcon = "figma" | "web" | "android" | "ios";

export interface TripUpContent {
  version: 1;
  hero: {
    title: string;
    summary: string;
    /** A file in private/tripup/media/. */
    icon?: string;
    tags: string[];
    /** A file in private/tripup/media/; null shows the placeholder. */
    video: string | null;
    /** The video's still, shown until it plays. */
    videoPoster?: string;
    /** Width / height of the video. A phone recording stands on the brand colour. */
    videoAspect?: string;
    videoFile: string;
    videoCaption: string;
  };
  /** A href starting with "#todo-" shows as a dimmed button, named "coming soon". */
  links: { label: string; href: string; icon: LinkIcon }[];
  sections: CaseSection[];
  coverage: Coverage;
  perf: FrameTimes;
  moneyStats: Stat[];
  motionRules: Stat[];
  end: { title: string; summary: string };
  credits: string;
}

export const isPendingLink = (href: string) => href.startsWith("#todo-");

/** Where a sealed media file is served from, after the password check. */
export const mediaUrl = (name: string) => `/tripup/media/${encodeURIComponent(name)}`;
