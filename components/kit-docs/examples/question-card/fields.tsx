"use client";

import { useState, type CSSProperties } from "react";
import { QuestionCard, type Answer, type Question, type QuestionState } from "inline-chat-kit";

const TOPIC: Question = {
  id: "topic",
  type: "single",
  title: "What are we sorting out?",
  shortTitle: "Topic",
  options: [
    { id: "home", title: "Care at home" },
    { id: "move", title: "A place to move to" },
    { id: "unsure", title: "Not sure yet" },
  ],
};

const ABOUT: Question = {
  id: "about",
  type: "inputs",
  title: "Who are we caring for?",
  subtitle: "Just the basics for now. We’ll go into detail together",
  shortTitle: "About them",
  fields: [
    { id: "name", label: "Their name", placeholder: "Milica Stevanović" },
    { id: "age", label: "Age", placeholder: "84" },
    { id: "where", label: "Where they live", placeholder: "Vračar, Beograd", optional: true },
  ],
};

const QUESTIONS = [TOPIC, ABOUT];

const ground: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--ick-space-5)",
  padding: "var(--ick-space-6)",
  borderRadius: "var(--ick-question-radius-group)",
  background: "var(--ick-question-surface)",
};

/**
 * Two cards, driven by the host: the free-text one opens once the first is
 * answered, and puts the cursor in its first field when it has finished growing.
 */
export default function QuestionCardFields() {
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const open = editing ?? QUESTIONS.find((q) => !answers[q.id])?.id ?? null;
  const stateOf = (question: Question): QuestionState =>
    question.id === open ? "active" : answers[question.id] ? "collapsed" : "upcoming";

  return (
    <div style={{ ...ground, width: "100%", maxWidth: 520, margin: "0 auto" }}>
      {QUESTIONS.map((question, i) => (
        <QuestionCard
          key={question.id}
          question={question}
          number={i + 1}
          state={stateOf(question)}
          answer={answers[question.id]}
          onCommit={(answer) => {
            setAnswers((all) => ({ ...all, [question.id]: answer }));
            setEditing(null);
          }}
          onEdit={() => setEditing(question.id)}
        />
      ))}
    </div>
  );
}
