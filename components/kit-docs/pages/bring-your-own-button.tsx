import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, Table } from "../doc";
import { DocLink } from "../doc-link";
import HostButtonExample from "../examples/bring-your-own-button/host-button";
import TokensExample from "../examples/bring-your-own-button/tokens";
import PerRoleExample from "../examples/bring-your-own-button/per-role";
import InTheChatExample from "../examples/bring-your-own-button/in-the-chat";

export const meta = {
  title: "Bring your own button",
  description:
    "Make every button in the chat yours: tokens first, then CSS on what each button is for, then your own component.",
};

const ROLES: [string, string][] = [
  ["send, stop, save", "The composer’s glyph. Three roles, not one button with three labels."],
  ["add, dictate, cancel-edit, add-close", "The composer’s other controls."],
  ["read-more, message-action", "On a sent message (data-ick-action: copy, edit)."],
  ["answer-action", "Under an answer (data-ick-action: copy, regenerate, up, down)."],
  ["suggestion", "The openers in an empty conversation."],
  ["back, header-action, header-more, header-menu-item", "The header. An action carries its id as data-ick-action."],
  ["approval-once, approval-always, approval-deny", "An approval."],
  ["question-next", "A question card."],
  ["highlight-action", "The highlight menu (data-ick-action: reply, remove)."],
  ["thread-save, thread-close", "A thread."],
  ["pane-expand, pane-close", "The artifact pane."],
  ["remove-attachment", "An attachment’s X."],
];

