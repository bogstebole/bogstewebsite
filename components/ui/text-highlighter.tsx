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
  onReplyInThread?: (text: string, rect: DOMRect) => void;
}

export function TextHighlighter({ text, onHighlightComplete, onReplyInThread }: TextHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<PathData | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number | string, y: number, pathId: string } | null>(null);
  const [hoveredPathId, setHoveredPathId] = useState<string | null>(null);
  const [pressedPathId, setPressedPathId] = useState<string | null>(null);

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

  // Menu position: horizontal center + top edge of the highlight (in container coords).
  // Points store skew-corrected x, so reapply the skew (visualX = x + TAN_ANGLE * y) to get the rendered x.
  const getMenuPosition = (points: { x: number; y: number }[]) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity;
    points.forEach((p) => {
      const visualX = p.x + TAN_ANGLE * p.y;
      if (visualX < minX) minX = visualX;
      if (visualX > maxX) maxX = visualX;
      if (p.y < minY) minY = p.y;
    });
    return { x: (minX + maxX) / 2, y: minY };
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
      const pos = getMenuPosition(currentPath.points);
      setMenuAnchor({ x: pos.x, y: pos.y, pathId: currentPath.id });
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

  const getHighlightedText = (pathId: string) => {
    const pathData = paths.find(p => p.id === pathId);
    if (!pathData || pathData.highlightedIndices.size === 0) return "";
    const sortedIndices = Array.from(pathData.highlightedIndices).sort((a, b) => a - b);
    const minIdx = sortedIndices[0];
    const maxIdx = sortedIndices[sortedIndices.length - 1];
    
    let highlightedText = "";
    for (let i = minIdx; i <= maxIdx; i++) {
      highlightedText += tokens[i];
    }
    return highlightedText.trim();
  };

  const removeHighlight = (id: string) => {
    setPaths(prev => prev.filter(p => p.id !== id));
    setMenuAnchor(null);
  };

  const replyInThread = () => {
    if (menuAnchor && onReplyInThread) {
      const text = getHighlightedText(menuAnchor.pathId);
      const el = document.getElementById(`highlight-path-${menuAnchor.pathId}`);
      if (el) {
        onReplyInThread(text, el.getBoundingClientRect());
      }
    }
    setMenuAnchor(null);
  };

  return (
    <motion.div
      ref={containerRef}
      data-cursor="marker"
      data-cursor-active={isDrawing ? "true" : "false"}
      animate={{
        scale: 1,
        y: 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none", // Prevent scrolling while highlighting on touch devices
        display: "block", // to wrap the text tightly
        zIndex: !!menuAnchor ? 10 : 1, // elevate above other paragraphs
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
        {tokens.map((token, i) => {
          const isHighlightActive = !!menuAnchor;
          const activePath = isHighlightActive ? paths.find(p => p.id === menuAnchor.pathId) : null;
          const isPartOfActiveHighlight = activePath?.highlightedIndices.has(i);
          const isBlurred = isHighlightActive && !isPartOfActiveHighlight;
          
          const pressedPath = pressedPathId ? paths.find(p => p.id === pressedPathId) : null;
          const isPartOfPressed = pressedPath?.highlightedIndices.has(i);

          return (
            <motion.span 
              key={i} 
              data-index={i}
              animate={{
                filter: isBlurred ? "blur(3px)" : "blur(0px)",
                opacity: isBlurred ? 0.15 : 1,
                color: isPartOfActiveHighlight ? "#000000" : "inherit",
                textShadow: isPartOfActiveHighlight ? "0px 1px 2px rgba(255, 255, 255, 0.4)" : "none",
                scale: isPartOfPressed ? 0.96 : 1,
              }}
              style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              {token}
            </motion.span>
          );
        })}
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
                id={`highlight-path-${path.id}`}
                d={makePathString(path.points)}
                fill="none"
                stroke={MARKER_COLOR}
                strokeLinejoin="round"
                strokeLinecap="butt"
                animate={{ 
                  strokeWidth: pressedPathId === path.id 
                    ? "16px" 
                    : menuAnchor?.pathId === path.id 
                    ? "28px" 
                    : hoveredPathId === path.id ? "24px" : "20px",
                  opacity: menuAnchor?.pathId === path.id ? 1 : hoveredPathId === path.id ? 0.9 : 1,
                  filter: menuAnchor?.pathId === path.id 
                    ? "drop-shadow(0px 6px 16px rgba(204, 255, 0, 0.6))" 
                    : "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                data-cursor="pointer"
                style={{
                  pointerEvents: isDrawing ? "none" : "stroke",
                }}
                onPointerEnter={() => !isDrawing && setHoveredPathId(path.id)}
                onPointerLeave={() => {
                  setHoveredPathId(null);
                  setPressedPathId(null);
                }}
                onPointerDown={(e) => {
                  if (isDrawing) return;
                  e.stopPropagation();
                  setPressedPathId(path.id);
                }}
                onPointerUp={(e) => {
                  if (pressedPathId === path.id) {
                    e.stopPropagation();
                    const pos = getMenuPosition(path.points);
                    setMenuAnchor({ x: pos.x, y: pos.y, pathId: path.id });
                    setPressedPathId(null);
                  }
                }}
                onPointerCancel={() => setPressedPathId(null)}
              />
              {/* Animated drawing shimmer over the path */}
              <AnimatePresence>
                {(hoveredPathId === path.id || menuAnchor?.pathId === path.id) && (
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0.8 }}
                    animate={{ pathLength: 1, opacity: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
                    d={makePathString(path.points)}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={menuAnchor?.pathId === path.id ? "28px" : "24px"}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.05 } }}
            exit={{ opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }}
            style={{
              position: "absolute",
              left: menuAnchor.x,
              top: menuAnchor.y,
              transform: "translate(-50%, calc(-100% - 16px))",
              zIndex: 10000,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              pointerEvents: "auto",
            }}
            onPointerDown={(e) => e.stopPropagation()} // Sprečava da klik na dugme započne novo crtananje
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
            >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
