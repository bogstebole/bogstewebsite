import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ArtifactBeside from "../../examples/artifact/beside";
import ArtifactCardStates from "../../examples/artifact/states";
import ArtifactWriting from "../../examples/artifact/writing";
import ArtifactChatLayout from "../../examples/artifact/layout";

export const meta = {
  title: "Artifact",
  description:
    "What an answer produced when it is bigger than the answer: a card in the transcript, and the whole of it in a pane beside the conversation.",
};

const PATTERN = `const artifacts = useArtifacts();

<ChatLayout
  onDismiss={artifacts.close}
  pane={({ narrow, expanded, toggleExpanded }) =>
    artifacts.openId ? (
      <ArtifactPane
        title="5k training plan"
        meta="8 weeks"
        modal={narrow}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
        onClose={artifacts.close}
      >
        <YourPlan />
      </ArtifactPane>
    ) : null
  }
>
  <Conversation>
    <ArtifactCard
      id="plan"
      title="5k training plan"
      content={plan}
      open={artifacts.openId === "plan"}
      onOpen={artifacts.toggle}
    />
  </Conversation>
</ChatLayout>`;

const YOURSELF = `const [openId, setOpenId] = useState<string | null>(null);
const open = openId ? findArtifact(openId) : null;

<div className="workspace">
  <ChatExperience
    chat={chat}
    pane="none"                       // no pane here, and no room made for one
    openArtifactId={openId}           // the cards still show which one is open
    onOpenArtifactChange={setOpenId}  // a card pressed, or a custom card's openArtifact
  />
  {open && (
    <aside className="my-column">
      <ArtifactPane key={openId} title={open.title} onClose={() => setOpenId(null)}>
        {open.body}
      </ArtifactPane>
    </aside>
  )}
</div>`;

const HOOK = `function useArtifacts(initial?: string | null): Artifacts;

interface Artifacts {
  openId: string | null;      // the one on screen, or null
  open: (id: string) => void;
  close: () => void;
  toggle: (id: string) => void; // press the open one again and it closes
}`;

const TYPES = `type ArtifactKind = "code" | "text";
type ArtifactState = "writing" | "done";

interface PaneState {
  narrow: boolean;            // covering the conversation rather than beside it
  expanded: boolean;          // widened; meaningless while narrow
  toggleExpanded: () => void;
}`;

