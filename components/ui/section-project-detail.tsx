"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout, CONTENT_ITEM } from "./project-detail-layout";
import { SECTION_PROJECT_ORDER, type SectionProjectKey } from "./section-project-tab-bar";

interface SectionProjectDetailProps {
  activeProject: SectionProjectKey;
  onCloseStart: () => void;
  onClose: () => void;
}

const ZOUN_SCREENSHOTS = [
  { src: "/assets/Zoun/home.png", alt: "Zoun — globe view" },
  { src: "/assets/Zoun/compare.png", alt: "Zoun — compare time zones" },
  { src: "/assets/Zoun/search.png", alt: "Zoun — select country" },
];

const FYNN_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/edit profile.png", alt: "Edit profile" },
  { src: "/assets/Fynn/Incidents.png", alt: "Incidents" },
];

const FYNN_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Signature flow.png", alt: "Signature flow" },
  { src: "/assets/Fynn/Temporary warning.png", alt: "Temporary warning" },
];

const FYNN_SPECS_LEFT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-overview.png", alt: "Design system — overview" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-building-blocks.png", alt: "Design system — building blocks" },
];

const FYNN_SPECS_RIGHT: { src: string; alt: string }[] = [
  { src: "/assets/Fynn/Design System Specs Assets/specs-type.png", alt: "Design system — type specs" },
  { src: "/assets/Fynn/Design System Specs Assets/specs-behaviour.png", alt: "Design system — behaviour" },
];

const CS_ASSETS = [
  { src: "/assets/Content snare/Form layout.png", alt: "Form layout" },
  { src: "/assets/Content snare/sidebar.png", alt: "Sidebar" },
  { src: "/assets/Content snare/comments.png", alt: "Comments" },
  { src: "/assets/Content snare/Input section.png", alt: "Input section" },
  { src: "/assets/Content snare/success.png", alt: "Success" },
];

const PAUSCHAL_SCREENSHOTS = [
  { src: "/assets/Pauschal tracker/1.png", alt: "Pauschal Tracker — dashboard" },
  { src: "/assets/Pauschal tracker/2.png", alt: "Pauschal Tracker — invoices" },
  { src: "/assets/Pauschal tracker/3.png", alt: "Pauschal Tracker — earnings" },
  { src: "/assets/Pauschal tracker/4.png", alt: "Pauschal Tracker — overview" },
  { src: "/assets/Pauschal tracker/5.png", alt: "Pauschal Tracker — settings" },
];

type ProjectConfig = {
  title: string;
  icon: string;
  iconRotate?: string;
  tags: string[];
  shortDescription: React.ReactNode;
  longDescription: string;
};

