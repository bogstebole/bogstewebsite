"use client";

import { useState } from "react";
import { Button, TaskList, type Task } from "inline-chat-kit";

const PLAN: Task[] = [
  { id: "flights", label: "Compare flights to Lisbon", state: "done", detail: "TAP, Saturday 9:40" },
  { id: "hotel", label: "Shortlist hotels near Alfama", state: "done", detail: "3 under €140" },
  { id: "museums", label: "Check which museums close on Monday", state: "running" },
  { id: "itinerary", label: "Draft a three-day itinerary" },
];

/**
 * `collapsible` folds the list once every task is done. Open or shut it
 * yourself and that choice outlives every change after it.
 */
export default function TaskListFolds() {
  const [tasks, setTasks] = useState(PLAN);
  const allDone = tasks.every((t) => t.state === "done");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, width: "100%", maxWidth: 480 }}>
      <TaskList title="Trip plan" tasks={tasks} collapsible style={{ width: "100%" }} />
      <Button
        variant="outline"
        size="s"
        onClick={() => setTasks(allDone ? PLAN : tasks.map((t): Task => ({ ...t, state: "done" })))}
      >
        {allDone ? "Start over" : "Finish everything"}
      </Button>
    </div>
  );
}
