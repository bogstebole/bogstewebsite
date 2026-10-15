import { ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import AnswerActionsBasic from "../../examples/answer-actions/basic";
import AnswerActionsWhatIsDrawn from "../../examples/answer-actions/what-is-drawn";
import AnswerActionsVerdict from "../../examples/answer-actions/verdict";
import AnswerActionsReveal from "../../examples/answer-actions/reveal";

export const meta = {
  title: "AnswerActions",
  description: "Copy, regenerate and a verdict, under an answer that has settled.",
};

export default function AnswerActionsPage() {
  return (
    <>
      <DocHeader title="AnswerActions" description={meta.description}>
        <ImportLine names={["AnswerActions", "type Verdict"]} />
      </DocHeader>

      <ComponentPreview file="answer-actions/basic.tsx" minHeight={260}>
        <AnswerActionsBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Under a finished answer: take it away, ask for another, say whether it was any good.",
          "Composing your own turn row, where ChatTurnRow is not drawing one for you.",
        ]}
        avoid={[
          "An answer still arriving. Offering to copy half an answer, or to rate one, is offering the wrong thing.",
          <>
            Moving between regenerated answers. That is a <DocLink to="components/branch">Branch</DocLink>, which sits
            beside this row.
          </>,
        ]}
      />
      <p>
        <strong>Only what has somewhere to report is drawn.</strong> No <code>onRegenerate</code>, no regenerate button; no{" "}
        <code>onFeedback</code>, no thumbs. A control that calls nothing looks like a feature and behaves like a dead end.
        Copy is the exception, because it has somewhere to go without you (the clipboard) unless the answer has no text
        at all, in which case there is nothing to copy and no button.
      </p>
      <p>
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws this row for you, and shows it only once the
        answer settles. It holds the row’s place while the answer streams, so finishing changes what is seen and not where
        anything is.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="what-is-drawn">What is drawn</H3>
      <p>
        Each handler adds its control. Anything you pass as children goes after the built-in ones (a share button, a
        bookmark), and a ghost <DocLink to="components/button">Button</DocLink> with an icon matches them.
      </p>
      <ComponentPreview file="answer-actions/what-is-drawn.tsx">
        <AnswerActionsWhatIsDrawn />
      </ComponentPreview>

      <H3 id="verdict">Taking a verdict back</H3>
      <p>
        <code>feedback</code> is controlled, for a host that stores the verdict. Pressing the thumb already given reports{" "}
        <code>null</code>: that is how somebody takes it back. Each thumb says which one is pressed with{" "}
        <code>aria-pressed</code>.
      </p>
      <ComponentPreview file="answer-actions/verdict.tsx">
        <AnswerActionsVerdict />
      </ComponentPreview>

      <H3 id="reveal">Revealed on hover</H3>
      <p>
        With <code>reveal</code> the row is invisible until it is pointed at or focused. It still takes its space and still
        hit-tests, so nothing shifts when it appears and nothing is out of reach, and <code>:focus-within</code> brings it
        back for anyone arriving by keyboard.
      </p>
      <ComponentPreview file="answer-actions/reveal.tsx">
        <AnswerActionsReveal />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: "text", type: "string", required: true, description: "The answer these act on. Copy takes it; with no text there is no copy button." },
          { name: "onCopy", type: "(text: string) => void", default: "writes to the clipboard", description: "Called instead of the clipboard write. The button confirms either way." },
          { name: "onRegenerate", type: "() => void", description: "Leave out and no regenerate button is drawn." },
          { name: "onFeedback", type: '(verdict: "up" | "down" | null) => void', description: "Leave out and no thumbs are drawn. null when a verdict is taken back." },
          { name: "feedback", type: '"up" | "down" | null', default: "null", description: "The verdict given, controlled." },
          { name: "busy", type: "boolean", default: "false", description: "While an answer is being regenerated. The button spins and refuses a second press." },
          { name: "reveal", type: "boolean", default: "false", description: "Invisible until hovered or focused. Still occupies its space." },
          { name: "children", type: "ReactNode", description: "Your own controls, after the built-in ones." },
          {
            name: "labels",
            type: 'Partial<Record<"copy" | "copied" | "regenerate" | "up" | "down", string>>',
            description: (
              <>
                The buttons’ accessible names and tooltips. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
