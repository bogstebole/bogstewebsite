import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import styles from "../../docs.module.css";
import ChatInputInteractive from "../../examples/chat-input/interactive";
import ChatInputStates from "../../examples/chat-input/states";
import ChatInputHandleExample from "../../examples/chat-input/handle";
import ChatInputMenu from "../../examples/chat-input/menu";
import ChatInputMotion from "../../examples/chat-input/motion";
import MorphGlyphExample from "../../examples/chat-input/morph-glyph";
import HoverActionsRowExample from "../../examples/chat-input/hover-actions";
import AddCardsOverlayExample from "../../examples/chat-input/add-cards";

export const meta = {
  title: "ChatInput",
  description: "The composer that becomes the message: the pill you type into morphs into the bubble that holds what you sent.",
};

const STATES = [
  { state: "idle", looks: "An empty pill, placeholder showing, and a microphone, given onTranscribe.", button: "+" },
  { state: "typing", looks: "Text in the pill; the send glyph slides in.", button: "send" },
  { state: "responding", looks: "The pill has become a glass bubble.", button: "stop" },
  { state: "resting", looks: "A settled bubble. Copy and edit appear on hover.", button: "none" },
];

export default function ChatInputPage() {
  return (
    <>
      <DocHeader title="ChatInput" description={meta.description}>
        <ImportLine
          names={[
            "ChatInput",
            "defaultInlineAnimConfig",
            "type ChatInputHandle",
            "type ChatInputState",
            "type InlineAnimConfig",
          ]}
        />
      </DocHeader>

      <ComponentPreview file="chat-input/interactive.tsx" minHeight={220}>
        <ChatInputInteractive />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "The idea on its own: a composer that turns into the sent message without a jump cut.",
          "A row of your own, when ChatTurnRow is more than you want.",
          "A single-question surface: a search box that becomes the query it asked.",
        ]}
        avoid={[
          "A conversation: ChatTurnRow renders one of these per turn and wires it to useChatTurns.",
          "A plain form field. Nothing here is a textarea with a button next to it.",
        ]}
      />
      <p>
        It is <strong>fully controlled</strong>. You own <code>value</code> and <code>state</code>, and the whole
        choreography (the send glyph sliding in, the pill becoming glass, the actions under the settled bubble) is
        driven by moving <code>state</code> between four values. Nothing animates because of a timer inside it; it
        animates because you said where it is.
      </p>
      <p>
        Enter sends and Shift+Enter is a newline. A message with only an attachment is still a message, so an empty box
        with something attached sends. In a conversation you rarely render it yourself:{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> draws one per turn.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="states">The four states</H3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>state</th>
              <th>What you see</th>
              <th>The button</th>
            </tr>
          </thead>
          <tbody>
            {STATES.map((row) => (
              <tr key={row.state}>
                <td>
                  <code className={styles.propName}>{row.state}</code>
                </td>
                <td>
                  <span className={styles.propDescription}>{row.looks}</span>
                </td>
                <td>
                  <code className={styles.propType}>{row.button}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The fifth row below is not a state but <code>busy</code>: a <code>typing</code> composer while an answer is
        arriving somewhere else: the docked composer, typed into while the answer above it is written. It stays open
        to type into and closed to send from: Enter does nothing, and the send glyph is a stop if there is an{" "}
        <code>onStop</code>, disabled if there is not.
      </p>
      <ComponentPreview file="chat-input/states.tsx">
        <ChatInputStates />
      </ComponentPreview>

      <H3 id="handle">Reaching in: ChatInputHandle</H3>
      <p>
        The <code>ref</code> is a small handle rather than the DOM node: <code>focus()</code>,{" "}
        <code>setValue(v)</code> and <code>getValue()</code>. <code>setValue</code> writes the editor and calls your{" "}
        <code>onChange</code>, so a prompt library or a “try this” button fills the box without you keeping two copies
        of the text.
      </p>
      <ComponentPreview file="chat-input/handle.tsx" minHeight={240}>
        <ChatInputHandleExample />
      </ComponentPreview>

      <H3 id="menu">The “+” menu</H3>
      <p>
        Left out, <code>menu</code> is the built-in three: Add, Design, Connectors. A list replaces them;{" "}
        <code>false</code> takes the “+” away. An entry with id <code>&quot;attach&quot;</code> and no{" "}
        <code>onSelect</code> opens the file picker, the one id the composer knows. Whatever is picked, the files
        arrive as the second argument to <code>onSubmit</code>; see{" "}
        <DocLink to="components/attachments#in-the-composer">Attachments</DocLink>.
      </p>
      <ComponentPreview file="chat-input/menu.tsx" minHeight={300}>
        <ChatInputMenu />
      </ComponentPreview>
      <p>
        The open menu lays a transparent backdrop over the whole window, so a press anywhere outside closes it, on this
        page too.
      </p>

      <H3 id="motion">Motion</H3>
      <p>
        <code>animationConfig</code> takes the whole <code>InlineAnimConfig</code>: the bubble and button springs, the
        ripple, the thresholds that decide when a growing input breaks onto a second line, the action-row stagger and
        the fan of the “+” menu. Spread <code>defaultInlineAnimConfig</code> and override what you need. Type and send in
        both.
      </p>
      <ComponentPreview file="chat-input/motion.tsx" minHeight={260}>
        <ChatInputMotion />
      </ComponentPreview>
      <Callout title="Passing the defaults is not the same as passing nothing">
        Left without <code>animationConfig</code>, the composer falls back to values of its own for the “+” fan:
        angles of −26°, −2° and 22°, a softer spring, an 8px hover pull, not the ones in{" "}
        <code>defaultInlineAnimConfig</code> (0°, −25°, −50°). So spreading the defaults to change the bubble also
        changes the shape of the menu. Open the “+” in both composers above to see it.
      </Callout>

      <H2 id="api">API</H2>
      <PropsTable
        rows={[
          { name: "state", type: '"idle" | "typing" | "responding" | "resting"', required: true, description: "Where the composer is. You move it; see the table above." },
          { name: "value", type: "string", required: true, description: "The text, controlled." },
          { name: "onChange", type: "(value: string) => void", required: true, description: "Typed into. Usually also moves state between idle and typing." },
          { name: "onSubmit", type: "(value: string, attachments: Attachment[]) => void", required: true, description: "Sent, with whatever is attached. Enter sends; Shift+Enter is a newline." },
          { name: "onStop", type: "() => void", description: "The stop button, while responding or busy." },
          { name: "busy", type: "boolean", default: "false", description: "An answer is arriving elsewhere: open to type into, closed to send from." },
          { name: "placeholder", type: "string", default: '"Ask anything…"', description: "Shown while it is empty." },
          { name: "onCopy", type: "(value: string) => void", description: "Hover action on a resting bubble." },
          { name: "onEdit", type: "(value: string) => void", description: "Hover action on a resting bubble. Put the turn back into typing." },
          { name: "isEditing", type: "boolean", default: "false", description: "Editing a sent message: save and cancel instead of send." },
          { name: "onCancelEdit", type: "() => void", description: "Paired with isEditing." },
          { name: "menu", type: "ComposerMenuItem[] | false", description: "What the “+” opens. Left out, Add, Design and Connectors." },
          { name: "onAdd", type: "() => void", description: "Called after any entry in the “+” menu is chosen." },
          { name: "attachments", type: "Attachment[]", description: "What is attached, controlled. Left out, the composer keeps its own." },
          { name: "onAttach", type: "(files: File[]) => void", description: "Files were picked. Given, the composer hands them to you instead of attaching them: upload first, attach the URL." },
          { name: "onRemoveAttachment", type: "(id: string) => void", description: "An attachment was removed." },
          { name: "accept", type: "string", default: '"image/*"', description: "Passed to the file picker." },
          { name: "multiple", type: "boolean", default: "false", description: "More than one file at a time." },
          {
            name: "onTranscribe",
            type: "TranscribeHandler",
            description: (
              <>
                Audio in, words out. Given, a microphone takes the send glyph’s slot while there is nothing to send;
                left out, there is no microphone. See <DocLink to="hooks/use-voice-input">useVoiceInput</DocLink>.
              </>
            ),
          },
          { name: "labels", type: "Partial<ChatInputLabels>", description: <>Every word the composer says. See <DocLink to="labels">Labels</DocLink>.</> },
          {
            name: "onLanded",
            type: "() => void",
            description: (
              <>
                Called once a sent bubble has come to rest: within a few pixels of its place, which reads as arrived,
                rather than when the spring stops most of a second later. Called at once if it never moves. Keep it
                stable. <DocLink to="components/chat-turn-row#docked">ChatTurnRow</DocLink> uses it to hold an answer
                back until its question has landed.
              </>
            ),
          },
          { name: "animationConfig", type: "InlineAnimConfig", description: "Springs and timings. Start from defaultInlineAnimConfig." },
          { name: "style", type: "CSSProperties", description: "On the root." },
        ]}
      />

      <H3 id="api-handle">ChatInputHandle</H3>
      <Code
        code={`
interface ChatInputHandle {
  focus: (options?: FocusOptions) => void;
  setValue: (value: string) => void; // writes the editor, then calls onChange
  getValue: () => string;
}

const input = useRef<ChatInputHandle>(null);
<ChatInput ref={input} … />`}
      />

      <H3 id="api-menu-item">ComposerMenuItem</H3>
      <Code
        code={`
interface ComposerMenuItem {
  id: string;           // "attach" without onSelect opens the file picker
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
}`}
      />

      <H3 id="api-anim-config">InlineAnimConfig</H3>
      <p>The defaults, as exported in <code>defaultInlineAnimConfig</code>:</p>
      <Code
        code={`
const defaultInlineAnimConfig: InlineAnimConfig = {
  bubble:      { stiffness: 600, damping: 22, mass: 0.3 },
  button:      { stiffness: 500, damping: 50, mass: 0.2, staggerEnter: 0.06, staggerExit: 0.06 },
  addButton:   { duration: 0.2, visualDuration: 0.2, bounce: 0.2 },
  enterButton: { duration: 0.2, visualDuration: 0.2, bounce: 0.2 },
  ripple:      { scaleX: 1, duration: 0.19, pulseDuration: 140 },
  // When a growing input breaks onto a second line, and how the controls leave (s).
  wrap:        { nearThreshold: 0.92, exitThreshold: 0.75, preExpandHeight: 16, slideInDelay: 120, exitDuration: 0.15 },
  actions:     { staggerDelay: 0.07, duration: 0.12, stiffness: 400, damping: 22 },
  // The "+" menu's fan: stagger, spring, how the input recedes, the three angles, the hover pull.
  addCards:    { staggerDelay: 0.06, stiffness: 800, damping: 41, inputScale: 0.95, inputBlur: 2,
                 angle1: 0, angle2: -25, angle3: -50, hoverPull: 12 },
};`}
      />

      <H2 id="recomposing">Recomposing the input</H2>
      <p>
        The pieces <code>ChatInput</code> is built from are exported, so you can rebuild the composer rather than fork
        it. They are low-level: each takes the state it shows and the setter it calls, and none of them keeps anything
        of its own. Pass the same <code>InlineAnimConfig</code> to all of them as <code>ac</code>, so they move as one.
      </p>
      <Callout>
        These are the parts, not a second API for the composer. If <code>ChatInput</code>’s props reach what you need{" "}
        (<code>menu</code>, <code>labels</code>, <code>animationConfig</code>), use those.
      </Callout>
      <ImportLine
        names={[
          "AddCardsOverlay",
          "HoverActionsRow",
          "MorphGlyph",
          "type AddCardsOverlayProps",
          "type HoverActionsRowProps",
          "type MorphGlyphProps",
        ]}
      />

      <H3 id="morph-glyph">MorphGlyph</H3>
      <p>
        The send button’s icon. It does not swap: the outgoing glyph slides up and out while the next slides up from
        below, in one slot, so send becoming stop reads as the same button changing its mind.
      </p>
      <ComponentPreview file="chat-input/morph-glyph.tsx">
        <MorphGlyphExample />
      </ComponentPreview>
      <PropsTable
        rows={[
          { name: "mode", type: '"send" | "stop" | "check" | "mic"', required: true, description: "Which glyph is in the slot." },
          { name: "size", type: "number", default: "14", description: "Icon size, in px." },
          { name: "color", type: "string", default: '"currentColor"', description: "Inherits from whatever contains it unless set." },
          { name: "duration", type: "number", default: "0.22", description: "The slide, in seconds." },
        ]}
      />

      <H3 id="hover-actions-row">HoverActionsRow</H3>
      <p>
        Copy, edit and “Read more”, under a settled bubble. It does not track hover itself (<code>showActions</code>{" "}
        is yours), and “Read more” only toggles <code>isExpanded</code>; clamping the bubble is the bubble’s job.
      </p>
      <ComponentPreview file="chat-input/hover-actions.tsx" minHeight={220}>
        <HoverActionsRowExample />
      </ComponentPreview>
      <PropsTable
        rows={[
          { name: "showActions", type: "boolean", required: true, description: "Whether the row is shown. It animates in and out." },
          { name: "showReadMore", type: "boolean", required: true, description: "Whether to offer Read more, when the bubble is clamped." },
          { name: "isExpanded", type: "boolean", required: true, description: "Whether the bubble is expanded. Read more becomes Read less." },
          { name: "setIsExpanded", type: "Dispatch<SetStateAction<boolean>>", required: true, description: "Toggled by Read more." },
          { name: "value", type: "string", required: true, description: "The message, handed to onCopy and onEdit." },
          { name: "onCopy", type: "(value: string) => void", description: "The copy button." },
          { name: "onEdit", type: "(value: string) => void", description: "The edit button." },
          { name: "ac", type: "InlineAnimConfig | undefined", required: true, description: "Its stagger and spring come from actions." },
        ]}
      />

      <H3 id="add-cards-overlay">AddCardsOverlay</H3>
      <p>
        The “+” menu: cards fanned out of the bottom-right corner of the nearest positioned box. While open it lays a
        transparent backdrop over the window, so a press anywhere closes it, and it brings its own close button.
      </p>
      <ComponentPreview file="chat-input/add-cards.tsx" minHeight={300}>
        <AddCardsOverlayExample />
      </ComponentPreview>
      <PropsTable
        rows={[
          { name: "isAddOpen", type: "boolean", required: true, description: "Open, controlled." },
          { name: "setIsAddOpen", type: "Dispatch<SetStateAction<boolean>>", required: true, description: "Called to close it: an entry, the close button, the backdrop." },
          { name: "items", type: "ComposerMenuItem[]", default: "Add, Design, Connectors", description: "The entries. A fourth and beyond fan at the last angle." },
          { name: "onAdd", type: "(label?: string, id?: string) => void", description: "An entry was chosen, after its own onSelect. Match on the id: the label is translated." },
          { name: "showInlineGlyph", type: "boolean", required: true, description: "Whether the composer’s send glyph is showing, so the fan starts to the left of it." },
          { name: "showButtons", type: "boolean", required: true, description: "Whether the composer’s controls are showing. Both must be true for the offset to apply." },
          { name: "ac", type: "InlineAnimConfig | undefined", required: true, description: "Its fan comes from addCards. undefined falls back to the fan ChatInput draws by default." },
          { name: "control", type: "number", default: "28", description: "How big the composer’s controls are, in px: --ick-composer-control, read as a number, so the fan starts where they end." },
        ]}
      />
    </>
  );
}
