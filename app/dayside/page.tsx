import type { Metadata } from "next";
import { DaysideShell } from "@/components/dayside/dayside-shell";
import styles from "@/components/ui/GlassButton.module.css";
import { DAYSIDE_APP_STORE_URL, DAYSIDE_SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dayside: Friends' Time Zones",
  description:
    "The people you care about on a real, living globe, right in your Mac's menu bar. Support, questions and privacy.",
};

const FEATURES = [
  {
    title: "Everyone at a glance",
    body: "Each contact rises from their city as a beam of light, labelled with their name and local time, while sunlight sweeps across the planet in real time.",
  },
  {
    title: "Their day in one click",
    body: "Local time, how far ahead or behind you they are, whether it's a good moment to reach them, sunrise and sunset, and when your working hours overlap.",
  },
  {
    title: "Plan a call in seconds",
    body: "Scrub the time ruler and watch night roll across the globe while every clock updates with it. Tap Now to jump back.",
  },
  {
    title: "Out of your way",
    body: "Lives in the menu bar and grows out of the notch when you click it. Esc or a click elsewhere tucks it away. Optionally opens at login.",
  },
];

const mailto = (subject: string) =>
  `mailto:${DAYSIDE_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where are my contacts stored?",
    a: "Only on your Mac. Dayside has no accounts and no server, so there is nothing to sync and nothing that can leak.",
  },
  {
    q: "Why does it ask for my location?",
    a: "To put you on the globe. It's read once, on your Mac, and never sent anywhere. If you'd rather not share it, say no and pick your city yourself.",
  },
  {
    q: "Which Macs does it run on?",
    a: "Any Mac running macOS 26 or later.",
  },
  {
    q: "Does it need the internet?",
    a: "Mostly not. The globe, the sunlight and your contacts all work offline. Sharper satellite imagery when you zoom in, and searching for some cities, need a connection.",
  },
  {
    q: "Is there a Windows or iPhone version?",
    a: (
      <>
        Not yet. If you&apos;d use one,{" "}
        <a href={mailto("Dayside for Windows / iPhone")} style={{ color: "var(--color-text-heading)" }}>
          send me a line
        </a>
        . Every email counts toward deciding what comes next.
      </>
    ),
  },
  {
    q: "How do I get a refund?",
    a: (
      <>
        Purchases go through Apple, so refunds do too. Request one at{" "}
        <a
          href="https://reportaproblem.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-text-heading)" }}
        >
          reportaproblem.apple.com
        </a>
        .
      </>
    ),
  },
];

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 500,
  lineHeight: 1.3,
  color: "var(--color-text-heading)",
};

const body: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: "21px",
  color: "var(--color-text-tertiary)",
};

const tag: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
  fontSize: 11,
  lineHeight: 1.3,
  letterSpacing: "-0.04em",
  color: "var(--color-text-label)",
  backgroundColor: "var(--color-bg-container)",
  borderRadius: 4,
  paddingInline: 6,
  paddingBlock: 2,
};

export default function DaysidePage() {
  return (
    <DaysideShell>
      {/* Intro */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640, marginTop: 32 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/globe.png" alt="" width={48} height={48} style={{ display: "block" }} />
        <h1 style={{ ...sectionTitle, fontSize: 28 }}>
          Dayside
          <span style={{ color: "var(--color-text-subdued)" }}>
            : Friends&apos; time zones on a real, living globe, right in your menu bar.
          </span>
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <span style={tag}>macOS 26+</span>
          <span style={tag}>€4.99</span>
          <span style={tag}>No accounts, no tracking</span>
        </div>
        <div style={{ marginTop: 8 }}>
          {DAYSIDE_APP_STORE_URL ? (
            <a
              href={DAYSIDE_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.glassBtn} ${styles.sizeM}`}
              style={{ textDecoration: "none" }}
            >
              Download on the Mac App Store
            </a>
          ) : (
            <span style={{ ...tag, fontSize: 12, paddingInline: 10, paddingBlock: 6 }}>
              Coming soon to the Mac App Store
            </span>
          )}
        </div>
      </section>

      {/* Recording */}
      <div
        style={{
          marginTop: 48,
          borderRadius: 32,
          overflow: "hidden",
          border: "1px solid var(--color-border-soft)",
          backgroundColor: "var(--color-bg-container)",
          aspectRatio: "2712 / 2010",
        }}
      >
        <video
          src="/assets/Dayside/dayside.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Features */}
      <section
        style={{
          marginTop: 48,
          display: "grid",
          // Two by two on a desktop, one column on a phone: four cards never leave an orphan.
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: 16,
        }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            style={{
              backgroundColor: "var(--color-bg-container)",
              borderRadius: 24,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <h2 style={{ ...sectionTitle, fontSize: 16 }}>{f.title}</h2>
            <p style={body}>{f.body}</p>
          </div>
        ))}
      </section>

      {/* Questions */}
      <section style={{ marginTop: 80, maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={sectionTitle}>Questions</h2>
        <div>
          {FAQ.map((item) => (
            <details key={item.q} style={{ borderTop: "1px solid var(--color-border-soft)", paddingBlock: 16 }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: "21px",
                  fontWeight: 500,
                  color: "var(--color-text-heading)",
                }}
              >
                {item.q}
              </summary>
              <p style={{ ...body, marginTop: 8 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Support */}
      <section
        id="support"
        style={{
          marginTop: 64,
          maxWidth: 640,
          backgroundColor: "var(--color-bg-container)",
          borderRadius: 24,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <h2 style={sectionTitle}>Something not working, or have an idea?</h2>
        <p style={body}>
          Email me at{" "}
          <a href={mailto("Dayside support")} style={{ color: "var(--color-text-heading)" }}>
            {DAYSIDE_SUPPORT_EMAIL}
          </a>
          . Tell me your macOS version and what happened, and I&apos;ll get back to you. Dayside is made by one
          person, so every message gets read.
        </p>
      </section>
    </DaysideShell>
  );
}
