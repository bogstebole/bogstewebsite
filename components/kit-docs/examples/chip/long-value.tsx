"use client";

import { Chip } from "inline-chat-kit";

/** A chip never wraps, and stops growing at --ick-chip-max (180px by default). */
export default function ChipLongValue() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, width: "100%", maxWidth: 420 }}>
      <Chip>Alfama</Chip>
      <Chip>Rua de São Tomé, near the Miradouro de Santa Luzia</Chip>
    </div>
  );
}
