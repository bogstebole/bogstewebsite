import { Code, ComponentPreview, DocHeader, H2, H3, ImportLine, PropsTable, UsageNotes } from "../../doc";
import { DocLink } from "../../doc-link";
import ConversationLive from "../../examples/conversation/live";
import ConversationFollowing from "../../examples/conversation/following";
import ConversationAnchored from "../../examples/conversation/anchored";
import ConversationDocked from "../../examples/conversation/docked";

export const meta = {
  title: "Conversation",
  description: "The scroll container: it keeps up with an answer as it arrives, and stops the instant the reader scrolls away.",
};

export default function ConversationPage() {
  return (
    <>
      <DocHeader title="Conversation" description={meta.description}>
        <ImportLine names={["Conversation"]} />
      </DocHeader>

      <ComponentPreview file="conversation/live.tsx" minHeight={460}>
        <ConversationLive />
      </ComponentPreview>

      <H2 id="when-to-use">When to use it</H2>
      <UsageNotes
        use={[
          "The scrolling area of a chat you assemble yourself, around ChatTurnRow.",
          "Anything that grows at the bottom while somebody may be reading further up: a log, a transcript.",
          "Holding a just-sent message at the top while its answer is written underneath.",
        ]}
        avoid={[
          "A chat page ChatExperience already describes: it has one inside.",
          "A list that never grows on its own. follow={false} turns it into a plain scroll container, but then you do not need it.",
        ]}
      />
      <p>
        <strong>It follows the end of the content, not the bottom of the container.</strong> Those are only the same
        when nothing is padded below, and this kit keeps room under the last turn so a turn can be brought to the top.
        Scrolling to the true bottom there would push the answer off the screen to sit in front of a blank space;
        measuring the content makes one behaviour right for both.
      </p>
      <p>
        <strong>It does not fight the reader.</strong> A component that watches the scroll event cannot tell its own
        scrolling from yours, and ends up either dragging you back down mid-sentence or never following at all. This
        one reads intent from the input (a wheel upwards, a page key, a drag away from the end) and any of those makes
        it let go. The scroll event is only used to measure where things ended up.
      </p>

      <H2 id="examples">Examples</H2>

      <H3 id="following">Following, and letting go</H3>
      <p>
        A line arrives every 600ms and the view keeps up. Scroll up while it is still growing: it stops at once, and a
        button offers the way back to the latest. Within <code>threshold</code> pixels of the end still counts as
        following.
      </p>
      <ComponentPreview file="conversation/following.tsx" minHeight={300}>
        <ConversationFollowing />
      </ComponentPreview>

      <H3 id="anchored">Holding a turn at the top</H3>
      <p>
        <code>anchorId</code> is the prop that changes the feel. Without it the view follows the end, which is what a
        chat that stacks downwards wants. With it, the named element is brought to the top and <em>held</em> there
        while the answer grows underneath, so the reader sees their question and its answer, not the whole
        conversation pushed up from below. Point it at the turn just sent; change the id and the view moves.
      </p>
      <ComponentPreview file="conversation/anchored.tsx" minHeight={380}>
        <ConversationAnchored />
      </ComponentPreview>
      <p>
        An element cannot be scrolled to the top of a container that ends just below it, so anchoring needs room
        underneath. <code>tail=&quot;auto&quot;</code> measures exactly enough: the screen, less the anchor offset, less
        everything from the anchored turn to the end. It shrinks by a pixel for every pixel the answer grows, so the
        scroll height stays put and the turn at the top does not move. <code>ChatTurnRow</code> already carries{" "}
        <code>id=&quot;turn-&lt;id&gt;&quot;</code>, which is what to point it at:
      </p>
      <Code
        code={`
const [anchor, setAnchor] = useState<string | null>(null);
const send = (id: string, value: string) => {
  setAnchor(id);
  submit(id, value);
};

<Conversation anchorId={anchor ? \`turn-\${anchor}\` : undefined} anchorOffset={100}>
  {turns.map((turn) => <ChatTurnRow key={turn.id} turn={turn} onSubmit={send} … />)}
</Conversation>`}
      />
      <p>
        Let go of it once the answer settles, or the view stays pinned to that question and the composer (the next
        turn) sits below the fold for the rest of the session. <code>anchorOffset</code> has to match whatever sits
        over the top of the conversation; leave it at zero under a fixed header and the turn is scrolled neatly
        underneath it.
      </p>

      <H3 id="docked">The composer at the bottom</H3>
      <p>
        <code>dock</code> pins the last child to the bottom edge: pushed down by an auto margin while the conversation
        is shorter than the view, held by <code>position: sticky</code> once it is longer. Both put it on the same
        edge, so nothing moves when it crosses from one to the other. It is still content, so when a fresh composer
        arrives, the old one is no longer last, goes back into the flow, and travels up into the conversation as a
        bubble.
      </p>
      <ComponentPreview file="conversation/docked.tsx" minHeight={480}>
        <ConversationDocked />
      </ComponentPreview>
      <p>
        Assembled by hand, that is three things together: <code>useChatTurns</code> with{" "}
        <code>nextTurn: &quot;at-send&quot;</code>, so the next composer appears the moment a message goes;{" "}
        <code>busy={"{isStreaming}"}</code> on the live row, so Enter waits and its send glyph is a stop; and{" "}
        <code>onStop</code> on the live row rather than on the bubble being answered, which may have scrolled away.{" "}
        <DocLink to="components/chat-experience#docked">ChatExperience</DocLink> does all of it with{" "}
        <code>composer=&quot;docked&quot;</code>.
      </p>

      <H2 id="api">API</H2>
      <p>
        Also takes every attribute of a <code>div</code>. They land on the <strong>viewport</strong>, the element
        that scrolls, except <code>className</code>, which goes on the root. <code>ref</code> is the viewport too:
        anybody reaching for a ref here wants to scroll something, and the root does not scroll.
      </p>
      <PropsTable
        rows={[
          { name: "children", type: "ReactNode", description: "The turns." },
          { name: "anchorId", type: "string", description: "The id of an element to hold at the top of the view: a turn, usually. Without it, the view follows the end." },
          { name: "anchorOffset", type: "number", default: "0", description: "How far below the top edge the anchor sits, in px. Leave room for whatever sits over the conversation." },
          { name: "tail", type: '"auto" | number', default: '"auto"', description: "The room under the last turn that anchoring scrolls into. auto measures it, and is zero unless the conversation anchors; a number sets it in px." },
          { name: "endOffset", type: "number", default: "0", description: "Room left under the last turn when the view is at the end, in px, so a composer is not jammed against the bottom edge." },
          { name: "threshold", type: "number", default: "64", description: "How close to the end still counts as following, in px." },
          { name: "follow", type: "boolean", default: "true", description: "false switches the whole thing off: a plain scroll container." },
          { name: "dock", type: "boolean", default: "false", description: "The last child is pinned to the bottom edge: a composer that stays at the bottom." },
          { name: "scrollButton", type: "boolean", default: "true", description: "The button offering the way back to the latest." },
          {
            name: "scrollButtonLabel",
            type: "string",
            default: '"Jump to the latest"',
            description: (
              <>
                Its label. Also <code>conversation.jump</code> in <DocLink to="labels">Labels</DocLink>.
              </>
            ),
          },
          { name: "className", type: "string", description: "On the root: the box you lay out. It is a flex item that fills its parent, so give the parent a height." },
          { name: "viewportClassName", type: "string", description: "On the element that scrolls. Padding belongs here, or it is not padding inside the scroll." },
        ]}
      />
    </>
  );
}
