"use client";

interface GroundLineProps {
  y: number;
}

/** Invisible ground line — the character walks along this Y coordinate */
export function GroundLine({ y }: GroundLineProps) {
  return (
    <div
      className="absolute left-0 right-0 h-px opacity-0"
      style={{ top: `${y}%` }}
    />
  );
}
