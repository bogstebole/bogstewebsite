import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import HandAssembled from "../../examples/use-chat-turns/hand-assembled";

export const meta = {
  title: "useChatTurns",
  description: "The conversation: the turn list, the request in flight and the reveal. Your app only supplies the answers.",
};

export default function UseChatTurnsPage() {
  return (
    <>
      <DocHeader title="useChatTurns" description={meta.description}>
        <ImportLine
          names={[
            "useChatTurns",
            "type ChatTurn",
            "type SendHandler",
            "type SendContext",
            "type ChatAnnouncements",
            "type UseChatTurnsOptions",
            "type UseChatTurnsResult",
          ]}
        />
      </DocHeader>

      <ComponentPreview file="use-chat-turns/hand-assembled.tsx" bleed minHeight={560}>
        <HandAssembled />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          <>
            Assembling a chat of your own from <DocLink to="components/conversation">Conversation</DocLink> and{" "}
            <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>.
          </>,
          <>
            Holding the conversation outside <DocLink to="components/chat-experience">ChatExperience</DocLink>: pass
            the result as <code>chat</code> to reach <code>updatePart</code>, or to read the turns.
          </>,
        ]}
        avoid={[
          <>
            A standard chat. <code>ChatExperience</code> calls this hook itself; you only pass <code>onSend</code>.
          </>,
        ]}
      />
      <p>
        It is a hook in the package rather than an example in a README because writing it correctly is harder than it
        looks, and getting it wrong is invisible until a conversation grows long. It never updates state faster than
        the display can show it, and when it rewrites one turn it leaves every other turn referentially untouched, so
        a memoised row for a finished answer skips rendering entirely while a new one streams in.
      </p>
      <p>
        That second property only pays off if the rows can see it. Pass the hook&apos;s functions straight through
        (they are stable) and keep any of your own in <code>useCallback</code>. See{" "}
        <DocLink to="usage#easy-to-get-wrong">three things that are easy to get wrong</DocLink>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="hand-assembled">Assembled by hand</H3>
      <p>
        The example above is what <code>ChatExperience</code> does, without the header and the pane. Things worth
        reading in it:
      </p>
      <ul>
        <li>
          <strong>The last turn is the composer.</strong> A row is the live input when it is last and still{" "}
          <code>idle</code> or <code>typing</code>.
        </li>
        <li>
          <strong>Holding the sent turn at the top.</strong> The hook has no notion of “the one just sent”, so the
          example records it on send and lets go when the turn is <code>resting</code> (derived, not cleared by an
          effect). Held forever, the next composer would sit below the fold.
        </li>
        <li>
          <strong>Regenerate is <code>submit(id)</code></strong> with no text. The turn gets a new version rather than
          an overwritten answer, and <code>showVersion</code> steps between them.
        </li>
        <li>
          <strong>The answer is a string</strong>, so the hook reveals it at <code>revealSpeed</code> characters a
          second. A stream would ignore that and show deltas as they land. See{" "}
          <DocLink to="usage#on-send">the send handler</DocLink>.
        </li>
      </ul>

      <H3 id="docked">A composer that stays at the bottom</H3>
      <p>
        <code>nextTurn: &quot;at-send&quot;</code> opens the next input the moment a message goes, rather than when its
        answer settles, so there is always a box to type into. A send while an answer is still arriving is refused, not
        queued. Pair it with <code>{"<Conversation dock>"}</code>, the live row last, <code>busy</code> on it and{" "}
        <code>onStop</code> on it rather than on the bubble being answered:
      </p>
      <Code
        code={`
const { turns, isStreaming, setDraft, submit, stop } = useChatTurns({ onSend: send, nextTurn: "at-send" });

<Conversation dock>
  {turns.map((turn, i) => {
    const live = i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing");
    return (
      <ChatTurnRow
        key={turn.id}
        turn={turn}
        isActiveInput={live}
        busy={live ? isStreaming : undefined}
        onStop={live ? stop : undefined}
        onDraft={setDraft}
        onSubmit={submit}
      />
    );
  })}
</Conversation>`}
      />

      <H2 id="api">API</H2>

      <H3 id="options">Options</H3>
      <PropsTable
        rows={[
          {
            name: "onSend",
            type: "SendHandler",
            required: true,
            description: (
              <>
                Produces the answer: a string, a promise of one, or an async iterable of prose deltas and parts. See{" "}
                <DocLink to="usage#on-send">Wiring a model</DocLink>.
              </>
            ),
          },
          {
            name: "revealSpeed",
            type: "number",
            default: "260",
            description: "Characters per second for an answer returned whole. Streamed answers are paced by whatever produced them.",
          },
          {
            name: "sentencePause",
            type: "number",
            default: "220",
            description: "Pause after a full stop during the reveal, in ms. Gives it a read-aloud rhythm.",
          },
          {
            name: "announcements",
            type: "ChatAnnouncements | false",
            description: (
              <>
                What a screen reader is told when a request starts and when the answer settles. <code>false</code> says
                nothing. See <DocLink to="usage#announce">What a screen reader hears</DocLink>.
              </>
            ),
          },
          {
            name: "nextTurn",
            type: '"after-answer" | "at-send"',
            default: '"after-answer"',
            description: "When the next input turn appears: once the answer settles, or the moment a message is sent (a docked composer).",
          },
        ]}
      />

      <H3 id="result">Result</H3>
      <PropsTable
        rows={[
          { name: "turns", type: "ChatTurn[]", description: "Every turn, oldest first. The last one is the live composer." },
          { name: "setDraft", type: "(id: string, value: string) => void", description: <>Report the person typing into a turn. Moves it between <code>idle</code> and <code>typing</code>.</> },
          {
            name: "submit",
            type: "(id: string, value?: string, attachments?: Attachment[]) => void",
            description: (
              <>
                Send a turn. Without <code>value</code>, re-sends the turn&apos;s own text: on an answered turn that is
                a regenerate, stored as a new version. Ignored while another answer is in flight, and when there is
                neither text nor an attachment.
              </>
            ),
          },
          { name: "stop", type: "() => void", description: "Abort the answer in flight. The turn settles with what had arrived." },
          { name: "beginEdit", type: "(id: string) => void", description: "Put a sent turn back into the composer. A submit from there answers it again." },
          { name: "cancelEdit", type: "(id: string) => void", description: "Leave the edit, restoring the text it started with." },
          {
            name: "showVersion",
            type: "(id: string, index: number) => void",
            description: "Show another of a turn's answers. An index out of range is ignored rather than clamped: asking for one that does not exist is a bug, and clamping would hide it.",
          },
          {
            name: "updatePart",
            type: "(turnId: string, part: TurnPartUpdate) => void",
            description: (
              <>
                Merge a part into a turn from outside the stream, by id: an approval decided, a question answered, a
                card applied. See <DocLink to="usage#parts-the-reader-answers">Parts the reader answers</DocLink>.
              </>
            ),
          },
          { name: "isStreaming", type: "boolean", description: "An answer is arriving." },
        ]}
      />

      <H3 id="chat-turn">ChatTurn</H3>
      <PropsTable
        rows={[
          { name: "id", type: "string", required: true, description: <>Stable for the turn&apos;s life. The row carries it as <code>id=&quot;turn-&lt;id&gt;&quot;</code>.</> },
          { name: "user", type: "string", required: true, description: "What the person asked, or is typing, while the turn is the composer." },
          { name: "attachments", type: "Attachment[]", description: "What was sent with it." },
          { name: "ai", type: "string", required: true, description: "The answer's prose, as much of it as has arrived. What Copy copies and a screen reader hears." },
          { name: "parts", type: "TurnPart[]", required: true, description: <>Everything else the answer is made of: reasoning, tool calls, sources, questions. See <DocLink to="usage#turn-parts">What a turn carries</DocLink>.</> },
          { name: "state", type: "ChatInputState", required: true, description: <><code>idle</code>, <code>typing</code>, <code>responding</code> or <code>resting</code>: the composer&apos;s four states, which are the turn&apos;s.</> },
          { name: "versions", type: "TurnVersion[]", description: <>Every answer the turn has had, oldest first, each <code>{"{ id, ai, parts }"}</code>. Empty until the first answer starts; absent on a turn built by hand.</> },
          { name: "versionIndex", type: "number", description: <>Which of <code>versions</code> is in <code>ai</code> and <code>parts</code>.</> },
        ]}
      />

      <H3 id="send-handler">SendHandler and SendContext</H3>
      <Code
        code={`
type SendHandler = (
  message: string,
  context: SendContext
) => AsyncIterable<string | TurnPartUpdate> | Promise<string> | string;

interface SendContext {
  signal: AbortSignal;        // aborted when the reader presses stop, or the hook unmounts
  turnId: string;             // the turn being answered
  attachments: Attachment[];  // what was sent with the message; empty when nothing was
}`}
      />

      <H3 id="announcements">ChatAnnouncements</H3>
      <PropsTable
        rows={[
          {
            name: "responding",
            type: "string | null",
            default: '"Generating response"',
            description: <>Spoken when a request starts. <code>null</code> for silence.</>,
          },
          {
            name: "answer",
            type: "(text: string) => string | null",
            default: "the answer itself",
            description: <>Spoken once, when the answer settles, never per character. Return <code>null</code> for silence.</>,
          },
        ]}
      />
    </>
  );
}
