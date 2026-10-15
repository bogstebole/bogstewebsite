import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import AttachmentsSent from "../../examples/attachments/sent";
import AttachmentsRemovable from "../../examples/attachments/removable";
import AttachmentsInComposer from "../../examples/attachments/in-composer";

export const meta = {
  title: "Attachments",
  description: "What goes along with a message: pictures that show themselves, and files that show their name.",
};

export default function AttachmentsPage() {
  return (
    <>
      <DocHeader title="Attachments" description={meta.description}>
        <ImportLine names={["Attachments", "formatSize", "type Attachment"]} />
      </DocHeader>

      <ComponentPreview file="attachments/sent.tsx">
        <AttachmentsSent />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Showing what was sent with a message: under the bubble, once it has gone.",
          "Showing what is about to go, with a way to take each one back out.",
        ]}
        avoid={[
          "A file browser or an upload queue with progress. It shows what is attached, not how far along it is.",
          "Documents the answer produced: those are artifacts, opened in the pane.",
        ]}
      />
      <p>
        <strong>An image with a <code>url</code> shows itself; everything else shows a glyph, its name and its size.</strong>{" "}
        A thumbnail of a PDF at 64px is a grey rectangle with a corner turned down, and tells you less than the
        filename does.
      </p>
      <p>
        The same row draws them in the composer and under the message once it has been sent, with{" "}
        <code>onRemove</code> in the first case and without it in the second. That prop is the whole difference between
        a control and a record, and <DocLink to="components/chat-input">ChatInput</DocLink> stops passing one the
        moment the message goes.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="removable">Being assembled</H3>
      <p>
        With <code>onRemove</code>, each one has a remove button: over a picture on hover, beside a named file always.
        Where there is no hover (a phone), the picture’s button moves to its corner and stays there, because a control
        that only appears on hover is not there at all. Remove them all and the row draws nothing, not an empty box.
      </p>
      <ComponentPreview file="attachments/removable.tsx">
        <AttachmentsRemovable />
      </ComponentPreview>

      <H3 id="in-the-composer">In the composer</H3>
      <p>
        <code>ChatInput</code> opens the picker from its “+” and keeps what comes back, unless you take over:{" "}
        <code>attachments</code> makes the list controlled, and with <code>onAttach</code> the picked files are handed to
        you instead of attached, so you can upload first and attach the URL you get back. Send: the second argument to{" "}
        <code>onSubmit</code> is what went.
      </p>
      <ComponentPreview file="attachments/in-composer.tsx" minHeight={240}>
        <AttachmentsInComposer />
      </ComponentPreview>
      <p>
        That second argument is the point. Before it, a file could be picked, shown in the composer, and quietly dropped
        on send: the message went and the picture did not, which is worse than not offering the button. A picture on
        its own is a message, so an empty box with something attached still sends.
      </p>
      <p>
        In a conversation they reach your send handler on its context,{" "}
        <code>{"onSend(message, { signal, turnId, attachments })"}</code>, and live on the turn as{" "}
        <code>turn.attachments</code>, which is how <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> keeps
        showing them under the sent message. The object URLs the composer makes for itself are revoked when one is
        removed and on unmount; the ones you make with <code>onAttach</code> are yours to revoke.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>ul</code> except <code>onRemove</code>.
      </p>
      <PropsTable
        rows={[
          { name: "attachments", type: "Attachment[]", required: true, description: "What to show. An empty list draws nothing at all." },
          { name: "onRemove", type: "(id: string) => void", description: "Leave it out and they are a record rather than a control." },
          {
            name: "labels",
            type: "Partial<{ remove: string }>",
            description: (
              <>
                The remove button’s name, followed by the file’s. See <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
        ]}
      />

      <H3 id="attachment">Attachment</H3>
      <PropsTable
        rows={[
          { name: "id", type: "string", required: true, description: "Stable, and what onRemove is called with." },
          { name: "name", type: "string", required: true, description: "The filename, shown when there is no picture to show instead." },
          { name: "type", type: "string", description: "The MIME type. Decides between a picture and a name, and which glyph." },
          { name: "url", type: "string", description: "An object URL, a data URL or a remote one. Only used when type is an image." },
          { name: "size", type: "number", description: "In bytes. Shown beside the name, through formatSize." },
        ]}
      />

      <H3 id="format-size">formatSize</H3>
      <p>
        The size beside a file’s name, exported for your own UI. Powers of two, because that is what a file browser
        says and this number is only ever compared to one of those, and nothing for a size nobody supplied.
      </p>
      <Code
        code={`
formatSize(512);        // "512 B"
formatSize(1_204);      // "1.2 KB"
formatSize(482_000);    // "471 KB"
formatSize(1_284_112);  // "1.2 MB"
formatSize(undefined);  // ""`}
      />
    </>
  );
}
