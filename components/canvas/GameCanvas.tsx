"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { PixelCharacter, DISPLAY_H } from "./PixelCharacter";
import { GroundLine } from "./GroundLine";
import { WeatherCanvas } from "./weather/WeatherCanvas";
import { InfoPanel } from "@/components/ui/info-panel";
import { useWeather } from "./weather/useWeather";
import { PixelPortal } from "./pixel-portal";
import { WarpParticles } from "./WarpParticles";
import { PixelDust } from "./pixel-dust";
import { LightningTrail } from "./lightning-trail";
import { ProjectCluster, PROJECTS } from "@/components/elements/project-cluster";
import { WorkCluster } from "@/components/elements/work-cluster";
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
import { IntroSequence } from "./intro-sequence";

/* ---------- Headbutt state ---------- */
type HeadbuttPhase = "sprint" | "jump" | "impact" | "iconReaction" | "window";

interface HeadbuttState {
  project: ProjectData;
  iconRect: DOMRect;
  phase: HeadbuttPhase;
  /** Canvas-local X of icon center */
  sprintTargetX: number;
  /** Negative Y offset from ground to icon center (for jump physics) */
  headbuttTargetY: number;
}

export function GameCanvas() {
  const { isDark } = useTheme();
  const weather = useWeather();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const cursorXRef = useRef(0);
  const characterXRef = useRef(0);
  const warpTriggerRef = useRef<"shivering" | "warping_in" | "warping_out" | "warped" | "idle" | "headbutt_sprint" | "headbutt_jump" | "headbutt_falling" | null>(null);
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [introActive, setIntroActive] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nearZone, setNearZone] = useState<string | null>(null);
  const [shedSet, setShedSet] = useState<Set<string>>(new Set());

  /* ---- Headbutt state ---- */
  const [headbutt, setHeadbutt] = useState<HeadbuttState | null>(null);
  const [impactIconKey, setImpactIconKey] = useState<string | null>(null);
  const [poppedIconKey, setPoppedIconKey] = useState<string | null>(null);
  const [dustBurst, setDustBurst] = useState<{ x: number; y: number; color: string } | null>(null);
  const [projectWindow, setProjectWindow] = useState<{ project: ProjectData; originRect: { x: number; y: number } } | null>(null);
  const headbuttRef = useRef<HeadbuttState | null>(null);
  /** Params for the engine to pick up on next sprint trigger */
  const headbuttParamsRef = useRef<{ sprintTargetX: number; headbuttTargetY: number } | null>(null);

  // Initialize character state once we know canvas size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Keep character centered during intro — freeze cursor at center
    cursorXRef.current = container.clientWidth / 2;
    setCharacter(createInitialState(container.clientWidth));
    if (!localStorage.getItem("boule-visited")) {
      setIntroActive(true);
      localStorage.setItem("boule-visited", "1");
    }
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
    let impactFired = false;

    function loop() {
      const width = container!.clientWidth;
      const height = container!.clientHeight;

      // Check for warp trigger from click handlers or particle system
      const trigger = warpTriggerRef.current;
      if (trigger) {
        warpTriggerRef.current = null;
        if (trigger === "headbutt_sprint") {
          const params = headbuttParamsRef.current;
          if (params) {
            // Short sprint edge case: if already close, snap X and jump straight up
            const distToTarget = Math.abs(animState.x - params.sprintTargetX);
            const apexFrames = CHARACTER.HEADBUTT_APEX_FRAMES;
            const hbGrav = (2 * Math.abs(params.headbuttTargetY)) / (apexFrames * apexFrames);
            const jumpVelShort = -hbGrav * apexFrames;
            if (distToTarget < 80) {
              animState = {
                ...animState,
                x: params.sprintTargetX,
                warpState: "headbutt_jump",
                warpTimer: 0,
                velocityY: jumpVelShort,
                isJumping: true,
                headbuttTargetY: params.headbuttTargetY,
                sprintTargetX: params.sprintTargetX,
                sprintSpeed: 0,
                headbuttGravity: hbGrav,
              };
            } else {
              animState = {
                ...animState,
                warpState: "headbutt_sprint",
                warpTimer: 0,
                velocityY: 0,
                headbuttTargetY: params.headbuttTargetY,
                sprintTargetX: params.sprintTargetX,
                sprintSpeed: CHARACTER.SPEED,
              };
            }
          }
          impactFired = false;
        } else if (trigger === "headbutt_falling") {
          animState = {
            ...animState,
            warpState: "headbutt_falling",
            warpTimer: 0,
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

      // --- Detect sprint → jump transition (engine handles this internally) ---
      if (prevWarpState === "headbutt_sprint" && nextState.warpState === "headbutt_jump") {
        const hb = headbuttRef.current;
        if (hb) {
          headbuttRef.current = { ...hb, phase: "jump" };
          setHeadbutt(prev => prev ? { ...prev, phase: "jump" } : null);
        }
      }

      // --- Impact detection: peak of jump (velocityY flips from negative to >= 0) ---
      if (nextState.warpState === "headbutt_jump" && !impactFired && nextState.velocityY >= 0) {
        impactFired = true;
        const hb = headbuttRef.current;
        if (hb) {
          const iconX = hb.iconRect.left + hb.iconRect.width / 2;
          const iconY = hb.iconRect.top + hb.iconRect.height / 2;

          // Impact phase
          headbuttRef.current = { ...hb, phase: "impact" };
          setHeadbutt(prev => prev ? { ...prev, phase: "impact" } : null);
          setImpactIconKey(hb.project.key);
          setDustBurst({ x: iconX, y: iconY, color: hb.project.color });

          // After 80ms: squash ends, icon pops, character starts falling
          setTimeout(() => {
            setImpactIconKey(null);
            setPoppedIconKey(hb.project.key);
            warpTriggerRef.current = "headbutt_falling";

            if (headbuttRef.current) {
              headbuttRef.current = { ...headbuttRef.current, phase: "iconReaction" };
              setHeadbutt(prev => prev ? { ...prev, phase: "iconReaction" } : null);
            }

            // After 100ms more: hide icon, open window
            setTimeout(() => {
              setPoppedIconKey(null);
              const hbNow = headbuttRef.current;
              if (hbNow) {
                const ix = hbNow.iconRect.left + hbNow.iconRect.width / 2;
                const iy = hbNow.iconRect.top + hbNow.iconRect.height / 2;
                setProjectWindow({
                  project: hbNow.project,
                  originRect: {
                    x: ix - (width / 2),
                    y: iy - (height / 2) - 40, // offset for popped position
                  },
                });
                headbuttRef.current = { ...hbNow, phase: "window" };
                setHeadbutt(prev => prev ? { ...prev, phase: "window" } : null);
              }
            }, 100);
          }, 80);
        }
      }

      animState = nextState;
      characterXRef.current = animState.x;
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
    if (introActive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      cursorXRef.current = e.clientX - rect.left;
    }
  }, [introActive]);

  const handlePortalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    warpTriggerRef.current = "shivering";
    // Don't set activeSection here; wait for disintegration to finish
  }, []);

  const handleClick = useCallback(() => {
    if (introActive) return;
    if (nearZone === "portal") {
      warpTriggerRef.current = "shivering";
      return;
    }

    if (nearZone) {
      setActiveSection(nearZone);
    }

    // Click also triggers jump — only if not warping
    setCharacter((prev) => (prev && prev.warpState === "idle" ? jump(prev) : prev));
  }, [introActive, nearZone]);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
    warpTriggerRef.current = "warping_out";
    setShedSet(new Set()); // reset shed pixels
  }, []);

  /** Handle project icon click — headbutt only for Useless Notes */
  const handleProjectIconClick = useCallback((project: ProjectData, rect: DOMRect) => {
    if (project.key !== "uselessNote") return;
    if (character?.warpState !== "idle") return;
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    // Icon center X in canvas-local pixels
    const sprintTargetX = rect.left + rect.width / 2 - containerRect.left;
    // Jump target: character HEAD (top of sprite) should reach icon center.
    // PixelCharacter top = groundYPx - DISPLAY_H + state.y * scale
    // So for head to reach iconCenterY: state.y = (iconCenterY - groundYPx + DISPLAY_H) / scale
    const groundYPx = (CANVAS.GROUND_Y / 100) * container.clientHeight;
    const iconCenterY = rect.top + rect.height / 2 - containerRect.top;
    const displayScale = DISPLAY_H / (CHARACTER.SPRITE_ROWS * CHARACTER.PIXEL_SIZE);
    const headbuttTargetY = (iconCenterY - groundYPx + DISPLAY_H) / displayScale;

    const hb: HeadbuttState = {
      project,
      iconRect: rect,
      phase: "sprint",
      sprintTargetX,
      headbuttTargetY,
    };
    headbuttRef.current = hb;
    setHeadbutt(hb);

    // Set params for engine and trigger sprint
    headbuttParamsRef.current = { sprintTargetX, headbuttTargetY };
    warpTriggerRef.current = "headbutt_sprint";
  }, [character?.warpState]);

  /** Close project detail window */
  const handleCloseProject = useCallback(() => {
    setProjectWindow(null);
    setHeadbutt(null);
    headbuttRef.current = null;
    setPoppedIconKey(null);
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

  // Lightning trail props — active during sprint + jump, fading intensity during jump
  const trailActive = !!headbutt && (headbutt.phase === "sprint" || headbutt.phase === "jump");
  const trailIntensity = headbutt?.phase === "sprint"
    ? Math.min((character?.sprintSpeed ?? 0) / CHARACTER.SPRINT_MAX_SPEED, 1)
    : headbutt?.phase === "jump" ? 0.3 : 0;

  // Lean angle during sprint
  const leanAngle = character?.warpState === "headbutt_sprint"
    ? Math.min(15, ((character?.sprintSpeed ?? 0) / CHARACTER.SPRINT_MAX_SPEED) * 15)
    : 0;

  // Determine which icon to hide (during window phase)
  const hiddenIconKey = headbutt && headbutt.phase === "window"
    ? headbutt.project.key
    : undefined;

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
          {/* Layer 0: Live weather background */}
          <WeatherCanvas weatherState={weather.condition} isDark={isDark} />

          {/* Layer 2: Project cluster */}
          <ProjectCluster
            launchedIconKey={hiddenIconKey}
            impactIconKey={impactIconKey}
            poppedIconKey={poppedIconKey}
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
            <PixelPortal scale={2.25} />
          </div>

          {/* Layer 6: Invisible ground line */}
          <GroundLine y={CANVAS.GROUND_Y} />

          {/* Lightning trail during sprint + jump */}
          <LightningTrail
            sourceXRef={characterXRef}
            intensity={trailIntensity}
            active={trailActive}
          />

          {/* Layer 7: The pixel character — hidden during intro */}
          <div style={{ opacity: projectWindow || introActive ? 0 : 1, transition: "opacity 0.2s" }}>
            <PixelCharacter
              state={character}
              groundY={CANVAS.GROUND_Y}
              shedSet={shedSet}
              leanAngle={leanAngle}
            />
          </div>

          {/* First-visit intro sequence */}
          {introActive && (
            <IntroSequence
              characterX={character.x}
              groundY={CANVAS.GROUND_Y}
              onDismiss={() => setIntroActive(false)}
            />
          )}

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

          {/* Info panel — whoami, projects, last listened, weather */}
          <InfoPanel
            tempC={weather.tempC}
            condition={weather.condition}
            loading={weather.loading}
          />

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
