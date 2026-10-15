import type { ReactNode } from "react";
import { Callout, Code, ComponentPreview, DocHeader, H2, H3 } from "../doc";
import { DocLink } from "../doc-link";
import styles from "../docs.module.css";
import BrandScope from "../examples/theming/brand-scope";

export const meta = {
  title: "Theming",
  description:
    "The kit reads --ick- custom properties and nothing else: a handful of them moves every colour, corner and font.",
};

interface TokenRow {
  name: string;
  value: string;
  description: ReactNode;
}

/** Token, its default, and what it moves. */
function TokenTable({ rows }: { rows: TokenRow[] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Token</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code className={styles.propName}>{row.name}</code>
              </td>
              <td style={{ whiteSpace: "normal" }}>
                <code className={styles.propType}>{row.value}</code>
                <div className={styles.propDescription}>{row.description}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ThemingPage() {
  return (
    <>
      <DocHeader title="Theming" description={meta.description} />

      <ComponentPreview file="theming/brand-scope.tsx" minHeight={420}>
        <BrandScope />
      </ComponentPreview>
      <p>
        Three invented brands, each scoped to one element with <code>.ick-theme</code>. None of them sets a token that
        belongs to a single component; <em>Default</em> is the kit as it ships, following this page&apos;s theme.
      </p>

      <H2 id="tokens">How tokens work</H2>
      <p>
        The kit reads CSS custom properties, all prefixed <code>--ick-</code>. That is the whole interface: no
        provider, no build step, no JavaScript API. The defaults sit in a cascade layer,{" "}
        <code>@layer inline-chat-kit</code>, so <strong>any unlayered rule in your app wins</strong>, whatever the
        import order. There is no specificity to fight.
      </p>
      <p>
        Colours are built from <strong>channel triplets</strong> rather than finished colours, so one line moves every
        tint and alpha step derived from it:
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-ink-rgb: 20 20 24;        /* text, hovers, borders */
  --ick-paper-rgb: 253 252 250;   /* surfaces, and the light side of glass */
  --ick-marker-rgb: 120 200 255;  /* the highlighter */
  --ick-font-sans: "Inter", system-ui, sans-serif;
  --ick-radius-xl: 12px;
}`}
      />
      <p>
        Spaces, not commas: <code>20 20 24</code>, never <code>20, 20, 24</code>, because they are used as{" "}
        <code>rgb(var(--ick-ink-rgb) / 0.6)</code>.
      </p>

      <H3 id="fonts">Fonts from a loader</H3>
      <p>If a font loader hands you a CSS variable, point the kit at it:</p>
      <Code
        lang="css"
        code={`
body {
  --ick-font-sans: var(--font-geist-sans);
  --ick-font-mono: var(--font-geist-mono);
}`}
      />
      <Callout title="Declare it where the loader does">
        The kit aliases a few common font variables back to its own (<code>--font-sans</code>,{" "}
        <code>--font-geist-sans</code>, <code>--font-geist-mono</code>, <code>--font-jetbrains-mono</code>) on{" "}
        <code>:root</code>. If your loader defines its variable on <code>body</code> (as <code>next/font</code> does when
        its class is on <code>body</code>) and you point the kit at it from <code>:root</code>, the two reference each
        other there and both resolve to nothing. Set the kit&apos;s fonts on the same element the loader writes to.
      </Callout>

      <H2 id="dark-mode">Dark mode</H2>
      <p>Three states, and you choose how much of it you want:</p>
      <ul>
        <li>
          <strong>Nothing set</strong>: the kit follows <code>prefers-color-scheme</code>.
        </li>
        <li>
          <strong>
            <code>data-theme=&quot;light&quot;</code> or <code>.light</code>
          </strong>{" "}
          on the root element: pinned light, whatever the system says.
        </li>
        <li>
          <strong>
            <code>data-theme=&quot;dark&quot;</code> or <code>.dark</code>
          </strong>: pinned dark. <code>.dark</code> is there because Tailwind projects already have it.
        </li>
      </ul>
      <p>
        The dark palette is one block of <code>--ick-dark-*</code> values that both dark rules read from. To adjust dark
        without touching light, override those:
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-dark-ink-rgb: 240 238 235;
  --ick-dark-paper-rgb: 24 22 28;
}`}
      />
      <Callout title="Pin it to what your app paints">
        Left alone, the kit reads the system preference. That is right for an app that follows the system, and wrong
        and invisible for one that does not: a light-only page on a machine set to dark gets near-white ink over its own
        white background, and every word the kit draws disappears. If your app does not follow the system, set{" "}
        <code>data-theme</code> to whatever it actually paints.
      </Callout>

      <H2 id="scoping">Theming part of a page</H2>
      <p>
        Put overrides on <code>:root</code> for the whole document, or on any element with{" "}
        <code>class=&quot;ick-theme&quot;</code> for a subtree:
      </p>
      <Code
        lang="html"
        code={`
<div class="ick-theme" data-theme="light" style="--ick-marker-rgb: 255 64 160">
  <!-- the kit is pink in here, and unchanged everywhere else -->
</div>`}
      />
      <p>
        <strong>The class is required.</strong> A derived token like <code>--ick-marker</code> is resolved where it is
        declared, and the finished colour is what inherits, so <code>--ick-marker-rgb</code> set on a plain wrapper
        changes the channel and nothing that reads it. <code>.ick-theme</code> re-declares the derived tokens on that
        element, so they are worked out again from what is set there.
      </p>
      <p>
        <strong>It starts the subtree from the kit&apos;s defaults</strong>, not from the page around it. Measured with
        the installed stylesheet:
      </p>
      <ul>
        <li>
          Tokens set on an <em>ancestor</em> of the class are reset by it. Put them on the element that carries the
          class.
        </li>
        <li>
          Under a page pinned to dark, an <code>.ick-theme</code> element with no <code>data-theme</code> of its own
          follows the system preference again. Give it the theme the subtree paints: <code>data-theme</code> works on
          the element itself, so a subtree can be dark on a light page.
        </li>
        <li>
          Fonts reset too: a <code>--ick-font-sans</code> you set on <code>body</code> does not reach inside. Set it on
          the element as well.
        </li>
      </ul>

      <H2 id="reference">The tokens worth knowing</H2>
      <p>
        Everything below is declared on <code>:root</code> and on <code>.ick-theme</code>, so it can be set in either
        place. Values are the installed defaults, light theme.
      </p>

      <H3 id="ink">Ink, paper and the marker</H3>
      <TokenTable
        rows={[
          { name: "--ick-ink-rgb", value: "17 17 17", description: "Every shade of text, every hover wash, every border." },
          { name: "--ick-paper-rgb", value: "255 255 255", description: "Surfaces, and the light side of glass." },
          { name: "--ick-marker-rgb", value: "204 255 0", description: "The highlighter: its stroke, its glow, a chosen row, a citation." },
          { name: "--ick-danger-rgb", value: "200 32 32", description: "Errors and a danger notice." },
          { name: "--ick-ink", value: "rgb(var(--ick-ink-rgb))", description: "Body text. Derived, so set the channel instead." },
          { name: "--ick-ink-soft", value: "rgb(var(--ick-ink-rgb) / .6)", description: "Secondary text." },
          { name: "--ick-ink-faint", value: "rgb(var(--ick-ink-rgb) / .4)", description: "Meta: durations, counts, placeholders." },
          { name: "--ick-border", value: "rgb(var(--ick-ink-rgb) / .1)", description: "Hairlines." },
          { name: "--ick-marker", value: "rgb(var(--ick-marker-rgb) / .7)", description: "The marker where it is a surface." },
          { name: "--ick-glass-rim-rgb / --ick-glass-shade-rgb", value: "255 255 255 / 0 0 0", description: "What glass is lit by, and lit against." },
        ]}
      />

      <H3 id="surfaces">Surfaces</H3>
      <p>
        Boxes nest in three steps: a <strong>ground</strong> a group sits on, an opaque <strong>card</strong> raised on
        it, and an <strong>inset</strong> row set into the card. A question, a tool call and an approval all use the
        same three, so moving these moves all of them.
      </p>
      <TokenTable
        rows={[
          { name: "--ick-surface", value: "rgb(var(--ick-paper-rgb))", description: "The paper." },
          { name: "--ick-page", value: "paper 97%, ink 3%", description: "Behind everything, a step off the paper." },
          { name: "--ick-ground", value: "rgb(var(--ick-ink-rgb) / .05)", description: "What a group of things sits on. A wash, deliberately." },
          { name: "--ick-card", value: "var(--ick-surface)", description: "An opaque panel on the ground. Opaque matters: a translucent card picks up whatever is under it." },
          { name: "--ick-inset", value: "card 96%, ink 4%", description: "A row set into the card." },
          { name: "--ick-surface-hover / -active / -press", value: "ink at .04 / .06 / .1", description: "Interaction washes." },
        ]}
      />

      <H3 id="radius">Radius and nesting</H3>
      <p>
        Corners are concentric: a box&apos;s corner is the corner inside it plus the gap between them, on one chain for
        the whole kit. Set the seed or a gap and every nested corner follows; set a derived step and you have broken the
        chain.
      </p>
      <TokenTable
        rows={[
          { name: "--ick-radius-xs … -xl", value: "2 · 6 · 8 · 12 · 24px", description: "How round everything is, from a badge to the composer." },
          { name: "--ick-radius-pill", value: "999px", description: "Pills. Set it to a number to square them off." },
          { name: "--ick-nest-inner", value: "var(--ick-radius-md)", description: "The seed: a badge, a chip, a fenced value." },
          { name: "--ick-nest-pad", value: "8px", description: "The gap inside a card, and inside a row." },
          { name: "--ick-nest-ground-pad", value: "16px", description: "The gap around a card, on its ground." },
          { name: "--ick-nest-row / -card / -ground", value: "16 · 24 · 40px", description: "Derived with calc() from the three above. Read them; do not set them." },
        ]}
      />
      <p>
        The composer is on a chain of its own: its corner, <code>--ick-input-radius</code>, is{" "}
        <code>--ick-btn-radius</code> plus its 8px of padding, up to <code>--ick-radius-xl</code>, so it stays
        concentric with the buttons inside it. The default pill leaves it at 24px; a 6px button gets a 14px composer.
      </p>

      <H3 id="buttons">Buttons</H3>
      <p>
        Every button the kit draws is one of five variants, and each is painted from its own{" "}
        <code>--ick-btn-&lt;variant&gt;-*</code> tokens. A state that does not change a property by default has no
        token for it and keeps the resting value: set <code>--ick-btn-primary-bg</code> and the hover is that colour
        too. To go further, with CSS per role or your own button component, see{" "}
        <DocLink to="bring-your-own-button">Bring your own button</DocLink>.
      </p>
      <TokenTable
        rows={[
          { name: "--ick-btn-radius", value: "var(--ick-radius-pill)", description: "Every button’s corner, the composer’s send glyph included. Also moves the composer’s corner." },
          { name: "--ick-btn-weight", value: "var(--ick-weight-medium)", description: "The label’s weight." },
          { name: "--ick-btn-primary-bg / -ink / -border", value: "glass gradient · ink · bright border", description: "The raised pill: openers, “Allow once”, the send glyph." },
          { name: "--ick-btn-primary-shadow / -shadow-hover / -shadow-press", value: "shadow-1 · shadow-2 · inset", description: "Its lift at rest, on hover, and pressed." },
          { name: "--ick-btn-secondary-bg / -bg-hover / -ink", value: "transparent · glass gradient · ink", description: "Naked until touched: the header’s actions." },
          { name: "--ick-btn-secondary-border-hover / -shadow-hover / -shadow-press", value: "bright border · shadow-2 · inset", description: "What it grows when touched." },
          { name: "--ick-btn-outline-bg / -bg-hover / -bg-press", value: "transparent · surface-hover · surface-press", description: "An edge and no fill: “Always allow”." },
          { name: "--ick-btn-outline-ink / -border / -border-hover", value: "ink · border · ink-faint", description: "Its text and its edge." },
          { name: "--ick-btn-ghost-ink / -ink-hover", value: "ink-soft · ink", description: "Neither edge nor fill: the actions under an answer, “Deny”." },
          { name: "--ick-btn-ghost-bg-hover / -bg-press", value: "surface-active · surface-press", description: "Its washes." },
          { name: "--ick-btn-glass-bg / -bg-hover / -bg-press", value: "glass fill, and its hover and press", description: "Blurred and translucent. Its rim and shadows are the glass tokens." },
          { name: "--ick-btn-glass-ink / -ink-hover", value: "ink-glass · ink-glass-strong", description: "Its text." },
          { name: "--ick-control-xs … -xl", value: "24 · 28 · 32 · 40 · 48px", description: "Button heights. A step taller on a coarse pointer (28 · 32 · 38 · 44 · 52), and every control answers to 44px there anyway." },
          { name: "--ick-composer-control", value: "var(--ick-control-s)", description: "The composer’s send glyph, “+” and microphone: 28px on a pointer, 32 on a touch screen. Its own token, so that row can grow without every small button growing with it." },
          { name: "--ick-input-radius", value: "min(btn-radius + 8px, radius-xl)", description: "The composer’s corner. Derived, on the composer itself: set --ick-btn-radius instead." },
        ]}
      />
      <p>
        Every button also says what it is for in <code>data-ick-role</code>, what it is in{" "}
        <code>data-ick-variant</code>, and which of several in <code>data-ick-action</code>. Set the same tokens on a
        role and only that role changes; the full list of roles is on{" "}
        <DocLink to="bring-your-own-button#per-role">Bring your own button</DocLink>.
      </p>
      <Code
        lang="css"
        code={`
[data-ick-role="stop"] { --ick-btn-primary-bg: #dc2626; }

@media (pointer: coarse) {
  :root { --ick-composer-control: var(--ick-control-l); }
}`}
      />

      <H3 id="type">Type</H3>
      <TokenTable
        rows={[
          { name: "--ick-font-sans", value: '"Geist", system-ui, sans-serif', description: "The interface font." },
          { name: "--ick-font-mono", value: '"Geist Mono", ui-monospace, monospace', description: "Labels, tool names, code." },
          { name: "--ick-text-xs … -lg", value: ".625 · .75 · .8125 · .875rem", description: "The scale. Raised a step on a coarse pointer, so reading text is 16px on a phone." },
          { name: "--ick-answer-size", value: ".75rem", description: "An answer's prose. 1rem on a coarse pointer." },
          { name: "--ick-weight-regular / -medium / -semibold", value: "400 · 500 · 600", description: "Weights." },
          { name: "--ick-md-gap", value: ".85em", description: "Between blocks in an answer. In em, so it scales with the text." },
          { name: "--ick-code-size", value: ".75rem", description: "Code blocks." },
        ]}
      />

      <H3 id="motion-tokens">Motion</H3>
      <TokenTable
        rows={[
          { name: "--ick-ease", value: "cubic-bezier(.25, 1, .5, 1)", description: "The default curve." },
          { name: "--ick-ease-overshoot", value: "cubic-bezier(.34, 1.35, .64, 1)", description: "A small overshoot, for things that arrive." },
          { name: "--ick-duration-press", value: "70ms", description: "A press." },
          { name: "--ick-duration-fast / -base / -slow", value: ".16s · .2s · .4s", description: "The rest of the scale." },
        ]}
      />

      <H3 id="per-component">Per component</H3>
      <p>
        Each component names its own handful, defaulting to the tokens above. Change one to move that thing without
        moving its neighbours:
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-conversation-gap: 48px;          /* between turns */
  --ick-conversation-pad-block: 24px;    /* inside the scroll */
  --ick-conversation-pad-inline: 24px;
  --ick-empty-pad: 40px;                 /* around the empty state */

  --ick-header-height-m: 56px;           /* a roomier header */
  --ick-header-blur: 20px;

  --ick-question-surface: var(--ick-ground);
  --ick-badge-size: 24px;
  --ick-loader-dot: 5px;

  --ick-md-item-gap: 0.35em;             /* between list items in an answer */
  --ick-md-rule: var(--ick-border);      /* quote bar, table borders, hr */
}`}
      />
      <p>
        Code blocks ship monochrome: ink at four weights. Six tokens turn that into a palette:
      </p>
      <Code
        lang="css"
        code={`
:root {
  --ick-code-comment: #6a737d;
  --ick-code-keyword: #d73a49;
  --ick-code-string: #032f62;
  --ick-code-number: #005cc5;
  --ick-code-name: #6f42c1;
  --ick-code-attr: #e36209;
}`}
      />

      <H3 id="fixed">Two things that do not follow the theme</H3>
      <p>
        <strong>The cursor</strong> (<code>--ick-cursor-fill</code>, <code>--ick-cursor-ink</code>) is drawn over
        content the kit does not control, so it keeps a light body and a dark outline in both themes, the way a road
        sign does. <strong>Text on the marker</strong> (<code>--ick-marker-ink</code>) stays dark in both, because the
        marker is the same colour in both. The stroke drawn across an answer is the exception: light multiplies it into
        the text, dark lays a tint down instead, because multiplying under light text inverts figure and ground.
      </p>

      <H2 id="motion">Tuning the motion</H2>
      <p>
        The durations and curves above cover CSS transitions. The composer&apos;s springs (the bubble, the buttons,
        the ripple, the wrap thresholds that decide when a growing input breaks onto a new line, the stagger of the
        action row, the radial fan behind the <code>+</code>) are an <code>InlineAnimConfig</code>, passed as{" "}
        <code>animationConfig</code> to <DocLink to="components/chat-input">ChatInput</DocLink>,{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> or{" "}
        <DocLink to="components/chat-experience">ChatExperience</DocLink>. Start from the defaults and override what you
        need:
      </p>
      <Code
        code={`
import { ChatInput, defaultInlineAnimConfig } from "inline-chat-kit";

<ChatInput
  {...props}
  animationConfig={{
    ...defaultInlineAnimConfig,
    bubble: { stiffness: 520, damping: 24, mass: 0.2 },
  }}
/>;`}
      />
      <p>
        Reduced motion is already handled: under <code>prefers-reduced-motion</code>, transforms and layout snap to
        their final values while opacity and colour still fade, so a state change stays legible without travelling.
      </p>
    </>
  );
}
