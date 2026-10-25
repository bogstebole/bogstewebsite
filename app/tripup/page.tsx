import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/case-studies";
import { hasTripUpAccess } from "@/lib/tripup-access";
import { loadTripUpContent } from "@/lib/tripup-content";
import styles from "@/components/tripup/tripup.module.css";
import { PasswordGate } from "@/components/tripup/password-gate";
import { AutoVideo } from "@/components/tripup/auto-video";
import {
  CaseStudySection,
  CoverageMatrix,
  FrameChart,
  OutLink,
  Placeholder,
  Stats,
  TripUpShell,
} from "@/components/tripup/parts";
import { mediaUrl, type Extra, type TripUpContent } from "@/components/tripup/types";

export const metadata: Metadata = {
  title: `TripUp | ${SITE_NAME}`,
  // Shown to anyone, password or not, so it gives nothing away.
  description: "A private case study.",
  // Behind a password, so kept out of search too.
  robots: { index: false, follow: false },
};

// Checked on the server for every request. Without the access cookie the
// response holds only the password form; with it, the content is decrypted
// here and nowhere else (lib/tripup-content.ts).
export default async function TripUpPage() {
  if (!(await hasTripUpAccess())) {
    return (
      <TripUpShell>
        <PasswordGate />
      </TripUpShell>
    );
  }

  const content = await loadTripUpContent();
  if (!content) {
    return (
      <TripUpShell>
        <section className={styles.gate}>
          <h1 className={styles.title}>
            TripUp<span className={styles.titleRest}>: the case study can&apos;t be opened right now.</span>
          </h1>
        </section>
      </TripUpShell>
    );
  }

  return <CaseStudy content={content} />;
}

function Links({ links }: { links: TripUpContent["links"] }) {
  return (
    <div className={styles.links}>
      {links.map((l) => (
        <OutLink key={l.label} href={l.href} label={l.label} icon={l.icon} />
      ))}
    </div>
  );
}

function CaseStudy({ content }: { content: TripUpContent }) {
  const { hero, links, sections, end } = content;
  const extras: Record<Extra, React.ReactNode> = {
    coverage: <CoverageMatrix coverage={content.coverage} />,
    "money-stats": <Stats items={content.moneyStats} />,
    "motion-rules": <Stats items={content.motionRules} />,
    perf: <FrameChart perf={content.perf} />,
  };

  return (
    <TripUpShell credits={content.credits} icon={hero.icon}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.h1}>
          {hero.title}
          <span className={styles.titleRest}>: {hero.summary}</span>
        </h1>
        <div className={styles.tags}>
          {hero.tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
        <Links links={links} />
      </section>

      <div className={`${styles.heroMedia} ${hero.video && hero.videoAspect ? styles.heroPhone : ""}`}>
        {hero.video ? (
          <AutoVideo
            src={mediaUrl(hero.video)}
            poster={hero.videoPoster ? mediaUrl(hero.videoPoster) : undefined}
            label={hero.videoCaption}
            style={hero.videoAspect ? { aspectRatio: hero.videoAspect } : undefined}
          />
        ) : (
          <Placeholder hero type="video" aspect="16 / 9" file={hero.videoFile} caption={hero.videoCaption} />
        )}
      </div>

      {sections.map((section, i) => (
        <CaseStudySection
          key={section.id}
          section={section}
          index={i}
          extra={section.extra ? extras[section.extra] : undefined}
        />
      ))}

      <section className={styles.end}>
        <h2 className={styles.title}>
          {end.title}
          <span className={styles.titleRest}>: {end.summary}</span>
        </h2>
        <Links links={links} />
      </section>
    </TripUpShell>
  );
}
