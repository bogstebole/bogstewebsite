import { Callout, Code, ComponentPreview, DocHeader, H2, H3, ImportLine, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import CustomCursorToggle from "../../examples/custom-cursor/toggle";

export const meta = {
  title: "CustomCursor",
  description: "An optional pointer that becomes a marker over an answer and a text caret over selectable text.",
};

export default function CustomCursorPage() {
  return (
    <>
      <DocHeader title="CustomCursor" description={meta.description}>
        <ImportLine names={["CustomCursor"]} />
      </DocHeader>

      <ComponentPreview file="custom-cursor/toggle.tsx" minHeight={360}>
        <CustomCursorToggle />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A chat where marking answers is the main gesture, and the pointer should say so before anybody drags.",
          "Your own surfaces that want the same marker or caret, by adding a data attribute.",
        ]}
        avoid={[
          "Touch screens. There is no pointer to replace, and it would follow taps.",
          "A page that is not mostly the chat. It replaces the pointer everywhere, not just over the answers.",
        ]}
      />
      <p>
        <strong>It replaces the pointer on the whole page</strong>, which is why the example above is opt-in: the cursor is
        mounted only while the toggle is on, and unmounted when you turn it off, press Escape, or leave the page. Mount it
        once in your app, near the root, never once per message.
      </p>
      <p>
        It draws the new cursor but does not hide the old one, and it does not check what kind of pointer there is. Both
        are yours to do. <DocLink to="components/chat-experience">ChatExperience</DocLink> does both behind its{" "}
        <code>cursor</code> prop: it hides the native cursor under <code>@media (pointer: fine)</code> and mounts this
        only where that query matches.
      </p>

      <H2 id="how-it-decides">How it decides what to draw</H2>
      <p>
        It listens for <code>pointermove</code> on the window and draws at the pointer’s viewport position, in a{" "}
        <code>position: fixed</code> layer at <code>--ick-z-cursor</code> that ignores the pointer itself. It draws nothing
        until the first move, and hides when the pointer leaves the document. On every move it looks at the element under
        the pointer:
      </p>
      <ul>
        <li>
          The nearest ancestor with <code>data-cursor=&quot;marker&quot;</code> gives a marker,{" "}
          <code>data-cursor=&quot;text&quot;</code> a text caret. Any other value, or none, gives the arrow.
        </li>
        <li>
          A control inside that element (a link, a button, an input, anything with <code>tabindex</code>) wins and shows
          the arrow, so a button sitting on an answer still looks pressable. An element that is itself the surface and
          focusable keeps its cursor: the highlighter’s answer has a <code>tabindex</code> for keyboard marking.
        </li>
        <li>
          It shrinks to look pressed while a mouse button is held, or over anything with{" "}
          <code>data-cursor-active=&quot;true&quot;</code>, which{" "}
          <DocLink to="components/text-highlighter">TextHighlighter</DocLink> sets while you draw.
        </li>
      </ul>
      <p>
        The highlighter sets <code>data-cursor</code> on its own answer surface (<code>marker</code> or{" "}
        <code>text</code> depending on its <code>selectionMode</code>) and on its marks, which therefore get the arrow.
        Nothing else in the kit needs anything from you.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="mounting">Mounting it in your app</H3>
      <p>
        One component, near the root, and only where there is a fine pointer. The rule that hides the native cursor goes
        with it, so neither outlives the other.
      </p>
      <Code
        label="app/cursor.tsx"
        code={`
"use client";

import { useSyncExternalStore } from "react";
import { CustomCursor } from "inline-chat-kit";

const QUERY = "(pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function Cursor() {
  const fine = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  if (!fine) return null;
  return (
    <>
      <style>{"* { cursor: none !important; }"}</style>
      <CustomCursor />
    </>
  );
}
`}
      />
      <Code
        label="app/layout.tsx"
        code={`
<body>
  {children}
  <Cursor />
</body>
`}
      />

      <H3 id="your-own-surfaces">Your own surfaces</H3>
      <p>The same attributes the kit uses work on anything of yours.</p>
      <Code
        code={`
<figure data-cursor="marker">…</figure>         {/* the marker */}
<pre data-cursor="text">…</pre>                 {/* the text caret */}
<canvas data-cursor="marker" data-cursor-active={drawing ? "true" : "false"} />
`}
      />

      <H3 id="with-chat-experience">With ChatExperience</H3>
      <p>Nothing to mount: the prop brings the cursor and the rule that hides the native one.</p>
      <Code code={`<ChatExperience cursor onSend={onSend} />`} />

      <H2 id="api">API</H2>
      <p>
        <code>CustomCursor</code> takes no props. What it draws is decided by the attributes above; its colours are{" "}
        <code>--ick-cursor-fill</code> and <code>--ick-cursor-ink</code>. See <DocLink to="theming">Theming</DocLink>.
      </p>
      <Callout title="Hide the native cursor yourself">
        Without a rule like <code>{"* { cursor: none; }"}</code> you get two pointers, the system’s and this one. Scope it
        to <code>@media (pointer: fine)</code>, or render it only when you render the component, as above.
      </Callout>
    </>
  );
}
