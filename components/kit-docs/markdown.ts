import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse, type HTMLElement } from "node-html-parser";
import { DOCS_PAGES, DOCS_ROOT } from "./nav";

/**
 * The docs as markdown, for agents and anybody who wants the text alone.
 *
 * Made from the page itself rather than written twice: the rendered HTML is
 * fetched, its article is taken, and what is only there for the eye (the
 * preview frames, the tab bars, copy buttons, icons) is dropped before it is
 * converted. So the markdown says what the page says, including the source of
 * every example, and a change to a page changes both.
 */

const converter = new NodeHtmlMarkdown({ codeFence: "```", bulletMarker: "-" });

/** Where the docs are served, as the reader reached them. */
export function siteOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

export function pageUrl(origin: string, path: string): string {
  return `${origin}${DOCS_ROOT}${path ? `/${path}` : ""}`;
}

export function markdownUrl(origin: string, path: string): string {
  return `${origin}${DOCS_ROOT}${path ? `/${path}` : ""}.md`;
}

export function isDocPath(path: string): boolean {
  return DOCS_PAGES.some((page) => page.path === path);
}

/** One docs page, as markdown. `null` when the page could not be read. */
export async function pageMarkdown(origin: string, path: string): Promise<string | null> {
  // The pages are static, so this is cheap; the response is cached by its headers.
  const response = await fetch(pageUrl(origin, path), { cache: "no-store" });
  if (!response.ok) return null;
  const article = parse(await response.text()).querySelector("article[data-doc-article]");
  if (!article) return null;

  // Only there for the eye.
  for (const node of article.querySelectorAll("[data-md-skip], [role=tablist], button, svg")) node.remove();

  // A heading is a link to itself on the page; in markdown it is a heading.
  for (const anchor of article.querySelectorAll("h1 a, h2 a, h3 a")) anchor.replaceWith(anchor.innerHTML);

  // Code blocks: the kit's CodeBlock is a bar and a <pre>; a fence needs the
  // language, which the wrapper carries, and the bar's label is the file name.
  for (const block of article.querySelectorAll("[data-md-lang]")) {
    const code = block.querySelector("pre code") ?? block.querySelector("pre");
    if (!code) continue;
    const lang = block.getAttribute("data-md-lang") ?? "";
    const label = labelOf(block);
    const caption = label && label !== lang && label !== "import" ? `<p><em>${label}</em></p>` : "";
    block.replaceWith(`${caption}<pre><code class="language-${lang}">${code.innerHTML}</code></pre>`);
  }

  // Links to other pages, absolute, so they still work out of context.
  for (const link of article.querySelectorAll("a[href^='/']")) {
    link.setAttribute("href", `${origin}${link.getAttribute("href")}`);
  }

  for (const label of article.querySelectorAll("[data-md-label]")) {
    label.replaceWith(`<p><strong>${label.innerHTML}</strong></p>`);
  }

  /* Tables are written by hand and put back after the conversion, through a
     placeholder: a props table reads better as a list (a type full of `|`
     breaks a markdown table), and any other table needs its cells flattened
     to one line and their pipes escaped. */
  const blocks: string[] = [];
  const hold = (markdown: string) => `<p>MDBLOCK${blocks.push(markdown) - 1}</p>`;
  for (const table of article.querySelectorAll("table")) {
    table.replaceWith(hold(table.hasAttribute("data-md-props") ? propsList(table) : gfmTable(table)));
  }

  let markdown = converter.translate(article.innerHTML).trim();
  markdown = markdown.replace(/MDBLOCK(\d+)/g, (_, i: string) => blocks[Number(i)]);
  return `${markdown}\n\n---\n\nSource: ${pageUrl(origin, path)}\n`;
}

/** Inline markdown for a fragment, on one line. */
function inline(html: string): string {
  return converter.translate(html).replace(/\s*\n+\s*/g, " ").trim();
}

function propsList(table: HTMLElement): string {
  return table
    .querySelectorAll("tbody tr")
    .map((row) => {
      const name = row.querySelector("[data-md-name]");
      const required = !!name?.querySelector("[aria-label=required]");
      name?.querySelector("[aria-label=required]")?.remove();
      const type = row.querySelector("[data-md-type]")?.text.trim();
      const fallback = row.querySelector("[data-md-default]")?.text.trim();
      const description = inline(row.querySelector("[data-md-description]")?.innerHTML ?? "");
      const head = [
        `\`${name?.text.trim()}\``,
        required ? " (required)" : "",
        type ? `: \`${type}\`` : "",
        fallback ? `, default \`${fallback}\`` : "",
      ].join("");
      return `- ${head}${description ? `. ${description}` : ""}`;
    })
    .join("\n");
}

function gfmTable(table: HTMLElement): string {
  const cells = (row: HTMLElement) =>
    row.querySelectorAll("th, td").map((cell) => inline(cell.innerHTML).replace(/\|/g, "\\|") || " ");
  const head = table.querySelector("thead tr");
  const rows = table.querySelectorAll("tbody tr").map(cells);
  const header = head ? cells(head) : rows.shift() ?? [];
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function labelOf(block: HTMLElement): string | null {
  const pre = block.querySelector("pre");
  const bar = pre?.parentNode?.querySelector("span");
  const text = bar?.text.trim();
  return text ? text : null;
}

export function markdownResponse(body: string, type = "text/markdown"): Response {
  return new Response(body, {
    headers: {
      "content-type": `${type}; charset=utf-8`,
      "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
