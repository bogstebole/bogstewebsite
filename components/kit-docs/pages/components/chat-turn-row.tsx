import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ChatTurnRowLive from "../../examples/chat-turn-row/live";
import ChatTurnRowStates from "../../examples/chat-turn-row/states";
import ChatTurnRowAgentTurn from "../../examples/chat-turn-row/agent-turn";
import ChatTurnRowCustomPart from "../../examples/chat-turn-row/custom-part";
import ChatTurnRowQuestionAlign from "../../examples/chat-turn-row/question-align";

export const meta = {
  title: "ChatTurnRow",
  description: "One turn: the question as a composer that becomes its own bubble, and the answer beneath it, parts and all.",
};

export default function ChatTurnRowPage() {
  return (
    <>
      <DocHeader title="ChatTurnRow" description={meta.description}>
        <ImportLine names={["ChatTurnRow", "useChatTurns"]} />
      </DocHeader>

      <ComponentPreview file="chat-turn-row/live.tsx" align="start" minHeight={240}>
        <ChatTurnRowLive />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Assembling a conversation yourself, when ChatExperience’s shape is not yours.",
          "Showing a single turn: a transcript, a share page, a test fixture.",
        ]}
        avoid={[
          "A chat page that ChatExperience already describes. It renders these rows for you.",
          "A record of a message from somebody else. The question half is a live input, not a quote.",
        ]}
      />
      <p>
        Not <code>Message</code>, because it is not one. The user half is the composer you type into, and sending it
        morphs that same element into the bubble, so the last row of a conversation is always the box for the next
        question. Everything under the bubble is the answer: its prose, rendered as markdown you can mark with a
        highlighter, and its <a href="#parts">parts</a>.
      </p>
      <p>
        It pairs with <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>, which owns the turn list, the request
        in flight and the reveal. The hook hands you the turns and a set of functions; the row takes a turn and those
        functions. The one thing you compute is which row is live: the last one, while it is{" "}
        <code>idle</code> or <code>typing</code>.
      </p>

      <H3 id="the-memo">The memo is load-bearing</H3>
      <p>
        The row is wrapped in <code>React.memo</code>, and the hook leaves untouched turns referentially identical when
        it rewrites one. Together they mean a finished turn does not re-render while another is arriving: measured
        before the memo existed, streaming one answer caused 366 DOM mutations inside an unrelated, finished turn.
        With it, zero. That is why every callback takes the turn’s <code>id</code> instead of being closed over per
        row: pass the hook’s functions straight through. An arrow written inline is a new prop on every render and
        undoes it, and so is a <code>renderPart</code> written inline.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">States</H3>
      <p>
        A turn moves through the same four states as the <DocLink to="components/chat-input#states">ChatInput</DocLink>{" "}
        inside it. <code>idle</code> and <code>typing</code> are a composer; <code>responding</code> and{" "}
        <code>resting</code> are a bubble with an answer under it. The row carries <code>aria-busy</code> while the
        answer arrives, and the actions under it (copy, and regenerate and the thumbs if you handle them) appear
        only once it has settled.
      </p>
      <ComponentPreview file="chat-turn-row/states.tsx" align="start">
        <ChatTurnRowStates />
      </ComponentPreview>

      <H3 id="parts">An agent turn</H3>
      <p>
        <code>turn.parts</code> is everything an answer is made of that is not its prose. Each kind is drawn by the
        component that owns it, and each remembers how much prose had arrived when it did, <code>at</code>, so the
        order the stream sent is the order on screen. A part without <code>at</code> sits before the prose.
      </p>
      <ComponentPreview file="chat-turn-row/agent-turn.tsx" align="start">
        <ChatTurnRowAgentTurn />
      </ComponentPreview>
      <PropsTable
        nameLabel="kind"
        typeLabel="Shape"
        rows={[
          { name: "reasoning", type: "{ text?, state?, duration? }", description: <>Drawn by <DocLink to="components/reasoning">Reasoning</DocLink>.</> },
          { name: "chain", type: "{ steps, state?, duration? }", description: <>Reasoning with structure, drawn by <DocLink to="components/chain-of-thought">ChainOfThought</DocLink>.</> },
          { name: "tool", type: "{ name, state?, summary?, input?, output?, error?, duration? }", description: <>Drawn by <DocLink to="components/tool">Tool</DocLink>.</> },
          { name: "tasks", type: "{ tasks, title?, collapsible? }", description: <>Drawn by <DocLink to="components/task-list">TaskList</DocLink>.</> },
          { name: "sources", type: "{ sources, title?, collapsible? }", description: <>Drawn by <DocLink to="components/sources">Sources</DocLink>; an inline <code>[^1]</code> in the prose resolves against it.</> },
          { name: "approval", type: "{ title, description?, tool?, decision?, choices? }", description: <>Drawn by <DocLink to="components/approval">Approval</DocLink>. The row reports a decision; it does not keep one.</> },
          { name: "question", type: "{ questions, title?, answers?, activeIndex?, collapsible?, readOnly? }", description: <>Drawn by <DocLink to="components/question-group">QuestionGroup</DocLink>. Answers are yours to keep.</> },
          { name: "notice", type: "{ text, tone? }", description: <>Something that happened to the conversation, drawn by <DocLink to="components/system-message">SystemMessage</DocLink>.</> },
          { name: "artifact", type: "{ title, meta?, preview?, lang?, content?, state? }", description: <>A card that opens the pane, drawn by <DocLink to="components/artifact">ArtifactCard</DocLink>.</> },
          { name: "custom", type: "{ type, data? }", description: "Your own card, drawn by renderPart. See below." },
        ]}
      />
      <p>
        Every part also has a <code>kind</code> and an <code>id</code>, and parts are merged by id: send{" "}
        <code>{"{ kind: \"tool\", id, state: \"done\" }"}</code> and only <code>state</code> changes.
      </p>

      <H3 id="custom-parts">Your own cards</H3>
      <p>
        A <code>{"{ kind: \"custom\", id, type, data }"}</code> part is handed to <code>renderPart</code>, and whatever
        it returns is drawn in the part’s place. It is data rather than JSX for the reason every part is: a stream can
        send data and cannot send a component. Press <em>Apply to plan</em>. The card writes the change back into the
        part’s <code>data</code> with <code>updatePart</code>, after the answer has finished, and only this row
        re-renders.
      </p>
      <ComponentPreview file="chat-turn-row/custom-part.tsx" align="start" minHeight={300}>
        <ChatTurnRowCustomPart />
      </ComponentPreview>
      <p>
        <code>renderPart</code> also gets <code>openArtifact(id)</code> and <code>closeArtifact()</code> on its second
        argument, so your card can open the pane the way an artifact card does. A part your renderer does not
        recognise is one it chose not to draw: return <code>null</code> and nothing is drawn.
      </p>

      <H3 id="question-align">Where the composer sits</H3>
      <p>
        <code>questionAlign=&quot;end&quot;</code> is the default, because the composer is about to become the
        reader’s own bubble and those sit right. <code>stretch</code> fills the row, which is what an{" "}
        <em>opening</em> composer wants: on an empty conversation it is the box under the openers, and a pill floating
        at the right edge of a centred block reads as unrelated to it.
      </p>
      <ComponentPreview file="chat-turn-row/question-align.tsx" align="start">
        <ChatTurnRowQuestionAlign />
      </ComponentPreview>

      <H3 id="docked">A composer docked at the bottom</H3>
      <p>
        Two props exist for a composer that stays at the bottom edge, as <code>composer=&quot;docked&quot;</code> on{" "}
        <DocLink to="components/chat-experience">ChatExperience</DocLink> draws it, and that is where it sets them.
      </p>
      <p>
        <code>entrance=&quot;fade&quot;</code>, on the live row. A new turn rises 16px into place, which is how it
        reads as arriving. A docked composer is not arriving anywhere: it is the box the reader was typing into a
        moment ago, so rising into place read as the input jumping up and back on every send. It fades in where it
        is instead.
      </p>
      <p>
        <code>answerAfterTravel</code>, on every row. Docked, a sent message travels from the bottom of the view to
        the top, and its answer’s “…” used to appear at the top the moment it was sent: two things moving in opposite
        directions, an answer begun above a question that had not arrived. Held, the question lands first and the
        answer starts under it, about 0.45s later. The row hears the landing from its composer’s{" "}
        <DocLink to="components/chat-input">onLanded</DocLink>, with a ceiling in case it never comes, and skips the
        wait under reduced motion.
      </p>
      <Code
        code={`
<ChatTurnRow
  turn={turn}
  isActiveInput={live}
  entrance={live ? "fade" : "rise"}
  answerAfterTravel
/>`}
      />

      <H2 id="api">API</H2>
      <p>
        Every callback is optional; a row with none of them renders and can be marked. The row carries{" "}
        <code>id=&quot;turn-&lt;id&gt;&quot;</code>, so a host can scroll to it (that is what{" "}
        <DocLink to="components/conversation#anchored">Conversation’s anchorId</DocLink> points at) and the live row
        carries <code>data-active-input</code>, so a page can style the composer without knowing which turn it is.
      </p>
      <Code
        label="lift the composer over a bottom fade"
        lang="css"
        code={`.feed [data-active-input] { position: relative; z-index: 6; }`}
      />

      <H3 id="api-turn">The turn</H3>
      <PropsTable
        rows={[
          { name: "turn", type: "ChatTurn", required: true, description: <>Straight from <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>: <code>id</code>, <code>user</code>, <code>ai</code>, <code>parts</code>, <code>state</code>, and optionally <code>attachments</code> and <code>versions</code>.</> },
          { name: "isActiveInput", type: "boolean", default: "false", description: "This row owns the live composer, the one the next question is typed into." },
          { name: "inputRef", type: "Ref<ChatInputHandle> | null", default: "null", description: <>For <code>focus()</code> on the live composer. See <DocLink to="components/chat-input#handle">ChatInputHandle</DocLink>.</> },
          { name: "placeholder", type: "string", description: "The composer’s placeholder." },
          { name: "questionAlign", type: '"end" | "stretch"', default: '"end"', description: "Where the composer sits: right, as a bubble on its way, or across the row, as an opening composer." },
          { name: "busy", type: "boolean", description: "An answer is arriving in another turn. The composer stays open to type into and offers a stop instead of a send." },
          { name: "entranceDelay", type: "number", default: "0", description: "Stagger for the entrance, in seconds." },
          { name: "entrance", type: '"rise" | "fade"', default: '"rise"', description: <>How the row arrives: from a little above its place, or in place, opacity only. <code>fade</code> is for a <a href="#docked">docked composer</a>.</> },
          { name: "answerAfterTravel", type: "boolean", default: "false", description: <>Hold the answer back until the sent message has finished travelling, keeping its room so the anchor does not move. For a <a href="#docked">docked composer</a>.</> },
          { name: "className", type: "string", description: "On the row." },
        ]}
      />

      <H3 id="api-callbacks">Callbacks</H3>
      <p>Each takes the turn’s id first, so the hook’s functions can be passed straight through.</p>
      <PropsTable
        rows={[
          { name: "onDraft", type: "(id: string, value: string) => void", description: <>The composer was typed into. <code>setDraft</code>.</> },
          { name: "onSubmit", type: "(id: string, value: string, attachments: Attachment[]) => void", description: <>Sent. <code>submit</code>.</> },
          { name: "onStop", type: "() => void", description: <>Stop the answer in flight. <code>stop</code>.</> },
          { name: "onEdit", type: "(id: string) => void", description: <>Edit a sent question in place. <code>beginEdit</code>.</> },
          { name: "onCancelEdit", type: "(id: string) => void", description: <><code>cancelEdit</code>.</> },
          { name: "onCopy", type: "(value: string) => void", default: "writes to the clipboard", description: "Copy, under a sent question or a settled answer." },
          { name: "onRegenerate", type: "(id: string) => void", description: "Draws the regenerate button. Without it, there is none." },
          { name: "onShowVersion", type: "(id: string, index: number) => void", description: <>Show another of the turn’s answers. <code>showVersion</code>. Without it the control is not drawn.</> },
          { name: "onFeedback", type: '(id: string, verdict: "up" | "down" | null) => void', description: "Draws the thumbs." },
          { name: "feedback", type: '"up" | "down" | null', default: "null", description: "Which thumb is lit." },
          { name: "answerActions", type: "boolean", default: "true", description: "false leaves the row of actions under the answer out entirely." },
        ]}
      />

      <H3 id="api-parts">Parts</H3>
      <PropsTable
        rows={[
          { name: "renderPart", type: "(part: CustomPart, context: CustomPartContext) => ReactNode", description: "Draws your { kind: \"custom\" } parts. Keep it stable." },
          { name: "onDecideApproval", type: "(turnId: string, partId: string, decision: Decision) => void", description: <>An approval was decided. Write it back with <code>updatePart</code>.</> },
          { name: "onAnswerQuestion", type: "(turnId: string, partId: string, questionId: string, answer: Answer) => void", description: "A question the assistant asked was answered." },
          { name: "onEditQuestion", type: "(turnId: string, partId: string, index: number) => void", description: "Somebody asked to change an answer already given." },
          { name: "foldMotion", type: "Partial<FoldMotion>", description: "A question group’s fold timing." },
          { name: "openArtifactId", type: "string | null", default: "null", description: "Which artifact the pane is showing, so the card that opened it can say so." },
          { name: "onOpenArtifact", type: "(turnId: string, artifactId: string) => void", description: "An artifact card was pressed." },
          { name: "onArtifactChange", type: "(artifactId: string | null) => void", description: "What a custom card’s openArtifact and closeArtifact call. Left out, openArtifact falls back to onOpenArtifact. Keep it stable." },
        ]}
      />

      <H3 id="api-marking">Marking, composer and words</H3>
      <PropsTable
        rows={[
          { name: "highlights", type: "boolean", default: "true", description: "Whether the answer can be marked. false draws it as plain prose, with nothing in the tab order." },
          { name: "selectionMode", type: '"marker" | "precise"', default: '"marker"', description: <>Passed to the <DocLink to="components/text-highlighter">TextHighlighter</DocLink> over the answer.</> },
          { name: "onHighlight", type: "(turnId: string, text: string) => void", description: "A passage was marked." },
          { name: "onReplyInThread", type: "(text: string, rect: DOMRect) => void", description: <>Open a <DocLink to="components/reply-thread-popup">thread</DocLink> on the marked passage.</> },
          { name: "onTranscribe", type: "TranscribeHandler", description: "Given, the live composer offers a microphone." },
          { name: "composerMenu", type: "ComposerMenuItem[] | false", description: "The live composer’s “+” menu. false takes the “+” away. Keep a list stable." },
          { name: "animationConfig", type: "InlineAnimConfig", description: "Passed to the composer." },
          { name: "labels", type: "ChatLabels", description: <>Every word the row says. Partial. For a whole conversation, one <code>LabelsProvider</code> around the list does the same once. See <DocLink to="labels">Labels</DocLink>.</> },
        ]}
      />
    </>
  );
}
