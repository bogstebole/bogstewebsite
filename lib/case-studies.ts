import type { Metadata } from "next";
import type { ProjectKey } from "@/components/ui/project-tab-bar";

export interface CaseStudy {
  key: ProjectKey;
  /** The public address: /work/<slug>. */
  slug: string;
  title: string;
  /** The one-liner shown after the title in the panel, and the link preview's description. */
  summary: string;
}

export const SITE_NAME = "Boule's Portfolio";

// Every project that opens in the detail panel, in the order of the project lists.
const ENTRIES: Record<ProjectKey, Omit<CaseStudy, "key">> = {
  heroNotes: {
    slug: "notes",
    title: "Notes",
    summary: "A conceptual app about information overload, built on an infinite canvas.",
  },
  heroReceipt: {
    slug: "receipt-tracker",
    title: "Receipt tracker",
    summary: "AI-powered expense tracking that reads your finances so you don’t have to.",
  },
  heroRuntronome: {
    slug: "runtronome",
    title: "Runtronome",
    summary: "A running assistant that turns pacing into something you hear, not something you check.",
  },
  heroDayside: {
    slug: "dayside",
    title: "Dayside",
    summary: "Friends' time zones on a real, living globe, right in your menu bar.",
  },
  weatherWear: {
    slug: "weather-wear",
    title: "Wear",
    summary: "A weather app that shows what to wear instead of temperatures.",
  },
  pauschalTracker: {
    slug: "pauschal-tracker",
    title: "Pauschal Tracker",
    summary: "Personal SaaS for tracking freelance earning limits, invoices, and bank transactions.",
  },
  fynn: {
    slug: "fynn",
    title: "Fynn.io",
    summary:
      "Task completion time cut in half. Development speed doubled, this is how we transformed Fynn's senior living management system.",
  },
  contentSnare: {
    slug: "content-snare",
    title: "Content Snare",
    summary:
      "Enhanced system led to faster request completion and reduced support tickets through clearer navigation and simplified user experience.",
  },
  trigify: {
    slug: "trigify",
    title: "Trigify",
    summary:
      "A GTM signal platform rebuilt around a copilot that reads context and does the setup, so work starts at the first useful action instead of an empty configuration screen.",
  },
  bankMigration: {
    slug: "uae-bank-migration",
    title: "UAE Bank · Migration",
    summary:
      "A bank's design team moved from Sketch to Figma and came out with a token-based design system they built, documented and now govern themselves.",
  },
  bankAudit: {
    slug: "uae-bank-audit",
    title: "UAE Bank · Audit",
    summary:
      "A web design system that had grown faster than anyone could maintain it, audited and cut from 120 components to 47, with universal names and tokens in place of hex codes.",
  },
};

// Off the site until their design is reworked: no list entry, no tab, no /work link.
// Take a key out of this set to bring the project back.
export const HIDDEN_PROJECTS: ReadonlySet<ProjectKey> = new Set<ProjectKey>(["weatherWear", "pauschalTracker"]);

export const CASE_STUDIES: CaseStudy[] = (Object.keys(ENTRIES) as ProjectKey[])
  .filter((key) => !HIDDEN_PROJECTS.has(key))
  .map((key) => ({ key, ...ENTRIES[key] }));

export const caseStudyBySlug = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((cs) => cs.slug === slug);

export const summaryOf = (key: ProjectKey): string => ENTRIES[key].summary;

/** Where a project's case study lives, inside `base` ("" on the public site, "/dive" on the review copy). */
export const caseStudyPath = (key: ProjectKey, base = ""): string => `${base}/work/${ENTRIES[key].slug}`;

/** The project a /work/<slug> path points at, or null for any other path. */
export function projectFromPath(pathname: string, base = ""): ProjectKey | null {
  const prefix = `${base}/work/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = decodeURIComponent(pathname.slice(prefix.length)).replace(/\/+$/, "");
  return caseStudyBySlug(slug)?.key ?? null;
}

/** The browser tab title while a case study is open. */
export const caseStudyTitle = (key: ProjectKey): string => `${ENTRIES[key].title} | ${SITE_NAME}`;

/** Title, description, canonical and link-preview tags for one case study. */
export function caseStudyMetadata(cs: CaseStudy): Metadata {
  const title = caseStudyTitle(cs.key);
  const url = `/work/${cs.slug}`;
  const image = { url: `/og/${cs.slug}.jpg`, width: 1200, height: 630, alt: cs.title };
  return {
    title,
    description: cs.summary,
    alternates: { canonical: url },
    openGraph: { title, description: cs.summary, url, siteName: SITE_NAME, images: [image], type: "article" },
    twitter: { card: "summary_large_image", title, description: cs.summary, images: [image.url] },
  };
}
