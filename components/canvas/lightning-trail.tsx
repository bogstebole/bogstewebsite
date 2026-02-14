"use client";

import { useRef, useEffect } from "react";
import { CANVAS } from "@/lib/constants";

// ─── Types ───
interface Point {
  x: number;
  y: number;
}

interface Bolt {
  points: (Point & { depth?: number })[];
  born: number;
  life: number;
  color: [number, number, number];
  width: number;
}

interface Ghost {
  x: number;
  y: number;
  opacity: number;
  born: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  born: number;
  life: number;
  color: [number, number, number];
}

interface AnimState {
  sourceX: number;
  sourceY: number;
  frame: number;
  ghosts: Ghost[];
  bolts: Bolt[];
  particles: Particle[];
  phase: "active" | "decay" | "done";
  time: number;
  lastTime: number;
  lastGhostTime: number;
  prevSourceX: number;
}

interface LightningTrailProps {
  /** Character X position in viewport px — trail follows this each frame */
  sourceX: number;
  /** Effect intensity 0–1 (scales bolt frequency, ghost density, streak count) */
  intensity: number;
  /** Whether the trail is active (sprint + jump phases) */
  active: boolean;
  onComplete?: () => void;
}

// ─── Pixel snap scale ───
const SCALE = 4;

// ─── Lightning bolt generator (midpoint displacement) ───
function generateLightningBolt(
  x1: number, y1: number, x2: number, y2: number,
  detail = 5, jitter = 8
): Point[] {
  let points: Point[] = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  for (let d = 0; d < detail; d++) {
    const newPoints: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * jitter;
      const my = (a.y + b.y) / 2 + (Math.random() - 0.5) * jitter;
      newPoints.push(a, { x: mx, y: my });
    }
    newPoints.push(points[points.length - 1]);
    points = newPoints;
    jitter *= 0.55;
  }
  return points;
}

// ─── Branch lightning ───
function generateBranch(
  x: number, y: number, angle: number, length: number, depth = 0
): (Point & { depth: number })[] {
  if (depth > 3 || length < 3) return [];
  const ex = x + Math.cos(angle) * length;
  const ey = y + Math.sin(angle) * length;
  const bolt = generateLightningBolt(x, y, ex, ey, 3, length * 0.4);
  const branches: (Point & { depth: number })[] = [];
  if (Math.random() > 0.4 && depth < 3) {
    const branchAngle = angle + (Math.random() - 0.5) * 1.5;
    branches.push(...generateBranch(ex, ey, branchAngle, length * 0.6, depth + 1));
  }
  return [...bolt.map(p => ({ ...p, depth })), ...branches];
}

/** Refs container passed to drawFrame so it can read live values each frame */
interface TrailRefs {
  props: { current: { sourceX: number; intensity: number; active: boolean } };
  onComplete: { current: (() => void) | undefined };
}

