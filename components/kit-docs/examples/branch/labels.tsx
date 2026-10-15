"use client";

import { useState } from "react";
import { Branch } from "inline-chat-kit";

/**
 * The words are for screen readers: the group is named "Draft 2 of 4", the
 * arrows "Earlier draft" and "Later draft". What is drawn stays 2/4.
 */
export default function BranchLabels() {
  const [index, setIndex] = useState(1);
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 520 }}>
      <Branch
        total={4}
        index={index}
        onSelect={setIndex}
        labels={{ previous: "Earlier draft", next: "Later draft", position: "Draft {index} of {total}" }}
      />
    </div>
  );
}
