import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import QuestionCardBasic from "../../examples/question-card/basic";
import QuestionCardStates from "../../examples/question-card/states";
import QuestionCardMulti from "../../examples/question-card/multi";
import QuestionCardFields from "../../examples/question-card/fields";
import QuestionCardSummaries from "../../examples/question-card/summaries";
import ComposedQuestion from "../../examples/question-card/composed";
import QuestionParts from "../../examples/question-card/parts";

export const meta = {
  title: "QuestionCard",
  description:
    "One structured question inside a conversation (answered by picking or typing rather than writing it out), in whichever of its three states it is in.",
};

const TYPES = `interface Common {
  id: string;
  title: string;
  subtitle?: string;
  /** What it is called once it is answered and folded into a row. */
  shortTitle: string;
}

type Question =
  | (Common & { type: "inputs"; fields: QuestionField[] })
  | (Common & { type: "single"; options: QuestionOption[] })
  | (Common & {
      type: "multi";
      options: QuestionOption[];
      allowOther?: boolean;       // a free-text "something else" row
      otherPlaceholder?: string;
      allowEmpty?: boolean;       // "none of these" is an answer
    });

interface QuestionOption {
  id: string;
  title: string;
  description?: string;
  short?: string;                 // used when several are chosen
}

interface QuestionField {
  id: string;
  label: string;
  placeholder?: string;
  optional?: boolean;
}

type Answer =
  | { values: Record<string, string> }        // inputs: field id → text
  | { optionId: string }                      // single
  | { optionIds: string[]; other?: string };  // multi

type QuestionState = "upcoming" | "active" | "collapsed";`;

const CHIPS = `answerChips(question: Question, answer?: Answer): string[]

answerChips(about, { values: { name: "Milica", age: "84", where: "Vračar" } });
// → ["Milica", "84", "+1"]`;

