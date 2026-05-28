"use client";

import { createContext, useContext, useState } from "react";

interface HoverContextType {
  hoveredKey: string | null;
  setHoveredKey: (key: string | null) => void;
}

const HoverContext = createContext<HoverContextType>({
  hoveredKey: null,
  setHoveredKey: () => {},
});

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  return (
    <HoverContext.Provider value={{ hoveredKey, setHoveredKey }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  return useContext(HoverContext);
}
