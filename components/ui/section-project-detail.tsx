"use client";

import { motion } from "motion/react";
import { CONTENT_ITEM } from "./project-detail-layout";
import { type SectionProjectKey } from "./project-tab-bar";

const FYNN_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/edit profile.png", alt: "Edit profile" },
  { src: "/assets/Fynn/Incidents.png", alt: "Incidents" },
];

const FYNN_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Signature flow.png", alt: "Signature flow" },
  { src: "/assets/Fynn/Temporary warning.png", alt: "Temporary warning" },
];

const FYNN_SPECS_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-overview.png", alt: "Design system: overview" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-building-blocks.png", alt: "Design system: building blocks" },
];

const FYNN_SPECS_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-type.png", alt: "Design system: type specs" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-behaviour.png", alt: "Design system: behaviour" },
];

const CS_ASSETS = [
  { src: "/assets/Content snare/Form layout.png", alt: "Form layout" },
  { src: "/assets/Content snare/sidebar.png", alt: "Sidebar" },
  { src: "/assets/Content snare/comments.png", alt: "Comments" },
  { src: "/assets/Content snare/Input section.png", alt: "Input section" },
  { src: "/assets/Content snare/success.png", alt: "Success" },
];

const TRIGIFY_HERO = { src: "/assets/Trigify/jarvis-landing.webp", alt: "Jarvis: contextual prompt surface" };

const TRIGIFY_PAIRS: { src: string; alt: string }[][] = [
  [
    { src: "/assets/Trigify/search-create.webp", alt: "Create a search: name and source" },
    { src: "/assets/Trigify/search-jarvis-questions.webp", alt: "Jarvis asking for the ICP before building" },
  ],
  [
    { src: "/assets/Trigify/search-created.webp", alt: "Search created, workflow suggested" },
    { src: "/assets/Trigify/listening-all-searches.webp", alt: "Listening: saved searches" },
  ],
  [
    { src: "/assets/Trigify/workflow-triggers.webp", alt: "Workflow: choosing a trigger" },
    { src: "/assets/Trigify/workflow-lead-generation.webp", alt: "Workflow: branching on sentiment" },
  ],
  [
    { src: "/assets/Trigify/login.webp", alt: "Log in: Google, LinkedIn or email" },
    { src: "/assets/Trigify/developer-docs.webp", alt: "Developer docs: API key authentication" },
  ],
];

const TRIGIFY_WIDE: { src: string; alt: string }[] = [
  { src: "/assets/Trigify/signals-account.webp", alt: "Signals: an account entering its buying window" },
  { src: "/assets/Trigify/workflows-empty.webp", alt: "Workflows: empty state with templates" },
];

// Each inner array is one row: a single image runs full width, two sit side by side.
const BANK_MIGRATION_ROWS: { src: string; alt: string }[][] = [
  [{ src: "/assets/Bank migration/button-specs.webp", alt: "Documentation: button sizes and spacing specs" }],
  [
    { src: "/assets/Bank migration/tokens.webp", alt: "Core and semantic tokens for color and type" },
    { src: "/assets/Bank migration/date-picker.webp", alt: "Date picker: master component and its subcomponents" },
  ],
  [{ src: "/assets/Bank migration/component-structure.webp", alt: "Component structure: master component down to atoms" }],
];

const BANK_AUDIT_ROWS: { src: string; alt: string }[][] = [
  [{ src: "/assets/Bank audit/pain-points.webp", alt: "Audit: four pain points and their fixes" }],
  [
    { src: "/assets/Bank audit/tabs-before.webp", alt: "Three components doing one job" },
    { src: "/assets/Bank audit/banner-merge.webp", alt: "Two blocks that became one Banner component" },
  ],
  [{ src: "/assets/Bank audit/cards-before-after.webp", alt: "Cards: previous set and the single flexible component" }],
  [{ src: "/assets/Bank audit/card-master.webp", alt: "Card: master component and its properties" }],
  [
    { src: "/assets/Bank audit/card-documentation.webp", alt: "Card: description and properties in Figma" },
    { src: "/assets/Bank audit/token-anatomy.webp", alt: "Token naming: namespace, tier, category, role" },
  ],
  [{ src: "/assets/Bank audit/component-structure.webp", alt: "Component structure: Card broken down to atoms" }],
];

