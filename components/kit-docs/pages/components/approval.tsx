import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ApprovalBasic from "../../examples/approval/basic";
import ApprovalDecided from "../../examples/approval/decided";
import ApprovalTwoChoices from "../../examples/approval/two-choices";
import ApprovalCodeSubject from "../../examples/approval/code-subject";

export const meta = {
  title: "Approval",
  description: "“It wants to do this. Is that all right?” The agent asks before it acts, and the answer stays on record.",
};

export default function ApprovalPage() {
  return (
    <>
      <DocHeader title="Approval" description={meta.description}>
        <ImportLine names={["Approval", "type ApprovalChoice", "type Decision"]} />
      </DocHeader>

      <ComponentPreview file="approval/basic.tsx" minHeight={340} align="start">
        <ApprovalBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Anything an agent wants to do that touches the world: run a command, write a file, send a message.",
          "Changes that are hard to take back, where a person should see the exact thing before it happens.",
        ]}
        avoid={[
          <>
            Reporting something that already ran: that is a <DocLink to="components/tool">Tool</DocLink>.
          </>,
          <>
            Asking for information rather than permission: that is a{" "}
            <DocLink to="components/question-card">QuestionCard</DocLink>.
          </>,
        ]}
      />
      <p>
        It is the only component in the kit whose whole job is to slow somebody down for a moment, so every detail of
        it is about making the safe answer the easy one.
      </p>
      <p>
        <strong>Three answers, not two.</strong> “Yes” and “yes from now on” are not the same answer, and one button
        for both collects the wrong one. <strong>Allow once is the primary</strong>: the narrow permission should be
        the easiest to give, and the standing one should cost a moment’s thought. Deny sits alone on the left, away
        from the two that say yes (a destructive choice flush against an affirmative one is a mis-click waiting to
        happen) and it comes first in the DOM, so a keyboard reaches the safe answer without tabbing past the other
        two. It turns red only under the pointer; a permanently red button is the first thing the eye lands on.
      </p>
      <p>
        <strong>Give it something to show.</strong> Somebody deciding needs to see what they are deciding about, and a
        name is not that. An approval with nothing under it asks for a signature on a blank page.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="decided">Decided</H3>
      <p>
        Once <code>decision</code> is set, the buttons are gone and a line says what was decided. Live controls under
        a decision already made invite a second one that contradicts the first. The component keeps no state of its
        own: <code>onDecide</code> reports, and the record appears when you pass the decision back.
      </p>
      <ComponentPreview file="approval/decided.tsx" align="start">
        <ApprovalDecided />
      </ComponentPreview>

      <H3 id="two-choices">Two answers, where “always” means nothing</H3>
      <p>
        Applying one change happens once. <code>choices=&#123;[&quot;once&quot;, &quot;deny&quot;]&#125;</code> leaves
        “Always allow” out and nothing else moves: Allow once is still the primary, Deny still first and alone on the
        left, and the record says only what was decided.
      </p>
      <ComponentPreview file="approval/two-choices.tsx" minHeight={300} align="start">
        <ApprovalTwoChoices />
      </ComponentPreview>

      <H3 id="any-subject">Any subject</H3>
      <p>
        <code>children</code> is the thing being approved, drawn as the one card between the question and the answer:
        a <DocLink to="components/tool">Tool</DocLink> for a call, a{" "}
        <DocLink to="components/code-block">CodeBlock</DocLink> for a file, or anything of your own. The title and the
        buttons sit on the ground around it, because they are the asking and the answering, not part of the thing.
      </p>
      <ComponentPreview file="approval/code-subject.tsx" align="start">
        <ApprovalCodeSubject />
      </ComponentPreview>

      <H2 id="in-a-conversation">In a conversation</H2>
      <p>
        Your <DocLink to="usage">send handler</DocLink> streams an <code>approval</code> part and{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws it. A part is data: a stream cannot send a
        component, so instead of children it names a <code>tool</code>, which is drawn for it, unrun.
      </p>
      <Code
        code={`
yield {
  kind: "approval",
  id: "rm-shots",
  title: "Run a command in your shell",
  description: "It removes the generated screenshots. Nothing else is touched.",
  tool: { name: "bash", input: { command: "rm -rf Shots/" } },
};`}
      />
      <p>
        The row does not keep the decision; it reports it. <code>ChatExperience</code> hands you a writer with it, and
        writing the decision back is what turns the buttons into a record:
      </p>
      <Code
        code={`
<ChatExperience
  onSend={send}
  onDecideApproval={(write, turnId, partId, decision) => {
    write(turnId, { kind: "approval", id: partId, decision });
    if (decision !== "denied") runCommand(partId);
  }}
/>`}
      />
      <p>
        Rendering <code>ChatTurnRow</code> yourself, the callback is <code>onDecideApproval(turnId, partId, decision)</code>{" "}
        and the writer is <code>updatePart</code> from <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>section</code> except <code>title</code>, which is the prop below.
      </p>
      <PropsTable
        rows={[
          { name: "title", type: "ReactNode", required: true, description: "What is being asked, in one line. Names the region for assistive technology." },
          { name: "description", type: "ReactNode", description: "Why it is being asked, or what it will touch." },
          { name: "children", type: "ReactNode", description: <>The thing itself, usually a <code>Tool</code> or a <code>CodeBlock</code>.</> },
          { name: "decision", type: '"once" | "always" | "denied" | null', default: "null", description: "The answer, held by you. null while it is still being asked." },
          { name: "onDecide", type: "(decision: Decision) => void", description: "Called with the answer somebody picked. Pass it back as decision." },
          { name: "readOnly", type: "boolean", default: "false", description: "Nothing can be decided from here: no buttons, for a record of a decision made elsewhere." },
          {
            name: "choices",
            type: '("once" | "always" | "deny")[]',
            default: "all three",
            description: "Which answers are offered. Allow once stays the primary and Deny stays first whatever you leave out.",
          },
          {
            name: "labels",
            type: "Partial<ApprovalLabels>",
            description: (
              <>
                The three buttons (<code>once</code>, <code>always</code>, <code>deny</code>) and the three records (
                <code>allowedOnce</code>, <code>allowedAlways</code>, <code>wasDenied</code>). See{" "}
                <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />
      <H3 id="types">Decision and ApprovalChoice</H3>
      <p>
        Two types because the button and the record are different words: <code>&quot;deny&quot;</code> is what you
        press, <code>&quot;denied&quot;</code> is what happened.
      </p>
      <Code
        code={`
type ApprovalChoice = "once" | "always" | "deny";   // the buttons
type Decision = "once" | "always" | "denied";       // the record`}
      />
    </>
  );
}
