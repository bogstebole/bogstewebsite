"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { PixelCharacter } from "./PixelCharacter";
import { GroundLine } from "./GroundLine";
import { Clouds } from "./clouds";
import { PixelPortal } from "./pixel-portal";
import { ProjectCluster } from "@/components/elements/project-cluster";
import { WorkCluster } from "@/components/elements/work-cluster";
import { INTERACTION_ZONES, CANVAS, FIGMA_POSITIONS } from "@/lib/constants";
import { figmaX, figmaY } from "@/lib/figma-scale";
import {
  createInitialState,
  updateCharacter,
  jump,
  checkInteractionZone,
  type CharacterState,
} from "@/lib/game-engine";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const cursorXRef = useRef(0);
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nearZone, setNearZone] = useState<string | null>(null);

  // Initialize character state once we know canvas size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setCharacter(createInitialState(container.clientWidth));
  }, []);

  // Game loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !character) return;

    let animState = character;

    function loop() {
      const width = container!.clientWidth;
      animState = updateCharacter(animState, cursorXRef.current, width);
      const zone = checkInteractionZone(animState.x, width, INTERACTION_ZONES);
      setCharacter({ ...animState });
      setNearZone(zone);
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [character !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: space to jump
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setCharacter((prev) => (prev ? jump(prev) : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorXRef.current = e.clientX - rect.left;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (nearZone) {
      setActiveSection(nearZone);
    }

    // Click also triggers jump (like prototype)
    setCharacter((prev) => (prev ? jump(prev) : prev));
  }, [nearZone]);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  // ESC key to close sections
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Escape") {
        setActiveSection(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-default"
      style={{ background: "#DAD9D2" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {character && (
        <>
          {/* Layer 1: Decorative clouds */}
          <Clouds />

          {/* Layer 2: Project cluster */}
          <ProjectCluster />

          {/* Layer 4: Work cluster */}
          <WorkCluster />

          {/* Layer 5: Pixel portal */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${figmaX(FIGMA_POSITIONS.portal.x)}%`,
              top: `${figmaY(FIGMA_POSITIONS.portal.y)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <PixelPortal scale={3} />
          </div>

          {/* Layer 6: Invisible ground line */}
          <GroundLine y={CANVAS.GROUND_Y} />

          {/* Layer 7: The pixel character */}
          <PixelCharacter state={character} groundY={CANVAS.GROUND_Y} />

          {/* Active section overlay */}
          {activeSection && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseSection();
                }}
                className="absolute top-8 right-8 text-white text-2xl z-50 hover:opacity-70 transition-opacity"
              >
                [ESC]
              </button>
              <div className="text-white text-center">
                <p className="text-xl opacity-60">
                  Section: {INTERACTION_ZONES.find((z) => z.id === activeSection)?.label}
                </p>
                <p className="text-sm opacity-40 mt-2">Content coming soon</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
