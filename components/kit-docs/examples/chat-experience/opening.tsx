"use client";

import { ChatExperience, type SendHandler } from "inline-chat-kit";

const ANSWERS: Record<string, string> = {
  "What should I see on a first visit?":
    "Start at **Kalemegdan**, the fortress above the meeting of the Sava and the Danube. Go at sunset. " +
    "Walk down **Knez Mihailova** to Republic Square, then cross to **Skadarlija** for dinner.\n\n" +
    "On a second day: the Church of Saint Sava in the morning, and a river barge on the Sava after dark.",
  "Where can I get good ćevapi?":
    "**Walter** on Strahinjića Bana is the safe answer, and **Željko** in Zemun is the one locals argue for. " +
    "Order ten in a somun with kajmak and chopped onion, and skip the fries.",
  "How do I get from the airport to the centre?":
    "Bus **A1** runs every 20 minutes to Slavija Square and takes about 35 minutes. " +
    "A taxi from the official stand is a fixed fare to zone one. Agree on it before you get in.",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* Stands in for a model: the answer arrives a word at a time. A real handler
   reads a stream from your API and yields each chunk the same way. */
const reply: SendHandler = async function* (message, { signal }) {
  const answer =
    ANSWERS[message] ??
    "This preview only knows three answers. Press one of the openers, or point `onSend` at your model.";
  for (const word of answer.split(/(?<= )/)) {
    if (signal.aborted) return;
    await wait(28);
    yield word;
  }
};

export default function ChatExperienceOpening() {
  return (
    // `fill="container"` makes the chat as tall as this box rather than the window.
    <div style={{ position: "relative", height: 560, overflow: "hidden" }}>
      <ChatExperience
        onSend={reply}
        fill="container"
        title="Belgrade guide"
        placeholder="Ask about Belgrade…"
        empty={{
          title: "Plan a weekend in Belgrade",
          description: "Where to eat, what to see, and how to get around.",
          suggestions: Object.keys(ANSWERS),
        }}
        // The page around this chat has its own theme switch.
        headerActions={false}
      />
    </div>
  );
}
