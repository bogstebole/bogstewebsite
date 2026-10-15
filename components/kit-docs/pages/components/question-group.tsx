import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import QuestionGroupBasic from "../../examples/question-group/basic";
import QuestionGroupEdit from "../../examples/question-group/edit";
import QuestionGroupFolded from "../../examples/question-group/folded";
import QuestionGroupReadOnly from "../../examples/question-group/read-only";
import QuestionGroupFoldMotion from "../../examples/question-group/fold-motion";

export const meta = {
  title: "QuestionGroup",
  description:
    "One step of a questionnaire: several questions answered in turn, folded down to a single row once the conversation has moved past them.",
};

const STATE = `const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
const [editing, setEditing] = useState<number | null>(null);

const firstOpen = questions.findIndex((q) => !answers[q.id]);
const done = firstOpen === -1;

<QuestionGroup
  id="care-setup"
  title="Setting up care"
  questions={questions}
  answers={answers}
  activeIndex={editing ?? (done ? null : firstOpen)}
  collapsible={done && questions.length >= FOLDABLE_FROM}
  onCommit={(id, answer) => {
    setAnswers((all) => ({ ...all, [id]: answer }));
    setEditing(null);
  }}
  onEdit={setEditing}
/>`;

const FOLD_MOTION = `interface FoldMotion {
  visualDuration: number; // the ground's resize, in seconds        0.34
  bounce: number;         // the ground's overshoot, 0–1            0.1
  rowDuration: number;    // a row arriving, in seconds             0.3
  rowBounce: number;      // a row's overshoot, 0–1                 0.12
  rowOffset: number;      // how far above its place a row starts   -10
  stagger: number;        // between one row and the next, seconds  0.045
  fadeIn: number;         // a row's fade in, seconds (a tween)     0.16
  fadeOut: number;        // a row's fade out, seconds              0.08
  fadeInDelay: number;    // how long the arriving body waits       0.08
}`;

