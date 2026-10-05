import type { Metadata } from "next";
import { DaysideShell } from "@/components/dayside/dayside-shell";
import { DAYSIDE_SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dayside: Privacy Policy",
  description: "Dayside collects no personal data. No accounts, no analytics, no ads, no tracking.",
};

const EFFECTIVE_DATE = "October 3, 2026";

const heading: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
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

const link: React.CSSProperties = { color: "var(--color-text-heading)" };

// Every claim here is checked against the app's source: what it stores, which
// permission it asks for, and the only two hosts it ever talks to.
const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "The short version",
    body: "Dayside does not collect, store or share any personal data on a server. There are no accounts, no analytics, no ads and no tracking. The developer never sees your contacts or your location.",
  },
  {
    title: "Contacts you add",
    body: "The names and places you add are saved only on your Mac, inside the app's own storage. They are never uploaded or synced. Removing a contact in Dayside deletes it.",
  },
  {
    title: "Your location",
    body: "If you allow it, macOS gives Dayside your approximate location once, so it can place you on the globe. It is used on your Mac only and never sent anywhere. You can say no and choose your city by hand, and you can change the permission at any time in System Settings, Privacy & Security, Location Services.",
  },
  {
    title: "Network requests",
    body: (
      <>
        Dayside makes only two kinds of requests, and neither includes anything about you or your contacts.
        <br />
        <br />
        When you zoom in, it loads sharper satellite imagery from NASA&apos;s Global Imagery Browse Services (
        <a href="https://www.earthdata.nasa.gov" target="_blank" rel="noopener noreferrer" style={link}>
          NASA Earthdata
        </a>
        ). As with any web request, NASA&apos;s servers see your IP address and which map tiles were requested.
        <br />
        <br />
        When you search for a city, the text you type may be sent to Apple Maps to find matching places. That is
        handled by Apple under{" "}
        <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" style={link}>
          Apple&apos;s privacy policy
        </a>
        .
      </>
    ),
  },
  {
    title: "Purchases",
    body: "Dayside is sold through the Mac App Store. Payment is handled entirely by Apple, and the developer receives no payment details or personal information from it.",
  },
  {
    title: "Children",
    body: "Dayside collects no data from anyone, including children.",
  },
  {
    title: "Changes",
    body: "If this policy changes, the new version will be posted on this page with a new effective date.",
  },
  {
    title: "Contact",
    body: (
      <>
        Questions about privacy go to{" "}
        <a href={`mailto:${DAYSIDE_SUPPORT_EMAIL}?subject=${encodeURIComponent("Dayside privacy")}`} style={link}>
          {DAYSIDE_SUPPORT_EMAIL}
        </a>
        .
      </>
    ),
  },
];

export default function DaysidePrivacyPage() {
  return (
    <DaysideShell>
      <article style={{ maxWidth: 640, marginTop: 32, display: "flex", flexDirection: "column", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1 style={{ ...heading, fontSize: 28 }}>Privacy policy</h1>
          <p style={{ ...body, color: "var(--color-text-muted)" }}>Dayside · Effective {EFFECTIVE_DATE}</p>
        </div>

        {SECTIONS.map((s) => (
          <section key={s.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 style={heading}>{s.title}</h2>
            <p style={body}>{s.body}</p>
          </section>
        ))}
      </article>
    </DaysideShell>
  );
}
