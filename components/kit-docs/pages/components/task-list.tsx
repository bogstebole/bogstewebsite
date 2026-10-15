import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import TaskListLive from "../../examples/task-list/live";
import TaskListStates from "../../examples/task-list/states";
import TaskListBare from "../../examples/task-list/bare";
import TaskListFolds from "../../examples/task-list/folds";

export const meta = {
  title: "TaskList",
  description: "What the agent means to do, what it is doing, and what it has finished, in the order it planned.",
};

export default function TaskListPage() {
  return (
    <>
      <DocHeader title="TaskList" description={meta.description}>
        <ImportLine names={["TaskList", "type Task", "type TaskState"]} />
      </DocHeader>

      <ComponentPreview file="task-list/live.tsx" minHeight={300} align="start">
        <TaskListLive />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A plan the agent announces before it starts, then works through.",
          "Showing where a long job is up to, and what each step turned up.",
        ]}
        avoid={[
          <>
            Steps that follow from one another and are only known as they happen: that is a derivation, and a{" "}
            <DocLink to="components/chain-of-thought">ChainOfThought</DocLink>.
          </>,
          <>
            The record of one call, with its input and output: that is a <DocLink to="components/tool">Tool</DocLink>.
          </>,
        ]}
      />
      <p>
        <strong>The order never changes.</strong> A list that sorted itself as work progressed would move the line
        somebody is reading out from under them, and the sequence is half of what the list says: these steps, in this
        order. Only the glyphs change.
      </p>
      <p>
        A task is <code>pending</code>, <code>running</code>, <code>done</code> or <code>error</code>: the same four
        states as a tool call, with the same glyphs, because they are the same four states. The glyphs differ in shape
        before they differ in colour, and each row also says its state in words a screen reader hears. The running task
        carries <code>aria-current=&quot;step&quot;</code>, so a screen reader can jump straight to where the work is
        up to instead of counting down the list.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">States and details</H3>
      <p>
        A task with no <code>state</code> is <code>pending</code>. <code>detail</code> is a line under the label: what
        the step found, or why it failed. A failed task keeps its place; the plan does not reorder around it.
      </p>
      <ComponentPreview file="task-list/states.tsx" align="start">
        <TaskListStates />
      </ComponentPreview>

      <H3 id="folds-when-finished">Folds when finished</H3>
      <p>
        With <code>collapsible</code>, the list folds itself once every task is done (a plan is worth watching while
        it runs and worth little afterwards) and its row keeps the count. That is a preference, not a rule: open or
        shut it yourself and your choice holds, in either direction, through every change after it.
      </p>
      <ComponentPreview file="task-list/folds.tsx" minHeight={300} align="start">
        <TaskListFolds />
      </ComponentPreview>

      <H3 id="bare">Without a title</H3>
      <p>
        <code>title</code> is what gives the list a row. Leave it out and you get the steps alone. Do not pair that with{" "}
        <code>collapsible</code>: a finished list would still fold itself away, and with no row there would be nothing
        left to open it with.
      </p>
      <ComponentPreview file="task-list/bare.tsx" align="start">
        <TaskListBare />
      </ComponentPreview>

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        Streamed from your <DocLink to="usage">send handler</DocLink> as a <code>tasks</code> part and drawn by{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>. The part merges by <code>id</code> and the merge
        is shallow, so send the whole <code>tasks</code> array each time a state changes.
      </p>
      <Code
        code={`
const plan = [
  { id: "read", label: "Read the care plan" },
  { id: "gaps", label: "Find the gaps in the weekly cover" },
];

yield { kind: "tasks", id: "plan", title: "Plan", collapsible: true, tasks: plan };
yield { kind: "tasks", id: "plan", tasks: [
  { ...plan[0], state: "done", detail: "42 lines" },
  { ...plan[1], state: "running" },
] };`}
      />

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>section</code> except <code>title</code>, which is the prop below.
      </p>
      <PropsTable
        rows={[
          { name: "tasks", type: "Task[]", required: true, description: "The plan, in order. The order is never changed for you." },
          { name: "title", type: "ReactNode", description: "Names the list and gives it a row, with a “2 of 5” count. Without one there is no row." },
          { name: "collapsible", type: "boolean", default: "false", description: <>Let the list fold into its row, which it does itself once every task is done. Needs a <code>title</code>.</> },
          { name: "open", type: "boolean", description: "Open, controlled. Leave it out and the list looks after itself." },
          { name: "defaultOpen", type: "boolean", description: "Where it starts, overruling the list’s own preference." },
          { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the list is opened or shut." },
          {
            name: "labels",
            type: "Partial<TaskListLabels>",
            description: (
              <>
                One per state (<code>pending</code>, <code>running</code>, <code>done</code>, <code>error</code>), and{" "}
                <code>progress</code>: <code>&quot;{"{done}"} of {"{total}"}&quot;</code>. See{" "}
                <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="task">Task and TaskState</H3>
      <Code
        code={`
type TaskState = "pending" | "running" | "done" | "error";

interface Task {
  id: string;
  label: ReactNode;
  /** Defaults to "pending". */
  state?: TaskState;
  /** A line under the label: what it found, or why it failed. */
  detail?: ReactNode;
}`}
      />
    </>
  );
}
