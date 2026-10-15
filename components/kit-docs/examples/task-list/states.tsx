"use client";

import { TaskList } from "inline-chat-kit";

/** Done, failed, running, queued: one list, in the order it was planned. */
export default function TaskListStates() {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <TaskList
        title="Plan"
        tasks={[
          { id: "read", label: "Read the care plan", state: "done", detail: "42 lines" },
          {
            id: "history",
            label: "Look up the prescription history",
            state: "error",
            detail: "No record for this resident before March",
          },
          { id: "gaps", label: "Find the gaps in the weekly cover", state: "running" },
          { id: "draft", label: "Draft the questions for the family" },
        ]}
      />
    </div>
  );
}
