import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ButtonVariants from "../../examples/button/variants";
import ButtonGrid from "../../examples/button/grid";
import ButtonIconOnly from "../../examples/button/icon-only";
import ButtonIcons from "../../examples/button/icons";
import ButtonStates from "../../examples/button/states";
import ButtonGlass from "../../examples/button/glass";

export const meta = {
  title: "Button",
  description: "The kit’s one button: five materials on one size scale, with icons and a loading state.",
};

export default function ButtonPage() {
  return (
    <>
      <DocHeader title="Button" description={meta.description}>
        <ImportLine names={["Button", "type ButtonVariant", "type ButtonSize"]} />
      </DocHeader>

      <ComponentPreview file="button/variants.tsx">
        <ButtonVariants />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "Actions placed next to kit components, so they match the composer, the highlight menu and the thread header, all of which are drawn with it.",
          "Small actions that still need a real target: even a 24px button is pressable over 44px (--ick-touch-target), and has a focus ring.",
        ]}
        avoid={[
          "Navigation. A link that looks like a button is still a link. Use an a.",
          "Showing a value. A count or an answer given is a Chip.",
        ]}
      />
      <p>
        <code>primary</code> is a raised pill and the default. <code>secondary</code> is transparent until hovered, right
        for a row of quiet actions, wrong for anything that has to read as pressable at rest, which is why{" "}
        <DocLink to="components/empty-state">EmptyState</DocLink> draws its openers as primary. <code>outline</code> has an
        edge and no fill, <code>ghost</code> neither, in the soft ink. <code>glass</code> is a blurred, translucent pill in
        the mono face, made to sit over something.
      </p>
      <p>
        There is no dark-mode prop: the theme is a token swap on an ancestor, and every variant follows it. See{" "}
        <DocLink to="theming">Theming</DocLink>.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="variants-and-sizes">Every variant at every size</H3>
      <p>
        One scale for all five: <code>xs</code> 24, <code>s</code> 28, <code>m</code> 32, <code>l</code> 40 and{" "}
        <code>xl</code> 48 pixels tall. The default is <code>s</code>. Type size and padding grow with it; the corners are
        a pill unless <code>--ick-btn-radius</code> says otherwise.
      </p>
      <ComponentPreview file="button/grid.tsx" minHeight={360}>
        <ButtonGrid />
      </ComponentPreview>

      <H3 id="icon-only">Icon only</H3>
      <p>
        An <code>icon</code> with no children makes a square button, as wide as it is tall. It has no words to be named by,
        so give it an <code>aria-label</code> and mark the icon <code>aria-hidden</code>.
      </p>
      <ComponentPreview file="button/icon-only.tsx">
        <ButtonIconOnly />
      </ComponentPreview>

      <H3 id="icons">Leading and trailing icons</H3>
      <p>
        <code>icon</code> goes before the label, <code>iconRight</code> after it. With a mouse or trackpad an icon keeps
        the size you give it: 14px suits <code>s</code> and <code>m</code>, 16 to 18 the larger sizes. On a touch screen
        the kit enlarges the text and sizes icons from it instead, so the two stay in proportion.
      </p>
      <ComponentPreview file="button/icons.tsx">
        <ButtonIcons />
      </ComponentPreview>

      <H3 id="loading-and-disabled">Loading and disabled</H3>
      <p>
        <code>loading</code> replaces the content with a spinner and disables the button, without changing its width. The
        label is hidden with opacity rather than removed, so the button keeps its accessible name, and{" "}
        <code>aria-busy</code> says it is working. A disabled button fades and cannot be pressed.
      </p>
      <ComponentPreview file="button/states.tsx" minHeight={360}>
        <ButtonStates />
      </ComponentPreview>

      <H3 id="glass">Glass</H3>
      <p>
        Glass blurs what is behind it, so it needs something behind it: a picture, a gradient, a video. Over a flat page
        it reads as a pale pill.
      </p>
      <ComponentPreview file="button/glass.tsx">
        <ButtonGlass />
      </ComponentPreview>

      <H2 id="theming-it">Theming it</H2>
      <p>
        Each variant is painted from its own <code>--ick-btn-&lt;variant&gt;-*</code> tokens, with{" "}
        <code>--ick-btn-radius</code> and <code>--ick-btn-weight</code> across all five, and heights from{" "}
        <code>--ick-control-*</code>. Every button the kit draws inside its components also carries{" "}
        <code>data-ick-role</code> (what it is for) and <code>data-ick-variant</code>, so CSS can reach one role
        without touching the rest:
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-btn-radius: 6px;
  --ick-btn-primary-bg: #18181b;
  --ick-btn-primary-ink: #fafafa;
}
[data-ick-role="stop"] { --ick-btn-primary-bg: #dc2626; }`}
      />
      <p>
        The full token list is on <DocLink to="theming#buttons">Theming</DocLink>. To draw the kit’s buttons with your
        own component instead, see <DocLink to="bring-your-own-button">Bring your own button</DocLink>.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>button</code>, and forwards its <code>ref</code> to it.
      </p>
      <PropsTable
        rows={[
          { name: "variant", type: "ButtonVariant", default: '"primary"', description: "The material." },
          { name: "size", type: "ButtonSize", default: '"s"', description: "Height on the shared scale: 24, 28, 32, 40 or 48px." },
          {
            name: "icon",
            type: "ReactNode",
            description: "Leading icon. On its own it makes a square button. Give that an aria-label.",
          },
          { name: "iconRight", type: "ReactNode", description: "Trailing icon." },
          {
            name: "loading",
            type: "boolean",
            default: "false",
            description: "Replaces the content with a spinner, disables the button and sets aria-busy.",
          },
          { name: "disabled", type: "boolean", default: "false", description: "The native attribute. Also implied by loading." },
          { name: "children", type: "ReactNode", description: "The label." },
        ]}
      />
      <Code
        code={`
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "glass";
type ButtonSize = "xs" | "s" | "m" | "l" | "xl";
`}
      />

      <H2 id="glass-button">GlassButton is deprecated</H2>
      <Callout title="Use <Button variant=&quot;glass&quot;> instead">
        <code>GlassButton</code> is still exported so existing code keeps working, but it is now a thin wrapper around{" "}
        <code>Button</code>. Its sizes were named one step lower than the shared scale, so <code>s</code>/<code>m</code>/
        <code>l</code> become <code>m</code>/<code>l</code>/<code>xl</code> (its default, <code>m</code>, is{" "}
        <code>l</code>), and <code>iconLeft</code> becomes <code>icon</code>.
      </Callout>
      <Code
        code={`
// before
<GlassButton size="s" iconLeft={<Mic />}>Dictate</GlassButton>

// after
<Button variant="glass" size="m" icon={<Mic />}>Dictate</Button>
`}
      />
    </>
  );
}
