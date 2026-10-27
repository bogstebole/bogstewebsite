import Link from "next/link";
import glass from "@/components/ui/GlassButton.module.css";
import styles from "./tripup.module.css";
import { AutoVideo } from "./auto-video";
import {
  isPendingLink,
  mediaUrl,
  STEP_LABEL,
  type CaseSection,
  type Coverage,
  type FrameTimes,
  type LinkIcon,
  type MediaItem,
  type Stat,
  type Step,
} from "./types";

/**
 * The frame around the case study: TripUp's icon on top and credits at the
 * bottom, both once unlocked. The icon is sealed media, so the password form
 * has an empty header.
 */
export function TripUpShell({
  children,
  credits,
  icon,
}: {
  children: React.ReactNode;
  credits?: string;
  icon?: string;
}) {
  return (
    <div className={styles.page} id="top">
      <header className={styles.header}>
        {icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(icon)} alt="TripUp" width={48} height={48} className={styles.icon} />
        )}
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

// Simple Icons (CC0), on a 24 × 24 grid, each in its brand colour.
const LOGO_PATHS: Record<Exclude<LinkIcon, "figma" | "drive">, string> = {
  web: "M24 22.525H0l12-21.05 12 21.05z",
  android:
    "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z",
  ios: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
};

/** Figma's mark in its five colours. */
function FigmaLogo() {
  return (
    <svg className={styles.linkLogo} viewBox="0 0 38 57" aria-hidden>
      <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  );
}

/** Google Drive's mark in its colours. */
function DriveLogo() {
  return (
    <svg className={styles.linkLogo} viewBox="0 0 87.3 78" aria-hidden>
      <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" />
      <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" />
      <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" />
      <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" />
      <path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
      <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" />
    </svg>
  );
}

/**
 * A square glass button that leaves the site, showing only the logo of where
 * it goes; the label is its name and tooltip. A "#todo-" link shows dimmed.
 */
export function OutLink({ href, label, icon }: { href: string; label: string; icon: LinkIcon }) {
  const pending = isPendingLink(href);
  const name = pending ? `${label}, coming soon` : label;
  return (
    <a
      href={href}
      aria-label={name}
      title={name}
      {...(pending ? { "aria-disabled": true } : { target: "_blank", rel: "noopener noreferrer" })}
      className={`${glass.glassBtn} ${glass.sizeM} ${styles.link} ${pending ? styles.pending : ""}`}
    >
      {icon === "figma" ? (
        <FigmaLogo />
      ) : icon === "drive" ? (
        <DriveLogo />
      ) : (
        <svg className={`${styles.linkLogo} ${styles[`logo-${icon}`]}`} viewBox="0 0 24 24" aria-hidden>
          <path d={LOGO_PATHS[icon]} />
        </svg>
      )}
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
      <AutoVideo
        src={mediaUrl(item.src)}
        poster={item.poster ? mediaUrl(item.poster) : undefined}
        label={item.caption}
        style={{ aspectRatio: item.aspect }}
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

type MediaRow = { kind: "flat" | "phone" | "thumb"; items: MediaItem[] };

const rowKind = (item: MediaItem): MediaRow["kind"] =>
  item.size === "phone" || item.size === "thumb" ? item.size : "flat";

/**
 * In the order they come: pictures two to a row (wide ones take the row),
 * phone screens three to a row, small screens four to a row.
 */
export function Media({ items }: { items: MediaItem[] }) {
  const rows = items.reduce<MediaRow[]>((out, item) => {
    const last = out.at(-1);
    if (last?.kind === rowKind(item)) last.items.push(item);
    else out.push({ kind: rowKind(item), items: [item] });
    return out;
  }, []);
  const key = (i: MediaItem) => i.src ?? i.file ?? i.caption;
  return (
    <div className={styles.media}>
      {rows.map((row) => (
        <div
          key={key(row.items[0])}
          className={row.kind === "phone" ? styles.mediaPhones : row.kind === "thumb" ? styles.mediaThumbs : styles.mediaGrid}
          style={row.kind === "phone" ? ({ "--phones": Math.min(row.items.length, 3) } as React.CSSProperties) : undefined}
        >
          {row.items.map((item) => (
            <MediaFigure key={key(item)} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** The chain of thought: one short line per step, labelled, on a rail. */
export function Chain({ steps }: { steps: Step[] }) {
  return (
    <ol className={styles.chain}>
      {steps.map((step, i) => (
        <li key={i} className={`${styles.step} ${styles[step.kind] ?? ""}`}>
          <span className={styles.label}>{STEP_LABEL[step.kind]}</span>
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
        <span className={styles.sectionNum} aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 id={`${section.id}-title`} className={styles.title}>
          {section.title}
          <span className={styles.titleRest}>: {section.summary}</span>
        </h2>
      </div>
      <Chain steps={section.steps} />
      {!section.extraLast && extra}
      {section.media && section.media.length > 0 && <Media items={section.media} />}
      {section.extraLast && extra}
    </section>
  );
}