/** Draw frame — defined outside component to avoid ref-during-render issues */
function drawFrame(
  canvas: HTMLCanvasElement,
  s: AnimState,
  refs: TrailRefs,
  animRef: { current: number },
  onDone: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (s.phase === "done") return;

  const now = performance.now();
  const dt = s.lastTime ? (now - s.lastTime) / 1000 : 0.016;
  s.lastTime = now;
  s.time = now / 1000;

  const w = canvas.width;
  const h = canvas.height;
  const groundY = (CANVAS.GROUND_Y / 100) * h;
  const srcCenterY = groundY - 40;

  // Read live props from ref each frame
  const { sourceX: liveSourceX, intensity: liveIntensity, active: liveActive } = refs.props.current;

  // Update source position from props each frame
  s.sourceX = liveSourceX;
  s.sourceY = srcCenterY;

  // Transition to decay when active goes false
  if (!liveActive && s.phase === "active") {
    s.phase = "decay";
    s.frame = 0;
  }

  // ─── Decay phase ───
  if (s.phase === "decay") {
    s.frame++;
    if (s.frame <= 30 && Math.random() > 0.35) {
      const cx = s.sourceX;
      const cy = srcCenterY;
      const angle = Math.random() * Math.PI * 2;
      const branchPts = generateBranch(cx, cy, angle, 25 + Math.random() * 55, 0);
      if (branchPts.length > 1) {
        s.bolts.push({
          points: branchPts,
          born: s.time,
          life: 0.08 + Math.random() * 0.12,
          color: [255, 220, 60],
          width: 1,
        });
      }

      for (let i = 0; i < 3; i++) {
        const px = cx + (Math.random() - 0.5) * 100;
        const py = cy + (Math.random() - 0.5) * 70;
        s.particles.push({
          x: Math.round(px / SCALE) * SCALE,
          y: Math.round(py / SCALE) * SCALE,
          vx: (Math.random() - 0.5) * 80,
          vy: (Math.random() - 0.5) * 50 - 25,
          size: SCALE * (Math.random() > 0.5 ? 1 : 2),
          born: s.time,
          life: 0.3 + Math.random() * 0.6,
          color: Math.random() > 0.5 ? [255, 220, 50] : [255, 250, 180],
        });
      }
    }

    if (s.frame > 30 && s.bolts.length === 0 && s.particles.length === 0) {
      s.phase = "done";
      ctx.clearRect(0, 0, w, h);
      onDone();
      refs.onComplete.current?.();
      return;
    }
  }

  // ─── Active phase: generate bolts/ghosts scaled by intensity ───
  if (s.phase === "active" && liveIntensity > 0.05) {
    const inten = liveIntensity;

    // Ghost positions
    const ghostInterval = inten > 0.7 ? 0.025 : 0.05;
    if (s.time - s.lastGhostTime > ghostInterval) {
      s.ghosts.push({
        x: s.sourceX,
        y: srcCenterY,
        opacity: 0.4 * inten,
        born: s.time,
        life: 0.6 + inten * 0.3,
      });
      s.lastGhostTime = s.time;
    }

    // Bolts between source and ghost trail
    if (Math.random() < 0.8 * inten) {
      const recentGhosts = s.ghosts.filter(g => s.time - g.born < 0.25);
      if (recentGhosts.length > 0) {
        const target = recentGhosts[Math.floor(Math.random() * recentGhosts.length)];
        const cx = s.sourceX;
        const cy = srcCenterY;
        const tx = target.x + (Math.random() - 0.5) * 20;
        const ty = target.y + (Math.random() - 0.5) * 30;
        const bolt = generateLightningBolt(cx, cy, tx, ty, 4, 15);
        const brightness = Math.random();
        s.bolts.push({
          points: bolt,
          born: s.time,
          life: 0.04 + Math.random() * 0.06,
          color: brightness > 0.6
            ? [255, 255, 200]
            : brightness > 0.3
            ? [255, 220, 50]
            : [255, 180, 20],
          width: Math.random() > 0.5 ? 1 : 2,
        });
      }
    }

    // Ambient arcs around source
    if (Math.random() < 0.6 * inten) {
      const cx = s.sourceX + (Math.random() - 0.5) * 30;
      const cy = srcCenterY - 10;
      const angle = Math.random() * Math.PI * 2;
      const len = 12 + Math.random() * 45;
      const ex = cx + Math.cos(angle) * len;
      const ey = cy + Math.sin(angle) * len;
      const bolt = generateLightningBolt(cx, cy, ex, ey, 3, 8);
      s.bolts.push({
        points: bolt,
        born: s.time,
        life: 0.03 + Math.random() * 0.05,
        color: Math.random() > 0.5 ? [255, 230, 80] : [255, 200, 40],
        width: 1,
      });
    }

    // Trailing long bolt behind
    if (Math.random() < 0.3 * inten && inten > 0.5) {
      const cx = s.sourceX;
      const cy = srcCenterY + (Math.random() - 0.5) * 20;
      const moveDelta = s.sourceX - s.prevSourceX;
      const dir = moveDelta >= 0 ? 1 : -1;
      const tx = cx - dir * (60 + Math.random() * 100);
      const ty = cy + (Math.random() - 0.5) * 50;
      const bolt = generateLightningBolt(cx, cy, tx, ty, 5, 20);
      s.bolts.push({
        points: bolt,
        born: s.time,
        life: 0.06 + Math.random() * 0.06,
        color: [255, 210, 30],
        width: 2,
      });
    }
  }

  s.prevSourceX = s.sourceX;

  // Filter expired
  s.ghosts = s.ghosts.filter(g => {
    const age = s.time - g.born;
    const t = age / g.life;
    g.opacity = g.opacity * (1 - t * 0.8);
    return t < 1;
  });
  s.bolts = s.bolts.filter(b => s.time - b.born < b.life);
  s.particles = s.particles.filter(p => {
    const age = s.time - p.born;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 40 * dt;
    return age < p.life;
  });

  // ═══════════════════════════════════════
  // ─── RENDER ───
  // ═══════════════════════════════════════

  ctx.clearRect(0, 0, w, h);

  // Speed streaks (scaled by intensity)
  if (liveIntensity > 0.3 && s.phase === "active") {
    const streakIntensity = Math.min((liveIntensity - 0.3) / 0.7, 1);
    for (let i = 0; i < 10 * streakIntensity; i++) {
      const ly = srcCenterY + (Math.random() - 0.5) * 80;
      const lx = s.sourceX - (Math.random() - 0.5) * 200;
      const lw = 30 + Math.random() * 100 * streakIntensity;
      ctx.fillStyle = `rgba(255,220,50,${0.02 + Math.random() * 0.04 * streakIntensity})`;
      ctx.fillRect(lx, Math.round(ly / SCALE) * SCALE, lw, SCALE);
    }
  }

  // ─── Lightning Bolts ───
  for (const bolt of s.bolts) {
    const age = s.time - bolt.born;
    const t = age / bolt.life;
    const alpha = 1 - t;

    ctx.save();
    ctx.shadowBlur = 10 + (1 - t) * 14;
    ctx.shadowColor = `rgba(${bolt.color[0]},${bolt.color[1]},${bolt.color[2]},${alpha * 0.9})`;
    ctx.strokeStyle = `rgba(${bolt.color[0]},${bolt.color[1]},${bolt.color[2]},${alpha})`;
    ctx.lineWidth = bolt.width;
    ctx.beginPath();

    for (let i = 0; i < bolt.points.length; i++) {
      const p = bolt.points[i];
      const sx = Math.round(p.x / SCALE) * SCALE;
      const sy = Math.round(p.y / SCALE) * SCALE;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // White-hot core
    if (bolt.width > 1) {
      ctx.shadowBlur = 4;
      ctx.strokeStyle = `rgba(255,255,240,${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  // ─── Decay Particles ───
  for (const p of s.particles) {
    const age = s.time - p.born;
    const t = age / p.life;
    const alpha = 1 - t;

    ctx.save();
    ctx.shadowBlur = 5;
    ctx.shadowColor = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha * 0.6})`;
    ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${alpha})`;
    const sx = Math.round(p.x / SCALE) * SCALE;
    const sy = Math.round(p.y / SCALE) * SCALE;
    ctx.fillRect(sx, sy, p.size, p.size);
    ctx.restore();
  }

  animRef.current = requestAnimationFrame(() => {
    drawFrame(canvas, s, refs, animRef, onDone);
  });
}

/**
 * Pixel Lightning Trail Effect — follows the character's X position with
 * intensity-scaled bolts, ghosts, and streaks. When active goes false,
 * runs a decay with branching arcs + particle fadeout for ~500ms.
 */
export function LightningTrail({ sourceX, intensity, active, onComplete }: LightningTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AnimState | null>(null);
  const animRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  const propsRef = useRef({ sourceX, intensity, active });
  // Sync refs in effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
    propsRef.current = { sourceX, intensity, active };
  });

  // Start animation when active becomes true; decay runs via propsRef when active goes false
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Make canvas visible (hidden by default via CSS)
    canvas.style.display = "block";

    const s: AnimState = {
      sourceX,
      sourceY: (CANVAS.GROUND_Y / 100) * canvas.height - 40,
      frame: 0,
      ghosts: [],
      bolts: [],
      particles: [],
      phase: "active",
      time: 0,
      lastTime: 0,
      lastGhostTime: 0,
      prevSourceX: sourceX,
    };
    stateRef.current = s;

    const hideCanvas = () => { canvas.style.display = "none"; };
    const refs: TrailRefs = { props: propsRef, onComplete: onCompleteRef };
    animRef.current = requestAnimationFrame(() => {
      drawFrame(canvas, s, refs, animRef, hideCanvas);
    });

    return () => cancelAnimationFrame(animRef.current);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{
        width: "100vw",
        height: "100vh",
        imageRendering: "pixelated",
        display: "none",
      }}
    />
  );
}
