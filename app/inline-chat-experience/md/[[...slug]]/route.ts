import { isDocPath, markdownResponse, pageMarkdown, siteOrigin } from "@/components/kit-docs/markdown";

/* Reached as /inline-chat-experience/<page>.md, through a rewrite in
   next.config.ts. Made from the page on request, so it cannot go stale. */
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const path = ((await params).slug ?? []).join("/");
  if (!isDocPath(path)) return new Response("Not found", { status: 404 });
  const markdown = await pageMarkdown(siteOrigin(request), path);
  if (!markdown) return new Response("Could not read the page", { status: 502 });
  return markdownResponse(markdown);
}
