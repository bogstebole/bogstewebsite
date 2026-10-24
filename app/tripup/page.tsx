import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/case-studies";
import { hasTripUpAccess } from "@/lib/tripup-access";
import { loadTripUpContent } from "@/lib/tripup-content";
import styles from "@/components/tripup/tripup.module.css";
import { PasswordGate } from "@/components/tripup/password-gate";
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
        <OutLink key={l.label} href={l.href}>
          {l.label}
        </OutLink>
      ))}
    </div>
  );
}

function CaseStudy({ content }: { content: TripUpContent }) {
  const { hero, links, inShort, story, sections, end } = content;
  const extras: Record<Extra, React.ReactNode> = {
    coverage: <CoverageMatrix coverage={content.coverage} />,
    "money-stats": <Stats items={content.moneyStats} />,
    "motion-rules": <Stats items={content.motionRules} />,
    perf: <FrameChart perf={content.perf} />,
  };

  return (
    <TripUpShell credits={content.credits}>
      {/* Hero */}
      <section className={styles.hero}>
        {hero.icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(hero.icon)} alt="" width={48} height={48} className={styles.icon} />
        )}
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

      <div className={styles.heroMedia}>
        {hero.video ? (
          <video src={mediaUrl(hero.video)} autoPlay loop muted playsInline aria-label={hero.videoCaption} />
        ) : (
          <Placeholder hero type="video" aspect="16 / 9" file={hero.videoFile} caption={hero.videoCaption} />
        )}
      </div>

      {/* In short */}
      <section className={styles.cards} aria-label="In short">
        {inShort.map((c) => (
          <div key={c.title} className={styles.card}>
            <h2 className={styles.cardTitle}>{c.title}</h2>
            <p className={styles.body}>{c.body}</p>
          </div>
        ))}
      </section>

      {/* The brief's story */}
      <section className={styles.storyBlock} aria-labelledby="story-title">
        <h2 id="story-title" className={styles.title}>
          {story.title}
          <span className={styles.titleRest}>: {story.summary}</span>
        </h2>
        <ol className={styles.story}>
          {story.steps.map((step, i) => (
            <li key={step} className={styles.storyStep}>
              <span className={styles.storyNum}>{String(i + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Contents */}
      <nav className={styles.contents} aria-label="Contents">
        <span className={styles.mono}>{content.contentsLabel}</span>
        <ol className={styles.contentsList}>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={styles.contentsLink}>
                <span className={styles.storyNum}>{String(i + 1).padStart(2, "0")}</span>
                {s.short}
              </a>
            </li>
          ))}
        </ol>
      </nav>

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
