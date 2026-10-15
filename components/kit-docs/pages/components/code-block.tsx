import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import CodeBlockBasic from "../../examples/code-block/basic";
import CodeBlockLanguages from "../../examples/code-block/languages";
import CodeBlockBar from "../../examples/code-block/bar";
import CodeBlockLongLines from "../../examples/code-block/long-lines";
import CodeBlockFallback from "../../examples/code-block/fallback";
import CodeBlockInAnAnswer from "../../examples/code-block/in-an-answer";

export const meta = {
  title: "CodeBlock",
  description: "A fenced block: its language, a copy button, and code that scrolls sideways rather than widening the answer.",
};

const PRELOAD = `import { loadHighlighter } from "inline-chat-kit";

// Once, at start-up: every block is then coloured from its first paint.
void loadHighlighter();`;

const TOKENS = `:root {
  --ick-code-keyword: #c678dd;
  --ick-code-string: #98c379;
  --ick-code-comment: #7f848e;
  --ick-code-name: #61afef;
  --ick-code-number: #d19a66;
  --ick-code-attr: #e5c07b;
}`;

const FUNCTIONS = `// Fetch the grammars, once. Concurrent callers share the one request.
loadHighlighter(): Promise<Highlighter>

// Whether the language, or one of its aliases, is one of the eleven. Loads nothing.
canHighlight(lang?: string): boolean`;

export default function CodeBlockPage() {
  return (
    <>
      <DocHeader title="CodeBlock" description={meta.description}>
        <ImportLine names={["CodeBlock", "loadHighlighter", "canHighlight"]} />
      </DocHeader>

      <ComponentPreview file="code-block/basic.tsx">
        <CodeBlockBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Code, commands, config: anything somebody will want to copy exactly.",
          "Inside your own cards and tool output, to match the fences in an answer.",
        ]}
        avoid={[
          "Prose that happens to be monospaced. A fence turns newlines into a block and wraps nothing.",
          <>
            A whole file somebody will read rather than copy. That belongs in an{" "}
            <DocLink to="components/artifact">ArtifactPane</DocLink>.
          </>,
        ]}
      />
      <p>
        The markdown renderer draws every fence in an answer with this, and <DocLink to="components/tool">Tool</DocLink> uses
        it for JSON input and output. It is exported for anything else.
      </p>
      <p>
        <strong>A block is not markable.</strong> The rest of an answer is split into word tokens so a marker can be drawn
        over it; preformatted text split on whitespace stops being preformatted, so a block renders whole and the{" "}
        <DocLink to="components/text-highlighter">highlighter</DocLink> skips it. Copy is what people want from code anyway.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="languages">Languages</H3>
      <p>
        Eleven are registered: TypeScript, JavaScript, HTML/XML, CSS, JSON, YAML, Bash, Python, SQL, Markdown and diff,
        plus the aliases people actually type (<code>ts</code>, <code>tsx</code>, <code>js</code>, <code>sh</code>,{" "}
        <code>py</code>, <code>yml</code>, …). That covers what a chat shows at half the weight of the common set.
      </p>
      <p>
        The scheme is ink at four weights rather than a syntax palette: the kit is ink, paper and one acid yellow, and a
        dozen colours dropped into it read as somebody else’s component. Six tokens turn it into whatever palette you
        already own:
      </p>
      <Code lang="css" code={TOKENS} />
      <ComponentPreview file="code-block/languages.tsx">
        <CodeBlockLanguages />
      </ComponentPreview>

      <H3 id="bar">The bar</H3>
      <p>
        The label defaults to the language. Give it a filename instead, or <code>label={"{false}"}</code> to drop the
        caption and keep the copy button. With <code>copyable={"{false}"}</code> as well, there is no bar at all, for a
        block nobody is meant to take away.
      </p>
      <ComponentPreview file="code-block/bar.tsx">
        <CodeBlockBar />
      </ComponentPreview>

      <H3 id="long-lines">Long lines</H3>
      <p>A long line scrolls inside the block. The answer around it keeps the width it was.</p>
      <ComponentPreview file="code-block/long-lines.tsx">
        <CodeBlockLongLines />
      </ComponentPreview>

      <H3 id="unknown-language">A language it cannot read</H3>
      <p>
        Anything outside the eleven renders unhighlighted rather than throwing: losing the colour is a small thing, a chat
        that crashes on one answer is not. <code>canHighlight(lang)</code> tells you which it will be without loading
        anything, for a caller deciding what to draw.
      </p>
      <ComponentPreview file="code-block/fallback.tsx">
        <CodeBlockFallback />
      </ComponentPreview>

      <H3 id="in-an-answer">In an answer</H3>
      <p>
        Where it usually lives. Drag across the prose and it takes a marker; the block does not.
      </p>
      <ComponentPreview file="code-block/in-an-answer.tsx">
        <CodeBlockInAnAnswer />
      </ComponentPreview>

      <H3 id="loading">When the colour arrives</H3>
      <p>
        The grammars are 22 kB gzipped (more than a third of the package), so they sit behind a dynamic{" "}
        <code>import()</code> and are not in your bundle until a block needs them. The first block on a page paints its code
        plain and colours in when the chunk lands; every block after that is coloured on its first paint, because the
        loaded highlighter is kept. Only the colour arrives late, so nothing shifts.
      </p>
      <p>
        If that trade is wrong for you (a docs tool where every answer is code), load it at start-up. It is idempotent,
        and concurrent callers share the one fetch.
      </p>
      <Code code={PRELOAD} />

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: "code", type: "string", required: true, description: "What is shown, and what copy takes." },
          { name: "lang", type: "string", description: "The fence’s language. Unknown ones render unhighlighted." },
          { name: "label", type: "string | false", default: "the language", description: "Top-left of the bar. false for no caption." },
          { name: "copyable", type: "boolean", default: "true", description: "false for a block nobody is meant to take away. With label={false}, no bar at all." },
          { name: "onCopy", type: "(code: string) => void", default: "writes to the clipboard", description: "Called instead of the clipboard write." },
          { name: "copiedFor", type: "number", default: "1600", description: "How long the button stays confirmed, in ms." },
          {
            name: "labels",
            type: 'Partial<ChatLabels["codeBlock"]>',
            description: (
              <>
                <code>copy</code>, <code>copyCode</code>, <code>copied</code> and <code>copiedAnnouncement</code>: what the
                live region says. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="api-functions">loadHighlighter and canHighlight</H3>
      <Code lang="ts" code={FUNCTIONS} />
    </>
  );
}