export default function ArtifactPage() {
  return (
    <>
      <DocHeader title="Artifact" description={meta.description}>
        <ImportLine names={["ArtifactCard", "ArtifactPane", "ChatLayout", "useArtifacts"]} />
        <ImportLine names={["type ArtifactKind", "type ArtifactState", "type PaneState", "type Artifacts"]} />
      </DocHeader>

      <ComponentPreview file="artifact/beside.tsx" minHeight={520} bleed>
        <ArtifactBeside />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A plan, a document, a file: something somebody will read at length, keep, or come back to.",
          "Code longer than a screen, where a fence in the answer would push the conversation out of view.",
        ]}
        avoid={[
          <>
            A short snippet: a <DocLink to="components/code-block">CodeBlock</DocLink> in the answer is enough.
          </>,
          <>
            Something waiting on a decision: that is an <DocLink to="components/approval">Approval</DocLink>.
          </>,
        ]}
      />
      <p>
        Three pieces and one decision. <code>ArtifactCard</code> is the line of the transcript that says the thing was made:
        a window onto it and a way in, not the thing itself; poured out in full it would just be a long message.{" "}
        <code>ArtifactPane</code> holds the whole of it. <code>useArtifacts</code> remembers which one is open, as a hook
        because the card and the pane sit in different parts of the tree and both need the answer. One at a time: a stack of
        open artifacts is a tab bar, and that is a product’s decision.
      </p>
      <p>
        <strong>The decision is where the pane goes.</strong> <code>ChatLayout</code> puts it on the right and makes the
        conversation room for it. A preview pane is one of the few patterns every AI chat now has, and a pattern is only
        worth anything if it is the same every time: ask for a plan, get a card, press it, the plan opens on the right.{" "}
        <strong>What is in the pane is yours:</strong> it takes children, because a plan, a table and a diagram are the part
        that actually differs between products.
      </p>
      <Code code={PATTERN} />
      <p>
        In a conversation an <code>artifact</code> part becomes the card for you: give{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> <code>openArtifactId</code> and{" "}
        <code>onOpenArtifact</code>, or let <DocLink to="components/chat-experience">ChatExperience</DocLink> hold all of it.
      </p>
      <Callout title="Every preview on this page is under 760px wide">
        <code>ChatLayout</code> switches on its own width, and this column is narrower than its breakpoint, so its example
        below shows the narrow layout, a sheet. The example at the top places the pane by hand, the way a host with its own
        layout would, to show it standing beside the conversation.
      </Callout>

      <H2 id="examples">Examples</H2>

      <H3 id="card-states">Card states</H3>
      <p>
        While it is being written the card has a title and no <code>content</code>, and the title shimmers rather than
        giving way to a spinner: it is the name of the thing, and a reader who cannot see the animation still reads it.{" "}
        <code>lines</code> is how much shows before the cut, 8 by default. Without <code>onOpen</code> the card is a record
        rather than a control.
      </p>
      <p>
        Nothing is drawn for <code>open</code>. The pane beside the conversation already says which one is open; a ring on
        the card said it twice. What changes is that the card stops lifting under the pointer, and{" "}
        <code>aria-expanded</code> says it to anybody not using one.
      </p>
      <ComponentPreview file="artifact/states.tsx">
        <ArtifactCardStates />
      </ComponentPreview>

      <H3 id="writing">Being written</H3>
      <p>The usual arrival: the title first, the content once it exists. Press replay to see it again.</p>
      <ComponentPreview file="artifact/writing.tsx" minHeight={320} align="start">
        <ArtifactWriting />
      </ComponentPreview>

      <H3 id="chat-layout">ChatLayout</H3>
      <p>
        <code>ChatLayout</code> measures <strong>its own width</strong>, not the window’s: a chat embedded in a narrow
        column of a wide page is exactly the case a media query gets wrong. Above 760px the conversation makes room and the
        pane arrives beside it: the room opens flat, because a bounce on the width would re-wrap every line of the answer
        twice, and the pane arrives with a little spring, where an overshoot costs nothing.
      </p>
      <p>
        Below it, as here, the pane is a <strong>sheet</strong> over the conversation, leaving a strip of what you asked in
        view. It is the same pane told it is <code>modal</code>: focus is held inside it and Escape closes it, because there
        is nothing usable behind it. And it gains two ways out that belong to the layout: dragged down (120px, or a flick),
        or the conversation behind it pressed, both reported through <code>onDismiss</code>. Leave that out and a thumb
        cannot dismiss the sheet. The sheet is positioned inside the layout, not portalled to the page, so it stays in
        whatever box you give <code>ChatLayout</code>.
      </p>
      <p>
        Press the card before the plan has finished: an <code>ArtifactPane</code> with no children shows its own skeleton,
        because a pane that opens empty reads as broken rather than early. While the sheet is open it holds focus on this
        page too, as it would on a phone. Escape or its close button lets go.
      </p>
      <ComponentPreview file="artifact/layout.tsx" minHeight={560} bleed>
        <ArtifactChatLayout />
      </ComponentPreview>

      <H3 id="modal">Focus, and the one prop that changes behaviour</H3>
      <p>
        On open, focus moves to the pane’s heading, not into its first control, which would skip what the thing is. It is{" "}
        <strong>not</strong> trapped unless the pane is covering the chat: beside it, trapping would lock a reader out of the
        conversation they are still reading. That is <code>modal</code>, and it is not about position. <code>ChatLayout</code>{" "}
        hands it to you as <code>narrow</code>; set it yourself only when placing the pane without one.
      </p>

      <H3 id="yourself">Drawing the pane yourself</H3>
      <p>
        A host with a layout of its own (its own column, a drawer, a route) holds which artifact is open and tells the kit
        to keep out of the way. That is what the example at the top of this page does, with <code>useArtifacts</code> and a
        flex row. Below 560px, where two columns do not fit, it lays the pane over the chat and passes{" "}
        <code>modal</code>, the decision <code>ChatLayout</code> would otherwise make for it. With{" "}
        <DocLink to="components/chat-experience">ChatExperience</DocLink> it looks like this:
      </p>
      <Code code={YOURSELF} />
      <ul>
        <li>
          <code>pane=&quot;none&quot;</code> draws no pane and makes no room for one; pressing a card reports the id, and
          pressing the open one again reports <code>null</code>.
        </li>
        <li>
          A custom card can open one too: <code>renderPart</code>’s second argument carries <code>openArtifact(id)</code>{" "}
          and <code>closeArtifact()</code>.
        </li>
        <li>
          Outside <code>ChatLayout</code>, leave <code>modal</code> off and key the pane by the artifact’s id, so opening a
          different one is a new pane and focus moves to the new title.
        </li>
      </ul>

      <H3 id="panes">Two panes, not one page split in half</H3>
      <p>
        By default the conversation fills the layout and the pane is the only card on it. <code>surface=&quot;panes&quot;</code>{" "}
        makes the conversation a card of its own: two surfaces from the same tokens, one ring of space around both and the
        same gap between them (<code>--ick-chat-pane-inset</code>). No divider: the gap is what says there are two. Below
        the breakpoint the corners and inset go, because a card inside a card with a sheet over both is three surfaces for
        one screen.
      </p>

      <H2 id="api">API</H2>

      <H3 id="api-artifact-card">ArtifactCard</H3>
      <p>
        Also takes every attribute of a <code>div</code> except <code>title</code> and <code>content</code>.
      </p>
      <PropsTable
        rows={[
          { name: "id", type: "string", required: true, description: "What the pane opens. The card and the pane share nothing else." },
          { name: "title", type: "ReactNode", required: true, description: "The artifact’s name. Shimmers while it is being written." },
          { name: "meta", type: "ReactNode", description: "What it is, in a word or two: “8 weeks”, “Python”." },
          { name: "kind", type: '"code" | "text"', default: '"code"', description: "How the preview is drawn: through the highlighter, or as prose with its line breaks." },
          { name: "lang", type: "string", description: "The fence’s language, for kind=\"code\"." },
          { name: "content", type: "string", description: "What was written. Absent while it is still being written." },
          { name: "state", type: '"writing" | "done"', default: '"done"', description: "Being written, or written." },
          { name: "lines", type: "number", default: "8", description: "How much the card shows before the cut." },
          { name: "onOpen", type: "(id: string) => void", description: "Open it. Without one the card is a record rather than a control." },
          { name: "open", type: "boolean", description: "True while its pane is on screen. Said as aria-expanded; nothing is drawn." },
        ]}
      />

      <H3 id="api-artifact-pane">ArtifactPane</H3>
      <p>
        Also takes every attribute of a <code>div</code> except <code>title</code>. It sets no width or position of its
        own and fills its parent’s height.
      </p>
      <PropsTable
        rows={[
          { name: "title", type: "ReactNode", required: true, description: "The heading focus moves to on open." },
          { name: "meta", type: "ReactNode", description: "What it is, under the title." },
          { name: "children", type: "ReactNode", description: "What you render. Absent, the pane shows a skeleton." },
          { name: "onClose", type: "() => void", description: "Draws the close button, and is what Escape calls while modal." },
          { name: "modal", type: "boolean", default: "false", description: "Covering the conversation: holds focus, answers Escape, becomes a dialog. ChatLayout passes it as narrow." },
          { name: "expanded", type: "boolean", default: "false", description: "Widened. The layout owns the width; the pane draws the control." },
          { name: "onToggleExpanded", type: "() => void", description: "Draws the widen control. Not drawn while modal: there is nothing left to take." },
          { name: "closeLabel", type: "string", default: '"Close"', description: "The close button’s name." },
          { name: "expandLabel", type: "string", default: '"Widen"', description: "The widen control’s name." },
          { name: "collapseLabel", type: "string", default: '"Narrow"', description: "Its name once widened." },
        ]}
      />

      <H3 id="api-chat-layout">ChatLayout</H3>
      <p>
        Also takes every attribute of a <code>div</code>. It fills its parent, so give it a box with a height.
      </p>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", required: true, description: "The conversation, and whatever belongs above and below it." },
          { name: "pane", type: "(state: PaneState) => ReactNode", description: "The pane, when one is open; null when none is." },
          { name: "onDismiss", type: "() => void", description: "Close it from the layout: the sheet dragged down, or the conversation behind it pressed. Only used when narrow." },
          { name: "surface", type: '"flush" | "panes"', default: '"flush"', description: "One surface with the pane on it, or two cards side by side." },
        ]}
      />

      <H3 id="api-use-artifacts">useArtifacts</H3>
      <Code lang="ts" code={HOOK} />

      <H3 id="api-types">Types</H3>
      <Code lang="ts" code={TYPES} />
    </>
  );
}
