import { DOCS_PAGES } from "@/components/kit-docs/nav";
import { markdownResponse, pageMarkdown, siteOrigin } from "@/components/kit-docs/markdown";

/* Every docs page as markdown, in sidebar order, in one file: for an agent
   that would rather read everything once than follow links. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = siteOrigin(request);
  const pages: (string | null)[] = [];
  // A few at a time: each one is a render of a page.
  for (let i = 0; i < DOCS_PAGES.length; i += 6) {
    const batch = DOCS_PAGES.slice(i, i + 6);
    pages.push(...(await Promise.all(batch.map((page) => pageMarkdown(origin, page.path)))));
  }
  return markdownResponse(pages.filter(Boolean).join("\n\n"), "text/plain");
}
