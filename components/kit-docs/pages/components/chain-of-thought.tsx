import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ChainOfThoughtBasic from "../../examples/chain-of-thought/basic";
import ChainOfThoughtLive from "../../examples/chain-of-thought/live";
import ChainOfThoughtWithTool from "../../examples/chain-of-thought/with-tool";
import ChainOfThoughtFailedStep from "../../examples/chain-of-thought/failed-step";

export const meta = {
  title: "ChainOfThought",
  description: "How the answer was arrived at, step by step, each step following from the one above it.",
};

export default function ChainOfThoughtPage() {
  return (
    <>
      <DocHeader title="ChainOfThought" description={meta.description}>
        <ImportLine names={["ChainOfThought", "type Thought"]} />
      </DocHeader>

      <ComponentPreview file="chain-of-thought/basic.tsx" align="start">
        <ChainOfThoughtBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Thinking that has structure: conclusions reached one after another, each resting on the last.",
          "Showing which step of a derivation a tool call belonged to.",
        ]}
        avoid={[
          <>
            Unstructured thinking: one block of prose is a <DocLink to="components/reasoning">Reasoning</DocLink>.
          </>,
          <>
            Steps known up front that the agent is about to work through: that is a plan, and a{" "}
            <DocLink to="components/task-list">TaskList</DocLink>.
          </>,
        ]}
      />
      <p>Three components in the kit draw a sequence, and the line between them is the only reason there are three:</p>
      <ul>
        <li>
          <strong>Reasoning</strong> is prose: the model talking to itself, unstructured.
        </li>
        <li>
          <strong>TaskList</strong> is a plan: known up front, in a fixed order, its items changing state as work
          happens.
        </li>
        <li>
          <strong>ChainOfThought</strong> is a derivation: backward-looking, and it <em>grows</em>. Each step follows
          from the one above it.
        </li>
      </ul>
      <p>
        That last word is what the line down the glyph column draws. A task list has no line between its items,
        because a plan’s items do not follow from each other: they are a set, in an order somebody chose.
      </p>
      <p>
        It opens and folds on the same terms as Reasoning: open while it thinks, folded once the answer starts, and
        overruled for good by anybody who touches it.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="while-it-thinks">While it thinks</H3>
      <p>
        With <code>state=&quot;thinking&quot;</code> the header carries the running step’s label rather than a count:
        that is the question somebody watching is asking, and the reason to look at a folded chain at all. When it is
        done it folds to “Thought through 3 steps” and the time. Press replay to watch it again.
      </p>
      <ComponentPreview file="chain-of-thought/live.tsx" minHeight={300} align="start">
        <ChainOfThoughtLive />
      </ComponentPreview>

      <H3 id="with-a-tool">A step that ran a tool</H3>
      <p>
        A step’s <code>body</code> is whatever you put there: prose, or the <DocLink to="components/tool">Tool</DocLink>{" "}
        call the step made. The working belongs to the step, not to a footnote under the chain.
      </p>
      <ComponentPreview file="chain-of-thought/with-tool.tsx" align="start">
        <ChainOfThoughtWithTool />
      </ComponentPreview>

      <H3 id="failed-step">A step that failed</H3>
      <p>
        Each step is in one of the same four states as a tool call (<code>pending</code>, <code>running</code>,{" "}
        <code>done</code>, <code>error</code>), drawn with the same glyphs. A step left without a state is{" "}
        <code>done</code>: a step you can read is a step that happened. A failure stays in the chain, because the step
        after it follows from it.
      </p>
      <ComponentPreview file="chain-of-thought/failed-step.tsx" align="start">
        <ChainOfThoughtFailedStep />
      </ComponentPreview>

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        Streamed from your <DocLink to="usage">send handler</DocLink> as a <code>chain</code> part, and drawn by{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>. Parts merge by <code>id</code> and the merge is
        shallow, so each update carries the whole <code>steps</code> array as it stands.
      </p>
      <Code
        code={`
yield { kind: "chain", id: "c1", state: "thinking", steps: [
  { id: "read", label: "The question is about size, not mass", body: "…" },
  { id: "check", label: "Checking the measured value", state: "running" },
] };

// …later, finished. Steps are replaced whole.
yield { kind: "chain", id: "c1", state: "done", duration: 4200, steps: finalSteps };`}
      />
      <p>
        Send either a <code>chain</code> or a <code>reasoning</code> part for one stretch of thinking, not both: they
        are the same job at two grains.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>section</code> except <code>title</code>.
      </p>
      <PropsTable
        rows={[
          { name: "steps", type: "Thought[]", required: true, description: "The derivation, in order. See the shape below." },
          {
            name: "state",
            type: '"thinking" | "done"',
            default: '"done"',
            description: "The chain as a whole. Thinking holds it open and narrates the running step.",
          },
          {
            name: "duration",
            type: "number",
            description: "How long the whole chain took, in ms. Shown once it is done; without one the header gives the count alone.",
          },
          { name: "open", type: "boolean", description: "Open, controlled. Leave it out and the chain looks after itself." },
          { name: "defaultOpen", type: "boolean", description: "Where it starts, overruling the chain’s own preference." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the chain is opened or shut." },
          {
            name: "labels",
            type: "Partial<ChainLabels>",
            description: (
              <>
                <code>through</code>, <code>step</code>, <code>steps</code> (“Thought through 3 steps”) and{" "}
                <code>thinking</code>. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="thought">Thought</H3>
      <Code
        code={`
interface Thought {
  id: string;
  /** What this step established. One line. */
  label: ReactNode;
  /** The working behind it: prose, or anything you want drawn, like a <Tool>. */
  body?: ReactNode;
  /** "pending" | "running" | "done" | "error". Defaults to "done". */
  state?: WorkState;
}`}
      />
    </>
  );
}
