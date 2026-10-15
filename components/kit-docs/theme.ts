/**
 * The docs' theme, remembered between visits. It is the kit's `data-theme`
 * on the root element; the demo reads the same key, so a reader who switched
 * the docs to dark opens the demo in dark.
 */

export type DocsTheme = "light" | "dark";

export const DOCS_THEME_KEY = "inline-chat-kit-docs-theme";

export function readDocsTheme(): DocsTheme {
  try {
    return localStorage.getItem(DOCS_THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function writeDocsTheme(theme: DocsTheme) {
  try {
    localStorage.setItem(DOCS_THEME_KEY, theme);
  } catch {
    // Private windows and blocked storage: the choice lasts for the visit.
  }
}

/** Run before the first paint, so a dark reader never sees the page flash light. */
export const DOCS_THEME_SCRIPT = `try{document.documentElement.dataset.theme=localStorage.getItem(${JSON.stringify(
  DOCS_THEME_KEY
)})==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;
