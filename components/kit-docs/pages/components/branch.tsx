import { ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import BranchBasic from "../../examples/branch/basic";
import BranchEnds from "../../examples/branch/ends";
import BranchLabels from "../../examples/branch/labels";

export const meta = {
  title: "Branch",
  description: "Which of a turn’s answers is on screen, and the way to the others, so regenerating compares rather than overwrites.",
};

export default function BranchPage() {
  return (
    <>
      <DocHeader title="Branch" description={meta.description}>
        <ImportLine names={["Branch"]} />
      </DocHeader>

      <ComponentPreview file="branch/basic.tsx" minHeight={240}>
        <BranchBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A turn that has been answered more than once, after regenerate.",
          "Letting somebody step back to an earlier answer and compare it with the new one.",
        ]}
        avoid={[
          "Paging through anything else: results, a carousel. It is named, and read out, as answers.",
          "A turn answered once. It draws nothing then, on purpose.",
        ]}
      />
      <p>
        Regenerating used to overwrite: the answer being compared against was gone the moment the second one started. But
        the only reason to press regenerate is to find out whether a second attempt is better, and there is no better once
        the first has been thrown away. So a regenerated answer is <strong>added</strong>, and this is how you reach the
        others. Press regenerate in the example above, then walk back.
      </p>
      <p>
        With <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink> you do not hold the versions yourself: a turn carries{" "}
        <code>versions</code> and <code>versionIndex</code>, the hook returns <code>showVersion(id, index)</code>, and{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws this control beside the{" "}
        <DocLink to="components/answer-actions">answer actions</DocLink> when you give it <code>onShowVersion</code>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="ends">At the ends, and alone</H3>
      <p>
        The arrows disable at either end rather than wrap (there is no answer zero) and stay drawn, so the control keeps
        its shape. The count is set in tabular figures, so walking through it does not jog the arrows sideways.{" "}
        <code>index</code> out of range is clamped. And with fewer than two
        answers it returns <code>null</code>: a control reading “1 of 1” offers to take you nowhere, so a turn answered once
        looks exactly as it did before there were versions.
      </p>
      <ComponentPreview file="branch/ends.tsx">
        <BranchEnds />
      </ComponentPreview>

      <H3 id="labels">Words for screen readers</H3>
      <p>
        What is drawn is two arrows and “2/4”. What is said is in <code>labels</code>: the arrows are named{" "}
        <code>previous</code> and <code>next</code>, and the group is named by <code>position</code>, which fills in{" "}
        <code>{"{index}"}</code> and <code>{"{total}"}</code>. The count is not a live region: moving to another answer
        replaces the answer itself, and that is what a reader wants read out.
      </p>
      <ComponentPreview file="branch/labels.tsx">
        <BranchLabels />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: "total", type: "number", required: true, description: "How many answers this turn has had. Under 2, nothing is drawn." },
          { name: "index", type: "number", required: true, description: "Which one is on screen, from zero. Out of range is clamped." },
          { name: "onSelect", type: "(index: number) => void", required: true, description: "Called with the index an arrow points to." },
          {
            name: "labels",
            type: "Partial<BranchLabels>",
            description: (
              <>
                <code>previous</code> (“Previous answer”), <code>next</code> (“Next answer”) and <code>position</code>{" "}
                (“Answer {"{index}"} of {"{total}"}”). See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
