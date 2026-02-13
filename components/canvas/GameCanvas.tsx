"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { PixelCharacter, DISPLAY_H } from "./PixelCharacter";
import { GroundLine } from "./GroundLine";
import { Clouds } from "./clouds";
import { PixelPortal } from "./pixel-portal";
import { WarpParticles } from "./WarpParticles";
import { ProjectCluster } from "@/components/elements/project-cluster";
import { WorkCluster } from "@/components/elements/work-cluster";
import { RetroWindow } from "@/components/ui/retro-window";
import { AboutTimeline } from "@/components/sections/about-timeline";
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
  const warpTriggerRef = useRef<"shivering" | "warping_in" | "warping_out" | "warped" | null>(null);
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nearZone, setNearZone] = useState<string | null>(null);
  const [shedSet, setShedSet] = useState<Set<string>>(new Set());

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

      // Check for warp trigger from click handlers or particle system
      const trigger = warpTriggerRef.current;
      if (trigger) {
        warpTriggerRef.current = null;
        animState = { ...animState, warpState: trigger, warpTimer: 0 };
        // When transitioning to warped, open the about section
        if (trigger === "warped") {
          setActiveSection("about");
        }
      }

      // Update character logic
      const prevWarpState = animState.warpState;
      const nextState = updateCharacter(animState, cursorXRef.current, width);

      // If engine safety cap forced warped state, open the section too
      if (prevWarpState === "warping_in" && nextState.warpState === "warped") {
        setActiveSection("about");
      }

      animState = nextState;
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

  const handlePortalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    warpTriggerRef.current = "shivering";
  }, []);

  const handleClick = useCallback(() => {
    if (nearZone === "portal") {
      warpTriggerRef.current = "shivering";
      return;
    }

    if (nearZone) {
      setActiveSection(nearZone);
    }

    // Click also triggers jump — only if not warping
    setCharacter((prev) => (prev && prev.warpState === "idle" ? jump(prev) : prev));
  }, [nearZone]);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
    warpTriggerRef.current = "warping_out";
    setShedSet(new Set()); // reset shed pixels
  }, []);

  // Called by WarpParticles when all particles have been consumed
  const handleAllConsumed = useCallback(() => {
    warpTriggerRef.current = "warped";
  }, []);

  // Called by WarpParticles each frame with the set of shed pixel keys
  const handleShedUpdate = useCallback((shed: Set<string>) => {
    setShedSet(shed);
  }, []);

  // ESC key to close sections
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Escape") {
        handleCloseSection();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseSection]);

  // Portal center as viewport percentages
  const portalXPercent = figmaX(FIGMA_POSITIONS.portal.x);
  const portalYPercent = figmaY(FIGMA_POSITIONS.portal.y);

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

          {/* Layer 5: Pixel portal — clickable to trigger warp */}
          <div
            className="absolute cursor-pointer z-10"
            style={{
              left: `${portalXPercent}%`,
              top: `${portalYPercent}%`,
              transform: "translate(-50%, -50%)",
              padding: "16px",
            }}
            onClick={handlePortalClick}
          >
            <PixelPortal scale={3} />
          </div>

          {/* Layer 6: Invisible ground line */}
          <GroundLine y={CANVAS.GROUND_Y} />

          {/* Layer 7: The pixel character */}
          <PixelCharacter
            state={character}
            groundY={CANVAS.GROUND_Y}
            shedSet={shedSet}
          />

          {/* Layer 8: Warp particle system overlay */}
          <WarpParticles
            active={character.warpState === "warping_in"}
            characterX={character.x}
            groundYPercent={CANVAS.GROUND_Y}
            portalXPercent={portalXPercent}
            portalYPercent={portalYPercent}
            onAllConsumed={handleAllConsumed}
            onShedUpdate={handleShedUpdate}
          />

          {/* Active section overlay */}
          <RetroWindow
            isOpen={activeSection === "about"}
            onClose={handleCloseSection}
            title="TIMELINE"
          >
            <AboutTimeline />
          </RetroWindow>

          {activeSection && activeSection !== "about" && (
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
