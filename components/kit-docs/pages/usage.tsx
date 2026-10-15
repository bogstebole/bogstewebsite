import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, Table } from "../doc";
import { DocLink } from "../doc-link";
import StreamingParts from "../examples/usage/streaming-parts";

export const meta = {
  title: "Wiring a model",
  description:
    "onSend is the one thing that has to be yours: return a string, a promise of one, or a stream of prose and parts.",
};

export default function UsagePage() {
  return (
    <>
      <DocHeader title="Wiring a model" description={meta.description}>
        <ImportLine names={["useChatTurns", "mergeParts", "announce", "type SendHandler", "type TurnPart"]} />
      </DocHeader>

      <ComponentPreview file="usage/streaming-parts.tsx" bleed minHeight={560}>
        <StreamingParts />
      </ComponentPreview>
      <p>
        Press the opener. The handler above streams a block of reasoning, a tool call that runs and finishes, a list of
        sources, and then the prose that cites them: one async generator, nothing else.
      </p>

      <H2 id="on-send">The send handler</H2>
      <p>
        The kit has no answers of its own. There is no canned fallback anywhere in the package: if your handler returns
        nothing, nothing is what appears. <code>onSend</code> takes the message and a context, and returns one of three
        shapes.
      </p>

      <H3 id="return-a-string">A string, or a promise of one</H3>
      <p>
        A complete answer. The kit reveals it at a readable pace (260 characters a second with a short pause after each
        full stop, both tunable on <DocLink to="hooks/use-chat-turns#options">useChatTurns</DocLink>), so an answer that
        arrived all at once does not land as a wall of text.
      </p>
      <Code
        code={`
useChatTurns({
  onSend: async (message, { signal }) => {
    const response = await fetch("/api/answer", {
      method: "POST",
      body: JSON.stringify({ message }),
      signal,
    });
    const { text } = await response.json();
    return text;
  },
});`}
      />

      <H3 id="return-a-stream">An async iterable of deltas</H3>
      <p>
        A stream. Each string is appended to the answer as it lands, at whatever pace produced it. The reveal speed does
        not apply. An SSE reader, an SDK&apos;s stream and a plain <code>fetch</code> body all fit this shape.
      </p>
      <Code
        code={`
useChatTurns({
  onSend: async function* (message, { signal }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
      signal,
    });
    yield* response.body!.pipeThrough(new TextDecoderStream());
  },
});`}
      />
      <p>
        The handler is read through a ref, so writing it inline costs nothing. The <DocLink to="nextjs">Next.js</DocLink>{" "}
        page has a route handler that produces this stream.
      </p>

      <H2 id="stop">Stop, and the signal</H2>
      <p>
        The second argument is a <code>SendContext</code>: <code>signal</code>, the <code>turnId</code> being answered,
        and the <code>attachments</code> sent with the message (empty when there were none).
      </p>
      <p>
        <code>signal</code> aborts when the reader presses stop, or when the component holding the conversation unmounts.
        Hand it to <code>fetch</code> and the request is cancelled; the kit stops reading your iterable either way and
        settles the turn with whatever had already arrived. An abort is not an error: nothing is thrown and nothing is
        drawn to say it stopped.
      </p>
      <p>
        One answer is in flight at a time. A send while one is arriving is refused rather than started on top of it.
      </p>

      <H3 id="errors">When the handler throws</H3>
      <p>
        The turn settles with what had arrived, and the error is rethrown. The kit draws nothing for it. Catch it and
        say so in the answer, with a <code>notice</code> part:
      </p>
      <Code
        code={`
const send: SendHandler = async function* (message, { signal }) {
  try {
    const response = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message }), signal });
    if (!response.ok) throw new Error(\`chat failed: \${response.status}\`);
    yield* response.body!.pipeThrough(new TextDecoderStream());
  } catch (error) {
    if (signal.aborted) return; // the reader pressed stop; that is not a failure
    const text = "The answer could not be finished. Try again in a moment.";
    yield { kind: "notice", id: "error", tone: "danger", text };
    announce(text, "assertive");
  }
};`}
      />

      <H2 id="turn-parts">What a turn carries</H2>
      <p>
        An answer is more than its prose. A streamed item is either a <strong>string</strong>, appended to the
        turn&apos;s <code>ai</code>, or a <strong>part</strong>: a <code>TurnPart</code>, merged into{" "}
        <code>turn.parts</code> <strong>by its id</strong>. <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>{" "}
        draws each kind with the component that owns it.
      </p>
      <Table
        head={["kind", "Drawn as", "Carries"]}
        rows={[
          [<code key="k">reasoning</code>, <DocLink key="c" to="components/reasoning">Reasoning</DocLink>, <code key="f">text, state, duration</code>],
          [<code key="k">tool</code>, <DocLink key="c" to="components/tool">Tool</DocLink>, <code key="f">name, state, summary, input, output, error, duration</code>],
          [<code key="k">tasks</code>, <DocLink key="c" to="components/task-list">TaskList</DocLink>, <code key="f">title, tasks, collapsible</code>],
          [<code key="k">chain</code>, <DocLink key="c" to="components/chain-of-thought">ChainOfThought</DocLink>, <code key="f">steps, state, duration</code>],
          [<code key="k">sources</code>, <DocLink key="c" to="components/sources">Sources</DocLink>, <code key="f">sources, title, collapsible</code>],
          [<code key="k">approval</code>, <DocLink key="c" to="components/approval">Approval</DocLink>, <code key="f">title, description, tool, decision, choices</code>],
          [<code key="k">question</code>, <DocLink key="c" to="components/question-group">QuestionGroup</DocLink>, <code key="f">title, questions, answers, activeIndex, collapsible, readOnly</code>],
          [<code key="k">notice</code>, <DocLink key="c" to="components/system-message">SystemMessage</DocLink>, <code key="f">text, tone</code>],
          [<code key="k">artifact</code>, <DocLink key="c" to="components/artifact">ArtifactCard</DocLink>, <code key="f">title, meta, preview, lang, content, state</code>],
          [<code key="k">custom</code>, <>your <code>renderPart</code></>, <code key="f">type, data</code>],
        ]}
      />
      <p>
        <strong>The merge is shallow, and that is the point.</strong> Send <code>{`{ kind: "tool", id: "t", state: "done" }`}</code>{" "}
        and the name and input sent earlier are still there: only the fields you send change. That is why an update is
        typed as <code>TurnPartUpdate</code>: everything optional but <code>kind</code> and <code>id</code>, so a field
        that was not meant to change is never retyped just to satisfy a type.
      </p>
      <Code
        code={`
const send: SendHandler = async function* (message) {
  yield { kind: "reasoning", id: "r", text: "Two numbers matter here.", state: "thinking" };
  yield { kind: "tool", id: "t", name: "search_web", state: "running", input: { query: message } };
  const results = await search(message);
  yield { kind: "tool", id: "t", state: "done", output: results, duration: 412 };
  yield { kind: "reasoning", id: "r", state: "done" };
  yield "The Higgs weighs about 125 GeV."; // a delta of the answer's prose
};`}
      />
      <p>
        <code>reasoning</code> and <code>chain</code> are the same job at two grains: a block of prose, or steps that
        follow from one another. Send one or the other for a stretch of thinking, not both.
      </p>
      <p>
        <code>mergeParts(parts, update)</code> is the same fold, exported for a host that keeps parts somewhere of its
        own: a store, a saved conversation being replayed.
      </p>

      <H3 id="parts-over-the-wire">Parts over the wire</H3>
      <p>
        A text stream can only carry prose. To send parts from a server, give each line a type and turn it back into a
        string or a part on the client:
      </p>
      <Code
        code={`
// The route writes one JSON object per line:
// {"type":"part","part":{"kind":"tool","id":"t","name":"search_web","state":"running"}}
// {"type":"text","text":"The Higgs weighs"}
const send: SendHandler = async function* (message, { signal }) {
  const response = await fetch("/api/agent", { method: "POST", body: JSON.stringify({ message }), signal });
  let buffer = "";
  for await (const chunk of response.body!.pipeThrough(new TextDecoderStream())) {
    buffer += chunk;
    const lines = buffer.split("\\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line) continue;
      const event = JSON.parse(line);
      yield event.type === "text" ? event.text : event.part;
    }
  }
};`}
      />

      <H3 id="part-position">Where a part sits in the prose</H3>
      <p>
        The answer is drawn in the order the stream sent it. A part remembers how much prose had arrived when it first
        did (<code>at</code>, in characters of <code>ai</code>) and is drawn at that point, so the sentence that
        introduces a card comes before the card:
      </p>
      <Code
        code={`
yield "I suggest this change:";                                   // prose
yield { kind: "custom", id: "change", type: "plan-diff", data };  // at: 22
yield " Tell me if it looks right.";                              // prose, after the card`}
      />
      <p>
        <code>useChatTurns</code> stamps <code>at</code> on a part&apos;s first appearance and nothing moves it
        afterwards. Set it yourself to place a part: <code>at: 0</code> puts it before all the prose. A part with no{" "}
        <code>at</code>, in a turn you built by hand, sits before the prose.
      </p>
      <p>
        The prose is still one string: <code>ai</code> is what Copy copies and what a screen reader hears. Only the
        drawing is cut where parts arrived, so a highlight cannot cross a card.
      </p>

      <H3 id="citations">Citing a source from the prose</H3>
      <p>
        <code>[^1]</code> in the answer is a citation marker, and the number is a position in the turn&apos;s{" "}
        <code>sources</code> part. It draws as an <DocLink to="components/sources">InlineCitation</DocLink> carrying the
        source&apos;s title, and is left out of the text a highlight or a thread quotes.
      </p>
      <Code
        code={`
yield { kind: "sources", id: "s", sources: [atlas, pdg] };
yield "The combined figure is 125.25 GeV[^1], to a fifth of a percent[^2].";`}
      />
      <Callout title="Send the list first">
        Sent after the prose, the markers draw bare and fill in later, which works, and looks like a bug.
      </Callout>

      <H3 id="custom-parts">Your own cards</H3>
      <p>
        Every other kind is a component in this package; <code>custom</code> is yours. <code>type</code> says which of
        your cards it is, <code>data</code> is what it needs, and <code>renderPart</code> draws it in its place. Without{" "}
        <code>renderPart</code>, or when it returns <code>null</code>, the part draws nothing.
      </p>
      <Code
        code={`
import type { CustomPart, CustomPartContext } from "inline-chat-kit";

// Streamed like any part…
yield { kind: "custom", id: "plan", type: "plan-diff", data: { changes, status: "proposed" } };

// …drawn by you. Outside the component, so it is the same function every render.
const renderPart = (part: CustomPart, { turnId }: CustomPartContext) =>
  part.type === "plan-diff" ? <PlanDiff turnId={turnId} {...(part.data as PlanDiffData)} /> : null;

// …and changed after the answer has finished, by id. \`data\` is replaced whole, not merged.
updatePart(turnId, { kind: "custom", id: "plan", data: { changes, status: "applied" } });`}
      />
      <p>
        The context also carries <code>openArtifact(id)</code> and <code>closeArtifact()</code>, so a card of yours can
        open the <DocLink to="components/artifact">artifact pane</DocLink> the way an <code>ArtifactCard</code> does.
      </p>

      <H3 id="parts-the-reader-answers">Parts the reader answers</H3>
      <p>
        A question or an approval is answered by the person reading it, not by the stream. The row reports the answer
        and keeps none of it; you write it back with <code>updatePart</code>, the same merge by id:
      </p>
      <Code
        code={`
const { turns, updatePart /* … */ } = useChatTurns({ onSend: send });

<ChatTurnRow
  /* … */
  onDecideApproval={decide}
/>

// Stable, like every row callback.
const decide = useCallback(
  (turnId: string, partId: string, decision: Decision) =>
    updatePart(turnId, { kind: "approval", id: partId, decision }),
  [updatePart]
);`}
      />
      <p>
        <DocLink to="components/chat-experience">ChatExperience</DocLink> hands its own writer to{" "}
        <code>onDecideApproval</code>, <code>onAnswerQuestion</code> and <code>onEditQuestion</code> as the first
        argument. To reach <code>updatePart</code> from outside it, call the hook yourself and pass the result in:{" "}
        <code>{`chat={useChatTurns({ onSend })}`}</code>.
      </p>
      <p>
        Parts are cleared when a turn is answered again: the tool calls that produced the old answer are not evidence
        for the new one. The old answer keeps its own, in <code>turn.versions</code>.
      </p>

      <H2 id="rendering">Rendering the turns yourself</H2>
      <p>
        <DocLink to="components/chat-experience">ChatExperience</DocLink> calls <code>useChatTurns</code> for you. When
        your app needs a shape it does not have, the pieces are exported: the hook, a{" "}
        <DocLink to="components/conversation">Conversation</DocLink> to scroll them and a{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> per turn. The last turn is always the live
        composer:
      </p>
      <Code
        code={`
const { turns, setDraft, submit, stop, beginEdit, cancelEdit } = useChatTurns({ onSend: send });

<Conversation>
  {turns.map((turn, i) => (
    <ChatTurnRow
      key={turn.id}
      turn={turn}
      isActiveInput={i === turns.length - 1 && (turn.state === "idle" || turn.state === "typing")}
      onDraft={setDraft}
      onSubmit={submit}
      onStop={stop}
      onEdit={beginEdit}
      onCancelEdit={cancelEdit}
    />
  ))}
</Conversation>`}
      />
      <p>
        Everything the hook takes and returns is on the <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink> page,
        with a full hand-assembled chat.
      </p>

      <H2 id="easy-to-get-wrong">Three things that are easy to get wrong</H2>
      <p>
        <strong>The stylesheet is not optional.</strong> The components are CSS Modules and the bundled sheet carries
        every class they reference. Without <code>import &quot;inline-chat-kit/styles.css&quot;</code> you get an
        unstyled page, which looks like the package is broken rather than unstyled. See{" "}
        <DocLink to="installation#stylesheet">Installation</DocLink>.
      </p>
      <p>
        <strong>
          <code>anchorOffset</code> has to match whatever sits above the conversation.
        </strong>{" "}
        It is how far below the top edge a sent message comes to rest, on <code>ChatExperience</code> and on{" "}
        <code>Conversation</code> alike. Put a fixed header over the feed and leave it at zero, and the message is
        scrolled neatly underneath the header.
      </p>
      <p>
        <strong>Pass the hook&apos;s own functions straight through.</strong> <code>ChatTurnRow</code> is memoised, and
        the memo is load-bearing: the hook leaves untouched turns referentially identical when it rewrites one, which
        only pays off if the rows can see that. Measured before the memo existed, streaming one answer made 366 DOM
        mutations inside an unrelated, already-finished turn. An arrow function written during render is a new prop on
        every render and undoes it, which is why every row callback takes the turn&apos;s id rather than closing over
        it. <code>renderPart</code> follows the same rule: define it outside the component, or in{" "}
        <code>useCallback</code>.
      </p>

      <H2 id="announce">What a screen reader hears</H2>
      <p>
        An answer that appears silently is one a blind reader never learns about, so <code>useChatTurns</code> speaks
        twice: <em>“Generating response”</em> when a request starts, and the answer once, when it settles, never per
        character, because a live region rewritten on every frame makes a screen reader start the answer again on every
        frame. Both are overridable through <code>announcements</code>, or silenced with{" "}
        <code>announcements: false</code>:
      </p>
      <Code
        code={`
useChatTurns({
  onSend: send,
  announcements: {
    responding: "Generišem odgovor",
    answer: (text) => (text.length > 600 ? "Odgovor je spreman." : text),
  },
});`}
      />
      <p>
        <code>announce(message, politeness?)</code> writes to the same live region, one per politeness, shared by every
        component on the page. Use it for anything of your own a reader should hear: an error, a <code>notice</code> you
        streamed, a file finished uploading. Do not add a second live region; two regions say everything twice.
      </p>
      <Code
        code={`
import { announce } from "inline-chat-kit";

announce("The conversation was saved.");                  // polite, the default
announce("The connection dropped. Retrying…", "assertive");`}
      />

      <H2 id="next">Next</H2>
      <ul>
        <li>
          <DocLink to="nextjs">Next.js</DocLink>: a route handler that streams, and the <code>onSend</code> that reads
          it.
        </li>
        <li>
          <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>: every option and everything it returns.
        </li>
        <li>
          <DocLink to="labels">Labels</DocLink>: the words the kit says, in your language.
        </li>
      </ul>
    </>
  );
}
