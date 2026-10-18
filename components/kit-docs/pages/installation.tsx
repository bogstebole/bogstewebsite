import { Callout, Code, DocHeader, H2 } from "../doc";
import { DocLink } from "../doc-link";

export const meta = {
  title: "Installation",
  description: "Install inline-chat-kit and its peer dependencies, and import the stylesheet once.",
};

export default function InstallationPage() {
  return (
    <>
      <DocHeader
        title="Installation"
        description="One package, three peers you probably already have, and a stylesheet imported once."
      />

      <Callout title="Not ready to use yet">
        inline-chat-kit is still being built: the API can change, and some features are in progress. See{" "}
        <DocLink to="status">Status</DocLink> for what is unfinished and what is missing.
      </Callout>

      <H2 id="install">Install the package</H2>
      <Code lang="bash" label="terminal" code="npm install inline-chat-kit motion lucide-react" />
      <p>
        <code>react</code>, <code>react-dom</code>, <code>motion</code> and <code>lucide-react</code> are peer
        dependencies: the kit uses whatever copy your app already has. React 18 or 19.
      </p>

      <H2 id="stylesheet">Import the stylesheet</H2>
      <p>Once, at the root of your app: a root layout, or the entry file.</p>
      <Code code={`import "inline-chat-kit/styles.css";`} />
      <Callout title="It is not optional">
        The components are CSS Modules and the bundled sheet carries every class they reference. Without it you get an
        unstyled page, which looks like the package is broken rather than unstyled.
      </Callout>

      <H2 id="first-chat">A first chat</H2>
      <p>A working chat, with no backend, in one component:</p>
      <Code
        label="minimal-chat.tsx"
        code={`
import { ChatExperience } from "inline-chat-kit";
import "inline-chat-kit/styles.css";

export function MinimalChat() {
  return (
    <ChatExperience
      // The one thing that has to be yours: a string, a promise of one,
      // or an async iterable of deltas.
      onSend={async (message) => \`You said: \${message}\`}
      title="Chat"
      placeholder="Ask anything…"
      empty={{
        title: "Ask me anything",
        description: "Or press one of these.",
        suggestions: ["What can you do?", "Write me a haiku"],
      }}
    />
  );
}`}
      />
      <p>
        Type, press enter, and the pill you typed into becomes the bubble holding your message. It travels to the top
        of the view and stays there while the answer is written underneath, then lets go so the composer for your next
        message is back on screen.
      </p>

      <H2 id="next">Next</H2>
      <ul>
        <li>
          <DocLink to="usage">Wiring a model</DocLink>: stream real answers into it.
        </li>
        <li>
          <DocLink to="nextjs">Next.js</DocLink>: a route handler that streams, and the <code>onSend</code> that
          reads it.
        </li>
        <li>
          <DocLink to="theming">Theming</DocLink>: colours, sizes and dark mode.
        </li>
      </ul>
    </>
  );
}
