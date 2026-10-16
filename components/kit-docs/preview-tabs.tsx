"use client";

import { useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { CodeBlock } from "inline-chat-kit";
import styles from "./docs.module.css";

type Tab = "preview" | "code";

const subscribe = () => () => {};

/** False on the server and during hydration, true once in the browser. */
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

/**
 * Preview and Code, one frame.
 *
 * The preview stays mounted while the code is showing, so somebody who opened
 * a tool call, read the code and came back finds it as they left it. Replay
 * remounts it instead, for the examples that stream or animate in, which
 * otherwise only ever play once.
 *
 * Examples are drawn in the browser only. Several of them hold state the
 * server cannot reproduce (a turn's random id, a timer, the clipboard), and
 * an example that fails hydration fails as a demo of the component.
 */
export function PreviewTabs({
  code,
  filename,
  align,
  minHeight,
  bleed,
  children,
}: {
  code: string;
  filename: string;
  align: "center" | "start";
  minHeight?: number;
  bleed: boolean;
  children: ReactNode;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const [run, setRun] = useState(0);
  const id = useId();
  const mounted = useMounted();

  return (
    <div className={styles.preview}>
      <div className={styles.previewBar} role="tablist" aria-label="Example">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${id}-${t}-tab`}
            aria-selected={tab === t}
            aria-controls={`${id}-${t}`}
            className={styles.previewTab}
            data-active={tab === t || undefined}
            onClick={() => setTab(t)}
          >
            {t === "preview" ? "Preview" : "Code"}
          </button>
        ))}
        {tab === "preview" && (
          <button
            type="button"
            className={styles.replay}
            onClick={() => setRun((n) => n + 1)}
            aria-label="Replay example"
            title="Replay"
          >
            <RotateCcw size={14} aria-hidden />
          </button>
        )}
      </div>

      <div
        role="tabpanel"
        id={`${id}-preview`}
        aria-labelledby={`${id}-preview-tab`}
        hidden={tab !== "preview"}
        data-md-skip
        className={styles.previewStage}
        data-align={align}
        data-bleed={bleed || undefined}
        style={minHeight ? { minHeight } : undefined}
      >
        <div key={run} className={styles.previewInner}>
          {mounted && children}
        </div>
      </div>

      {/* Always in the page, hidden until asked for: a reader who never opens
          the tab and an agent reading the HTML both get the example's source. */}
      <div
        role="tabpanel"
        id={`${id}-code`}
        aria-labelledby={`${id}-code-tab`}
        hidden={tab !== "code"}
        className={styles.previewCode}
        data-md-lang="tsx"
      >
        <CodeBlock code={code} lang="tsx" label={filename} />
      </div>
    </div>
  );
}