export default function QuestionGroupPage() {
  return (
    <>
      <DocHeader title="QuestionGroup" description={meta.description}>
        <ImportLine names={["QuestionGroup", "FOLDABLE_FROM", "defaultFoldMotion", "type FoldMotion"]} />
      </DocHeader>

      <ComponentPreview file="question-group/basic.tsx" minHeight={560} align="start">
        <QuestionGroupBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Two or more questions that belong to one step: setting something up, narrowing something down.",
          "Asking them one at a time, with what is still to come visible but dimmed.",
          "Keeping a finished step in the transcript without it taking the screen.",
        ]}
        avoid={[
          <>
            One question on its own. A <DocLink to="components/question-card">QuestionCard</DocLink> is enough.
          </>,
          "A long form. Past a handful of questions, a step should be split into steps.",
        ]}
      />
      <p>
        The group holds the questions; you hold the answers. It reports each one through <code>onCommit</code>, you put it
        in <code>answers</code>, and <code>activeIndex</code> says which question is open. Each card’s state follows from
        those two: the active one is open, answered ones are collapsed rows, the rest are upcoming.
      </p>
      <Code code={STATE} />
      <p>
        <strong>The title names the step and is also the fold control</strong>. That is the point of putting it at the
        top. A control at the top does not move when the body under it changes, so folding stops being two shapes swapping
        places and becomes one header over two bodies. Folded, the body is a single summary row, not a peek at the list: a
        peek costs more height than the answers it shows, and a conversation with four half-open steps above it is
        unreadable.
      </p>
      <p>
        In a conversation, a <code>question</code> part streamed from your <DocLink to="usage">send handler</DocLink> is
        drawn as one of these by <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>, which hands answers back
        through <code>onAnswerQuestion</code> and <code>onEditQuestion</code>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="editing">Editing an earlier answer</H3>
      <p>
        Press an answered row and <code>onEdit</code> reports its index. Make that the <code>activeIndex</code> until the
        new answer is committed, then hand the next unanswered question back. The answer already given seeds the card, so
        changing one field does not mean typing the others again.
      </p>
      <ComponentPreview file="question-group/edit.tsx" minHeight={440} align="start">
        <QuestionGroupEdit />
      </ComponentPreview>

      <H3 id="folding">Folding when done</H3>
      <p>
        <code>collapsible</code> offers the fold, and the group starts folded. The usual rule is “once every question is
        answered and there are at least <code>FOLDABLE_FROM</code> of them”. That constant is 3, because below it folding
        saves less room than the summary row costs. Press the title to open it; the answers can still be edited.
      </p>
      <ComponentPreview file="question-group/folded.tsx" minHeight={300} align="start">
        <QuestionGroupFolded />
      </ComponentPreview>

      <H3 id="read-only">Read-only, and no header</H3>
      <p>
        <code>readOnly</code> turns every collapsed row into a record rather than a control, for a step shown back from an
        earlier session. Without a <code>title</code>, a group that cannot fold has no header at all; a foldable one falls
        back to the count (“3 answers”) so the control still has a name.
      </p>
      <ComponentPreview file="question-group/read-only.tsx" align="start">
        <QuestionGroupReadOnly />
      </ComponentPreview>

      <H3 id="fold-motion">Tuning the fold</H3>
      <p>
        <code>foldMotion</code> overrides any of the fold’s numbers; <code>defaultFoldMotion</code> is what they are
        otherwise. This one runs every timing four times slower. Press the title to watch it. Rows leave and arrive one
        after the next, each a little above its place and settling in, and the arriving body waits until the leaving one
        is gone, so two sentences are never on the same pixels at half opacity.
      </p>
      <ComponentPreview file="question-group/fold-motion.tsx" minHeight={320} align="start">
        <QuestionGroupFoldMotion />
      </ComponentPreview>
      <p>
        Springs move things and tweens fade them. Opacity is bounded at 0 and 1, so a spring with any bounce overshoots into
        a clamp and spends the overshoot sitting still; position and size have no ceiling, which is why they are the ones
        worth springing. Durations are <code>visualDuration</code> rather than stiffness and damping, because “how long is
        this” is the only question anybody tuning it is asking.
      </p>

      <H2 id="api">API</H2>
      <PropsTable
        rows={[
          { name: "id", type: "string", required: true, description: "Keeps one group’s layout animations apart from another’s. Unique per group on the page." },
          { name: "questions", type: "Question[]", required: true, description: <>The step’s questions, in order. See <DocLink to="components/question-card#api-types">Question</DocLink>.</> },
          { name: "answers", type: "Record<string, Answer | undefined>", required: true, description: "Answers so far, by question id." },
          { name: "activeIndex", type: "number | null", default: "null", description: "The question being answered, or null when none is." },
          { name: "title", type: "ReactNode", description: "What the step is about. Also the fold control when there is one." },
          { name: "collapsible", type: "boolean", default: "false", description: "Offer to fold the group into one row. It starts folded." },
          { name: "onCommit", type: "(questionId: string, answer: Answer) => void", description: "An answer was given." },
          { name: "onEdit", type: "(index: number) => void", description: "Somebody asked to change the answer at this index." },
          { name: "readOnly", type: "boolean", default: "false", description: "Answers can be read but not changed." },
          { name: "foldMotion", type: "Partial<FoldMotion>", description: "Overrides for the fold’s timing. See below." },
          { name: "labels", type: 'Partial<Record<"answers", string>>', description: <>The word after the count in the folded row: “3 answers”. See <DocLink to="labels">Labels</DocLink>.</> },
          { name: "className", type: "string", description: "On the group’s ground." },
        ]}
      />

      <H3 id="api-constants">FOLDABLE_FROM and defaultFoldMotion</H3>
      <p>
        <code>FOLDABLE_FROM</code> is <code>3</code>. <code>defaultFoldMotion</code> is a <code>FoldMotion</code>, with the
        defaults shown on the right:
      </p>
      <Code lang="ts" code={FOLD_MOTION} />
    </>
  );
}