export default function QuestionCardPage() {
  return (
    <>
      <DocHeader title="QuestionCard" description={meta.description}>
        <ImportLine
          names={[
            "QuestionCard",
            "answerChips",
            "QuestionShell",
            "QuestionOptionRow",
            "QuestionFieldRow",
            "QuestionOtherRow",
            "QuestionBadge",
          ]}
        />
        <ImportLine names={["type Question", "type QuestionOption", "type QuestionField", "type Answer", "type QuestionState"]} />
      </DocHeader>

      <ComponentPreview file="question-card/basic.tsx" minHeight={360} align="start">
        <QuestionCardBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A question with a shape to it: pick one, pick several, or fill in a few short fields.",
          "Gathering what an agent needs before it starts: who it is for, what is needed, how soon.",
          "Showing an answer given earlier as one row, with a way back in to change it.",
        ]}
        avoid={[
          <>
            Several questions that belong together: that is a <DocLink to="components/question-group">QuestionGroup</DocLink>,
            which steps through them and folds when they are done.
          </>,
          <>
            A yes or no on something the agent is about to do: that is an{" "}
            <DocLink to="components/approval">Approval</DocLink>.
          </>,
          "An open question. If the answer is a sentence, the composer is already the right box.",
        ]}
      />
      <p>
        A <code>Question</code> is one of three shapes, because there are three ways to answer one: <code>inputs</code>{" "}
        (type something), <code>single</code> (pick one) and <code>multi</code> (pick several). Each carries a{" "}
        <code>shortTitle</code>: what it is called once it folds into a row. The full question is too long for a summary,
        and truncating it loses the end, which is where the meaning usually is.
      </p>
      <p>
        <strong>The card morphs between its states rather than swapping them.</strong> The box animates its size, and the
        content inside counter-scales so text keeps its real size on the way instead of stretching. A single-choice card
        commits on the pick, but waits a beat first: commit instantly and the card is gone before anyone sees what they
        chose.
      </p>
      <p>
        The card keeps no answer of its own. It reports one through <code>onCommit</code>, and you hand it back as{" "}
        <code>answer</code> along with the <code>state</code> it should be in. In a conversation you rarely place cards
        yourself: a <code>question</code> part is drawn as a <DocLink to="components/question-group">QuestionGroup</DocLink>{" "}
        by <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">States</H3>
      <p>
        <code>upcoming</code> is one dim row waiting its turn. <code>active</code> is the question, open.{" "}
        <code>collapsed</code> is the short title, the answer as chips, and a way back in: a single{" "}
        <code>&lt;button&gt;</code> named for what it does (“Edit answer: Household”), not a click handler on a{" "}
        <code>div</code> that can be clicked but not tabbed to. With <code>readOnly</code> it is a record instead of a
        control.
      </p>
      <ComponentPreview file="question-card/states.tsx">
        <QuestionCardStates />
      </ComponentPreview>

      <H3 id="multi">Pick several, or something else</H3>
      <p>
        <code>allowOther</code> adds a row that reads as one more option but is a text field. It is a{" "}
        <code>&lt;label&gt;</code> rather than a button, because an input inside a button is not reliably focusable, and
        that row exists to be typed into. <code>allowEmpty</code> turns the disabled button into “None of these”, so
        somebody with nothing to pick is not stuck.
      </p>
      <ComponentPreview file="question-card/multi.tsx" minHeight={420} align="start">
        <QuestionCardMulti />
      </ComponentPreview>

      <H3 id="inputs">Type something</H3>
      <p>
        Enter moves to the next field rather than submitting the lot (the next field is nearly always what somebody means
        by it) and commits from the last one. Fields marked <code>optional</code> do not hold up the Next button.
      </p>
      <p>
        An active <code>inputs</code> card puts the cursor in its first field once it has finished growing; focus landing
        mid-animation makes the browser scroll to where the field was rather than where it is. That is also why this
        example opens it only after the first question is answered, as a conversation would.
      </p>
      <ComponentPreview file="question-card/fields.tsx" minHeight={420} align="start">
        <QuestionCardFields />
      </ComponentPreview>

      <H3 id="summaries">How an answer is summarised</H3>
      <p>
        <code>answerChips</code> is what the collapsed row draws: two chips at most, then a count. Three chips of
        unpredictable width in a row that also holds a title is a row that wraps, and a summary that wraps is not a summary.
        Several picks that all have a <code>short</code> are joined into one chip. It is exported for a recap of your own.
      </p>
      <ComponentPreview file="question-card/summaries.tsx">
        <QuestionCardSummaries />
      </ComponentPreview>

      <H2 id="composing">Composing a fourth kind of question</H2>
      <p>
        Three shapes are not the only three. The parts a card is built from are exported, so a shape the kit does not ship
        is a composition rather than a fork, and it arrives wearing the same tokens, focus behaviour and ARIA as the ones
        that do. This one is pick one <em>and</em> add a note.
      </p>
      <ComponentPreview file="question-card/composed.tsx">
        <ComposedQuestion />
      </ComponentPreview>
      <ul>
        <li>
          <code>QuestionShell</code>: the card (header, the column the rows sit in, a right-aligned footer).
        </li>
        <li>
          <code>QuestionOptionRow</code>: a row that picks. A <code>&lt;button&gt;</code> with <code>aria-pressed</code>.
        </li>
        <li>
          <code>QuestionFieldRow</code>: a row that is typed into. A <code>&lt;label&gt;</code>, so pressing anywhere on
          the row focuses the input.
        </li>
        <li>
          <code>QuestionOtherRow</code>: the “something else” row (reads as an option, is a text field). Its placeholder is
          also its accessible name.
        </li>
        <li>
          <code>QuestionBadge</code>: the 24px square with the letter or the number.
        </li>
      </ul>
      <p>
        Each takes a <code>className</code> that is <strong>added</strong> to its own rather than replacing it, and spreads
        the rest of its props onto the element it ends in. On the two rows with an input, <code>className</code> styles the
        row and everything else (<code>inputMode</code>, <code>autoComplete</code>, the ref) goes to the input.{" "}
        <code>letter</code> is optional on all three rows; left out, the row starts at its title. <code>onEnter</code> fires
        on Enter unless your own <code>onKeyDown</code> called <code>preventDefault</code> first, which is how a handler says
        it has dealt with the key.
      </p>
      <p>
        The letter badges are <code>aria-hidden</code>. The letter is a visual index; left in the accessibility tree it turns
        a field called “Their name” into one called “a Their name”.
      </p>

      <H3 id="parts">The parts on their own</H3>
      <p>
        <code>QuestionShell</code> paints the card box unless you pass <code>card={"{false}"}</code>, which is what{" "}
        <code>QuestionCard</code> does, because the box that morphs between its states is its own and two would nest.
      </p>
      <ComponentPreview file="question-card/parts.tsx">
        <QuestionParts />
      </ComponentPreview>

      <H2 id="api">API</H2>

      <H3 id="api-question-card">QuestionCard</H3>
      <PropsTable
        rows={[
          { name: "question", type: "Question", required: true, description: "What is asked, and in which shape." },
          { name: "number", type: "number", required: true, description: "Shown in the badge. 1-based." },
          { name: "state", type: '"upcoming" | "active" | "collapsed"', required: true, description: "Still to come, being answered, or answered." },
          { name: "answer", type: "Answer", description: "The answer so far. Seeds the fields when an answered card is opened again." },
          { name: "onCommit", type: "(answer: Answer) => void", description: "Called with the answer when it is given." },
          { name: "onEdit", type: "() => void", description: "Called when somebody asks to change an answer already given. Set the card back to active." },
          { name: "readOnly", type: "boolean", default: "false", description: "Answers can be read but not changed. The collapsed row stops being a control." },
          {
            name: "labels",
            type: 'Partial<ChatLabels["question"]>',
            description: (
              <>
                <code>next</code>, <code>none</code>, <code>edit</code>, <code>other</code>, and <code>letters</code> (the
                alphabet options are lettered from). See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="api-types">Question and Answer</H3>
      <Code lang="ts" code={TYPES} />

      <H3 id="api-answer-chips">answerChips</H3>
      <p>What an answer looks like folded into a row: at most two strings, then a <code>+n</code> count.</p>
      <Code lang="ts" code={CHIPS} />

      <H3 id="api-question-shell">QuestionShell</H3>
      <p>
        Also takes every attribute of a <code>div</code> except <code>title</code>. The ref goes to the card.
      </p>
      <PropsTable
        rows={[
          { name: "title", type: "ReactNode", required: true, description: "The question." },
          { name: "subtitle", type: "ReactNode", description: "Under the title, quieter." },
          { name: "number", type: "ReactNode", description: "The badge over the question. Left out, the header starts at the title." },
          { name: "children", type: "ReactNode", required: true, description: "The rows the question is made of." },
          { name: "footer", type: "ReactNode", description: "Right-aligned under the rows, usually the button that commits." },
          { name: "card", type: "boolean", default: "true", description: "Paint the card box: background, radius, shadow. Off when something around it already draws one." },
        ]}
      />

      <H3 id="api-option-row">QuestionOptionRow</H3>
      <p>
        Also takes every attribute of a <code>button</code>. The ref goes to the button.
      </p>
      <PropsTable
        rows={[
          { name: "title", type: "ReactNode", required: true, description: "The option. Wins the name over the button’s own title attribute, which is a tooltip." },
          { name: "description", type: "ReactNode", description: "A line under the title." },
          { name: "letter", type: "ReactNode", description: "The a/b/c badge. Left out, the row starts at its title." },
          { name: "selected", type: "boolean", description: "Picked. Drawn, and said as aria-pressed." },
        ]}
      />

      <H3 id="api-field-row">QuestionFieldRow</H3>
      <p>
        Every other attribute of an <code>input</code> goes to the input, and so does the ref.
      </p>
      <PropsTable
        rows={[
          { name: "label", type: "ReactNode", required: true, description: "What the field is for." },
          { name: "value", type: "string", required: true, description: "Controlled." },
          { name: "onChange", type: "(value: string) => void", required: true, description: "The value, not the event: the row exists to be typed into." },
          { name: "onEnter", type: "() => void", description: "Enter, which in a question nearly always means “the next one”, not “send”." },
          { name: "letter", type: "ReactNode", description: "The a/b/c badge. Left out, the row starts at its label." },
          { name: "className", type: "string", description: "On the row, not the input." },
        ]}
      />

      <H3 id="api-other-row">QuestionOtherRow</H3>
      <p>
        Every other attribute of an <code>input</code> goes to the input, and so does the ref.
      </p>
      <PropsTable
        rows={[
          { name: "value", type: "string", required: true, description: "Controlled." },
          { name: "placeholder", type: "string", required: true, description: "Also the accessible name: the row has no visible label of its own." },
          { name: "onChange", type: "(value: string) => void", required: true, description: "The value, not the event." },
          { name: "onEnter", type: "() => void", description: "Called on Enter." },
          { name: "letter", type: "ReactNode", description: "The badge. Left out, the row starts at the field." },
          { name: "className", type: "string", description: "On the row, not the input." },
        ]}
      />

      <H3 id="api-badge">QuestionBadge</H3>
      <p>
        Also takes every attribute of a <code>span</code>.
      </p>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", required: true, description: "The number or the letter." },
          { name: "selected", type: "boolean", description: "Wearing the accent: this is the one being answered or chosen." },
          { name: "onCard", type: "boolean", description: "Sitting on a raised card rather than on the group’s own surface." },
        ]}
      />
    </>
  );
}
