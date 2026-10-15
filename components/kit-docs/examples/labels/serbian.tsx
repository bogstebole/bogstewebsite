"use client";

import { useState } from "react";
import {
  Approval,
  Button,
  LabelsProvider,
  Reasoning,
  TaskList,
  Tool,
  type ChatLabels,
  type Decision,
} from "inline-chat-kit";

/** Every group is partial: anything left out stays English. */
const sr: ChatLabels = {
  reasoning: { thinking: "Razmišljam", thought: "Razmislio", thoughtFor: "Razmišljao" },
  tasks: {
    pending: "Na čekanju",
    running: "U toku",
    done: "Gotovo",
    error: "Nije uspelo",
    // {done} and {total} are filled in; move them wherever the sentence wants them.
    progress: "{done} od {total}",
  },
  tool: { input: "Ulaz", output: "Izlaz", error: "Greška", pending: "Na čekanju", running: "U toku", done: "Gotovo" },
  approval: {
    once: "Dozvoli jednom",
    always: "Uvek dozvoli",
    deny: "Odbij",
    allowedOnce: "Dozvoljeno jednom",
    allowedAlways: "Dozvoljeno od sada",
    wasDenied: "Odbijeno",
    pending: "Čeka tvoju odluku",
  },
};

// The kit translates its own words. What you put in it (titles, task names) is yours.
const CONTENT = {
  en: {
    thought: "The screenshots folder is generated, so removing it loses nothing that cannot be rebuilt.",
    plan: "Plan",
    tasks: ["Find the generated files", "Check nothing else is inside", "Remove the folder"],
    title: "Run a command in your shell",
    description: "It removes the generated screenshots. Nothing else is touched.",
  },
  sr: {
    thought: "Folder sa snimcima ekrana se generiše, pa njegovim brisanjem ništa nepovratno ne gubimo.",
    plan: "Plan",
    tasks: ["Pronađi generisane fajlove", "Proveri da unutra nema ničeg drugog", "Obriši folder"],
    title: "Pokreni komandu u terminalu",
    description: "Briše generisane snimke ekrana. Ništa drugo se ne dira.",
  },
};

export default function SerbianLabels() {
  const [lang, setLang] = useState<"en" | "sr">("sr");
  const [decision, setDecision] = useState<Decision | null>(null);
  const copy = CONTENT[lang];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 520 }}>
      <div role="group" aria-label="Language" style={{ display: "flex", gap: 6 }}>
        <Button size="s" variant={lang === "en" ? "secondary" : "ghost"} aria-pressed={lang === "en"} onClick={() => setLang("en")}>
          English
        </Button>
        <Button size="s" variant={lang === "sr" ? "secondary" : "ghost"} aria-pressed={lang === "sr"} onClick={() => setLang("sr")}>
          Srpski
        </Button>
      </div>

      {/* Undefined labels means English. */}
      <LabelsProvider labels={lang === "sr" ? sr : undefined}>
        <div lang={lang} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Reasoning state="done" duration={4000}>
            {copy.thought}
          </Reasoning>

          <TaskList
            title={copy.plan}
            tasks={copy.tasks.map((label, i) => ({
              id: String(i),
              label,
              state: i < 2 ? "done" : "running",
            }))}
          />

          <Approval
            title={copy.title}
            description={copy.description}
            decision={decision}
            onDecide={setDecision}
          >
            <Tool name="bash" state="pending" input={{ command: "rm -rf Shots/", cwd: "~/Projects/chat" }} />
          </Approval>
        </div>
      </LabelsProvider>

      {decision && (
        <Button size="s" variant="ghost" onClick={() => setDecision(null)} style={{ alignSelf: "flex-start" }}>
          {lang === "sr" ? "Pitaj ponovo" : "Ask again"}
        </Button>
      )}
    </div>
  );
}
