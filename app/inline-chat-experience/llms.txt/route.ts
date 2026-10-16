import { DOCS_NAV } from "@/components/kit-docs/nav";
import { DOCS_REGISTRY } from "@/components/kit-docs/registry";
import { markdownResponse, markdownUrl, siteOrigin } from "@/components/kit-docs/markdown";

/* The index an agent reads first (llmstxt.org): what the kit is, and every
   page as a link to its markdown with one line on what it covers. */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = siteOrigin(request);
  const sections = await Promise.all(
    DOCS_NAV.map(async (group) => {
      const lines = await Promise.all(
        group.items.map(async (item) => {
          const { meta } = await DOCS_REGISTRY[item.path]();
          return `- [${item.title}](${markdownUrl(origin, item.path)}): ${meta.description}`;
        })
      );
      return `## ${group.title}\n\n${lines.join("\n")}`;
    })
  );

  const body = `# inline-chat-kit

> An inline AI chat experience for React. The input is the message: when you send, the pill you typed into morphs into the bubble that holds your text, and the answer streams in below it. Install with \`npm install inline-chat-kit motion lucide-react\` and import \`inline-chat-kit/styles.css\` once.

Every page below is also a web page at the same address without \`.md\`. The whole documentation in one file: ${origin}/inline-chat-experience/llms-full.txt. The npm package ships its README, getting-started.md, theming.md and typed declarations with doc comments.

${sections.join("\n\n")}

## Optional

- [Live demo](${origin}/inline-chat-experience/demo): every part of the kit in one scripted conversation, no backend.
- [npm](https://www.npmjs.com/package/inline-chat-kit)
- [Source](https://github.com/bogstebole/chat-experience)
`;
  return markdownResponse(body, "text/plain");
}
