import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import LoaderVariants from "../../examples/loader/variants";
import LoaderStatusLine from "../../examples/loader/status-line";
import LoaderInATurn from "../../examples/loader/in-a-turn";
import LoaderWithLabel from "../../examples/loader/with-label";

export const meta = {
  title: "Loader",
  description: "The gap between sending a question and the first word of the answer arriving.",
};

export default function LoaderPage() {
  return (
    <>
      <DocHeader title="Loader" description={meta.description}>
        <ImportLine names={["Loader", "type LoaderVariant"]} />
      </DocHeader>

      <ComponentPreview file="loader/variants.tsx">
        <LoaderVariants />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          <>
            <code>dots</code>: a request is out and there is nothing to show yet.
          </>,
          <>
            <code>shimmer</code>: words that stand in for something (a status line that has not settled).
          </>,
        ]}
        avoid={[
          "Before anybody has asked. That is the EmptyState.",
          "Work you can describe step by step: a Tool call or a TaskList says what is happening, not just that something is.",
        ]}
      />
      <p>
        Inside a conversation you rarely place it yourself:{" "}
        <DocLink to="components/chat-turn-row">ChatTurnRow</DocLink> shows the dots between the question being sent and
        the first word landing, so a sent question is never followed by blank space.
      </p>
      <p>
        <strong>Silent by default.</strong> <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink> already announces
        that a response is coming, and a second live region saying the same thing means hearing it twice. Without a{" "}
        <code>label</code> the loader is <code>aria-hidden</code>.
      </p>
      <p>
        Both variants stop under <code>prefers-reduced-motion</code>, and both stay legible standing still: the dots hold
        at a steady opacity and the shimmer becomes plain faint text. A loader that vanishes when its animation does was
        carrying its meaning in the movement.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="in-a-turn">In a turn</H3>
      <p>
        A turn in the <code>responding</code> state with no answer yet. You do not render a Loader here: the row does.
      </p>
      <ComponentPreview file="loader/in-a-turn.tsx" minHeight={200}>
        <LoaderInATurn />
      </ComponentPreview>

      <H3 id="status-line">A status line that has not settled</H3>
      <p>
        The shimmer runs through whatever <code>children</code> you give it, so a changing status is just changing
        children. Once the line is final, drop the loader and render the words as text. Press replay to run it again.
      </p>
      <ComponentPreview file="loader/status-line.tsx" minHeight={160}>
        <LoaderStatusLine />
      </ComponentPreview>

      <H3 id="with-a-label">When nothing else is speaking</H3>
      <p>
        Outside a chat (loading a list of past conversations, say), nothing else tells a screen reader that something is
        on its way. Pass <code>label</code> and the loader becomes a <code>role=&quot;status&quot;</code> region with that
        text, visually hidden.
      </p>
      <ComponentPreview file="loader/with-label.tsx" minHeight={220}>
        <LoaderWithLabel />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>.
      </p>
      <PropsTable
        rows={[
          { name: "variant", type: "LoaderVariant", default: '"dots"', description: "Three blinking dots, or shimmering words." },
          {
            name: "children",
            type: "ReactNode",
            description: (
              <>
                The words the shimmer runs through. Ignored by <code>dots</code>.
              </>
            ),
          },
          {
            name: "label",
            type: "string | null",
            default: "null",
            description: (
              <>
                What a screen reader is told. Leave it <code>null</code> when <code>useChatTurns</code> (or anything else)
                is already announcing the wait.
              </>
            ),
          },
        ]}
      />
      <Code label="LoaderVariant" code={`type LoaderVariant = "dots" | "shimmer";`} />
      <p>
        The dot size is <code>--ick-loader-dot</code>. See <DocLink to="theming">Theming</DocLink>.
      </p>
    </>
  );
}