const PAUSCHAL_SCREENSHOTS = [
  { src: "/assets/Pauschal tracker/1.png", alt: "Pauschal Tracker: dashboard" },
  { src: "/assets/Pauschal tracker/2.png", alt: "Pauschal Tracker: invoices" },
  { src: "/assets/Pauschal tracker/3.png", alt: "Pauschal Tracker: earnings" },
  { src: "/assets/Pauschal tracker/4.png", alt: "Pauschal Tracker: overview" },
  { src: "/assets/Pauschal tracker/5.png", alt: "Pauschal Tracker: settings" },
];

type ProjectConfig = {
  title: string;
  icon: string;
  iconRotate?: string;
  tags: string[];
  shortDescription: React.ReactNode;
  longDescription: string;
};

export const SECTION_PROJECT_CONFIGS: Record<SectionProjectKey, ProjectConfig> = {
  weatherWear: {
    title: "Wear",
    icon: "/images/puffer.png",
    tags: ["iOS", "Weather", "In progress.."],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Wear</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A weather app that shows what to wear instead of temperatures."}
        </span>
      </>
    ),
    longDescription: "Wear reimagines the weather app as a styling tool, showing an invisible figure dressed for the current conditions. The design language is 3D cartoon figures with a matte vinyl aesthetic, rendered per weather state alongside a hand-drawn environment and a body language cue, three expressive layers per condition rather than a simple outfit swap. Mapping outfits to the full iOS weather condition set turned out to be the core design challenge: 30+ states across sky, rain, winter, wind, and severe categories, each requiring a distinct combination of environment illustration, figure pose, and attire. The project is still in production with the 3D asset pipeline as the main bottleneck.",
  },
  pauschalTracker: {
    title: "Pauschal Tracker",
    icon: "/images/pauschal-tracker.png",
    iconRotate: "7.68deg",
    tags: ["Web", "Earning limit tracker", "Personal Usage"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Pauschal Tracker</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": Personal SaaS for tracking freelance earning limits, invoices, and bank transactions."}
        </span>
      </>
    ),
    longDescription: "Pauschal Tracker is a personal finance web app built in React and shadcn/ui to solve a specific problem with Serbia's pauschal tax system. Cross the annual income limit and you pay higher taxes the following year, with no native tooling to help you stay aware of where you stand. Before building it, tracking simply wasn't happening. The app covers invoice creation, income logging, and a dashboard that gives a clear picture of cumulative earnings relative to the limit at any point in the year. The stack was chosen for speed, as React and shadcn/ui meant functional, clean UI without fighting the tooling. Invoice generation took the most time to implement, though not because it was technically complex, just detail-heavy work that required getting the output right. The app is live and used daily as a single source of truth for the agency's finances. The main value isn't any single feature but having one place where the limit is always visible, removing the risk of an expensive surprise at year end.",
  },
  fynn: {
    title: "Fynn.io",
    icon: "/images/fynn.png",
    iconRotate: "13.1deg",
    tags: ["Web", "HealthTech", "B2B"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Fynn.io</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": Task completion time cut in half. Development speed doubled, this is how we transformed Fynn's senior living management system."}
        </span>
      </>
    ),
    longDescription: "Fynn is a U.S.-based senior living care management platform that came to us with a fragmented system built on Ionic, Angular, and Bootstrap, all mixing in ways they shouldn't. The goal was to redesign the core \"Activities of Daily Living\" feature, build a scalable design system, and set the product up for future growth. With no existing Ionic UI kit in Figma, we built one from scratch, establishing root-level tokens for color, typography, and spacing that matched Ionic's structure and made sense to developers immediately. Discovery started with lo-fi wireframes, moved through hi-fi prototypes, and was validated through in-person user testing, which revealed how users physically interacted with devices, directly shaping final decisions. We established a clear workflow from Jira stories through design, refinement, visual QA, and release, with a custom annotation system in Figma that made handoffs clean and reduced back-and-forth. The design system was organized into three layers (foundations, native Ionic components, and custom components), which kept the Figma file navigable as the project scaled. A pattern rulebook covering navigation, filters, drawers, and grid behavior reduced dev meetings and increased team efficiency by 13%. For the resident profile redesign, we moved from a single overloaded page to a tabbed layout with a drawer pattern for complex forms, keeping resident context visible throughout interactions. The drawer approach was a pragmatic call: not perfect, but fast to implement with existing components, and initial user feedback confirmed it worked. The Bulk ADL feature launch cut task completion time by 50%, and the design system accelerated development speed across all ongoing projects. The main lesson: lock in the technical stack before touching the design system, because the Ionic vs. Angular split created avoidable complexity throughout. Moving forward, the priority is consolidating to a single framework, deepening design-dev collaboration, and expanding the system for new features.",
  },
  contentSnare: {
    title: "Content Snare",
    icon: "/images/content-snare.png",
    iconRotate: "3.34deg",
    tags: ["Web", "Productivity", "B2B, B2C"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Content Snare</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": Enhanced system led to faster request completion and reduced support tickets through clearer navigation and simplified user experience."}
        </span>
      </>
    ),
    longDescription: "ContentSnare is an Australian productivity platform that helps businesses collect content and information from clients through structured request forms. They came to us needing a full redesign of their end-user request experience, not a blank-slate redesign but one built directly on top of existing user feedback they had already collected. Discovery started with a planned workshop that went off-script, but the unstructured conversation turned out to surface exactly the insights we needed. The core friction points were clear: users missed submit buttons, got confused by terminology like \"reject\" and \"submit for review,\" struggled with rigid section structures, and couldn't easily navigate or understand their progress through a form. We restructured field information hierarchically so critical details stood out, and replaced text-heavy status indicators with visual cues, cleaning up the interface without breaking familiar patterns. The sidebar was rebuilt to separate progress tracking from navigation, with color coding and icons that communicate field states without adding visual noise. The comment system got a straightforward but effective fix: alignment and background color now instantly distinguish who said what and in what context. On the creator side, we improved the dashboard layout, filter organization, and tackled the recurring request feature, a deceptively simple concept that required multiple steps to implement properly. Collaboration was fast and direct, coming straight from an owner-developer, which kept decisions quick even if it occasionally meant realigning after missed updates. The main lesson: rigid process isn't a prerequisite for good outcomes. The quality came from collaboration and adaptability, not structure. Results are still being measured as the features roll out, with future iterations tied to actual usage patterns rather than assumptions.",
  },
  trigify: {
    title: "Trigify",
    icon: "/images/trigify.svg",
    iconRotate: "-6.2deg",
    tags: ["Web", "GTM Intelligence", "B2B"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Trigify</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A GTM signal platform rebuilt around a copilot that reads context and does the setup, so work starts at the first useful action instead of an empty configuration screen."}
        </span>
      </>
    ),
    longDescription: "Trigify is a GTM signal platform that monitors LinkedIn, X, Reddit, GitHub and half a dozen other sources, then turns what it finds into workflows a revenue team can act on. Four surfaces had to land close together: Listening, Workflows, Signals, and Jarvis, the AI copilot running through all of them. The hardest question was never any single screen but whether Jarvis belonged to the platform or to the page. We settled on contextual: a copilot that reads where you are and proposes the actions that make sense there, rather than a general chat bolted to the side. That decision shaped everything downstream. Search creation became a conversation, with Jarvis asking for the ICP, what to capture and where leads should land, then building the search itself. The four-step form stays visible behind it, so nothing feels hidden or taken away. Signals moved furthest from where it started: instead of a chronological feed and a settings page carrying a hundred toggles, the landing page offers four things to track, and the view splits into today\u2019s actions and the accounts behind them, with Jarvis drafting the emails and wiring the workflow before being asked to. The workflow builder was the stubborn one. A flowchart tells you a workflow exists but not what it does, so the work went into the states a node can be in (placeholder, needs configuration, hover to edit) and into making a node\u2019s landing position obvious before it is added rather than after. Smaller calls followed the same reasoning: the send button in the chat stepped back once it was clear almost nobody clicks it, and progress inside a workflow card stopped borrowing the button component, because something mid-run should not look pressable. Inline editing is still a compromise: you open one node, close it, open the next, and that one is not solved yet. It shipped recently, so there are no numbers to report; the next pass follows what people actually do with the copilot rather than what we assumed they would.",
  },
  bankMigration: {
    title: "UAE Bank · Migration",
    icon: "/images/bank-migration.svg",
    iconRotate: "-4.5deg",
    tags: ["Sketch to Figma", "Banking", "Undisclosed"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>UAE Bank · Migration</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A bank's design team moved from Sketch to Figma and came out with a token-based design system they built, documented and now govern themselves."}
        </span>
      </>
    ),
    longDescription: "In mid-2022 a UAE bank decided to leave Sketch for Figma. Nobody could say exactly why, only that it felt like the logical next step, so the brief was open: move the team across and leave behind a design system that would keep working once I was gone. The client stays unnamed here. Their senior designer knew the platform inside out and ran the audit of the existing design assets, which told us what was worth carrying over and what had to be rebuilt. We started from the bottom: core tokens for color, type and spacing, then a semantic tier on top, so a button asks for a primary background instead of a hex value. Rather than recreate the whole library before anyone could use it, we published components in the order live work needed them. A wizard flow was in progress, so inputs and buttons went out first. Every component was assembled from subcomponents (a date picker is cells, rows and a header before it is a date picker), which turned maintenance into fixing one small piece instead of chasing copies. There was no classroom training. The team learned Figma by building the system with us, which got them comfortable faster and left them owning it. Each component was documented in Zeroheight through the same five lenses: overview, variations, states, anatomy and properties, and a governance process kept several designers from pulling the library in different directions. There are no numbers here, it was not that kind of project. Once the system was running without me, the job was done and I left. The main lesson: publish what the product needs next, not what a complete library is supposed to contain.",
  },
  bankAudit: {
    title: "UAE Bank · Audit",
    icon: "/images/bank-audit.svg",
    iconRotate: "8.2deg",
    tags: ["Design System", "Banking", "Undisclosed"],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>UAE Bank · Audit</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {": A web design system that had grown faster than anyone could maintain it, audited and cut from 120 components to 47, with universal names and tokens in place of hex codes."}
        </span>
      </>
    ),
    longDescription: "A long-established UAE bank had a web design system that worked, though it was hard to say how. UX designers were racing client deadlines, developers were scrambling to keep up, and components kept landing in a library nobody was pruning. The client stays unnamed here. We made the call to slow down and audit first. Four problems came out of it: inconsistent designs, names tied too tightly to one use, duplicated components, and separate mobile and desktop versions of the same thing. We presented the findings with a plan ordered by urgency, the client said \"ok\", and the cleanup started. Three components doing one job with three different looks became one. Names like FormButton and NavigationButton gave way to universal ones, so a component could be reused outside the page it was made for. A \"Not sure\" block and a \"Benefit card\" turned out to be the same image, text and call to action, so they merged into a single Banner with variants, and promotional, account and credit card tiles collapsed into one Card with orientation, size and image as properties. Mobile and desktop stopped being separate components and became one switch in the properties panel. Components were rebuilt from subcomponents down to atoms, hex values were replaced with tokens named by namespace, tier, category and role, and documentation moved into Figma's component descriptions so it travels with the component. A governance process with the UX and dev teams was there to stop the library filling up again. Was it a success? Here and there. The library went from 120 components to 47 and became easier to maintain, and we did the best we could with what we had. The main lesson: slowing down to fix the foundations is what lets a team move faster later.",
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

