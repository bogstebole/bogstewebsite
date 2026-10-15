import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ContextSlider from "../../examples/context/slider";
import ContextLevels from "../../examples/context/levels";
import ContextLabels from "../../examples/context/labels";
import ContextInHeader from "../../examples/context/in-header";

export const meta = {
  title: "Context",
  description: "How full the context window is: a small meter that explains why a long conversation starts forgetting.",
};

export default function ContextPage() {
  return (
    <>
      <DocHeader title="Context" description={meta.description}>
        <ImportLine names={["Context"]} />
      </DocHeader>

      <ComponentPreview file="context/slider.tsx" minHeight={220}>
        <ContextSlider />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A conversation long enough to fill the model’s window.",
          "Showing, before it happens, that the oldest messages are about to drop out.",
        ]}
        avoid={[
          "Billing, quotas or rate limits: it measures one window, not an account.",
          "A progress bar for a task. It is a gauge of something filling, not of something finishing.",
        ]}
      />
      <p>
        <strong>Small on purpose.</strong> It is a gauge, not a feature, and it earns its place for one reason: it is
        the only honest way to explain why a long conversation starts forgetting. Without it, the forgetting looks like
        the model being stupid rather than the window being full.
      </p>
      <p>
        That is why the warning says <em>what happens next</em> rather than only that a number is high. “82%” tells
        somebody nothing they can act on. The whole sentence (how much is used, of how much, and that the oldest
        messages will start dropping out) is the meter’s accessible name and its <code>title</code>, so it
        reaches a pointer and a screen reader alike. It is a <code>role=&quot;meter&quot;</code> with its value on it,
        so assistive technology can read the number without parsing the sentence.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="levels">Quiet, warning, over</H3>
      <p>
        Two colours, not three: quiet until <code>warnAt</code> (80% by default), then the danger colour. A gauge with
        an amber in the middle makes somebody learn a scale to read a number they can already see.
      </p>
      <p>
        <code>used</code> past <code>total</code> is clamped to 100%, because a host summing its own tokens will
        overshoot before it notices. A <code>total</code> of zero reads as 0%: a window that has not been reported
        yet, not one that is full.
      </p>
      <ComponentPreview file="context/levels.tsx">
        <ContextLevels />
      </ComponentPreview>

      <H3 id="labels">What it says</H3>
      <p>
        <code>label</code> is what is drawn beside the ring: the percentage by default, your own text, or{" "}
        <code>false</code> for the ring alone. <code>labels</code> is what it <em>says</em>: the words of the sentence
        above, for another language. Keep <code>nearlyFull</code> a statement of what happens next.
      </p>
      <ComponentPreview file="context/labels.tsx">
        <ContextLabels />
      </ComponentPreview>

      <H3 id="in-a-header">In a header</H3>
      <p>
        Its usual home is the <DocLink to="components/chat-header">ChatHeader</DocLink>, as a child. Keep the
        percentage there: a bare ring beside a row of icon buttons reads as a spinner: something loading, not
        something measured. <code>label=&#123;false&#125;</code> is for places where nothing else around it could be
        mistaken for one.
      </p>
      <ComponentPreview file="context/in-header.tsx">
        <ContextInHeader />
      </ComponentPreview>

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        The meter is not a part of a turn. It describes the whole conversation, so it is never streamed. With{" "}
        <DocLink to="components/chat-experience">ChatExperience</DocLink> you give it the window’s size and it puts a
        meter in its header, counting what the conversation has spent at about four characters to the token.{" "}
        <code>contextBase</code> is what the system prompt and tool definitions cost before anybody types.
      </p>
      <Code
        code={`
<ChatExperience
  onSend={send}
  contextTotal={200_000}
  contextBase={3_200}
/>`}
      />
      <p>
        When the window actually fills, <code>ChatExperience</code> also says so in the conversation, with a{" "}
        <DocLink to="components/system-message">SystemMessage</DocLink> that is announced once. A real app that knows
        its exact usage from its API can draw <code>Context</code> itself with those numbers instead.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code> except <code>title</code>, which carries the sentence.
      </p>
      <PropsTable
        rows={[
          { name: "used", type: "number", required: true, description: "How much of the window is spent: tokens, or whatever unit you count in." },
          { name: "total", type: "number", required: true, description: "The size of the window, in the same unit. 0 means not reported yet." },
          { name: "warnAt", type: "number", default: "0.8", description: "The fraction where it stops being quiet." },
          {
            name: "label",
            type: "ReactNode | false",
            default: "the percentage",
            description: <>Drawn beside the ring. <code>false</code> for the ring on its own.</>,
          },
          {
            name: "labels",
            type: "Partial<ContextLabels>",
            description: (
              <>
                <code>name</code>, <code>of</code>, <code>tokens</code> and <code>nearlyFull</code>: the words of the
                spoken sentence. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
