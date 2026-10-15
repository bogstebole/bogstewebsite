import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import TextHighlighterMarker from "../../examples/text-highlighter/marker";
import TextHighlighterModes from "../../examples/text-highlighter/modes";
import TextHighlighterMarkdown from "../../examples/text-highlighter/markdown";
import TextHighlighterMarkingOff from "../../examples/text-highlighter/marking-off";

export const meta = {
  title: "TextHighlighter",
  description: "An answer, rendered from markdown, that the reader can mark up, to keep a passage or to ask about it.",
};

export default function TextHighlighterPage() {
  return (
    <>
      <DocHeader title="TextHighlighter" description={meta.description}>
        <ImportLine names={["TextHighlighter"]} />
      </DocHeader>

      <ComponentPreview file="text-highlighter/marker.tsx" minHeight={280}>
        <TextHighlighterMarker />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Drawing an answer the reader can mark: a passage to keep, or one sentence to ask about rather than the whole answer.",
          "Opening a thread on a passage: the highlight menu’s “Reply in thread” hands you the text and where it is.",
          "Rendering streamed markdown, with or without marking.",
        ]}
        avoid={[
          "Text the reader writes: that is ChatInput.",
          "Untrusted HTML. Raw HTML in the text is dropped, not rendered.",
        ]}
      />
      <p>
        In a conversation you rarely place it yourself: <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws
        every answer through it, and <DocLink to="components/chat-experience">ChatExperience</DocLink> adds saved
        highlights, the marker/precise toggle and threads around it.
      </p>
      <p>
        <strong>The marker does not care about markdown.</strong> Internally the words stay a flat array of tokens
        addressed by index, and markdown only decides which element each token is drawn inside. So a stroke that starts
        in plain text and ends inside <code>**bold**</code> is one run of indices like any other. Fenced code blocks are
        the exception: they are preformatted, so they are not split into tokens and cannot be marked. They get a copy
        button instead.
      </p>
      <p>
        <strong>It works without a mouse.</strong> Tab to the answer, move by word with the left and right arrows, hold
        shift to extend, press Enter to highlight and Escape to clear. Each highlight then gets an invisible button in the
        tab order; focusing one lights up its mark, and Enter opens its menu. A native selection (a double-click, a
        triple-click, shift and the arrows) becomes a highlight in either mode, too.
      </p>
      <Callout title="Wrap it in a div, not a p">
        It renders block-level elements (paragraphs, lists, the marker overlay). A <code>&lt;div&gt;</code> inside a{" "}
        <code>&lt;p&gt;</code> is invalid HTML and causes a hydration mismatch under SSR.
      </Callout>

      <H2 id="examples">Examples</H2>

      <H3 id="marker-and-precise">Marker or precise</H3>
      <p>
        <code>marker</code>, the default, draws a freeform stroke and snaps it to the words it crossed. <code>precise</code>{" "}
        gives the pointer back to the browser’s own text selection, character by character. Switching modes closes any
        open menu. With <DocLink to="components/custom-cursor">CustomCursor</DocLink> mounted, the pointer becomes a
        marker or a text caret to match: the surface carries <code>data-cursor=&quot;marker&quot;</code> or{" "}
        <code>&quot;text&quot;</code>.
      </p>
      <ComponentPreview file="text-highlighter/modes.tsx" minHeight={300}>
        <TextHighlighterModes />
      </ComponentPreview>

      <H3 id="markdown-and-citations">Markdown and citations</H3>
      <p>
        Headings, emphasis, links, lists, blockquotes, inline and fenced code, tables and strikethrough all render.{" "}
        <code>[^1]</code> becomes an <DocLink to="components/sources">InlineCitation</DocLink> pointing at{" "}
        <code>sources[0]</code>; a marker whose source has not arrived yet still draws, as a number, and starts working
        when the list does. Without <code>onSelectSource</code> the numbers are not controls.
      </p>
      <ComponentPreview file="text-highlighter/markdown.tsx" minHeight={420}>
        <TextHighlighterMarkdown />
      </ComponentPreview>

      <H3 id="marking-off">Marking off</H3>
      <p>
        <code>marking={"{false}"}</code> draws the answer and nothing else: no marker layer, no menu, nothing in the tab
        order, no cursor of its own. For a product with no use for highlights, which should not have to see them switched
        off in its own interface. Markdown, code blocks and citations are unchanged. They are the answer itself.
      </p>
      <ComponentPreview file="text-highlighter/marking-off.tsx">
        <TextHighlighterMarkingOff />
      </ComponentPreview>

      <H3 id="reply-in-thread">Replying in a thread</H3>
      <p>
        The highlight menu has two actions, “Reply in thread” and “Remove highlight”. The first calls{" "}
        <code>onReplyInThread</code> with the passage and its bounding box in viewport coordinates, exactly what{" "}
        <DocLink to="components/reply-thread-popup">ReplyThreadPopup</DocLink> takes as <code>activeReply</code>. The
        live example is on that page.
      </p>
      <Code
        code={`
const [reply, setReply] = useState<{ text: string; rect: DOMRect } | null>(null);

<TextHighlighter text={answer} onReplyInThread={(text, rect) => setReply({ text, rect })} />
{reply && (
  <ReplyThreadPopup activeReply={reply} onClose={() => setReply(null)} onSendMessage={askAboutPassage} />
)}
`}
      />

      <H2 id="api">API</H2>
      <p>
        Takes only the props below: no <code>className</code> or <code>div</code> attributes. Size and colour the text
        from a wrapper: the component inherits its font size and line height.
      </p>
      <PropsTable
        rows={[
          {
            name: "text",
            type: "string",
            required: true,
            description: "The answer, as markdown. Re-parsed when it changes, so it can be streamed in.",
          },
          {
            name: "marking",
            type: "boolean",
            default: "true",
            description: "Whether the answer can be marked at all. false draws it as plain prose.",
          },
          {
            name: "selectionMode",
            type: '"marker" | "precise"',
            default: '"marker"',
            description: "A freeform drawn marker, or native character-level selection.",
          },
          {
            name: "onHighlightComplete",
            type: "(highlightedText: string) => void",
            description: "Called with the passage each time a highlight is made, by pointer or keyboard.",
          },
          {
            name: "onReplyInThread",
            type: "(text: string, rect: DOMRect) => void",
            description: "The reader chose “Reply in thread”. The rect is the highlight’s box, in viewport coordinates.",
          },
          {
            name: "sources",
            type: "Source[]",
            description: (
              <>
                What <code>[^1]</code>, <code>[^2]</code>… point at, in the order the answer cites them. See{" "}
                <DocLink to="components/sources">Sources</DocLink>.
              </>
            ),
          },
          {
            name: "onSelectSource",
            type: "(index: number, source?: Source) => void",
            description: "Called when a citation number is pressed. Without it, the numbers are not controls.",
          },
        ]}
      />
      <p>
        Its words (the menu, the keyboard hint read on focus, the highlight count) come from the{" "}
        <code>highlighter</code> group of <DocLink to="labels">labels</DocLink>. Parsing costs about 0.9 ms per 1,000
        characters and runs once per frame while an answer streams: fine for an ordinary answer, not for a book.
      </p>
    </>
  );
}