const FYNN_CONTAINER = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 24,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** The media for one section project, laid out for the shared detail panel. */
export function SectionProjectContent({ project, isMobile }: { project: SectionProjectKey; isMobile: boolean }) {
  const renderRows = (backgroundColor: string, rows: { src: string; alt: string }[][]) => (
    <motion.div
      variants={FYNN_CONTAINER}
      style={{
        backgroundColor,
        borderRadius: 24,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        width: "100%",
        marginTop: 12,
      }}
    >
      {rows.map((row, i) =>
        isMobile || row.length === 1 ? (
          row.map((item) => (
            <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI(item.src)} alt={item.alt}
                style={{ display: "block", width: "100%", height: "auto" }} />
            </motion.div>
          ))
        ) : (
          <motion.div key={i} variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
            {row.map((item) => (
              <motion.div key={item.src} variants={CONTENT_ITEM} style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI(item.src)} alt={item.alt}
                  style={{ display: "block", width: "100%", height: "auto" }} />
              </motion.div>
            ))}
          </motion.div>
        )
      )}
    </motion.div>
  );

  const renderChildren = () => {
    switch (project) {
      case "weatherWear":
        return (
          <motion.div variants={CONTENT_ITEM} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <div style={{
              width: 247,
              height: 534,
              backgroundColor: "#fff",
              borderRadius: 30,
              border: "4.4px solid #000",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}>
              <div style={{ width: "100%", flex: 1, backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", paddingBottom: 16 }}>
                <video src="/assets/Wear/wear.mp4" autoPlay loop muted playsInline style={{ width: "60%", height: "auto", display: "block" }} />
              </div>
              <div style={{ height: 140, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, color: "#666", opacity: 0.7, marginBottom: 6 }}>Belgrade</div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 11, color: "#666" }}>Light, noticeable wind.</div>
              </div>
            </div>
          </motion.div>
        );

      case "pauschalTracker":
        return (
          <>
            {PAUSCHAL_SCREENSHOTS.map((s) => (
              <motion.div key={s.src} variants={CONTENT_ITEM}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} style={{ borderRadius: 8, display: "block", height: "auto", width: "100%" }} />
              </motion.div>
            ))}
          </>
        );

      case "fynn":
        return (
          <motion.div
            variants={FYNN_CONTAINER}
            style={{
              backgroundColor: "#347eff",
              borderRadius: 24,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 12,
              width: "100%",
              marginTop: 12,
            }}
          >
            {isMobile ? (
              [...[{ src: "/assets/Fynn/Billing dashboard - Rent roll.png", alt: "Billing dashboard: rent roll" }],
                ...FYNN_LEFT, ...FYNN_RIGHT,
                { src: "/assets/Fynn/Resident care.png", alt: "Resident care" },
                ...FYNN_SPECS_LEFT, ...FYNN_SPECS_RIGHT,
              ].map((item) => (
                <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={encodeURI(item.src)} alt={item.alt}
                    style={{ display: "block", width: "100%", height: "auto" }} />
                </motion.div>
              ))
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.div variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                  <img src={encodeURI("/assets/Fynn/Billing dashboard - Rent roll.png")} alt="Billing dashboard: rent roll"
                    style={{ display: "block", width: "100%", height: "auto" }} />
                </motion.div>
                <motion.div variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
                  <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                    {FYNN_LEFT.map((item) => (
                      <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={encodeURI(item.src)} alt={item.alt}
                          style={{ display: "block", width: "100%", height: "auto" }} />
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                    {FYNN_RIGHT.map((item) => (
                      <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={encodeURI(item.src)} alt={item.alt}
                          style={{ display: "block", width: "100%", height: "auto" }} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.div variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                  <img src={encodeURI("/assets/Fynn/Resident care.png")} alt="Resident care"
                    style={{ display: "block", width: "100%", height: "auto" }} />
                </motion.div>
                <motion.div variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
                  <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                    {FYNN_SPECS_LEFT.map((item) => (
                      <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={encodeURI(item.src)} alt={item.alt}
                          style={{ display: "block", width: "100%", height: "auto" }} />
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 8 }}>
                    {FYNN_SPECS_RIGHT.map((item) => (
                      <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={encodeURI(item.src)} alt={item.alt}
                          style={{ display: "block", width: "100%", height: "auto" }} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        );

      case "contentSnare":
        return isMobile ? (
          <>
            {CS_ASSETS.map((item) => (
              <motion.div key={item.src} variants={CONTENT_ITEM}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI(item.src)} alt={item.alt}
                  style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
              </motion.div>
            ))}
          </>
        ) : (
          <>
            <motion.div variants={CONTENT_ITEM}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI("/assets/Content snare/Form layout.png")} alt="Form layout"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
            </motion.div>
            <motion.div variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
              <motion.div variants={CONTENT_ITEM} style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI("/assets/Content snare/sidebar.png")} alt="Sidebar"
                  style={{ display: "block", width: "100%", height: "auto" }} />
              </motion.div>
              <motion.div variants={CONTENT_ITEM} style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI("/assets/Content snare/comments.png")} alt="Comments"
                  style={{ display: "block", width: "100%", height: "auto" }} />
              </motion.div>
            </motion.div>
            <motion.div variants={CONTENT_ITEM}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI("/assets/Content snare/Input section.png")} alt="Input section"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
            </motion.div>
            <motion.div variants={CONTENT_ITEM}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI("/assets/Content snare/success.png")} alt="Success"
                style={{ borderRadius: 8, display: "block", width: "100%", height: "auto" }} />
            </motion.div>
          </>
        );

      case "trigify":
        return (
          <motion.div
            variants={FYNN_CONTAINER}
            style={{
              backgroundColor: "#FF2D8A",
              borderRadius: 24,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 12,
              width: "100%",
              marginTop: 12,
            }}
          >
            <motion.div variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={encodeURI(TRIGIFY_HERO.src)} alt={TRIGIFY_HERO.alt}
                style={{ display: "block", width: "100%", height: "auto" }} />
            </motion.div>

            {TRIGIFY_PAIRS.map((pair, i) =>
              isMobile ? (
                pair.map((item) => (
                  <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={encodeURI(item.src)} alt={item.alt}
                      style={{ display: "block", width: "100%", height: "auto" }} />
                  </motion.div>
                ))
              ) : (
                <motion.div key={i} variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
                  {pair.map((item) => (
                    <motion.div key={item.src} variants={CONTENT_ITEM} style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={encodeURI(item.src)} alt={item.alt}
                        style={{ display: "block", width: "100%", height: "auto" }} />
                    </motion.div>
                  ))}
                </motion.div>
              )
            )}

            {TRIGIFY_WIDE.map((item) => (
              <motion.div key={item.src} variants={CONTENT_ITEM} style={{ borderRadius: 8, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={encodeURI(item.src)} alt={item.alt}
                  style={{ display: "block", width: "100%", height: "auto" }} />
              </motion.div>
            ))}
          </motion.div>
        );

      case "bankMigration":
        return renderRows("#BA1B19", BANK_MIGRATION_ROWS);

      case "bankAudit":
        return renderRows("#27323A", BANK_AUDIT_ROWS);
    }
  };

  return <>{renderChildren()}</>;
}
