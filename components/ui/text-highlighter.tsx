import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button/Button";
import { MessageCircle, Trash2 } from "lucide-react";

const SKEW_ANGLE = -20;
const TAN_ANGLE = Math.tan((SKEW_ANGLE * Math.PI) / 180);
const MARKER_COLOR = "rgba(204, 255, 0, 0.7)"; // #CCFF00 at 70% opacity

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number | string, y: number, pathId: string } | null>(null);
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalPointerDown = (e: PointerEvent) => {
      if (menuAnchor && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuAnchor(null);
      }
    };
    window.addEventListener("pointerdown", handleGlobalPointerDown);
    return () => window.removeEventListener("pointerdown", handleGlobalPointerDown);
  }, [menuAnchor]);

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
    
    setIsDrawing(true);
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
    setMenuAnchor(null); // Hide menu when starting a new highlight
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
    setIsDrawing(false);
    if (!currentPath) return;
    const target = e.currentTarget as HTMLDivElement;
    target.releasePointerCapture(e.pointerId);

    setPaths((prev) => [...prev, currentPath]);
    
    if (currentPath.highlightedIndices.size > 0) {
      // Find the maxY to position the menu inline with the lower edge
      let maxY = -Infinity;
      currentPath.points.forEach(p => {
        if (p.y > maxY) maxY = p.y;
      });
      setMenuAnchor({ x: "calc(100% + 16px)", y: maxY, pathId: currentPath.id });
    }

    if (onHighlightComplete && currentPath.highlightedIndices.size > 0) {
      // Reconstruct highlighted text by filling in any gaps (e.g., spaces missed by fast mouse movement)
      const sortedIndices = Array.from(currentPath.highlightedIndices).sort((a, b) => a - b);
      const minIdx = sortedIndices[0];
      const maxIdx = sortedIndices[sortedIndices.length - 1];
      
      let highlightedText = "";
      for (let i = minIdx; i <= maxIdx; i++) {
        highlightedText += tokens[i];
      }
      onHighlightComplete(highlightedText.trim());
    }
    
    setCurrentPath(null);
  };

  const removeHighlight = (id: string) => {
    setPaths(prev => prev.filter(p => p.id !== id));
    setMenuAnchor(null);
  };

  const replyInThread = () => {
    console.log("Reply in thread clicked for path", menuAnchor?.pathId);
    setMenuAnchor(null);
  };

  return (
    <div
      ref={containerRef}
      data-cursor="marker"
      data-cursor-active={isDrawing ? "true" : "false"}
      style={{
        position: "relative",
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

      {/* Proximity Hitbox: proširuje zonu "hvatanja" miša za 20px bez pomeranja layouta */}
      <div 
        style={{
          position: "absolute",
          top: -20,
          left: -20,
          right: -20,
          bottom: -20,
          zIndex: 0,
        }}
      />

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
            <React.Fragment key={path.id}>
              <motion.path
                d={makePathString(path.points)}
                fill="none"
                stroke={MARKER_COLOR}
                strokeLinejoin="round"
                strokeLinecap="butt"
                animate={{ 
                  strokeWidth: hoveredPathId === path.id ? "24px" : "20px",
                  opacity: hoveredPathId === path.id ? 0.9 : 1 
                }}
                transition={{ duration: 0.15 }}
                data-cursor="pointer"
                style={{
                  pointerEvents: isDrawing ? "none" : "stroke",
                }}
                onPointerEnter={() => !isDrawing && setHoveredPathId(path.id)}
                onPointerLeave={() => setHoveredPathId(null)}
                onPointerDown={(e) => {
                  if (isDrawing) return;
                  e.stopPropagation();
                  let maxY = -Infinity;
                  path.points.forEach(p => { if (p.y > maxY) maxY = p.y; });
                  setMenuAnchor({ x: "calc(100% + 16px)", y: maxY, pathId: path.id });
                }}
              />
              {/* Animated drawing shimmer over the path */}
              <AnimatePresence>
                {hoveredPathId === path.id && (
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0.8 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.7, ease: "easeOut", repeat: Infinity, repeatDelay: 0.15 }}
                    d={makePathString(path.points)}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="24px"
                    strokeLinejoin="round"
                    strokeLinecap="butt"
                    style={{ pointerEvents: "none", mixBlendMode: "overlay" }}
                  />
                )}
              </AnimatePresence>
            </React.Fragment>
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

      {/* Floating Action Menu */}
      <AnimatePresence>
        {menuAnchor && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              position: "absolute",
              left: menuAnchor.x,
              top: menuAnchor.y,
              transform: "translateY(-50%)",
              zIndex: 10000,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              pointerEvents: "auto",
            }}
          >
            <Button
              variant="primary"
              icon={<MessageCircle size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                replyInThread();
              }}
              title="Reply in thread"
            >
              Reply in thread
            </Button>
            <Button
              variant="primary"
              icon={<Trash2 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                removeHighlight(menuAnchor.pathId);
              }}
              title="Remove highlight"
              aria-label="Remove highlight"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
