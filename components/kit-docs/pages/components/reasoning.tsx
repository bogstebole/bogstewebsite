import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ReasoningStreaming from "../../examples/reasoning/streaming";
import ReasoningStates from "../../examples/reasoning/states";
import ReasoningStaysOpen from "../../examples/reasoning/stays-open";

export const meta = {
  title: "Reasoning",
  description: "What the model worked through before it answered: open while it thinks, folded away once the answer starts.",
};

export default function ReasoningPage() {
  return (
    <>
      <DocHeader title="Reasoning" description={meta.description}>
        <ImportLine names={["Reasoning"]} />
      </DocHeader>

      <ComponentPreview file="reasoning/streaming.tsx" minHeight={380} align="start">
        <ReasoningStreaming />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A model’s thinking as it streams: prose, in the model’s own words.",
          "Keeping that thinking reachable after the answer, for when the answer looks wrong.",
        ]}
        avoid={[
          <>
            Thinking that comes in steps which follow from one another: that is a{" "}
            <DocLink to="components/chain-of-thought">ChainOfThought</DocLink>.
          </>,
          <>
            Something that ran, with an input and an output: that is a <DocLink to="components/tool">Tool</DocLink>.
          </>,
        ]}
      />
      <p>
        <strong>Open while it thinks, folded once the answer starts.</strong> Thinking is worth watching while it
        happens and worth almost nothing afterwards, but it has to stay reachable, because the times it matters are
        exactly the times the answer looks wrong.
      </p>
      <p>
        Folding is the block’s <em>preference</em>, not something done to the reader. Open it and it stays open,
        however many times the state changes underneath; shut it and it stays shut.
      </p>
      <p>
        It is prose with a rule down the side rather than a box. A tool call is a record of something that ran and
        gets a panel; thinking is the model talking to itself, and boxing it would give it a weight it has not earned.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">States</H3>
      <p>
        <code>thinking</code> and <code>done</code>. While it thinks, the word in the header shimmers: the kit’s way
        of saying “provisional” everywhere. It is a real word in a real button rather than a loader, because a loader
        is decorative and hidden from screen readers, and hiding this one would leave a control with no name.
      </p>
      <ComponentPreview file="reasoning/states.tsx" align="start">
        <ReasoningStates />
      </ComponentPreview>

      <H3 id="reader-wins">The reader has the last word</H3>
      <p>
        Shut it while it is still thinking, then press <strong>Finish thinking</strong>: it stays shut. Open it after
        it has folded, then press <strong>Think again</strong>: it stays open. A block nobody has touched still follows
        its state.
      </p>
      <ComponentPreview file="reasoning/stays-open.tsx" minHeight={280} align="start">
        <ReasoningStaysOpen />
      </ComponentPreview>

      <H3 id="timing">Timing</H3>
      <p>
        Leave <code>duration</code> out and the block times itself, from the moment it starts thinking to the moment
        it stops: that is what the example at the top of this page does. Pass one when you already know: replaying a
        saved transcript, where the thinking did not happen just now and there is nothing to time. Without one, a block
        that mounts already done says only “Thought”.
      </p>
      <Code
        code={`
// Live: no duration, it measures itself.
<Reasoning state={thinking ? "thinking" : "done"}>{thoughts}</Reasoning>

// Replayed from storage: say how long it took.
<Reasoning state="done" duration={turn.thoughtMs}>{turn.thoughts}</Reasoning>`}
      />

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        You rarely render it yourself. Your <DocLink to="usage">send handler</DocLink> streams a{" "}
        <code>reasoning</code> part, and <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws it as a{" "}
        <code>Reasoning</code>. Parts are merged by <code>id</code>, shallowly: send the whole text so far as it grows,
        then the state change on its own: the text that arrived before it is still there.
      </p>
      <Code
        code={`
const send: SendHandler = async function* (message) {
  yield { kind: "reasoning", id: "r1", text: "Two numbers matter here.", state: "thinking" };
  yield { kind: "reasoning", id: "r1", text: "Two numbers matter here. The mass, and how well it is known." };
  yield { kind: "reasoning", id: "r1", state: "done" };
  yield "The Higgs boson weighs about 125.25 GeV.";
};`}
      />
      <p>
        <code>reasoning</code> and <code>chain</code> are the same job at two grains: a block of prose, or steps
        that follow from one another. Sending both for one stretch of thinking says it twice.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code> except <code>title</code>.
      </p>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", required: true, description: "The thinking itself. Prose: line breaks in a string are kept." },
          { name: "state", type: '"thinking" | "done"', default: '"done"', description: "Still working it out, or finished. Thinking holds it open; done lets it fold." },
          { name: "duration", type: "number", description: "How long it took, in ms. Left out, the block times itself." },
          { name: "open", type: "boolean", description: "Open, controlled. Leave it out and the block looks after itself." },
          { name: "defaultOpen", type: "boolean", description: "Where it starts, overruling the block’s own preference." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the block is opened or shut." },
          {
            name: "labels",
            type: "Partial<ReasoningLabels>",
            description: (
              <>
                <code>thinking</code>, <code>thought</code>, <code>thoughtFor</code> (“Thought for 12s”). See{" "}
                <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
