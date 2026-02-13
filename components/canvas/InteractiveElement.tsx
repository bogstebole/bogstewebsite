"use client";

import type { InteractionZone } from "@/lib/constants";
import { Door } from "@/components/elements/Door";
import { Block } from "@/components/elements/Block";

interface InteractiveElementProps {
  zone: InteractionZone;
  isNear: boolean;
  isActive: boolean;
  groundY: number;
}

/** Routes to the correct element component based on zone type */
export function InteractiveElement({
  zone,
  isNear,
  isActive,
  groundY,
}: InteractiveElementProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${zone.x}%`,
    top: `${groundY}%`,
    transform: "translate(-50%, -100%)",
  };

  switch (zone.type) {
    case "door":
      return <Door zone={zone} isNear={isNear} isActive={isActive} style={style} />;
    case "block":
      return <Block zone={zone} isNear={isNear} isActive={isActive} style={style} />;
    default:
      return null;
  }
}
