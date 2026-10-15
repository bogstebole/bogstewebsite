"use client";

import { ArtifactCard } from "inline-chat-kit";

const PLAN = `Week 1: base
Mon  rest
Tue  4 km easy, conversational
Wed  cross-train, 30 min
Thu  5 × 400 m at 5k effort, 90 s jog between
Fri  rest`;

const PACE = `def pace(distance_km: float, target: str) -> float:
    minutes, seconds = (int(part) for part in target.split(":"))
    return (minutes * 60 + seconds) / distance_km`;

export default function ArtifactCardStates() {
  // Wire this to `useArtifacts().toggle` to open a pane.
  const openIt = () => {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 520 }}>
      {/* No content yet: the title shimmers while it is written. */}
      <ArtifactCard id="draft" title="Race-week checklist" state="writing" kind="text" />

      <ArtifactCard id="plan" title="5k training plan" meta="8 weeks" kind="text" content={PLAN} lines={4} onOpen={openIt} />

      <ArtifactCard id="pace" title="pace.py" meta="Python" kind="code" lang="python" content={PACE} onOpen={openIt} />

      {/* No onOpen: a record of what was made, not a control. */}
      <ArtifactCard id="old" title="Last month’s plan" meta="Replaced" kind="text" content={PLAN} lines={2} />
    </div>
  );
}
