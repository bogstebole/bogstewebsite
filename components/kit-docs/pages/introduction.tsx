import { Callout, ComponentPreview, DocHeader, H2 } from "../doc";
import { DocLink } from "../doc-link";
import Morph from "../examples/introduction/morph";
import FeatureStatus from "../examples/introduction/feature-status";

export const meta = {
  title: "Introduction",
  description:
    "An inline AI chat experience for React. The input is the message: it morphs into the bubble, and the answer streams beneath it.",
};

export default function IntroductionPage() {
  return (
    <>
      <DocHeader
        title="inline-chat-kit"
        description="An inline AI chat experience for React. The input is the message: when you send, the pill you typed into morphs into the bubble that holds your text, and the answer streams in below it. No separate composer, no jump cut."
      />

      <Callout title="Not ready to use yet">
        inline-chat-kit is still being built: the API can change, and some features are in progress. See{" "}
        <DocLink to="status">Status</DocLink> for what is unfinished and what is missing.
      </Callout>

      <ComponentPreview file="introduction/morph.tsx" minHeight={220}>
        <Morph />
      </ComponentPreview>

      <H2 id="what-it-is">What it is</H2>
      <p>
        A set of React components for building an AI chat where the conversation reads as one continuous
        surface. The last turn is always the composer, so a message does not appear to move so much as to{" "}
        <em>become</em> the thing that was sent.
      </p>
      <p>
        Around that idea it ships everything an agent answer is made of: <DocLink to="components/tool">tool calls</DocLink>
        , <DocLink to="components/reasoning">reasoning</DocLink>, <DocLink to="components/task-list">plans</DocLink>,{" "}
        <DocLink to="components/sources">sources and citations</DocLink>,{" "}
        <DocLink to="components/question-card">questions</DocLink>, <DocLink to="components/approval">approvals</DocLink>,{" "}
        <DocLink to="components/artifact">artifacts in a side pane</DocLink>, dictation, and markdown answers you can draw
        on with a marker.
      </p>

      <H2 id="how-it-is-built">How it is built</H2>
      <ul>
        <li>
          <strong>One assembly, many pieces.</strong> <DocLink to="components/chat-experience">ChatExperience</DocLink> is
          a header over a conversation over a composer, already wired together. Everything it draws is also exported on
          its own, for when your app needs a shape it does not have.
        </li>
        <li>
          <strong>You own the model.</strong> The kit has no answers of its own. <code>onSend</code> returns a string, a
          promise of one, or an async iterable of deltas. See <DocLink to="usage">Wiring a model</DocLink>.
        </li>
        <li>
          <strong>Tokens, not overrides.</strong> Every colour, size and radius is an <code>--ick-</code> custom
          property, with light and dark built in. See <DocLink to="theming">Theming</DocLink>.
        </li>
        <li>
          <strong>Your buttons, if you want them.</strong> Hand the kit your design system’s button and it draws it
          in place of its own (all but the send glyph), keeping the layout and the behaviour. See{" "}
          <DocLink to="bring-your-own-button">Bring your own button</DocLink>.
        </li>
        <li>
          <strong>Every word is replaceable.</strong> Labels live in one object, so a translation is one prop. See{" "}
          <DocLink to="labels">Labels</DocLink>.
        </li>
      </ul>

      <H2 id="where-it-runs">Where it is meant to run</H2>
      <p>
        <strong>Desktop and tablet.</strong> That is what it is designed for, tuned for, and what its checks measure.
        It runs on a phone and does not break (the artifact pane and reply threads become bottom sheets, every control
        is reachable by a thumb, nothing zooms on focus), but the inline idea is weaker there: with the keyboard up, a
        phone gives you about half a screen, and the browser will not say how much.
      </p>
      <Callout title="Electron and Tauri">
        A desktop app&apos;s renderer is a browser, so the kit works there today with nothing changed.
      </Callout>

      <H2 id="status">What works today</H2>
      <p>
        The same list the demo shows, kept by the kit and checked in a browser before anything is written into it.
      </p>
      <ComponentPreview file="introduction/feature-status.tsx">
        <FeatureStatus />
      </ComponentPreview>

      <H2 id="next">Where to go next</H2>
      <ul>
        <li>
          <DocLink to="installation">Installation</DocLink>: one command and one stylesheet.
        </li>
        <li>
          <DocLink to="components/chat-experience">ChatExperience</DocLink>: a working chat in one component.
        </li>
        <li>
          <DocLink to="demo">The demo</DocLink>: every part in one scripted conversation, no backend.
        </li>
      </ul>
    </>
  );
}
