import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ChatHeaderBasic from "../../examples/chat-header/basic";
import ChatHeaderVariants from "../../examples/chat-header/variants";
import ChatHeaderSizes from "../../examples/chat-header/sizes";
import ChatHeaderCollapsing from "../../examples/chat-header/collapsing";
import ChatHeaderCustomControls from "../../examples/chat-header/custom-controls";

export const meta = {
  title: "ChatHeader",
  description: "The chrome above a conversation: what it is about, the way back, and the few things you can do to the whole thread.",
};

export default function ChatHeaderPage() {
  return (
    <>
      <DocHeader title="ChatHeader" description={meta.description}>
        <ImportLine names={["ChatHeader", "headerIconSize", "type ChatHeaderAction"]} />
      </DocHeader>

      <ComponentPreview file="chat-header/basic.tsx">
        <ChatHeaderBasic />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "The top of a chat you assemble yourself, or of a panel that holds one.",
          "Thread-wide actions: share, export, saved highlights, the theme.",
          "A title that is a sentence (the first question asked) rather than a label.",
        ]}
        avoid={[
          "Per-message actions. Those sit under the message, in the row.",
          "A site’s own navigation. This is about one conversation.",
        ]}
      />
      <p>
        Actions are <strong>described</strong>, not handed over as children, and the reason is not tidiness: when the
        header gets narrow it folds them into an overflow menu, and a header cannot summarise children it cannot read.
        So each action is an id, a label, an icon and what it does. <code>label</code> is required because an icon has
        no name of its own: a header of unlabelled glyphs reads as “button, button, button”.
      </p>
      <p>
        Anything without that shape (a segmented control, a model picker) goes in as <code>children</code>. It sits
        before the actions and never collapses. <DocLink to="components/chat-experience">ChatExperience</DocLink> draws
        one of these for you, titled with the first question asked.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="variants">Variants</H3>
      <p>
        Three answers to “should this line be here yet”. <code>plain</code> is nothing until something scrolls under
        it, then grows a backdrop and a hairline. <code>bordered</code> keeps its hairline either way.{" "}
        <code>glass</code> is frosted the whole time, and what passes beneath it blurs. On a still page they look the
        same. Scroll each column.
      </p>
      <ComponentPreview file="chat-header/variants.tsx">
        <ChatHeaderVariants />
      </ComponentPreview>
      <p>
        <code>sticky</code> keeps the header at the top of its scroller, and <code>elevateOnScroll</code>, on by
        default when sticky, is what grows the border and backdrop once content has scrolled underneath.
      </p>

      <H3 id="sizes">Sizes</H3>
      <p>
        <code>s</code>, <code>m</code> and <code>l</code> are 40, 48 and 56px rows, and the buttons scale with them.
        The header draws its own back button and overflow menu at the right size; your action icons are{" "}
        <code>ReactNode</code>s you made, at whatever size you guessed. <code>headerIconSize</code> is that size per
        header size (14, 16 and 18), so the row stays even when the header changes.
      </p>
      <ComponentPreview file="chat-header/sizes.tsx">
        <ChatHeaderSizes />
      </ComponentPreview>

      <H3 id="actions">Actions and the overflow menu</H3>
      <p>
        Below <code>collapseActionsAt</code> pixels (measured on the header itself, not the window, so a header in a
        narrow panel collapses on its own terms), every action not <code>pinned</code> folds into a “More actions”
        menu. Drag the corner of the frame. The menu closes on Escape, on an item, on the button pressed again, or on a
        press anywhere outside it.
      </p>
      <ComponentPreview file="chat-header/collapsing.tsx" align="start" minHeight={300}>
        <ChatHeaderCollapsing />
      </ComponentPreview>
      <p>
        <code>count</code> draws a badge on the glyph and is folded into the accessible name, so a reader who cannot
        see the badge still hears “Saved highlights, 3”. <code>active</code> makes an action a toggle with{" "}
        <code>aria-pressed</code>; <code>href</code> makes it a link, because navigation is not a click.{" "}
        <code>variant: &quot;primary&quot;</code> draws one as your primary while it is in the header.
      </p>
      <p>
        Every button the header draws carries <code>data-ick-role</code> (<code>back</code>,{" "}
        <code>header-action</code>, <code>header-more</code>, <code>header-menu-item</code>) and an action its{" "}
        <code>id</code> as <code>data-ick-action</code>, so one action can be styled by what it is rather than by
        where it sits. To draw them with your own component, see{" "}
        <DocLink to="bring-your-own-button">Bring your own button</DocLink>.
      </p>

      <H3 id="children">Controls the kit does not manage</H3>
      <p>
        A segmented control as <code>children</code>, sized with <code>headerIconSize</code> so it matches the action
        beside it. <code>align=&quot;center&quot;</code> is the native arrangement: the title in the middle, controls
        either side.
      </p>
      <ComponentPreview file="chat-header/custom-controls.tsx">
        <ChatHeaderCustomControls />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>header</code> element except <code>title</code>, and forwards its{" "}
        <code>ref</code>.
      </p>
      <PropsTable
        rows={[
          { name: "title", type: "ReactNode", description: "What the conversation is about." },
          { name: "subtitle", type: "ReactNode", description: "The second line: the model, a count, a state." },
          { name: "avatar", type: "ReactNode", description: "A logo or an agent’s avatar, before the title." },
          { name: "headingLevel", type: "1 | 2 | 3 | 4 | 5 | 6 | false", default: "2", description: "The title’s heading level. It belongs to your document. false renders plain text." },
          { name: "truncate", type: "boolean", default: "true", description: "Long titles get an ellipsis rather than a second line." },
          { name: "onBack", type: "() => void", description: "Renders a back button." },
          { name: "backHref", type: "string", description: "Renders a back link instead: navigation belongs in an anchor." },
          { name: "backLabel", type: "string", default: '"Back"', description: "The back control’s accessible name." },
          { name: "actions", type: "ChatHeaderAction[]", default: "[]", description: "The managed actions. These are what collapse." },
          { name: "overflowLabel", type: "string", default: '"More actions"', description: "The overflow button’s name." },
          { name: "variant", type: '"plain" | "glass" | "bordered"', default: '"plain"', description: "The material." },
          { name: "size", type: '"s" | "m" | "l"', default: '"m"', description: "40, 48 or 56px." },
          { name: "align", type: '"start" | "center"', default: '"start"', description: "center: the title in the middle, controls either side." },
          { name: "sticky", type: "boolean", default: "false", description: "Stick to the top of the scroller." },
          { name: "elevateOnScroll", type: "boolean", default: "sticky", description: "Grow a border and a backdrop once content has scrolled under it." },
          { name: "collapseActionsAt", type: "number | false", default: "520", description: "Header width in px below which unpinned actions fold into the menu. false never folds." },
          { name: "landmark", type: "boolean", default: "true", description: "Render as <header>, the page’s banner landmark. false inside a panel or a card, where that would be a lie." },
          { name: "children", type: "ReactNode", description: "Anything the kit should not manage. Sits before the actions; never collapses." },
        ]}
      />

      <H3 id="header-action">ChatHeaderAction</H3>
      <PropsTable
        rows={[
          { name: "id", type: "string", required: true, description: "Stable across renders. Also the React key and the menu item’s id." },
          { name: "label", type: "string", required: true, description: "The accessible name, and the text in the overflow menu." },
          { name: "icon", type: "ReactNode", required: true, description: "The glyph. Size it with headerIconSize." },
          { name: "onClick", type: "() => void", description: "What it does." },
          { name: "href", type: "string", description: "Renders an anchor rather than a button." },
          { name: "count", type: "number", description: "A number on the glyph: saved items, unread replies. Folded into the name." },
          { name: "active", type: "boolean", description: "A toggle rather than a command. Renders aria-pressed." },
          { name: "disabled", type: "boolean", description: "Shown, not pressable." },
          { name: "pinned", type: "boolean", description: "Stays visible when the rest collapse. For the one action that matters." },
          {
            name: "variant",
            type: '"primary" | "secondary" | "outline" | "ghost"',
            default: '"secondary"',
            description: "How it is drawn in the header: secondary is naked until touched, primary is the one that stands out. Folded into the menu, every action is a plain menu item.",
          },
        ]}
      />

      <H3 id="header-icon-size">headerIconSize</H3>
      <Code
        code={`
headerIconSize; // { s: 14, m: 16, l: 18 }

<ChatHeader size="l" actions={[{ id: "share", label: "Share", icon: <Share2 size={headerIconSize.l} /> }]} />`}
      />
    </>
  );
}