const CONFIGS: Record<SectionProjectKey, ProjectConfig> = {
  zoun: {
    title: "Zoun",
    icon: "/images/globe.png",
    tags: ["iOS", "Time Zone Tracker", "In progress.."],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Zoun</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {" — Time zones should feel spatial and immediate, not like reading a spreadsheet."}
        </span>
      </>
    ),
    longDescription: "Zoun is a personal iOS app built around the idea that comparing time zones across a global team should feel spatial and immediate, not like reading a spreadsheet. Existing world clock tools get the job done but look dated, and that gap was enough reason to build something better. The concept centers on a photorealistic 3D globe that reflects real-time daylight conditions, with contacts pinned to their locations and a list view below showing local times, UTC offsets, and day/night status at a glance. A time scrubber lets you simulate what everyone's clock looks like at any given hour, which is useful for scheduling calls across multiple zones. Built in SwiftUI, with an MVP already running using MapKit as a placeholder renderer. The final globe is still being evaluated between Metal, RealityKit, and SpriteKit, since MapKit does not deliver the visual fidelity the concept needs, and getting that right is the blocker between concept and release. Planned additions include calendar integrations for booking directly into Google Meet or similar. The app is intended for public release once the visuals meet the standard the concept sets.",
  },
  weatherWear: {
    title: "Wear",
    icon: "/images/puffer.png",
    tags: ["iOS", "Weather", "In progress.."],
    shortDescription: (
      <>
        <span style={{ color: "var(--color-text-heading)" }}>Wear</span>
        <span style={{ color: "var(--color-text-subdued)" }}>
          {" — A weather app that shows what to wear instead of temperatures."}
        </span>
      </>
    ),
    longDescription: "Wear reimagines the weather app as a styling tool, showing an invisible figure dressed for the current conditions. The design language is 3D cartoon figures with a matte vinyl aesthetic, rendered per weather state alongside a hand-drawn environment and a body language cue — three expressive layers per condition rather than a simple outfit swap. Mapping outfits to the full iOS weather condition set turned out to be the core design challenge: 30+ states across sky, rain, winter, wind, and severe categories, each requiring a distinct combination of environment illustration, figure pose, and attire. The project is still in production with the 3D asset pipeline as the main bottleneck.",
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
          {" — Personal SaaS for tracking freelance earning limits, invoices, and bank transactions."}
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
          {" — Task completion time cut in half. Development speed doubled, this is how we transformed Fynn's senior living management system."}
        </span>
      </>
    ),
    longDescription: "Fynn is a U.S.-based senior living care management platform that came to us with a fragmented system built on Ionic, Angular, and Bootstrap — all mixing in ways they shouldn't. The goal was to redesign the core \"Activities of Daily Living\" feature, build a scalable design system, and set the product up for future growth. With no existing Ionic UI kit in Figma, we built one from scratch, establishing root-level tokens for color, typography, and spacing that matched Ionic's structure and made sense to developers immediately. Discovery started with lo-fi wireframes, moved through hi-fi prototypes, and was validated through in-person user testing — which revealed how users physically interacted with devices, directly shaping final decisions. We established a clear workflow from Jira stories through design, refinement, visual QA, and release, with a custom annotation system in Figma that made handoffs clean and reduced back-and-forth. The design system was organized into three layers — foundations, native Ionic components, and custom components — keeping the Figma file navigable as the project scaled. A pattern rulebook covering navigation, filters, drawers, and grid behavior reduced dev meetings and increased team efficiency by 13%. For the resident profile redesign, we moved from a single overloaded page to a tabbed layout with a drawer pattern for complex forms, keeping resident context visible throughout interactions. The drawer approach was a pragmatic call — not perfect, but fast to implement with existing components, and initial user feedback confirmed it worked. The Bulk ADL feature launch cut task completion time by 50%, and the design system accelerated development speed across all ongoing projects. The main lesson: lock in the technical stack before touching the design system — the Ionic vs. Angular split created avoidable complexity throughout. Moving forward, the priority is consolidating to a single framework, deepening design-dev collaboration, and expanding the system for new features.",
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
          {" — Enhanced system led to faster request completion and reduced support tickets through clearer navigation and simplified user experience."}
        </span>
      </>
    ),
    longDescription: "ContentSnare is an Australian productivity platform that helps businesses collect content and information from clients through structured request forms. They came to us needing a full redesign of their end-user request experience — not a blank-slate redesign, but one built directly on top of existing user feedback they had already collected. Discovery started with a planned workshop that went off-script, but the unstructured conversation turned out to surface exactly the insights we needed. The core friction points were clear: users missed submit buttons, got confused by terminology like \"reject\" and \"submit for review,\" struggled with rigid section structures, and couldn't easily navigate or understand their progress through a form. We restructured field information hierarchically so critical details stood out, and replaced text-heavy status indicators with visual cues — cleaning up the interface without breaking familiar patterns. The sidebar was rebuilt to separate progress tracking from navigation, with color coding and icons that communicate field states without adding visual noise. The comment system got a straightforward but effective fix: alignment and background color now instantly distinguish who said what and in what context. On the creator side, we improved the dashboard layout, filter organization, and tackled the recurring request feature — a deceptively simple concept that required multiple steps to implement properly. Collaboration was fast and direct, coming straight from an owner-developer, which kept decisions quick even if it occasionally meant realigning after missed updates. The main lesson: rigid process isn't a prerequisite for good outcomes — the quality came from collaboration and adaptability, not structure. Results are still being measured as the features roll out, with future iterations tied to actual usage patterns rather than assumptions.",
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

export function SectionProjectDetail({ activeProject, onCloseStart, onClose }: SectionProjectDetailProps) {
  const { isMobile } = useBreakpoint();
  const [prevProject, setPrevProject] = useState<SectionProjectKey>(activeProject);
  const [slideDirection, setSlideDirection] = useState(0);

  if (activeProject !== prevProject) {
    const prevIdx = SECTION_PROJECT_ORDER.indexOf(prevProject);
    const currIdx = SECTION_PROJECT_ORDER.indexOf(activeProject);
    setSlideDirection(currIdx > prevIdx ? 1 : -1);
    setPrevProject(activeProject);
  }

  const renderChildren = () => {
    switch (activeProject) {
      case "zoun":
        return isMobile ? (
          <motion.div variants={IMAGES_STAGGER} style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", width: "100%" }}>
            {ZOUN_SCREENSHOTS.map((s) => (
              <motion.div key={s.src} variants={CONTENT_ITEM} style={{ borderRadius: 12, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} style={{ display: "block", height: "auto", objectFit: "cover", width: "100%" }} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={IMAGES_STAGGER} style={{ display: "flex", gap: 8 }}>
            {ZOUN_SCREENSHOTS.map((s) => (
              <motion.div key={s.src} variants={CONTENT_ITEM} style={{ borderRadius: 12, flex: 1, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} style={{ display: "block", height: "auto", objectFit: "cover", width: "100%" }} />
              </motion.div>
            ))}
          </motion.div>
        );

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
              [...[{ src: "/assets/Fynn/Billing dashboard - Rent roll.png", alt: "Billing dashboard — rent roll" }],
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
                  <img src={encodeURI("/assets/Fynn/Billing dashboard - Rent roll.png")} alt="Billing dashboard — rent roll"
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
    }
  };

  const config = CONFIGS[activeProject];

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title={config.title}
      icon={config.icon}
      iconRotate={config.iconRotate}
      tags={config.tags}
      shortDescription={config.shortDescription}
      longDescription={config.longDescription}
      contentKey={activeProject}
      slideDirection={slideDirection}
    >
      {renderChildren()}
    </ProjectDetailLayout>
  );
}
