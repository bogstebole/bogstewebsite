import type { ReactNode } from "react";
import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, Table } from "../doc";
import { DocLink } from "../doc-link";
import SerbianLabels from "../examples/labels/serbian";

export const meta = {
  title: "Labels",
  description:
    "Every word the kit says (on screen, in an aria-label, through the live region) in one object, grouped by the component that says it.",
};

/** One row of the groups table: the key in `ChatLabels`, who says it, and its strings. */
function group(key: string, component: ReactNode, strings: string) {
  return [<code key="g">{key}</code>, component, <code key="s">{strings}</code>];
}

export default function LabelsPage() {
  return (
    <>
      <DocHeader title="Labels" description={meta.description}>
        <ImportLine names={["LabelsProvider", "defaultLabels", "type ChatLabels"]} />
      </DocHeader>

      <ComponentPreview file="labels/serbian.tsx" minHeight={480}>
        <SerbianLabels />
      </ComponentPreview>
      <p>
        One <code>LabelsProvider</code> around three components. Switch the language and every word the kit owns
        changes: the state under the tool, the duration under the reasoning, the count on the plan, the buttons and
        their answers. Decide the approval to see the settled wording.
      </p>

      <H2 id="labels-prop">One object for every word</H2>
      <p>
        Every component takes a <code>labels</code> prop. <DocLink to="components/chat-experience">ChatExperience</DocLink>{" "}
        and <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> take one object for all of them: a{" "}
        <code>ChatLabels</code>, grouped by the component that says each string, and partial at every level: anything
        left out stays English.
      </p>
      <Code
        code={`
import { ChatExperience, type ChatLabels } from "inline-chat-kit";

const sr: ChatLabels = {
  input: { placeholder: "Pitaj bilo šta…", send: "Pošalji poruku", copy: "Kopiraj", edit: "Izmeni" },
  approval: { once: "Dozvoli jednom", deny: "Odbij", allowedOnce: "Dozvoljeno jednom", wasDenied: "Odbijeno" },
  reasoning: { thinking: "Razmišljam", thoughtFor: "Razmišljao" },
  answerActions: { copy: "Kopiraj odgovor", regenerate: "Ponovo" },
  tasks: { progress: "{done} od {total}" },
};

<ChatExperience onSend={send} labels={sr} />;`}
      />
      <p>
        <strong>What counts as a word:</strong> text on screen, an <code>aria-label</code>, a <code>title</code>, a
        placeholder, text only a screen reader gets, and what is said through the live region: everything a person
        sees or hears. A <code>{"{name}"}</code> in a value is filled in by the component; keep it, and move it wherever
        the language wants it.
      </p>
      <p>
        <code>defaultLabels</code> is the full English set. It is also the list of what there is to translate: start
        from it and you cannot miss a string.
      </p>
      <p>
        The spoken &quot;Generating response&quot; and the answer read when it settles belong to{" "}
        <code>useChatTurns</code>, not to a label group. Set them with its{" "}
        <DocLink to="usage#announce">announcements</DocLink> option.
      </p>

      <H2 id="provider">Assembled by hand: LabelsProvider</H2>
      <p>
        Labels travel by context, not by a prop on every row, so the rows&apos; memo is not disturbed. For pieces you
        assemble yourself, <code>LabelsProvider</code> does what <code>ChatExperience</code> does:
      </p>
      <Code
        code={`
<LabelsProvider labels={sr}>
  {turns.map((turn) => (
    <ChatTurnRow key={turn.id} turn={turn} /* … */ />
  ))}
</LabelsProvider>`}
      />
      <ul>
        <li>
          <strong>Compared by content</strong>, so an object written inline in render costs nothing after the first
          time.
        </li>
        <li>
          <strong>Providers nest</strong>: an inner one overrides the outer one string by string.
        </li>
        <li>
          <strong>A component&apos;s own <code>labels</code> prop wins</strong> over the provider, for that instance
          only. Somebody who wrote a string on one instance meant that instance.
        </li>
      </ul>
      <Code
        code={`
<LabelsProvider labels={sr}>
  {/* Serbian everywhere, except this one tool's output heading. */}
  <Tool name="run_sql" output={rows} labels={{ output: "Rezultat upita" }} />
</LabelsProvider>`}
      />
      <p>
        <DocLink to="hooks/use-voice-input">useVoiceInput</DocLink> is the exception: a hook cannot read a provider
        rendered below it, so it takes its <code>voice</code> strings as an option. <code>ChatInput</code> passes its own
        through.
      </p>

      <H2 id="groups">The groups</H2>
      <p>
        Grouped by what says it, so a translator can find a string by looking at the screen. Each group&apos;s type is
        exported too: <code>ToolLabels</code>, <code>ApprovalLabels</code>, <code>ReasoningLabels</code>,{" "}
        <code>ChainLabels</code>, <code>TaskListLabels</code>, <code>SourcesLabels</code>,{" "}
        <code>AnswerActionsLabels</code>, <code>BranchLabels</code>, <code>ContextLabels</code>,{" "}
        <code>ChatInputLabels</code>, <code>VoiceLabels</code>.
      </p>
      <Table
        head={["Group", "Said by", "Strings"]}
        rows={[
          group("input", <DocLink to="components/chat-input">ChatInput</DocLink>, "placeholder, send, save, stop, cancelEdit, add, closeMenu, attach, design, connectors, copy, edit, readMore, readLess, dictate, stopListening, waitingForMicrophone, cancelTranscription, microphoneBlocked, microphoneBlockedHelp"),
          group("voice", <DocLink to="hooks/use-voice-input">useVoiceInput</DocLink>, "listening, stoppedListening, transcribing, nothingHeard, transcriptAdded, transcriptFailed, refused, notFound, couldNotOpen"),
          group("tool", <DocLink to="components/tool">Tool</DocLink>, "input, output, error, pending, running, done"),
          group("reasoning", <DocLink to="components/reasoning">Reasoning</DocLink>, "thinking, thought, thoughtFor"),
          group("chain", <DocLink to="components/chain-of-thought">ChainOfThought</DocLink>, "through, step, steps, thinking"),
          group("tasks", <DocLink to="components/task-list">TaskList</DocLink>, "pending, running, done, error, progress"),
          group("approval", <DocLink to="components/approval">Approval</DocLink>, "once, always, deny, allowedOnce, allowedAlways, wasDenied, pending"),
          group("sources", <DocLink to="components/sources">Sources</DocLink>, "title, one, many"),
          group("citation", <DocLink to="components/sources">InlineCitation</DocLink>, "cite"),
          group("question", <DocLink to="components/question-card">QuestionCard</DocLink>, "next, none, edit, other, letters"),
          group("questionGroup", <DocLink to="components/question-group">QuestionGroup</DocLink>, "answers"),
          group("answerActions", <DocLink to="components/answer-actions">AnswerActions</DocLink>, "copy, copied, regenerate, up, down"),
          group("branch", <DocLink to="components/branch">Branch</DocLink>, "previous, next, position"),
          group("context", <DocLink to="components/context">Context</DocLink>, "name, of, tokens, nearlyFull"),
          group("attachments", <DocLink to="components/attachments">Attachments</DocLink>, "remove"),
          group("codeBlock", <DocLink to="components/code-block">CodeBlock</DocLink>, "copy, copyCode, copied, copiedAnnouncement"),
          group("pane", <DocLink to="components/artifact">ArtifactPane</DocLink>, "close, expand, collapse"),
          group("highlighter", <DocLink to="components/text-highlighter">TextHighlighter</DocLink>, "menu, reply, remove, highlight, countOne, countMany, keyboardHint"),
          group("thread", <DocLink to="components/reply-thread-popup">ReplyThreadPopup</DocLink>, "title, save, close, on, placeholder"),
          group("header", <DocLink to="components/chat-header">ChatHeader</DocLink>, "back, more"),
          group("conversation", <DocLink to="components/conversation">Conversation</DocLink>, "jump"),
          group("emptyState", <DocLink to="components/empty-state">EmptyState</DocLink>, "suggestions"),
          group("experience", <DocLink to="components/chat-experience">ChatExperience</DocLink>, "title, savedHighlights, themeToLight, themeToDark, share, selectionMode, marker, precise, windowFull, highlights, close, paragraph, responding"),
        ]}
      />

      <H2 id="turning-off">Turning off what you do not use</H2>
      <p>
        Everything here is decided <strong>in code</strong>, not offered in the interface. A product either marks
        passages or it does not, keeps a theme toggle or does not; a control for choosing is a question nobody asked.
      </p>
      <Code
        code={`
<ChatExperience
  onSend={send}
  composer="docked"        // or "inline", the default
  highlights={false}       // no marker layer, no highlight menu, no saved ones
  bookmarks={false}        // marking stays, keeping goes
  headerActions={false}    // or ["theme"], or ["share"]
  composerMenu={false}     // or your own: [{ id, label, icon?, onSelect }]
  pane="none"              // draw the artifact pane yourself
  surface="panes"          // the conversation as a card of its own
  fill="container"         // as tall as its parent, not the window
/>`}
      />
      <Table
        head={["Prop", "Off means"]}
        rows={[
          [<code key="p">{"highlights={false}"}</code>, "Answers are prose: no marker layer, nothing over the text in the tab order, no highlight menu, and no saved highlights or selection-mode pair, since both are about marking."],
          [<code key="p">{"bookmarks={false}"}</code>, <>A passage can still be marked and replied to; nothing is kept. Use <code>onHighlight</code> to keep them yourself.</>],
          [<code key="p">onThreadReply</code>, "Omitted: no threads. A thread is opened from a highlight, so highlights={false} takes them too."],
          [<code key="p">{"headerActions={false}"}</code>, <>No theme toggle, no Share. Your own <code>actions</code> are unaffected.</>],
          [<code key="p">{"composerMenu={false}"}</code>, "No “+” in the composer."],
          [<code key="p">selectionToggle</code>, "Omitted (the default): no marker / precise pair in the header."],
          [<code key="p">cursor</code>, "Omitted (the default): no pointer-following cursor."],
        ]}
      />
      <H3 id="fill-container">Embedded, use fill=&quot;container&quot;</H3>
      <p>
        By default the chat is as tall as the window, which is what a page that is nothing but the chat wants. Anywhere
        smaller (a card, a sidebar, a split), it has to take its parent&apos;s height instead, or it hangs past the
        bottom of it. The parent has to have a height to give. The software keyboard is then yours to handle, because
        the chat no longer knows where the window&apos;s edge is.
      </p>
      <p>
        Assembling the rows by hand, the same switch for marking is <code>highlights</code> on{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>, which is <code>marking</code> on{" "}
        <DocLink to="components/text-highlighter">TextHighlighter</DocLink>.
      </p>
    </>
  );
}
