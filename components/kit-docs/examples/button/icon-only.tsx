"use client";

import { Copy, Paperclip, Plus, Share2, Trash2 } from "lucide-react";
import { Button, type ButtonSize } from "inline-chat-kit";

// The icon keeps the size you give it, so it grows with the button by hand.
const SIZES: { size: ButtonSize; icon: number }[] = [
  { size: "xs", icon: 12 },
  { size: "s", icon: 14 },
  { size: "m", icon: 14 },
  { size: "l", icon: 16 },
  { size: "xl", icon: 18 },
];

/**
 * An icon on its own makes a square button. It has no words to be named by,
 * so it needs an aria-label, and the icon itself is aria-hidden.
 */
export default function ButtonIconOnly() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {SIZES.map(({ size, icon }) => (
          <Button key={size} size={size} icon={<Plus size={icon} aria-hidden />} aria-label="New conversation" />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button variant="secondary" icon={<Copy size={14} aria-hidden />} aria-label="Copy answer" />
        <Button variant="outline" icon={<Share2 size={14} aria-hidden />} aria-label="Share conversation" />
        <Button variant="ghost" icon={<Trash2 size={14} aria-hidden />} aria-label="Remove highlight" />
        <Button variant="glass" size="l" icon={<Paperclip size={16} aria-hidden />} aria-label="Attach a file" />
      </div>
    </div>
  );
}
