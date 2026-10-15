import { Callout, Code, DocHeader, H2, H3 } from "../doc";
import { DocLink } from "../doc-link";

export const meta = {
  title: "Next.js",
  description: "The App Router, end to end: the stylesheet, a route handler that streams, and the onSend that reads it.",
};

export default function NextjsPage() {
  return (
    <>
      <DocHeader title="Next.js" description={meta.description} />

      <H2 id="app-router">It works in the App Router as-is</H2>
      <p>
        The bundle carries a <code>&quot;use client&quot;</code> directive, so any kit component can be imported from
        anywhere: a server component that renders one is rendering a client boundary, which is fine.
      </p>
      <p>
        What cannot cross that boundary is a function. <code>onSend</code> is one, and so are{" "}
        <code>renderPart</code> and every callback, so the component that defines them is a client component. In
        practice that is one file, your chat, marked <code>&quot;use client&quot;</code>, rendered from a server page.
      </p>

      <H2 id="stylesheet">Import the stylesheet once</H2>
      <p>
        From your root layout, or from a client component; a CSS import is fine in either. Order against your own
        stylesheets does not matter: the kit&apos;s rules sit in a cascade layer, so yours win regardless (see{" "}
        <DocLink to="theming#tokens">Theming</DocLink>).
      </p>
      <Code
        label="app/layout.tsx"
        code={`
import "inline-chat-kit/styles.css";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`}
      />

      <H2 id="route-handler">A route handler that streams</H2>
      <p>
        The browser needs a body it can read as it arrives. Plain text is enough for prose: forward each text delta from
        the model as bytes and close the stream when the model stops.
      </p>
      <Code
        lang="ts"
        label="app/api/chat/route.ts"
        code={`
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { message, history = [], quotedText } = await request.json();

  const stream = anthropic.messages.stream(
    {
      model: "claude-opus-5-5",
      max_tokens: 4096,
      // The passage a thread hangs off, when there is one.
      system: quotedText
        ? \`The reader highlighted this passage and is asking about it:\\n\\n\${quotedText}\`
        : undefined,
      messages: [...history, { role: "user", content: message }],
    },
    // Stop aborts the fetch, which aborts this request, which stops the model.
    { signal: request.signal }
  );

  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    }),
    { headers: { "content-type": "text/plain; charset=utf-8" } }
  );
}`}
      />
      <p>
        Passing <code>request.signal</code> on is what makes Stop worth pressing: without it the reader stops reading,
        but the model keeps writing (and billing) an answer nobody will see.
      </p>
      <Callout title="More than prose">
        A text body carries text. To stream tool calls, reasoning or sources as well, write one JSON object per line and
        turn each back into a string or a part on the client. See{" "}
        <DocLink to="usage#parts-over-the-wire">Parts over the wire</DocLink>.
      </Callout>

      <H2 id="on-send">The onSend that reads it</H2>
      <Code
        label="app/chat/chat.tsx"
        code={`
"use client";

import { ChatExperience, type SendHandler } from "inline-chat-kit";

const send: SendHandler = async function* (message, { signal }) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message }),
    signal,
  });
  if (!response.ok) throw new Error(\`chat failed: \${response.status}\`);
  // \`signal\` aborts the request when the reader presses stop, which ends
  // this loop and settles the turn with whatever had already arrived.
  yield* response.body!.pipeThrough(new TextDecoderStream());
};

export function Chat() {
  return <ChatExperience onSend={send} title="Chat" placeholder="Ask anything…" />;
}`}
      />
      <Code
        label="app/chat/page.tsx"
        code={`
import { Chat } from "./chat";

// A server component: it renders the client one and passes it nothing that is a function.
export default function ChatPage() {
  return <Chat />;
}`}
      />
      <p>
        A thrown error settles the turn with what had arrived and draws nothing; to say so in the answer, see{" "}
        <DocLink to="usage#errors">When the handler throws</DocLink>.
      </p>

      <H3 id="history">Sending the conversation, not just the message</H3>
      <p>
        <code>onSend</code> is handed the message, not the conversation, and a model answering one message at a time
        forgets everything before it. The turns are yours to send. Hold the conversation with{" "}
        <DocLink to="hooks/use-chat-turns">useChatTurns</DocLink> and pass it in as <code>chat</code>; the handler always
        sees the latest turns:
      </p>
      <Code
        code={`
"use client";

import { ChatExperience, useChatTurns } from "inline-chat-kit";

export function Chat() {
  const chat = useChatTurns({
    onSend: async function* (message, { signal, turnId }) {
      // Every answered turn before this one. Regenerating an older turn sends only what came before it.
      const before = chat.turns.slice(0, chat.turns.findIndex((turn) => turn.id === turnId));
      const history = before
        .filter((turn) => turn.ai)
        .flatMap((turn) => [
          { role: "user", content: turn.user },
          { role: "assistant", content: turn.ai },
        ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, history }),
        signal,
      });
      if (!response.ok) throw new Error(\`chat failed: \${response.status}\`);
      yield* response.body!.pipeThrough(new TextDecoderStream());
    },
  });

  return <ChatExperience chat={chat} title="Chat" />;
}`}
      />

      <H2 id="threads">Threads on a passage</H2>
      <p>
        A reader can mark a passage of an answer and ask about just that. The reply handler has the same three shapes as{" "}
        <code>onSend</code>, with the quoted passage as a second argument, which is what the route above puts in the
        system prompt. On <DocLink to="components/chat-experience">ChatExperience</DocLink> it is{" "}
        <code>onThreadReply</code>; leave it out and threads are off.
      </p>
      <Code
        code={`
<ChatExperience
  onSend={send}
  onThreadReply={async function* (message, quotedText, { signal }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, quotedText }),
      signal,
    });
    yield* response.body!.pipeThrough(new TextDecoderStream());
  }}
/>`}
      />
      <p>
        Drawing the thread yourself, <DocLink to="components/reply-thread-popup">ReplyThreadPopup</DocLink> takes the
        same handler as <code>onSendMessage</code>, and the passage and its position from a row&apos;s{" "}
        <code>onReplyInThread</code>:
      </p>
      <Code
        code={`
const [activeReply, setActiveReply] = useState<{ text: string; rect: DOMRect } | null>(null);
const openThread = useCallback((text: string, rect: DOMRect) => setActiveReply({ text, rect }), []);

<ChatTurnRow /* … */ onReplyInThread={openThread} />

{activeReply && (
  <ReplyThreadPopup
    activeReply={activeReply}
    onClose={() => setActiveReply(null)}
    onSendMessage={replyInThread}
  />
)}`}
      />
    </>
  );
}
