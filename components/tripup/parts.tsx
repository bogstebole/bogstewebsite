import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import glass from "@/components/ui/GlassButton.module.css";
import styles from "./tripup.module.css";
import {
  isPendingLink,
  mediaUrl,
  STEP_LABEL,
  type CaseSection,
  type Coverage,
  type FrameTimes,
  type MediaItem,
  type Stat,
  type Step,
} from "./types";

/** The frame around the case study: the way home on top, credits at the bottom once unlocked. */
export function TripUpShell({ children, credits }: { children: React.ReactNode; credits?: string }) {
  return (
    <div className={styles.page} id="top">
      <header className={styles.header}>
        <Link href="/" aria-label="Back to home" style={{ display: "inline-flex" }}>
          <Logo />
        </Link>
      </header>

      <main className={styles.main}>{children}</main>

      {credits !== undefined && (
        <footer className={styles.footer}>
          {credits && <p>{credits}</p>}
          <div className={styles.footerRow}>
            <a href="#top">Back to top</a>
            <Link href="/" style={{ marginLeft: "auto" }}>
              Made by Bogdan
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
}

/** A glass button that leaves the site. A "#todo-" link shows dimmed, marked "soon". */
export function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pending = isPendingLink(href);
  return (
    <a
      href={href}
      {...(pending ? { "aria-disabled": true, title: "Link to come" } : { target: "_blank", rel: "noopener noreferrer" })}
      className={`${glass.glassBtn} ${glass.sizeM} ${styles.link} ${pending ? styles.pending : ""}`}
    >
      {children}
      {pending && <span className={styles.soon}>soon</span>}
    </a>
  );
}

function PlayIcon() {
  return (
    <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="M10 9.2v5.6l4.6-2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="M21 16l-5.5-5-7.5 7" />
    </svg>
  );
}

/** A slot that says exactly what goes there, until the file exists. */
export function Placeholder({
  type,
  caption,
  file,
  aspect,
  hero = false,
}: {
  type: MediaItem["type"];
  caption: string;
  file?: string;
  aspect: string;
  hero?: boolean;
}) {
  const kind = type === "video" ? "Video to record" : "Screenshot to add";
  return (
    <div
      role="img"
      aria-label={`${kind}: ${caption}`}
      className={`${styles.placeholder} ${hero ? styles.heroPlaceholder : ""}`}
      style={{ "--ratio": aspect } as React.CSSProperties}
    >
      {type === "video" ? <PlayIcon /> : <ImageIcon />}
      <span className={styles.placeholderKind}>{kind}</span>
      {hero && <span className={styles.heroPlaceholderText}>{caption}</span>}
      {file && <span className={styles.placeholderFile}>{file}</span>}
    </div>
  );
}

function MediaFigure({ item }: { item: MediaItem }) {
  let content: React.ReactNode;
  if (!item.src) {
    content = <Placeholder type={item.type} caption={item.caption} file={item.file} aspect={item.aspect} />;
  } else if (item.type === "video") {
    content = (
      <video
        src={mediaUrl(item.src)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        style={{ aspectRatio: item.aspect }}
        aria-label={item.caption}
      />
    );
  } else {
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={mediaUrl(item.src)}
        alt={item.caption}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <figure className={`${styles.figure} ${styles[item.size]}`}>
      {content}
      <figcaption className={styles.caption}>{item.caption}</figcaption>
    </figure>
  );
}

/** Pictures two to a row (wide ones take the row), then phone screens side by side. */
export function Media({ items }: { items: MediaItem[] }) {
  const flat = items.filter((i) => i.size !== "phone");
  const phones = items.filter((i) => i.size === "phone");
  const key = (i: MediaItem) => i.src ?? i.file ?? i.caption;
  return (
    <div className={styles.media}>
      {flat.length > 0 && (
        <div className={styles.mediaGrid}>
          {flat.map((item) => (
            <MediaFigure key={key(item)} item={item} />
          ))}
        </div>
      )}
      {phones.length > 0 && (
        <div className={styles.mediaPhones}>
          {phones.map((item) => (
            <MediaFigure key={key(item)} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/** The chain of thought: one short line per step, labelled, on a rail. */
export function Chain({ steps }: { steps: Step[] }) {
  return (
    <ol className={styles.chain}>
      {steps.map((step, i) => (
        <li key={i} className={`${styles.step} ${styles[step.kind] ?? ""}`}>
          <span className={styles.mono}>{STEP_LABEL[step.kind]}</span>
          <p className={styles.stepText}>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Stats({ items }: { items: Stat[] }) {
  return (
    <div className={styles.stats}>
      {items.map((s) => (
        <div key={s.label} className={styles.stat}>
          <span className={styles.statValue}>{s.value}</span>
          <span className={styles.statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

const MARK_CLASS: Record<number, string> = {
  2: styles.markYes,
  1: styles.markPart,
  0: styles.markNo,
  [-1]: styles.markUnknown,
};

const MARK_LABEL: Record<number, string> = { 2: "yes", 1: "partly", 0: "no", [-1]: "not confirmed" };

/** A grid of rows against columns, each cell a dot: yes, partly, no or not confirmed. */
export function CoverageMatrix({ coverage }: { coverage: Coverage }) {
  const { columns, rows, note } = coverage;
  return (
    <div>
      <div className={styles.matrixWrap}>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th scope="col">App</th>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.app} className={row.goal ? styles.goalRow : undefined}>
                <td>{row.goal ? `${row.app} (the goal)` : row.app}</td>
                {row.marks.map((m, i) => (
                  <td key={columns[i]}>
                    <span
                      className={`${styles.mark} ${MARK_CLASS[m]}`}
                      role="img"
                      aria-label={`${columns[i]}: ${MARK_LABEL[m]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.legend}>
        <span>
          <span className={`${styles.mark} ${styles.markYes}`} /> does it
        </span>
        <span>
          <span className={`${styles.mark} ${styles.markPart}`} /> partly
        </span>
        <span>
          <span className={`${styles.mark} ${styles.markNo}`} /> doesn&apos;t
        </span>
        <span>
          <span className={`${styles.mark} ${styles.markUnknown}`} /> not confirmed
        </span>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}

/** Time per frame, before and after, against the budget for one frame. */
export function FrameChart({ perf }: { perf: FrameTimes }) {
  const max = Math.max(perf.budgetMs, ...perf.rows.map((r) => r.before)) * 1.02;
  const pct = (ms: number) => `${(ms / max) * 100}%`;
  return (
    <div className={styles.chart}>
      <div className={styles.chartKey}>
        <span>
          <span className={`${styles.swatch} ${styles.barBefore}`} /> before
        </span>
        <span>
          <span className={`${styles.swatch} ${styles.barAfter}`} /> after
        </span>
        <span>
          <span className={`${styles.swatch} ${styles.swatchBudget}`} /> {perf.budgetMs} ms, one frame at 60 Hz
        </span>
        {perf.note && <span>{perf.note}</span>}
      </div>
      {perf.rows.map((row) => (
        <div key={row.scenario} className={styles.chartRow}>
          <span className={styles.chartLabel}>{row.scenario}</span>
          <div className={styles.bars} role="img" aria-label={`${row.scenario}: ${row.before} ms before, ${row.after} ms after`}>
            <div className={`${styles.bar} ${styles.barBefore}`} style={{ width: pct(row.before) }} />
            <div className={`${styles.bar} ${styles.barAfter}`} style={{ width: pct(row.after) }} />
            <span className={styles.barValues}>
              {row.before.toFixed(1)} → {row.after.toFixed(1)}
            </span>
            <span className={styles.budget} style={{ left: pct(perf.budgetMs) }} aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}

/** One decision chain: title, the steps, then a visual. */
export function CaseStudySection({
  section,
  index,
  extra,
}: {
  section: CaseSection;
  index: number;
  extra?: React.ReactNode;
}) {
  return (
    <section id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
      <div className={styles.sectionHead}>
        <span className={styles.mono}>{String(index + 1).padStart(2, "0")}</span>
        <h2 id={`${section.id}-title`} className={styles.title}>
          {section.title}
          <span className={styles.titleRest}>: {section.summary}</span>
        </h2>
      </div>
      <Chain steps={section.steps} />
      {extra}
      {section.media && section.media.length > 0 && <Media items={section.media} />}
    </section>
  );
}
