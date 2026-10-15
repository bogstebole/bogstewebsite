"use client";

import { Atom } from "lucide-react";
import { ChatTurnRow, EmptyState, useChatTurns } from "inline-chat-kit";

const ANSWERS: Record<string, string> = {
  "What is a boson?":
    "A boson is a particle with whole-number spin. Bosons carry the forces: photons carry electromagnetism, gluons the strong force, and the W and Z bosons the weak one.",
  "Explain spin":
    "Spin is an intrinsic angular momentum. Nothing is literally rotating: it is a quantum property that comes in fixed amounts and decides how a particle behaves in a magnetic field.",
  "Why does mass exist?":
    "For elementary particles, mostly through the Higgs field: particles that interact with it more strongly are heavier. Most of the mass of everyday matter, though, is the binding energy of quarks inside protons and neutrons.",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Pressing an opener sends it. The empty state gives way to the turn, the
 * loader fills the gap, and the answer reveals.
 */
export default function EmptyStateSendAnOpener() {
  const { turns, submit } = useChatTurns({
    onSend: async (message) => {
      await wait(1200);
      return ANSWERS[message] ?? "I can only answer the three openers in this example.";
    },
  });

  const asked = turns.filter((turn) => turn.user);

  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      {asked.length === 0 ? (
        <EmptyState
          icon={<Atom size={22} aria-hidden />}
          title="Ask me about particle physics"
          description="The Standard Model, the Higgs, and what a boson actually is."
          suggestions={Object.keys(ANSWERS)}
          onSuggestion={(text) => submit(turns[0].id, text)}
        />
      ) : (
        asked.map((turn) => <ChatTurnRow key={turn.id} turn={turn} />)
      )}
    </div>
  );
}
