import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ReplyThreadFromAHighlight from "../../examples/reply-thread-popup/from-a-highlight";
import ReplyThreadFromAButton from "../../examples/reply-thread-popup/from-a-button";
import ReplyThreadLabels from "../../examples/reply-thread-popup/labels";

export const meta = {
  title: "ReplyThreadPopup",
  description: "A focused side conversation about one highlighted passage, opened from the passage itself.",
};

export default function ReplyThreadPopupPage() {
  return (
    <>
      <DocHeader title="ReplyThreadPopup" description={meta.description}>
        <ImportLine names={["ReplyThreadPopup"]} />
      </DocHeader>

      <ComponentPreview file="reply-thread-popup/from-a-highlight.tsx" minHeight={280}>
        <ReplyThreadFromAHighlight />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Asking about one sentence of an answer without derailing the main conversation.",
          "Any passage with a box on screen: a highlight, a quoted clause, a table cell.",
        ]}
        avoid={[
          "The main conversation. That is ChatTurnRow, or ChatExperience for the whole thing.",
          "Something that is not about a specific passage. A thread with nothing to hang off is just a second chat.",
        ]}
      />
      <p>
        It hangs off the passage: the panel starts at the passage’s own box and travels to where it fits, so it reads as
        the passage opening. Inside is a small conversation of its own, run by the same{" "}
        <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink> as the main feed, so streaming, stop and edit behave the
        same. Every message is handed to <code>onSendMessage</code> together with the quoted passage. The popup has no
        answers of its own.
      </p>
      <p>
        In the example at the top, <DocLink to="components/text-highlighter">TextHighlighter</DocLink>’s{" "}
        <code>onReplyInThread</code> gives the passage and its box, and that pair is <code>activeReply</code>. The handler
        is an async generator, so the reply streams in as text deltas, and it checks <code>signal</code> so that stop and
        close really stop it. <code>onSave</code> is yours to define: here it counts the thread and closes it.
      </p>
      <p>
        <strong>It is a dialog.</strong> Focus moves into its input when it opens, Tab wraps at both ends, Escape closes
        it, and focus goes back to wherever it was before, if that is still on the page. Below 760px of window width it stops hanging off the phrase and comes
        up from the bottom as a sheet with a grabber. Drag it down (or flick it) to put it away. A phone has nowhere for
        a panel to hang.
      </p>
      <p>
        With <DocLink to="components/chat-experience">ChatExperience</DocLink> you do not render it at all: pass{" "}
        <code>onThreadReply</code> (same signature as <code>onSendMessage</code>) and highlights get a thread for free.
      </p>
      <Callout title="It covers the viewport while open">
        It is not portalled (it renders where you put it), but its backdrop is <code>position: fixed</code> over the whole
        viewport at <code>--ick-z-modal</code>, and a click on the backdrop closes it. That is why the examples on this
        page render it only once a thread is opened. Keep it out of ancestors with a <code>transform</code>,{" "}
        <code>filter</code> or <code>contain</code>: those make “fixed” relative to the ancestor, while the rect you pass
        is in viewport coordinates, so the panel would open in the wrong place.
      </Callout>

      <H2 id="examples">Examples</H2>

      <H3 id="from-a-button">From anything with a box</H3>
      <p>
        Nothing ties it to the highlighter. Measure an element with <code>getBoundingClientRect()</code> and pass its text.
        This handler returns a <code>Promise&lt;string&gt;</code> instead of a stream; the thread reveals the whole reply
        at the kit’s reading pace. Without <code>onSave</code>, the Save button does nothing.
      </p>
      <ComponentPreview file="reply-thread-popup/from-a-button.tsx" minHeight={240}>
        <ReplyThreadFromAButton />
      </ComponentPreview>

      <H3 id="labels">In your own words</H3>
      <p>
        There is no <code>labels</code> prop: the thread’s title, buttons and placeholder come from the nearest{" "}
        <DocLink to="labels">LabelsProvider</DocLink>, as does the highlighter’s “Reply in thread”. Anything you leave out
        stays at its default. This handler returns a plain string, the simplest shape it can take.
      </p>
      <ComponentPreview file="reply-thread-popup/labels.tsx" minHeight={240}>
        <ReplyThreadLabels />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <PropsTable
        rows={[
          {
            name: "activeReply",
            type: "{ text: string; rect: DOMRect }",
            required: true,
            description: (
              <>
                The passage, and its box in viewport coordinates. Pass what <code>onReplyInThread</code> gave you.
              </>
            ),
          },
          {
            name: "onClose",
            type: "() => void",
            required: true,
            description: "Called by the close button, Escape, a click on the backdrop, or dragging the sheet away. Unmount it here.",
          },
          {
            name: "onSendMessage",
            type: "(message: string, quotedText: string, context: SendContext) => AsyncIterable<string> | Promise<string> | string",
            required: true,
            description: (
              <>
                Produces the reply. Receives the message, the quoted passage, and the same{" "}
                <code>{"{ signal, turnId, attachments }"}</code> context as a <DocLink to="usage">send handler</DocLink>.
                Return a string, a promise of one, or stream text deltas.
              </>
            ),
          },
          {
            name: "onSave",
            type: "() => void",
            description: "Called by the Save button in the header. What saving means is up to you.",
          },
        ]}
      />
      <p>
        Its words (the title, Save, Close, the placeholder, and the screen-reader prefix before the quoted passage)
        come from the <code>thread</code> group of <DocLink to="labels">labels</DocLink>.
      </p>
      <p>
        <code>Turn</code> is still exported from here, as a deprecated alias of <code>ChatTurn</code>. Import{" "}
        <code>ChatTurn</code> instead.
      </p>
      <Code code={`import type { ChatTurn } from "inline-chat-kit"; // not Turn`} />
    </>
  );
}
