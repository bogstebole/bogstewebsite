"use client";

import { useEffect, useState } from "react";
import { TaskList, type Task } from "inline-chat-kit";

const PLAN = [
  { id: "read", label: "Read the care plan", found: "42 lines, last updated in March" },
  { id: "meds", label: "Check the medication list against the prescription", found: "All six match" },
  { id: "gaps", label: "Find the gaps in the weekly cover", found: "Tuesday and Thursday evenings" },
  { id: "draft", label: "Draft the questions for the family", found: "4 questions" },
];

const STEP_MS = 1400;

/**
 * A plan, worked through. The order never changes (only the glyphs do)
 * and once every task is done the list folds to its row.
 */
export default function TaskListLive() {
  // How many tasks are finished. The next one is running.
  const [finished, setFinished] = useState(0);

  useEffect(() => {
    const timers = PLAN.map((_, i) => window.setTimeout(() => setFinished(i + 1), STEP_MS * (i + 1)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const tasks: Task[] = PLAN.map((task, i) => ({
    id: task.id,
    label: task.label,
    state: i < finished ? "done" : i === finished ? "running" : "pending",
    detail: i < finished ? task.found : undefined,
  }));

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <TaskList title="Plan" tasks={tasks} collapsible />
    </div>
  );
}
