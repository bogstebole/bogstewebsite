import type { Metadata } from "next";
import pkg from "inline-chat-kit/package.json";
import "inline-chat-kit/styles.css";
import { DocsShell } from "@/components/kit-docs/docs-shell";
import { DOCS_THEME_SCRIPT } from "@/components/kit-docs/theme";

export const metadata: Metadata = {
  title: { template: "%s · inline-chat-kit", default: "inline-chat-kit" },
  description:
    "An inline AI chat experience for React. The input is the message: it morphs into the bubble, and the answer streams beneath it.",
};

/**
 * The inline-chat-kit docs: every component, live, with its code, its props
 * and the reasoning behind it. The demo itself is one level down, at /demo.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DOCS_THEME_SCRIPT }} />
      <DocsShell version={pkg.version}>{children}</DocsShell>
    </>
  );
}
