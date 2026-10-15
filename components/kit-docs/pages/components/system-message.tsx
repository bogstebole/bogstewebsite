import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import SystemMessageTones from "../../examples/system-message/tones";
import SystemMessageInAConversation from "../../examples/system-message/in-a-conversation";
import SystemMessageWraps from "../../examples/system-message/wraps";
import SystemMessageWithAction from "../../examples/system-message/with-action";

export const meta = {
  title: "SystemMessage",
  description: "The conversation saying something about itself, not the reader, and not the agent.",
};

export default function SystemMessagePage() {
  return (
    <>
      <DocHeader title="SystemMessage" description={meta.description}>
        <ImportLine names={["SystemMessage", "type SystemTone"]} />
      </DocHeader>

      <ComponentPreview file="system-message/tones.tsx">
        <SystemMessageTones />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Something that happened to the conversation: the window filled, the model changed partway through, the connection dropped.",
          "A line that belongs in the transcript, so it is still there when somebody scrolls back.",
        ]}
        avoid={[
          "Anything the agent says. That is the answer.",
          "A notification somebody should dismiss. This is a line of the transcript, not a toast.",
          "How full the window is getting. That is Context. This is what speaks when it is full.",
        ]}
      />
      <p>
        <DocLink to="components/context">Context</DocLink> warns that the window is nearly full, and then nothing used to
        say anything when it filled. This is what says so. It sits on the recessed ground rather than on a card, because
        a note about the conversation is not a thing in it, and its text lines up with the words inside the cards around
        it, not with their edges.
      </p>
      <p>
        <strong>No icon</strong>, deliberately. Every glyph in the kit carries a state the words beside it also carry, so
        a reader the picture does not reach loses nothing. An icon here would only say “something is being announced”
        beside a sentence announcing it. The tint says which tone it is; the sentence says the rest.
      </p>
      <p>
        <strong>No dismiss, no action, no live region.</strong> Dismissing a line would be editing what happened. A host
        that wants a button composes one under it. And the kit already has one shared live region, written to by{" "}
        <code>announce</code>: a second would say everything twice.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="in-a-conversation">In a conversation</H3>
      <p>
        Between the rows it describes. A one-line note keeps close to the height of a folded row like a{" "}
        <DocLink to="components/tool">Tool</DocLink> call, so it does not jolt the rhythm of the transcript.
      </p>
      <ComponentPreview file="system-message/in-a-conversation.tsx">
        <SystemMessageInAConversation />
      </ComponentPreview>

      <H3 id="wrapping">Long sentences</H3>
      <p>
        Write the sentence about what happens next, not just that a state changed, which usually makes it long enough
        to wrap. It wraps like prose, at a reading line height, not like a label.
      </p>
      <ComponentPreview file="system-message/wraps.tsx">
        <SystemMessageWraps />
      </ComponentPreview>

      <H3 id="with-an-action">With an action of your own</H3>
      <p>
        The button sits under the message, not inside it. When the connection returns, a second line is added and the
        first stays: the transcript says it was lost and then came back. Because the message is not a live region, the
        example calls <code>announce</code> itself.
      </p>
      <ComponentPreview file="system-message/with-action.tsx" minHeight={220}>
        <SystemMessageWithAction />
      </ComponentPreview>

      <H3 id="from-a-stream">From a stream</H3>
      <p>
        You do not have to place it by hand. Yield a <code>notice</code> part from your{" "}
        <DocLink to="usage">send handler</DocLink> and{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws it as a <code>SystemMessage</code>. That is the
        only way anything reaches a conversation without the host placing it, which is why it exists as a part as well
        as a component. If you stream a notice, announce it yourself.
      </p>
      <Code
        code={`
import { announce, type SendHandler } from "inline-chat-kit";

const onSend: SendHandler = async function* (message, { signal }) {
  const res = await fetch("/api/chat", { method: "POST", body: message, signal });
  if (res.headers.get("x-model-switched")) {
    const text = "The model changed partway through this answer.";
    announce(text);
    yield { kind: "notice", id: "model-switch", text };
  }
  // …then stream the answer as usual
};
`}
      />

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          {
            name: "children",
            type: "ReactNode",
            required: true,
            description: "The sentence. Say what happens next, not only that a state changed.",
          },
          {
            name: "tone",
            type: "SystemTone",
            default: '"notice"',
            description: (
              <>
                <code>&quot;notice&quot;</code> or <code>&quot;danger&quot;</code>. Two, because Context already settled
                that a third, amber step in the middle is one too many.
              </>
            ),
          },
        ]}
      />
      <Code label="SystemTone" code={`type SystemTone = "notice" | "danger";`} />
      <p>
        The tones are drawn from <code>--ick-system-surface</code>, <code>--ick-system-ink</code> and their{" "}
        <code>-danger</code> pairs, with <code>--ick-system-radius</code> for the corners. See{" "}
        <DocLink to="theming">Theming</DocLink>.
      </p>
    </>
  );
}
