"use client";

import { TaskList } from "inline-chat-kit";

/** No title: no row above the list, and nothing for it to fold into. */
export default function TaskListBare() {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <TaskList
        tasks={[
          { id: "branch", label: "Create a branch for the fix", state: "done" },
          { id: "test", label: "Write a failing test for the empty cart", state: "done" },
          { id: "fix", label: "Guard the total against an empty list", state: "running" },
          { id: "pr", label: "Open a pull request" },
        ]}
      />
    </div>
  );
}