export default function BringYourOwnButtonPage() {
  return (
    <>
      <DocHeader title="Bring your own button" description={meta.description}>
        <ImportLine names={["ComponentsProvider", "type KitButtonProps", "type KitButtonRole"]} />
      </DocHeader>

      <ComponentPreview file="bring-your-own-button/host-button.tsx" align="start" minHeight={520}>
        <HostButtonExample />
      </ComponentPreview>
      <p>
        The same four pieces twice. On the left a shadcn-style button, handed down once by{" "}
        <code>ComponentsProvider</code>, draws every button in them; on the right nothing is provided and the kit draws
        its own. Neither piece was told about the button.
      </p>

      <H2 id="who-owns-what">Who owns what</H2>
      <p>
        The kit owns <strong>layout and behaviour</strong>: the box each button sits in, its height from{" "}
        <code>--ick-control-*</code> (and its width when it is an icon on its own), where it goes, how it arrives and
        leaves, the 44px it answers to under a finger, focus moving to it, and what pressing it does. Your button owns{" "}
        <strong>the paint</strong>: colour, border, radius, font, shadow, hover and press, its icons, and the focus ring.
      </p>
      <p>
        That split is why a host button can be dropped in without breaking the chat. The composer’s row opens with a
        spring, the header folds actions into a menu, a phone needs a 44px target: none of that is in your button, so
        none of it has to be rebuilt there. Your button fills the box it is given and never positions or animates
        itself.
      </p>

      <H2 id="levels">Three levels</H2>
      <p>Each one goes further than the last. Stop at the first that is enough; most apps stop at the first.</p>

      <H3 id="tokens">1. Tokens</H3>
      <p>
        Every button the kit draws is one of five variants, and each variant is painted from its own{" "}
        <code>--ick-btn-&lt;variant&gt;-*</code> tokens, with <code>--ick-btn-radius</code> and{" "}
        <code>--ick-btn-weight</code> across all of them. Every button reads them, the composer’s send glyph included,
        so a brand’s primary is one block of CSS rather than a selector per component.
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-btn-radius: 8px;
  --ick-btn-weight: 600;
  --ick-btn-primary-bg: #2563eb;
  --ick-btn-primary-ink: #fff;
  --ick-btn-primary-border: transparent;
  --ick-btn-primary-shadow: none;
  --ick-btn-primary-shadow-hover: 0 2px 8px rgb(37 99 235 / 0.35);
  --ick-btn-primary-shadow-press: none;
}`}
      />
      <ComponentPreview file="bring-your-own-button/tokens.tsx" align="start" minHeight={480}>
        <TokensExample />
      </ComponentPreview>
      <p>
        A state that does not change a property by default has no token for it, and keeps the resting value: set{" "}
        <code>--ick-btn-primary-bg</code> and the hover is that colour too. Heights are{" "}
        <code>--ick-control-xs</code> to <code>-xl</code>, and the composer’s own controls (the send glyph, the “+”
        and the microphone) are <code>--ick-composer-control</code>, so that row can grow without every other small
        button growing with it:
      </p>
      <Code
        lang="css"
        code={`
@media (pointer: coarse) {
  :root { --ick-composer-control: var(--ick-control-l); }
}`}
      />
      <p>
        Every token, with its default, is on <DocLink to="theming#buttons">Theming</DocLink>.
      </p>

      <H3 id="per-role">2. Per role, in CSS</H3>
      <p>
        Every button says what it is for in <code>data-ick-role</code>, what it is in <code>data-ick-variant</code>,
        and, where a role has several, which one in <code>data-ick-action</code>. Set the same tokens on a role and
        only that role changes, or write your own rules on it. A role survives a translation: matching on a hashed
        class name breaks on the next release, and matching on an <code>aria-label</code> breaks the day the label is
        translated.
      </p>
      <Code
        lang="css"
        code={`
[data-ick-role="stop"] {
  --ick-btn-primary-bg: #dc2626;
  --ick-btn-primary-ink: #fff;
}
[data-ick-action="down"][aria-pressed="true"] {
  --ick-btn-ghost-ink: #e5484d;
}`}
      />
      <ComponentPreview file="bring-your-own-button/per-role.tsx" align="start" minHeight={420}>
        <PerRoleExample />
      </ComponentPreview>
      <p>
        The composer is busy for a few seconds, so its glyph is a red stop; send something to see it again. Only the
        stop is red: <code>send</code>, <code>stop</code> and <code>save</code> are three roles on one button.
      </p>
      <Table
        head={["Role", "Where"]}
        rows={ROLES.map(([roles, where]) => [<code key="r">{roles}</code>, where])}
      />

      <H3 id="component">3. Your component</H3>
      <p>
        Give <DocLink to="components/chat-experience">ChatExperience</DocLink> your button and it draws it in place of
        its own, everywhere but <a href="#the-exception">one place</a>:
      </p>
      <Code code={`<ChatExperience components={{ Button: MyButton }} onSend={send} />`} />
      <p>
        Pieces assembled by hand (<DocLink to="components/chat-turn-row">ChatTurnRow</DocLink>,{" "}
        <DocLink to="components/chat-header">ChatHeader</DocLink>, <DocLink to="components/approval">Approval</DocLink>,
        the <DocLink to="components/artifact">artifact pane</DocLink>) take it from <code>ComponentsProvider</code>, the
        way they take words from <DocLink to="labels">LabelsProvider</DocLink>. Providers nest: an inner one overrides
        the outer one’s components one by one.
      </p>
      <Code
        code={`
<ComponentsProvider components={{ Button: MyButton }}>
  <ChatHeader title="Chat" actions={actions} />
  {turns.map((turn) => <ChatTurnRow key={turn.id} turn={turn} />)}
</ComponentsProvider>`}
      />
      <ComponentPreview file="bring-your-own-button/in-the-chat.tsx" bleed minHeight={560}>
        <InTheChatExample />
      </ComponentPreview>
      <Callout title="Declare it once, outside a render">
        A component written inside a render is a new component on every render, and every button in the chat
        remounts with it: focus is lost, a pressed state resets. Declare <code>MyButton</code> at module level, and
        keep the <code>components</code> object stable too.
      </Callout>

      <H2 id="contract">The contract</H2>
      <p>
        Your component is called with <code>KitButtonProps</code>. The first group is the kit’s words for things, not
        attributes: take them out before spreading the rest onto the element.
      </p>
      <PropsTable
        rows={[
          { name: "kitRole", type: "KitButtonRole", required: true, description: <>What it is for: a role from the <a href="#per-role">table above</a>. Switch on it to pick your own variant.</> },
          { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "glass"', required: true, description: "What the kit would have drawn. A hint." },
          { name: "size", type: '"xs" | "s" | "m" | "l" | "xl"', required: true, description: "The step of --ick-control-* the box already is. Use it for type size and padding, not height." },
          { name: "shape", type: '"square" | "pill" | "default"', required: true, description: "square: an icon on its own, as wide as it is tall. pill: a chip standing alone (an opener, Read more, a highlight’s action). default: a text button in a row. A hint." },
          { name: "icon", type: "ReactNode", description: "Leading icon. With no children it is the whole button, and aria-label names it." },
          { name: "iconRight", type: "ReactNode", description: "Trailing icon." },
          { name: "children", type: "ReactNode", description: "The label." },
          { name: "loading", type: "boolean", description: "Working: draw a spinner if you have one. disabled and aria-busy are set too." },
          { name: "pressed", type: "boolean", description: "A toggle that is on. aria-pressed is set too." },
        ]}
      />
      <p>The rest are attributes. Spread them onto the button as they are.</p>
      <PropsTable
        rows={[
          { name: "disabled", type: "boolean", description: "Also set while loading." },
          { name: "type", type: '"button"', required: true, description: "Always. A host button inside a form must not submit it." },
          { name: "onClick", type: "MouseEventHandler<HTMLButtonElement>", description: "And every other handler the kit needs." },
          { name: "aria-*, title, role, tabIndex", type: "string | number | boolean", description: "A menu’s items arrive with role=\"menuitem\" and a roving tabIndex; an icon-only button with its aria-label." },
          { name: "data-ick-role", type: "KitButtonRole", required: true, description: "The same as kitRole, so the per-role CSS still reaches your button." },
          { name: "data-ick-variant", type: "ButtonVariant", required: true, description: "The same as variant." },
          { name: "data-ick-action", type: "string", description: "Which of several the role is: copy, edit, a header action’s id." },
          { name: "data-*", type: "string | number | boolean", description: "Anything else the kit marks a button with, such as data-voice on the microphone." },
          { name: "ref", type: "Ref<HTMLButtonElement>", required: true, description: "The <button> itself. The kit focuses it and anchors the header’s menu to it." },
        ]}
      />

      <H3 id="must-do">What your button has to do</H3>
      <ul>
        <li>
          <strong>Forward the ref</strong>, with <code>forwardRef</code> or, in React 19, by passing <code>ref</code>{" "}
          through. Without it the kit cannot move focus to the button or anchor a menu to it.
        </li>
        <li>
          <strong>Render a <code>&lt;button&gt;</code>.</strong> The keyboard behaviour (Enter, Space, the tab order) is
          the element’s, and the kit relies on it.
        </li>
        <li>
          <strong>Spread what it does not use</strong> onto that button: the <code>aria-*</code>, <code>data-*</code>,{" "}
          <code>role</code>, <code>tabIndex</code>, <code>title</code>, <code>type</code> and the handlers. If you need
          a handler yourself, call the one you were given from yours.
        </li>
        <li>
          <strong>Show focus.</strong> The kit’s own ring is not drawn on a host’s button, so a button with no ring
          has none.
        </li>
        <li>
          <strong>Fill the box.</strong> The kit sets the height over yours (a <code>h-9</code> included) and, on{" "}
          <code>square</code>, the width. An inline <code>height</code> beats the kit’s rule, so leave it out.
        </li>
      </ul>
      <Code
        code={`
const MyButton = forwardRef<HTMLButtonElement, KitButtonProps>(function MyButton(
  { kitRole, variant, size, shape, icon, iconRight, loading, pressed, children, ...rest },
  ref
) {
  const look = kitRole === "approval-once" ? "default" : variant === "primary" ? "secondary" : "ghost";
  return (
    <Button ref={ref} variant={look} size={shape === "square" ? "icon" : "sm"} {...rest}>
      {loading ? <Spinner /> : icon}
      {children}
      {iconRight}
    </Button>
  );
});`}
      />
      <p>
        In development the kit checks each role’s button once and names it in the console when it does not forward
        its ref, is not a <code>&lt;button&gt;</code>, drops the <code>aria-*</code> or <code>data-ick-*</code> it was
        given, or looks no different with keyboard focus. One warning per role, and none in a production build.
      </p>

      <H3 id="kit-role">Why kitRole, not role</H3>
      <p>
        A button that spread a <code>role</code> of <code>&quot;send&quot;</code> onto itself would be an ARIA error:{" "}
        <code>role</code> is an attribute with a fixed vocabulary, and assistive technology reads it. So what the button
        is <em>for</em> arrives as <code>kitRole</code>, and the ARIA <code>role</code> still arrives where there is
        one, as <code>menuitem</code> in the header’s menu.
      </p>

      <H2 id="the-exception">The one exception: the send glyph</H2>
      <p>
        The composer’s send, stop and save button is always the kit’s. It is one button whose glyph morphs between the
        three as the composer changes state, and that animation lives inside the button: a host component would have
        to take all of it on to stand in for it. It follows the tokens instead: <code>--ick-btn-radius</code>,{" "}
        <code>--ick-btn-primary-*</code> (on <code>[data-ick-role=&quot;send&quot;]</code>, <code>&quot;stop&quot;</code>{" "}
        or <code>&quot;save&quot;</code> to tell them apart) and <code>--ick-composer-control</code>. That is why the
        chat example above sets the primary tokens to match the button it provides.
      </p>
      <p>
        Two more stay the kit’s for a different reason: a back control given <code>backHref</code> and a header
        action given an <code>href</code> are links, not buttons, and are drawn as <code>&lt;a&gt;</code>. A back
        control given <code>onBack</code> is a button, and is yours.
      </p>

      <H2 id="one-radius">One radius</H2>
      <p>
        Set <code>--ick-btn-radius</code> to your buttons’ corner even when you bring your own button. It is how the
        kit’s glyph matches yours, and how the surfaces around buttons match them: the composer’s corner,{" "}
        <code>--ick-input-radius</code>, is the button’s plus the composer’s 8px of padding, concentric, up to{" "}
        <code>--ick-radius-xl</code>. A 6px button sits in a 14px composer; the default pill sits in the 24px composer
        it always had.
      </p>
      <Code lang="css" code={`:root { --ick-btn-radius: 6px; } /* composer: 6 + 8 = 14px */`} />

      <H2 id="api">API</H2>
      <H3 id="components-provider">ComponentsProvider</H3>
      <PropsTable
        rows={[
          { name: "components", type: "ChatComponents", description: "Your components. Merged over an outer provider’s, one by one." },
          { name: "children", type: "ReactNode", description: "Every kit component beneath it draws your button." },
        ]}
      />
      <p>
        <code>ChatExperience</code> sets one up from its <code>components</code> prop, so you only need the provider
        for pieces assembled by hand.
      </p>
      <Code
        label="types"
        code={`
interface ChatComponents {
  /** Every button the kit draws but the composer's send / stop / save glyph. */
  Button?: KitButtonComponent;
}

type KitButtonComponent = ComponentType<KitButtonProps & RefAttributes<HTMLButtonElement>>;
type KitButtonShape = "pill" | "square" | "default";
type KitButtonRole =
  | "send" | "stop" | "save"            // never handed to your button
  | "add" | "dictate" | "cancel-edit" | "add-close"
  | "read-more" | "message-action" | "answer-action" | "suggestion"
  | "back" | "header-action" | "header-more" | "header-menu-item"
  | "approval-once" | "approval-always" | "approval-deny"
  | "question-next" | "highlight-action" | "thread-save" | "thread-close"
  | "pane-expand" | "pane-close" | "remove-attachment";`}
      />
    </>
  );
}
