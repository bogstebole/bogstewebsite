import { ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ToolBasic from "../../examples/tool/basic";
import ToolStates from "../../examples/tool/states";
import ToolLifecycle from "../../examples/tool/lifecycle";
import ToolPlainText from "../../examples/tool/plain-text";

export const meta = {
  title: "Tool",
  description: "One tool call on the way to an answer: what was run, what with, and what came back.",
};

export default function ToolPage() {
  return (
    <>
      <DocHeader title="Tool" description={meta.description}>
        <ImportLine names={["Tool"]} />
      </DocHeader>

      <ComponentPreview file="tool/basic.tsx" minHeight={300}>
        <ToolBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Showing what an agent did while it worked: a search, a file read, a query.",
          "Letting somebody check the input and output of a call without leaving the answer.",
          "Surfacing a failure the answer depends on.",
        ]}
        avoid={[
          "A step that needs a decision before it runs. That is an Approval.",
          "A list of steps the agent plans to take. That is a TaskList.",
        ]}
      />
      <p>
        <strong>Shut by default</strong> (because most of the time nobody cares) and <strong>open when it failed</strong>,
        because an error nobody can see has not been reported. That is derived from the state rather than forced by an
        effect, so a call that fails later opens itself, while one somebody deliberately shut stays shut.
      </p>
      <p>
        In a conversation you rarely render it yourself: a <code>tool</code> part streamed from your{" "}
        <DocLink to="usage">send handler</DocLink> is drawn as one by <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">States</H3>
      <p>
        <code>pending</code>, <code>running</code>, <code>done</code> and <code>error</code>. The state is never carried
        by colour alone: the glyph changes shape, and the row says which state it is in, in words only a screen reader
        hears.
      </p>
      <ComponentPreview file="tool/states.tsx">
        <ToolStates />
      </ComponentPreview>

      <H3 id="lifecycle">A call as it happens</H3>
      <p>Only <code>state</code> changes; the duration appears once the call has finished. Press replay to run it again.</p>
      <ComponentPreview file="tool/lifecycle.tsx" minHeight={200}>
        <ToolLifecycle />
      </ComponentPreview>

      <H3 id="input-and-output">Text, JSON, or your own element</H3>
      <p>
        <strong>What you give it decides how it is drawn.</strong> A string is text: wrapping{" "}
        <code>&quot;Belgrade, 24°C&quot;</code> in a fence would put it in quotes with its newlines spelled out. An
        object is JSON, in a <DocLink to="components/code-block">CodeBlock</DocLink> with its copy button. An element is
        left alone.
      </p>
      <ComponentPreview file="tool/plain-text.tsx" minHeight={360}>
        <ToolPlainText />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: "name", type: "string", required: true, description: "What was called. Set in mono: it is an identifier, not prose." },
          { name: "state", type: '"pending" | "running" | "done" | "error"', default: '"done"', description: "Where the call is." },
          { name: "summary", type: "ReactNode", description: "A sentence for what it did: “Searched the web”, “Read 3 files”." },
          { name: "input", type: "unknown", description: "What it was called with. A string is text, an object is JSON, an element is rendered untouched." },
          { name: "output", type: "unknown", description: "What came back. Read the same way as input." },
          { name: "error", type: "ReactNode", description: "What went wrong. Drawn instead of the output, and opens the row." },
          { name: "duration", type: "number", description: "How long it took, in ms. Shown once it has finished." },
          { name: "open", type: "boolean", description: "Open, controlled. Leave out and the row keeps its own." },
          { name: "defaultOpen", type: "boolean", default: 'state === "error"', description: "Where it starts." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the row is opened or shut." },
          { name: "labels", type: "Partial<ToolLabels>", description: <>The words it uses: <code>input</code>, <code>output</code>, <code>error</code>, and one per state. See <DocLink to="labels">Labels</DocLink>.</> },
        ]}
      />
    </>
  );
}
