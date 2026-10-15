import { promises as fs } from "fs";
import path from "path";
import type { ReactNode } from "react";
import { CodeBlock } from "inline-chat-kit";
import { PreviewTabs } from "./preview-tabs";
import styles from "./docs.module.css";

/**
 * The parts every docs page is written in. Server components: a page is
 * prose and tables around a few live examples, and only the examples (and
 * the tabs that hold them) need to be on the client.
 */

export function DocHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  /** Under the description: an import line, a status, a link. */
  children?: ReactNode;
}) {
  return (
    <header className={styles.docHeader}>
      <h1 className={styles.docTitle}>{title}</h1>
      <p className={styles.docDescription}>{description}</p>
      {children}
    </header>
  );
}

/** A section heading other pages and the "On this page" list can link to. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className={styles.h2}>
      <a href={`#${id}`}>{children}</a>
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3 id={id} className={styles.h3}>
      <a href={`#${id}`}>{children}</a>
    </h3>
  );
}

/** A note worth stopping for. Used sparingly, or it stops being one. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className={styles.callout}>
      {title && <strong className={styles.calloutTitle}>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}

/** A code sample, drawn by the kit's own `CodeBlock`. */
export function Code({ code, lang = "tsx", label }: { code: string; lang?: string; label?: string }) {
  return <CodeBlock className={styles.code} code={code.trim()} lang={lang} label={label} />;
}

/** `import { Tool } from "inline-chat-kit";`, the first line anybody copies. */
export function ImportLine({ names, from = "inline-chat-kit" }: { names: string[]; from?: string }) {
  return <Code lang="tsx" label="import" code={`import { ${names.join(", ")} } from "${from}";`} />;
}

/**
 * A live example and the file it lives in.
 *
 * The code tab shows the example's own source, read from disk when the page
 * is built, so what is shown is what is running. There is no second copy of
 * the snippet to drift from it.
 *
 * `file` is relative to `components/kit-docs/examples`.
 */
export async function ComponentPreview({
  file,
  children,
  align = "center",
  minHeight,
  bleed = false,
}: {
  file: string;
  children: ReactNode;
  /** Where the example sits in the frame. `start` for things wider than tall. */
  align?: "center" | "start";
  minHeight?: number;
  /** No padding: for full-height assemblies that draw their own edges. */
  bleed?: boolean;
}) {
  const source = await fs.readFile(
    path.join(/* turbopackIgnore: true */ process.cwd(), "components/kit-docs/examples", file),
    "utf8"
  );
  return (
    <PreviewTabs
      code={source.trim()}
      filename={path.basename(file)}
      align={align}
      minHeight={minHeight}
      bleed={bleed}
    >
      {children}
    </PreviewTabs>
  );
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: ReactNode;
}

/**
 * Every prop a component takes, what it is, and what it is for.
 *
 * The same shape serves any name → type list (the kinds of a turn part, the
 * fields of a type): rename the columns with `nameLabel` and `typeLabel`. The
 * Default column is only drawn when a row has a default.
 */
export function PropsTable({
  rows,
  nameLabel = "Prop",
  typeLabel = "Type",
}: {
  rows: PropRow[];
  nameLabel?: string;
  typeLabel?: string;
}) {
  const hasDefault = rows.some((row) => row.default);
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{nameLabel}</th>
            <th>{typeLabel}</th>
            {hasDefault && <th>Default</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code className={styles.propName}>
                  {row.name}
                  {row.required && <span className={styles.required} aria-label="required">*</span>}
                </code>
              </td>
              <td>
                <code className={styles.propType}>{row.type}</code>
                <div className={styles.propDescription}>{row.description}</div>
              </td>
              {hasDefault && (
                <td>
                  {row.default ? <code className={styles.propType}>{row.default}</code> : <span className={styles.none}>none</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A plain reference table, for anything that is not a list of props. The last column wraps. */
export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={j === row.length - 1 ? styles.wrap : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Use it when … / Not for …": the context a props table cannot give. */
export function UsageNotes({ use, avoid }: { use: ReactNode[]; avoid?: ReactNode[] }) {
  return (
    <div className={styles.usage}>
      <div>
        <span className={styles.usageLabel}>Use it for</span>
        <ul>
          {use.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      {avoid && avoid.length > 0 && (
        <div>
          <span className={styles.usageLabel}>Not for</span>
          <ul>
            {avoid.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
