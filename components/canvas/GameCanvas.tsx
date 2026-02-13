"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { PixelCharacter, DISPLAY_H } from "./PixelCharacter";
import { GroundLine } from "./GroundLine";
import { Clouds } from "./clouds";
import { PixelPortal } from "./pixel-portal";
import { WarpParticles } from "./WarpParticles";
import { PixelDust } from "./pixel-dust";
import { ProjectCluster, PROJECTS } from "@/components/elements/project-cluster";
import { WorkCluster } from "@/components/elements/work-cluster";
import { Stars } from "./stars";
import { RetroWindow } from "@/components/ui/retro-window";
import { ProjectDetailWindow } from "@/components/ui/project-detail-window";
import type { ProjectData } from "@/components/ui/project-detail-window";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { INTERACTION_ZONES, CANVAS, FIGMA_POSITIONS, CHARACTER } from "@/lib/constants";
import { figmaX, figmaY } from "@/lib/figma-scale";
import {
  createInitialState,
  updateCharacter,
  jump,
  checkInteractionZone,
  type CharacterState,
} from "@/lib/game-engine";

import { useTheme } from "@/components/providers/theme-provider";

/* ---------- Launched icon physics state ---------- */
interface LaunchedIcon {
  project: ProjectData;
  x: number; // viewport px
  y: number; // viewport px
  vy: number; // velocity Y
  phase: "flying" | "expanding";
  iconRect: DOMRect; // original rect for origin animation
}

