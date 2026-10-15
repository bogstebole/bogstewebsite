import { ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ChipAnswers from "../../examples/chip/answers";
import ChipAnswerChips from "../../examples/chip/answer-chips";
import ChipLongValue from "../../examples/chip/long-value";
import ChipEntering from "../../examples/chip/entering";

export const meta = {
  title: "Chip",
  description: "A small, self-contained value: an answer given, a count, a tag.",
};

export default function ChipPage() {
  return (
    <>
      <DocHeader title="Chip" description={meta.description}>
        <ImportLine names={["Chip", "answerChips"]} />
      </DocHeader>

      <ComponentPreview file="chip/answers.tsx">
        <ChipAnswers />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "An answer somebody already gave, shown in the row it folded into.",
          "A count (“+2”) or a short tag beside a title.",
        ]}
        avoid={[
          "Anything pressable: a chip is a span, not a control. Use a Button.",
          "Files somebody attached. Those are Attachments.",
          "Sentences. It never wraps.",
        ]}
      />
      <p>
        The kit uses it where a <DocLink to="components/question-card">QuestionCard</DocLink> folds into one row once it
        is answered: the short title on one side, the answer as chips on the other. A chip is a badge that holds words, so
        it is the badge’s height (<code>--ick-badge-size</code>) and takes the badge’s inner corner rather than a full
        pill: two shapes for one level of nesting would be a wobble, not a hierarchy.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="from-an-answer">From a question’s answer</H3>
      <p>
        <code>answerChips(question, answer)</code> is what a folded QuestionCard uses to turn an answer into chip text:
        two values at most, then a count, because three chips of unpredictable width beside a title make a row that
        wraps, and a summary that wraps is not a summary.
      </p>
      <ComponentPreview file="chip/answer-chips.tsx">
        <ChipAnswerChips />
      </ComponentPreview>

      <H3 id="long-values">Long values</H3>
      <p>
        A chip never wraps. It stops growing at <code>--ick-chip-max</code>, 180px by default, and the rest is clipped,
        cut mid-word, with no ellipsis. Keep values short, and when you control the text, shorten it yourself.
      </p>
      <ComponentPreview file="chip/long-value.tsx">
        <ChipLongValue />
      </ComponentPreview>

      <H3 id="entering">Arriving</H3>
      <p>
        Each chip springs in from a slightly smaller scale when it mounts, so a value appearing reads as arriving rather
        than as the row jumping. With reduced motion it only fades in. Press replay to watch it again.
      </p>
      <ComponentPreview file="chip/entering.tsx">
        <ChipEntering />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Takes only these two props: no event handlers, no ARIA attributes. It renders a <code>span</code>.
      </p>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", required: true, description: "The value. Text, optionally with a small icon." },
          { name: "className", type: "string", description: "Added to the chip’s own class." },
        ]}
      />
      <p>
        Its height, corner, fill and maximum width are <code>--ick-chip-height</code>, <code>--ick-chip-radius</code>,{" "}
        <code>--ick-chip-fill</code> and <code>--ick-chip-max</code>. See <DocLink to="theming">Theming</DocLink>.
      </p>
    </>
  );
}
