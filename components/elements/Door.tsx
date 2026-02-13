"use client";

import type { InteractionZone } from "@/lib/constants";

interface DoorProps {
  zone: InteractionZone;
  isNear: boolean;
  isActive: boolean;
  style: React.CSSProperties;
}

/** Door element — character walks to it, user clicks to enter a section */
export function Door({ zone, isNear, style }: DoorProps) {
  return (
    <div style={style} className="pointer-events-none select-none">
      {/* Door frame */}
      <div
        className={`
          w-16 h-24 border-4 rounded-t-lg transition-all duration-200
          ${isNear ? "border-amber-400 bg-amber-900/60 shadow-lg shadow-amber-400/30" : "border-gray-600 bg-gray-800/60"}
        `}
      >
        {/* Door knob */}
        <div
          className={`
            absolute right-2 top-1/2 w-2 h-2 rounded-full
            ${isNear ? "bg-amber-300" : "bg-gray-500"}
          `}
        />
      </div>
      {/* Label */}
      <p
        className={`
          text-center text-xs mt-2 whitespace-nowrap transition-opacity duration-200
          ${isNear ? "text-amber-400 opacity-100" : "text-gray-500 opacity-60"}
        `}
      >
        {zone.label}
      </p>
    </div>
  );
}
