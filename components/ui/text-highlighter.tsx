import React, { useState, useRef, useEffect } from "react";

const SKEW_ANGLE = -20;
const TAN_ANGLE = Math.tan((SKEW_ANGLE * Math.PI) / 180);
const MARKER_COLOR = "rgba(250, 192, 246, 1)"; // Pink marker color

const markerSvg = `<svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.383 7.767L25.309 1.111C27.347 0.259 29.69 1.22 30.542 3.259L32.085 6.949C32.937 8.987 31.975 11.33 29.937 12.182L14.011 18.839L5.353 17.813L3.251 18.692L1.228 15.821L4.03 14.65L9.383 7.767Z" fill="#FFFFFF" /><path d="M4.03 14.65L9.383 7.767L25.309 1.111C27.347 0.259 29.69 1.22 30.542 3.259L32.085 6.949C32.937 8.987 31.975 11.33 29.937 12.182L14.011 18.839L5.353 17.813M9.383 7.767L14.011 18.839M4.03 14.65L1.228 15.821L3.251 18.692L5.353 17.813M4.03 14.65L5.353 17.813" stroke="#111111" stroke-width="1.6" /></svg>`;
const cursorUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(markerSvg)}') 2 15, auto`;

interface PathData {
  id: string;
  points: { x: number; y: number }[];
  highlightedIndices: Set<number>;
}

interface TextHighlighterProps {
  text: string;
  onHighlightComplete?: (highlightedText: string) => void;
}

export function TextHighlighter({ text, onHighlightComplete }: TextHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);

  // Split text by words and keep spaces separate so we can render them properly
  const tokens = text.split(/(\s+)/);

  const makePathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    const start = points[0];
    let d = `M ${start.x} ${start.y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const checkHighlight = (clientX: number, clientY: number, indices: Set<number>) => {
    const el = document.elementFromPoint(clientX, clientY);
    if (el && el.hasAttribute("data-index")) {
      const idx = parseInt(el.getAttribute("data-index")!, 10);
      indices.add(idx);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click / main touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);

    const rect = target.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const correctedX = mouseX - mouseY * TAN_ANGLE;
    const newPath: PathData = {
      id: Date.now().toString(),
      points: [{ x: correctedX, y: mouseY }],
      highlightedIndices: new Set<number>(),
    };
    setCurrentPath(newPath);
    checkHighlight(e.clientX, e.clientY, newPath.highlightedIndices);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!currentPath) return;

    const rect = containerRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const correctedX = mouseX - mouseY * TAN_ANGLE;

    setCurrentPath((prev) => {
      if (!prev) return prev;
      const newIndices = new Set(prev.highlightedIndices);
      checkHighlight(e.clientX, e.clientY, newIndices);
      return {
        ...prev,
        points: [...prev.points, { x: correctedX, y: mouseY }],
        highlightedIndices: newIndices,
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!currentPath) return;
    const target = e.currentTarget as HTMLDivElement;
    target.releasePointerCapture(e.pointerId);

    setPaths((prev) => [...prev, currentPath]);
    
    if (onHighlightComplete && currentPath.highlightedIndices.size > 0) {
      // Reconstruct highlighted text
      const sortedIndices = Array.from(currentPath.highlightedIndices).sort((a, b) => a - b);
      let highlightedText = "";
      for (const idx of sortedIndices) {
        highlightedText += tokens[idx];
      }
      onHighlightComplete(highlightedText.trim());
    }
    
    setCurrentPath(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        cursor: cursorUrl,
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none", // Prevent scrolling while highlighting on touch devices
        display: "block", // to wrap the text tightly
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Underlying text */}
      <span style={{ position: "relative", zIndex: 1 }}>
        {tokens.map((token, i) => (
          <span key={i} data-index={i}>
            {token}
          </span>
        ))}
      </span>

      {/* SVG Canvas overlay */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          mixBlendMode: "multiply",
          zIndex: 2,
          overflow: "visible", // allows stroke to go slightly outside bounds
        }}
      >
        <g transform={`skewX(${SKEW_ANGLE})`}>
          {paths.map((path) => (
            <path
              key={path.id}
              d={makePathString(path.points)}
              fill="none"
              stroke={MARKER_COLOR}
              strokeWidth="20px"
              strokeLinejoin="round"
              strokeLinecap="butt"
            />
          ))}
          {currentPath && (
            <path
              d={makePathString(currentPath.points)}
              fill="none"
              stroke={MARKER_COLOR}
              strokeWidth="20px"
              strokeLinejoin="round"
              strokeLinecap="butt"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
