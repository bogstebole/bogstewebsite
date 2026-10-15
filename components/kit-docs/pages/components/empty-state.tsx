import { ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import EmptyStateSendAnOpener from "../../examples/empty-state/send-an-opener";
import EmptyStateSparse from "../../examples/empty-state/sparse";
import EmptyStateHeading from "../../examples/empty-state/heading";

export const meta = {
  title: "EmptyState",
  description: "What is on screen before anybody has asked anything: a title, a line of context, and openers to press.",
};

export default function EmptyStatePage() {
  return (
    <>
      <DocHeader title="EmptyState" description={meta.description}>
        <ImportLine names={["EmptyState"]} />
      </DocHeader>

      <ComponentPreview file="empty-state/send-an-opener.tsx" minHeight={340}>
        <EmptyStateSendAnOpener />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "A conversation with no turns yet.",
          "Offering openers: questions somebody can press instead of having to think of one.",
        ]}
        avoid={[
          "The gap after a question is sent. That is the Loader.",
          "An error or a lost connection. That is a SystemMessage, in the transcript.",
        ]}
      />
      <p>
        A blank input asks somebody to think of something. Openers are for the moment before they have.{" "}
        <strong>Pressing one calls <code>onSuggestion</code> with its text, and that is all it does</strong>: the
        component does not fill the input or send anything. What happens next is yours, and the answer is almost always
        to send it: an opener that only fills the input asks somebody to press send on a sentence they did not write.{" "}
        <DocLink to="components/chat-experience">ChatExperience</DocLink> takes its own <code>empty</code> prop and does
        exactly that.
      </p>
      <p>
        The example at the top does it by hand with <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink>: the empty
        state shows while no turn has a question, an opener is submitted into the first turn, and the{" "}
        <DocLink to="components/loader">Loader</DocLink> covers the wait. Press replay to start over.
      </p>
      <p>
        The openers are <code>primary</code> buttons at size <code>m</code>, not <code>secondary</code>: the secondary
        button is transparent until hovered, so an opener drawn with it reads as a line of bold text rather than as
        something to press. They wrap rather than scroll, because an opener that runs off the edge is one nobody reads.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="optional-pieces">Every piece is optional</H3>
      <p>
        <code>icon</code>, <code>title</code>, <code>description</code> and the openers are each drawn only when given,
        and nothing stands in for what you leave out. <code>suggestions</code> without <code>onSuggestion</code> draws
        nothing: an opener with nowhere to report would be a button that does nothing.
      </p>
      <ComponentPreview file="empty-state/sparse.tsx">
        <EmptyStateSparse />
      </ComponentPreview>

      <H3 id="as-a-heading">A heading, and something under it</H3>
      <p>
        <code>title</code> renders as text, not a heading, and the component is not a landmark. It sits inside a
        conversation your page already owns, and claiming a level in your document outline is not its call. Pass an{" "}
        <code>&lt;h2&gt;</code> (or whichever level fits) when it should be one. <code>children</code> are drawn last,
        under the openers, and <code>suggestionsLabel</code> names the group of openers for screen readers.
      </p>
      <ComponentPreview file="empty-state/heading.tsx">
        <EmptyStateHeading />
      </ComponentPreview>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>, except <code>title</code>, which is the prop below.
      </p>
      <PropsTable
        rows={[
          { name: "icon", type: "ReactNode", description: "Drawn above the title, in the faint ink. Mark it aria-hidden." },
          {
            name: "title",
            type: "ReactNode",
            description: "Plain text by default. Pass a heading element if your page needs one here.",
          },
          { name: "description", type: "ReactNode", description: "A line of context under the title. Rendered in a p." },
          {
            name: "suggestions",
            type: "string[]",
            description: "Openers, one button each. Drawn only when onSuggestion is given too.",
          },
          {
            name: "onSuggestion",
            type: "(text: string) => void",
            description: "Called with the opener’s text when it is pressed. Without it, no openers are drawn.",
          },
          {
            name: "suggestionsLabel",
            type: "string",
            default: '"Suggestions"',
            description: (
              <>
                The accessible name of the group of openers. The default comes from{" "}
                <DocLink to="labels">labels</DocLink> (<code>emptyState.suggestions</code>).
              </>
            ),
          },
          { name: "children", type: "ReactNode", description: "Anything else, drawn last, under the openers." },
        ]}
      />
      <p>
        Spacing around it comes from <code>--ick-empty-pad</code>. See <DocLink to="theming">Theming</DocLink>.
      </p>
    </>
  );
}
