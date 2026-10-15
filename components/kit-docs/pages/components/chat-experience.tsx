import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ChatExperienceOpening from "../../examples/chat-experience/opening";
import ChatExperienceMinimal from "../../examples/chat-experience/minimal";
import ChatExperienceDocked from "../../examples/chat-experience/docked";
import ChatExperienceParts from "../../examples/chat-experience/parts";

export const meta = {
  title: "ChatExperience",
  description: "The whole chat, assembled (header, conversation, composer, parts and pane) around one onSend of yours.",
};

export default function ChatExperiencePage() {
  return (
    <>
      <DocHeader title="ChatExperience" description={meta.description}>
        <ImportLine
          names={[
            "ChatExperience",
            "type ChatExperienceEmpty",
            "type ChatExperienceArtifact",
            "type ChatExperienceHeaderAction",
            "type PartWriter",
          ]}
        />
      </DocHeader>

      <ComponentPreview file="chat-experience/opening.tsx" bleed minHeight={560}>
        <ChatExperienceOpening />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A page that is a chat, or a card, sidebar or split that holds one, with fill=“container”.",
          "Getting the behaviour right without writing it: the held anchor, the title, the pane, the empty state.",
          "Building against a scripted onSend before the model behind it exists.",
        ]}
        avoid={[
          "A shape this one does not have: put ChatHeader, Conversation and ChatTurnRow together yourself.",
          "A phone-first product. It runs on a phone, but it is designed and tuned for desktop and tablet.",
        ]}
      />
      <p>
        Every other export is a piece. Putting them together is a page’s job right up until two pages do it, and
        when two did, they became two 900-line copies, and the faults lived in the copy: a header that rendered
        see-through, an empty state that snapped out of existence, a sent message that stayed pinned to the top for the
        rest of the session. So the assembly is in the kit, where a fix is made once. What stays yours is content and
        identity: the answers, the copy, what an artifact contains, where “back” goes.
      </p>
      <p>
        What it does that a page would have to remember to: it <strong>holds a sent message at the top</strong> while
        its answer is written and lets go once it settles, so the composer is back on screen. It titles the header with
        the first question actually asked, not the first keystroke. It announces a full context window once, through
        the kit’s own live region. And it puts the artifact pane <em>beside</em> the conversation, which is the
        difference between a pane and a modal.
      </p>
      <p>
        Everything it draws is exported on its own: <DocLink to="components/chat-header">ChatHeader</DocLink>,{" "}
        <DocLink to="components/conversation">Conversation</DocLink>,{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> and{" "}
        <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>. Reach for those second.
      </p>

      <Callout title="It is as tall as the window unless told otherwise">
        By default it fills <code>100dvh</code> and needs no height from its host. Embedded anywhere smaller, pass{" "}
        <code>fill=&quot;container&quot;</code> and give the parent a height: the chat fills it and scrolls inside it.
        Every preview on this page does that, in a fixed-height box. Its header and top fade are{" "}
        <code>position: fixed</code> to the chat’s own column, so they stay inside the box too; the saved-highlights
        sheet is a real modal and covers the window.
      </Callout>

      <H2 id="examples">Examples</H2>

      <H3 id="minimal">Minimal</H3>
      <p>
        One prop has to be yours: <code>onSend</code>. Return a string and the kit reveals it at a readable pace;
        return an async iterable and each delta is shown as it lands. There is no canned fallback anywhere in the
        package. Return nothing and nothing is what appears.
      </p>
      <ComponentPreview file="chat-experience/minimal.tsx" bleed minHeight={480}>
        <ChatExperienceMinimal />
      </ComponentPreview>

      <H3 id="empty-state">Before anybody has asked</H3>
      <p>
        <code>empty</code> is the opening block: a title, a line under it, and openers. The hero above uses it. An
        opener is <strong>sent</strong>, not typed into the box: one that only fills the input asks somebody to press
        send on a sentence they did not write. Ideally there is one per branch of your <code>onSend</code>, so
        everything the chat can draw is reachable by pressing something rather than by knowing what to type. The
        composer sits in the same column as the openers, so the two read as one thing.
      </p>

      <H3 id="docked">Composer at the bottom</H3>
      <p>
        <code>composer=&quot;inline&quot;</code> is the default and the argument this kit makes: the input stands at
        the end of the conversation and becomes the bubble where you typed it.{" "}
        <code>composer=&quot;docked&quot;</code> is the shape most chats have: the box stays at the bottom and the
        conversation stacks above it. Sent, it still becomes the bubble: the same element travels up into the
        conversation and a fresh composer takes its place, so the next question can be typed while this one is
        answered. Sending again before the answer settles is refused, not queued.
      </p>
      <ComponentPreview file="chat-experience/docked.tsx" bleed minHeight={560}>
        <ChatExperienceDocked />
      </ComponentPreview>
      <p>
        With a <code>chat</code> of your own, give its <code>useChatTurns</code> <code>nextTurn: &quot;at-send&quot;</code>.
        Built by hand, the same shape is <code>&lt;Conversation dock&gt;</code>. See{" "}
        <DocLink to="components/conversation#docked">Conversation</DocLink>.
      </p>

      <H3 id="parts">Parts in an answer</H3>
      <p>
        A stream can carry more than prose. A string is appended to the answer; an object is a{" "}
        <DocLink to="components/chat-turn-row#parts">part</DocLink> (reasoning, a tool call, an approval) merged into
        the turn by its <code>id</code>, so sending the same id again updates it in place. Each is drawn by its own
        component, at the point in the prose where it arrived.
      </p>
      <p>
        An approval is decided after the answer has finished, so the decision cannot be streamed.{" "}
        <code>onDecideApproval</code> hands you a <code>PartWriter</code> for that: call it with the turn and the
        changed part, and the row redraws.
      </p>
      <ComponentPreview file="chat-experience/parts.tsx" bleed minHeight={640}>
        <ChatExperienceParts />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <Callout title="The theme">
        Left without <code>theme</code>, it keeps its own and its header offers a toggle. Either way it writes{" "}
        <code>data-theme</code> on <code>&lt;html&gt;</code>, and until somebody chooses, it <em>removes</em> it, so
        the kit follows the system preference. In an app that already sets <code>data-theme</code>, pass{" "}
        <code>theme</code> and <code>onThemeChange</code> from your own state, or the chat will clear your choice when
        it mounts. <code>headerActions</code> takes the toggle away. See <DocLink to="theming">Theming</DocLink>.
      </Callout>

      <H3 id="api-answers">Answers</H3>
      <PropsTable
        rows={[
          {
            name: "onSend",
            type: "SendHandler",
            description: (
              <>
                Where answers come from: a string, a promise of one, or an async iterable of deltas and parts. Required
                unless <code>chat</code> is given. See <DocLink to="usage">Wiring a model</DocLink>.
              </>
            ),
          },
          {
            name: "chat",
            type: "UseChatTurnsResult",
            description: (
              <>
                The conversation, held by you: what your own <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>{" "}
                returned. Gives you <code>updatePart</code> for changing a part after its answer has finished.{" "}
                <code>onSend</code> is ignored then.
              </>
            ),
          },
          {
            name: "renderPart",
            type: "(part: CustomPart, context: CustomPartContext) => ReactNode",
            description: (
              <>
                Draws your own <code>{"{ kind: \"custom\" }"}</code> parts. Keep it stable (outside the component or in{" "}
                <code>useCallback</code>) or every row re-renders on every frame of an answer.
              </>
            ),
          },
          {
            name: "onDecideApproval",
            type: "(write: PartWriter, turnId: string, partId: string, decision: Decision) => void",
            description: "An approval was decided. Write the decision back with write.",
          },
          {
            name: "onAnswerQuestion",
            type: "(write: PartWriter, turnId: string, partId: string, questionId: string, answer: Answer) => void",
            description: "A question the assistant asked was answered. The row reports it; write it back to keep it.",
          },
          {
            name: "onEditQuestion",
            type: "(write: PartWriter, turnId: string, partId: string, index: number) => void",
            description: "Somebody asked to change an answer already given.",
          },
        ]}
      />

      <H3 id="api-chrome">Header, copy and components</H3>
      <PropsTable
        rows={[
          { name: "title", type: "string", default: '"Chat"', description: "Shown in the header until a question has been asked; then the header carries the first question." },
          { name: "empty", type: "ChatExperienceEmpty", description: "The opening block, before anybody has asked anything. See the types below." },
          { name: "placeholder", type: "string", description: "The composer’s placeholder." },
          { name: "backHref", type: "string", description: "Where the header’s back link goes. Leave out for no back link." },
          { name: "backLabel", type: "string", default: '"Back"', description: "Its accessible name." },
          {
            name: "headerActions",
            type: "boolean | ChatExperienceHeaderAction[]",
            default: "true",
            description: (
              <>
                The built-in actions: the theme toggle and Share. <code>false</code> is neither; a list keeps those named.
                The saved-highlights button is not one of these: it appears once there is a highlight.
              </>
            ),
          },
          {
            name: "actions",
            type: "ChatHeaderAction[]",
            description: (
              <>
                Your own header actions, after the built-in ones. <code>variant: &quot;primary&quot;</code> on one makes
                it stand out. See <DocLink to="components/chat-header#header-action">ChatHeaderAction</DocLink>.
              </>
            ),
          },
          {
            name: "contextTotal",
            type: "number",
            description: (
              <>
                The context window, in tokens. Leave it off and there is no <DocLink to="components/context">meter</DocLink>.
                Past it, a system message says the oldest messages are dropping out.
              </>
            ),
          },
          { name: "contextBase", type: "number", default: "0", description: "What a system prompt and the tool definitions cost before anybody types." },
          {
            name: "labels",
            type: "ChatLabels",
            description: (
              <>
                Every word the chat says, grouped by component. Partial; what is left out stays English. See{" "}
                <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
          {
            name: "components",
            type: "ChatComponents",
            description: (
              <>
                Your own components, drawn in place of the kit’s. <code>{"{ Button }"}</code> is used for every button
                the chat draws but the composer’s send glyph; the kit keeps the layout and your button paints. Declare it
                outside a render. See <DocLink to="bring-your-own-button">Bring your own button</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="api-composer">Composer and layout</H3>
      <PropsTable
        rows={[
          { name: "composer", type: '"inline" | "docked"', default: '"inline"', description: "Where the composer lives: at the end of the conversation, or at the bottom of the view." },
          { name: "fill", type: '"window" | "container"', default: '"window"', description: "What the chat is as tall as. container needs a parent with a height; the software keyboard is then yours to handle." },
          {
            name: "composerMenu",
            type: "ComposerMenuItem[] | false",
            description: (
              <>
                The composer’s “+” menu. Left out, the built-in three; a list replaces them; <code>false</code> takes the
                “+” away. Keep a list stable. See <DocLink to="components/chat-input#menu">ChatInput</DocLink>.
              </>
            ),
          },
          {
            name: "onTranscribe",
            type: "TranscribeHandler",
            description: (
              <>
                Speech to text: the kit records, you transcribe. Omit and there is no microphone. See{" "}
                <DocLink to="hooks/use-voice-input">useVoiceInput</DocLink>.
              </>
            ),
          },
          { name: "anchorOffset", type: "number", default: "100", description: "How far below the top edge a sent message comes to rest, in px. Also the conversation’s top padding: one number writes both." },
          { name: "endOffset", type: "number", default: "120", description: "Room left under the composer once an answer settles, in px. Inline composer only." },
          { name: "surface", type: '"flush" | "panes"', default: '"flush"', description: "flush fills the window; panes makes the conversation a card of its own, so a pane beside it is a second card." },
          { name: "theme", type: '"light" | "dark" | null', description: "The theme, held by you. Left out, the chat keeps its own and offers a toggle." },
          { name: "onThemeChange", type: '(theme: "light" | "dark") => void', description: "The header’s toggle was pressed." },
          { name: "className", type: "string", description: "On the chat’s column." },
        ]}
      />

      <H3 id="api-pane">Artifact pane</H3>
      <PropsTable
        rows={[
          {
            name: "artifact",
            type: "(openId: string) => ChatExperienceArtifact | null",
            description: (
              <>
                What the pane shows for the artifact that is open. The kit draws the pane; what is inside it is yours.
                See <DocLink to="components/artifact">Artifact</DocLink>.
              </>
            ),
          },
          { name: "openArtifactId", type: "string | null", description: "Which artifact is open, held by you. undefined: the chat keeps it. null: held, none open." },
          { name: "onOpenArtifactChange", type: "(id: string | null) => void", description: "An artifact was opened or closed: a card pressed, the pane’s close button. Called whether or not you hold the state." },
          { name: "pane", type: '"inline" | "none"', default: '"inline"', description: "inline: the chat draws the pane beside the conversation. none: no pane and no room for one; the cards still open, and you draw it." },
        ]}
      />

      <H3 id="api-marking">Marking and threads</H3>
      <PropsTable
        rows={[
          { name: "highlights", type: "boolean", default: "true", description: "Whether an answer can be marked at all. false draws answers as prose and takes the saved highlights, the selection toggle and threads with it." },
          { name: "bookmarks", type: "boolean", default: "true", description: "Whether marked passages are kept. On, the header grows a button with the count once there is one." },
          { name: "selectionToggle", type: "boolean", default: "false", description: "The freeform-marker / precise-selection pair in the header." },
          { name: "onThreadReply", type: 'ReplyThreadPopupProps["onSendMessage"]', description: "A follow-up asked on a marked passage. Omit and replying in a thread is off." },
          { name: "cursor", type: "boolean", default: "false", description: "The pointer-following marker cursor, and the rule that hides the real one. Only where there is a fine pointer." },
        ]}
      />

      <H3 id="api-motion">Motion</H3>
      <PropsTable
        rows={[
          {
            name: "animationConfig",
            type: "InlineAnimConfig",
            description: (
              <>
                The composer’s springs and timings. See <DocLink to="components/chat-input#motion">ChatInput</DocLink>.
              </>
            ),
          },
          { name: "foldMotion", type: "FoldMotion", description: "A question group’s fold timing." },
          { name: "feedDelay", type: "number", default: "0", description: "How long the first row waits before it arrives, in seconds." },
        ]}
      />

      <H3 id="types">Types</H3>
      <Code
        label="types"
        code={`
/** The opening block, before anybody has asked anything. */
interface ChatExperienceEmpty {
  title: string;
  description?: string;
  /** Sent when pressed, not typed into the box. */
  suggestions?: string[];
}

/** What the pane shows while an artifact is open. */
interface ChatExperienceArtifact {
  title: string;
  meta?: string;       // "8 weeks", "Python"
  children: ReactNode; // yours: the kit draws the pane, not what is in it
}

/** The header's built-in actions, by id. */
type ChatExperienceHeaderAction = "theme" | "share";

/** Writes a part into a turn after its answer has finished. Merged by id. */
type PartWriter = (turnId: string, part: TurnPartUpdate) => void;`}
      />
      <p>
        A <code>PartWriter</code> is <code>updatePart</code> from the chat’s own <code>useChatTurns</code>, handed to
        the three decision callbacks so they can stay plain functions outside your component. A{" "}
        <code>TurnPartUpdate</code> is a part with everything optional but <code>kind</code> and <code>id</code>.
        Send only the fields that changed.
      </p>
    </>
  );
}