export function GameCanvas() {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const cursorXRef = useRef(0);
  const warpTriggerRef = useRef<"shivering" | "warping_in" | "warping_out" | "warped" | "idle" | "headbutt" | null>(null);
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nearZone, setNearZone] = useState<string | null>(null);
  const [shedSet, setShedSet] = useState<Set<string>>(new Set());

  /* ---- Headbutt state ---- */
  const [headbuttTarget, setHeadbuttTarget] = useState<{ project: ProjectData; iconRect: DOMRect } | null>(null);
  const [impactIconKey, setImpactIconKey] = useState<string | null>(null);
  const [launchedIcon, setLaunchedIcon] = useState<LaunchedIcon | null>(null);
  const [dustBurst, setDustBurst] = useState<{ x: number; y: number; color: string } | null>(null);
  const [projectWindow, setProjectWindow] = useState<{ project: ProjectData; originRect: { x: number; y: number } } | null>(null);
  const launchedIconRef = useRef<LaunchedIcon | null>(null);
  const headbuttTargetYRef = useRef<number | null>(null);

  // Initialize character state once we know canvas size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setCharacter(createInitialState(container.clientWidth));
  }, []);

  // Sound design
  useEffect(() => {
    const warpState = character?.warpState;
    if (warpState === "shivering") {
      const audio = new Audio("/sounds/glitch.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => { }); // Ignore autoplay errors
    } else if (warpState === "warping_in") {
      const audio = new Audio("/sounds/woosh.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => { });
    }
  }, [character?.warpState]);

  // Game loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !character) return;

    let animState = character;

    function loop() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;

      // Check for warp trigger from click handlers or particle system
      const trigger = warpTriggerRef.current;
      if (trigger) {
        warpTriggerRef.current = null;
        if (trigger === "headbutt") {
          const targetY = headbuttTargetYRef.current;
          // Slide character X toward the icon's X position
          const iconX = launchedIconRef.current?.iconRect
            ? launchedIconRef.current.iconRect.left + launchedIconRef.current.iconRect.width / 2
            : animState.x;
          animState = {
            ...animState,
            warpState: "headbutt",
            warpTimer: 0,
            velocityY: CHARACTER.HEADBUTT_VELOCITY,
            headbuttTargetY: targetY ?? undefined,
            x: iconX, // teleport to below the icon
          };
        } else {
          animState = { ...animState, warpState: trigger, warpTimer: 0 };
        }
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

      // --- Headbutt collision detection ---
      // Trigger impact at peak height (velocity crosses from negative to positive)
      if (nextState.warpState === "headbutt" && nextState.headbuttTargetY !== undefined) {
        const wasGoingUp = animState.velocityY < 0;
        const nowComingDown = nextState.velocityY >= 0;

        if (wasGoingUp && nowComingDown) {
          // PEAK HEIGHT — trigger impact!
          const target = launchedIconRef.current;
          if (target && target.phase !== "flying") {
            setImpactIconKey(target.project.key);

            setDustBurst({
              x: target.iconRect.left + target.iconRect.width / 2,
              y: target.iconRect.top + target.iconRect.height / 2,
              color: target.project.color,
            });

            setLaunchedIcon({
              ...target,
              x: target.iconRect.left + target.iconRect.width / 2,
              y: target.iconRect.top,
              vy: -14,
              phase: "flying",
            });

            setTimeout(() => setImpactIconKey(null), 150);
          }
        }
      }

      // --- Launched icon physics ---
      const launched = launchedIconRef.current;
      if (launched && launched.phase === "flying") {
        launched.vy += 0.8; // gravity
        launched.y += launched.vy;

        // Hit the floor
        if (launched.y >= height - 60) {
          launched.y = height - 60;
          launched.phase = "expanding";
          setLaunchedIcon({ ...launched });
          // Open project detail window
          setProjectWindow({
            project: launched.project,
            originRect: {
              x: launched.x - width / 2,
              y: launched.y - height / 2,
            },
          });
        } else {
          setLaunchedIcon({ ...launched });
        }
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

  // Keep launchedIconRef in sync
  useEffect(() => {
    launchedIconRef.current = launchedIcon;
  }, [launchedIcon]);

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
    // Don't set activeSection here; wait for disintegration to finish
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

  /** Handle project icon click — start headbutt sequence */
  const handleProjectIconClick = useCallback((project: ProjectData, rect: DOMRect) => {
    if (character?.warpState !== "idle") return;

    const container = containerRef.current;
    if (!container) return;

    // Store headbutt target info
    const target: LaunchedIcon = {
      project,
      x: rect.left + rect.width / 2,
      y: rect.top,
      vy: 0,
      phase: "expanding", // not flying yet — waiting for impact
      iconRect: rect,
    };
    launchedIconRef.current = target;
    setHeadbuttTarget({ project, iconRect: rect });

    // Set the target Y for collision detection (viewport relative) via ref
    headbuttTargetYRef.current = rect.top;

    // Trigger the headbutt jump
    warpTriggerRef.current = "headbutt";
  }, [character?.warpState]);

  /** Close project detail window */
  const handleCloseProject = useCallback(() => {
    setProjectWindow(null);
    setLaunchedIcon(null);
    setHeadbuttTarget(null);
    launchedIconRef.current = null;
  }, []);

  // Called by WarpParticles when all particles have been consumed (or integrated)
  const handleAllConsumed = useCallback(() => {
    const currentState = character?.warpState;
    if (currentState === "warping_in") {
      // Disintegration complete → Open Timeline immediately
      warpTriggerRef.current = "warped";
      setActiveSection("about");
    } else if (currentState === "warping_out") {
      // Integration complete → Character restored
      warpTriggerRef.current = "idle";
    } else {
      // Fallback
      warpTriggerRef.current = "warped";
    }
  }, [character?.warpState]);

  // Called by WarpParticles each frame with the set of shed pixel keys
  const handleShedUpdate = useCallback((shed: Set<string>) => {
    setShedSet(shed);
  }, []);

  // ESC key to close sections
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Escape") {
        if (projectWindow) {
          handleCloseProject();
        } else {
          handleCloseSection();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseSection, handleCloseProject, projectWindow]);

  // Portal center as viewport percentages
  const portalXPercent = figmaX(FIGMA_POSITIONS.portal.x);
  const portalYPercent = figmaY(FIGMA_POSITIONS.portal.y);
  const active = !!character && (character.warpState === "warping_in" || character.warpState === "warping_out");
  const particleMode = character?.warpState === "warping_out" ? "integrate" : "shed";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden cursor-default transition-colors duration-700"
      style={{ background: isDark ? "#1a1a2e" : "#DAD9D2" }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {character && (
        <>
          {/* Layer 0: Background Stars (Dark mode only) */}
          <Stars />

          {/* Layer 1: Decorative clouds */}
          <Clouds />

          {/* Layer 2: Project cluster */}
          <ProjectCluster
            launchedIconKey={launchedIcon?.phase === "flying" || projectWindow ? launchedIcon?.project.key ?? headbuttTarget?.project.key : undefined}
            impactIconKey={impactIconKey}
            onIconClick={handleProjectIconClick}
          />

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
            active={active}
            mode={particleMode}
            characterX={character.x}
            groundYPercent={CANVAS.GROUND_Y}
            portalXPercent={portalXPercent}
            portalYPercent={portalYPercent}
            onAllConsumed={handleAllConsumed}
            onShedUpdate={handleShedUpdate}
          />

          {/* Pixel dust burst on impact */}
          {dustBurst && (
            <PixelDust
              x={dustBurst.x}
              y={dustBurst.y}
              color={dustBurst.color}
              active={true}
              onComplete={() => setDustBurst(null)}
            />
          )}

          {/* Launched icon flying through the air */}
          {launchedIcon && launchedIcon.phase === "flying" && (
            <div
              className="absolute pointer-events-none z-30"
              style={{
                left: launchedIcon.x - 24,
                top: launchedIcon.y,
                width: 48,
                height: 48,
                borderRadius: 12,
                background: launchedIcon.project.color,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "transform 0.05s linear",
                // Rotation based on velocity for dynamic feel
                transform: `rotate(${launchedIcon.vy * 3}deg)`,
              }}
            >
              {launchedIcon.project.videoSrc && (
                <video
                  src={launchedIcon.project.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {/* Project detail window */}
          <ProjectDetailWindow
            project={projectWindow?.project ?? null}
            isOpen={!!projectWindow}
            onClose={handleCloseProject}
            layoutId={projectWindow ? `project-${projectWindow.project.key}` : undefined}
            originRect={projectWindow?.originRect}
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
