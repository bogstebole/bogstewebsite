import { Callout, DocHeader, H2 } from "../doc";
import { DocLink } from "../doc-link";

export const meta = {
  title: "Status",
  description:
    "What is still being built and what is missing. inline-chat-kit is not ready to use in a product yet.",
};

export default function StatusPage() {
  return (
    <>
      <DocHeader
        title="Status"
        description="What is still being built, and what is missing. Read this before anything else on this site."
      />

      <Callout title="Not ready to use yet">
        inline-chat-kit is being built in the open. It is published because this site runs on it, not because it is
        ready for your product: until 1.0, a new minor version can change the API, and parts of what is below are
        unfinished. Please do not ship it yet.
      </Callout>

      <H2 id="in-progress">In progress</H2>
      <ul>
        <li>
          <strong>Dictation.</strong> The microphone in the composer. The kit draws it and records; you attach the
          service that turns speech into words, because the kit has no transcriber and will not ship one. The way it
          looks while it listens is being finished: a recorder the microphone unrolls into, the composer becoming the
          recorder, and the voice drawn above the composer as sand or water. None of that is on this site yet. The one
          free transcriber, the browser&apos;s own, answers only in Google Chrome; in Arc, Brave, Dia, Edge and Firefox
          the microphone works and no words come.
        </li>
        <li>
          <strong>Phones.</strong> The kit runs on a phone and does not break, but it has not been checked on a real
          device yet: the composer under a software keyboard, the safe areas of a notched phone, whether every control
          is in reach of a thumb. It is designed for desktop and tablet first (see{" "}
          <DocLink to="#where-it-runs">where it is meant to run</DocLink>).
        </li>
      </ul>

      <H2 id="missing">Missing</H2>
      <ul>
        <li>
          <strong>Sending while an answer is still arriving.</strong> The composer waits for the answer to finish.
          Queueing the next message has open questions first: whether it sends itself, whether it can be edited or
          dropped while it waits, and what a message that is there but not yet sent looks like.
        </li>
        <li>
          <strong>A list of conversations.</strong> There is no thread list, because nothing stores conversations
          yet.
        </li>
      </ul>

      <H2 id="what-works">What works today</H2>
      <p>
        Everything else in these docs, with a live example on every page. The list of what the demo can do is on the{" "}
        <DocLink to="#status">introduction</DocLink>, kept by the kit itself and checked in a browser before anything is
        written into it.
      </p>
    </>
  );
}
