"use client";

import type { InteractionZone } from "@/lib/constants";

interface BlockProps {
  zone: InteractionZone;
  isNear: boolean;
  isActive: boolean;
  style: React.CSSProperties;
}

/** Block element — character jumps and hits it to pop out content */
export function Block({ zone, isNear, style }: BlockProps) {
  return (
    <div style={{ ...style, transform: "translate(-50%, -180%)" }} className="pointer-events-none select-none">
      {/* Floating block (positioned above ground so character jumps into it) */}
      <div
        className={`
          w-14 h-14 border-4 rounded transition-all duration-200
          ${isNear ? "border-yellow-400 bg-yellow-700/80 shadow-lg shadow-yellow-400/30" : "border-gray-600 bg-gray-700/80"}
        `}
      >
        <span className="flex items-center justify-center h-full text-xl font-bold text-white/80">
          ?
        </span>
      </div>
      {/* Label */}
      <p
        className={`
          text-center text-xs mt-2 whitespace-nowrap transition-opacity duration-200
          ${isNear ? "text-yellow-400 opacity-100" : "text-gray-500 opacity-60"}
        `}
      >
        {zone.label}
      </p>
    </div>
  );
}
