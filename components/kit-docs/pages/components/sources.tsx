import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import SourcesTogether from "../../examples/sources/together";
import SourcesMarkers from "../../examples/sources/markers";
import SourcesList from "../../examples/sources/list";
import SourcesCollapsible from "../../examples/sources/collapsible";

export const meta = {
  title: "Sources & InlineCitation",
  description: "What an answer was drawn from: numbered markers in the prose, and the list they point to.",
};

export default function SourcesPage() {
  return (
    <>
      <DocHeader title="Sources & InlineCitation" description={meta.description}>
        <ImportLine names={["Sources", "InlineCitation", "type Source"]} />
      </DocHeader>

      <ComponentPreview file="sources/together.tsx" minHeight={340}>
        <SourcesTogether />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "An answer built on things somebody can go and read: search results, documents, uploaded files.",
          "Tying a specific claim in the prose to the passage that supports it.",
        ]}
        avoid={[
          <>
            Showing the search that found them: that is a <DocLink to="components/tool">Tool</DocLink>; the list is
            what the answer <em>stands on</em>.
          </>,
          "Links that are part of the answer itself. A source is evidence, not a recommendation.",
        ]}
      />
      <p>
        <strong>The citation marker and the highlight marker are the same interaction seen twice.</strong> The kit
        already has a way of saying “this run of words is picked out”: the marker somebody draws over an answer to ask
        about it. A citation is that same statement made by the answer rather than the reader, so it is drawn the same
        way, in the same yellow, rather than in a second visual language nobody has learned.
      </p>
      <p>
        Pressing a marker <strong>marks</strong> the entry it points at instead of scrolling to it. The list is already
        under the answer, and moving the page under somebody who clicked a number in a sentence they were reading loses
        them the sentence.
      </p>
      <p>
        The list is <strong>open by default</strong>. Sources are the difference between an answer somebody can check
        and one they have to trust, and folding them away by default says the opposite of what a citation is for.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="markers">Markers, with and without a passage</H3>
      <p>
        Give <code>InlineCitation</code> the passage as <code>children</code> and the passage is marked; give it none
        and the number stands on its own after whatever precedes it. Without <code>onSelect</code> the marker is not a
        control and does not pretend to be one. It is a note with an accessible name, “Source 1: <em>title</em>”.
      </p>
      <ComponentPreview file="sources/markers.tsx">
        <SourcesMarkers />
      </ComponentPreview>

      <H3 id="entries">Entries</H3>
      <p>
        A <code>Source</code> with a <code>url</code> is a link that opens in a new tab; without one it is a row, not a
        link: the right thing for a file somebody uploaded. <code>origin</code> names where it is (a domain, a file, a
        page) and <code>quote</code> is the passage that carries the claim. The number in the list wears the same
        square as the marker in the text, so the two read as one thing counted twice.
      </p>
      <ComponentPreview file="sources/list.tsx">
        <SourcesList />
      </ComponentPreview>

      <H3 id="collapsible">Collapsible</H3>
      <p>
        <code>collapsible</code> lets the list fold into its header row, which keeps the count. It is opt-in, and it
        still starts open unless you say otherwise with <code>defaultOpen=&#123;false&#125;</code>: do that where the
        sources are secondary, like a long research thread where every answer carries a list.
      </p>
      <ComponentPreview file="sources/collapsible.tsx">
        <SourcesCollapsible />
      </ComponentPreview>

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        Your <DocLink to="usage">send handler</DocLink> streams a <code>sources</code> part, drawn as a{" "}
        <code>Sources</code> by <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>. In the prose,{" "}
        <code>[^1]</code> is a citation marker, and the number is a position in that part’s list:
      </p>
      <Code
        code={`
const send: SendHandler = async function* (message) {
  yield { kind: "sources", id: "s", sources: [atlas, pdg] };
  yield "The combined figure is 125.25 GeV[^1], to a fifth of a percent[^2].";
};`}
      />
      <p>
        Each <code>[^n]</code> draws as an <code>InlineCitation</code> carrying that source’s title, and the marker is
        left out of the answer’s words, so a highlight drawn across the sentence, and the text a thread quotes back, do
        not contain a stray “[1]”. Order the list by the order the answer cites it, not by rank.
      </p>
      <Callout title="Send the list first">
        Send the <code>sources</code> part <em>before</em> the prose that cites it, so the markers come up already
        knowing what they point at. Sent after, they draw bare and fill in later, which works, and looks like a bug.
      </Callout>
      <p>
        This is the kit’s one extension to markdown. GFM spells footnotes the same way but wants a{" "}
        <code>[^1]: …</code> definition in the document; a model streams the marker and sends the list beside the text,
        never below it.
      </p>

      <H2 id="api">API</H2>

      <H3 id="sources-props">Sources</H3>
      <p>
        Also takes every attribute of a <code>section</code> except <code>title</code> and <code>onSelect</code>, which
        are the props below.
      </p>
      <PropsTable
        rows={[
          { name: "sources", type: "Source[]", required: true, description: "The list, numbered from 1 in this order: the numbers the markers use." },
          { name: "title", type: "ReactNode", default: "labels.title", description: "Heads the list. “Sources” by default; the count is always beside it." },
          { name: "collapsible", type: "boolean", default: "false", description: "Offer to fold the list into its own row." },
          { name: "activeId", type: "string | null", default: "null", description: "The entry just arrived at from a marker. Marked, not scrolled to." },
          { name: "onSelect", type: "(source: Source, index: number) => void", description: "Called when a linked entry is opened. index is 1-based." },
          { name: "open", type: "boolean", description: "Open, controlled. Only has an effect when collapsible." },
          { name: "defaultOpen", type: "boolean", default: "true", description: "Where a collapsible list starts." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the list is opened or shut." },
          {
            name: "labels",
            type: "Partial<SourcesLabels>",
            description: (
              <>
                <code>title</code>, and <code>one</code> / <code>many</code> for the count (“3 sources”). See{" "}
                <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="inline-citation-props">InlineCitation</H3>
      <p>
        Also takes every attribute of a <code>span</code> except <code>children</code> and <code>onSelect</code>, which
        are the props below.
      </p>
      <PropsTable
        rows={[
          { name: "index", type: "number", required: true, description: "1-based, and it has to match the entry’s place in Sources." },
          { name: "source", type: "Source", description: "Named in the marker’s accessible name, so it says more than a number." },
          { name: "children", type: "ReactNode", description: "The passage this citation speaks for. Given one, it is marked." },
          { name: "onSelect", type: "(index: number, source?: Source) => void", description: "Where the reader is taken. Without one the marker is not a control." },
          {
            name: "labels",
            type: "Partial<{ cite: string }>",
            description: (
              <>
                <code>cite</code>: the “Source” in “Source 2: <em>title</em>”. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="source">Source</H3>
      <Code
        code={`
interface Source {
  id: string;
  title: string;
  /** Opened when the entry is a link. Without one it is a row, not a link. */
  url?: string;
  /** A domain, a filename, a page: whatever names where this is. */
  origin?: string;
  /** The passage in the source that carries the claim. */
  quote?: string;
}`}
      />
    </>
  );
}
