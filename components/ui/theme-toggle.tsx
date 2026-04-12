"use client";

import { useEffect, useRef, useState } from "react";

const GRAVITY = 1.35;
const FRICTION = 0.94;
const ITERATIONS = 35;
const SEGMENT_COUNT = 11;
const SEGMENT_LENGTH = 11;
const TRIGGER_Y = 150;
const REARM_Y = 110;
const DEBOUNCE_MS = 600;
const ANCHOR_OFFSET_X = 50;

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface Stick {
  p1: Point;
  p2: Point;
  length: number;
}

interface MouseState {
  x: number;
  y: number;
  active: boolean;
  targetPoint: Point | null;
}

export function ThemeToggle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);

  // All physics state in refs — never causes re-renders
  const isDarkRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const sticksRef = useRef<Stick[]>([]);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, active: false, targetPoint: null });
  const rafRef = useRef<number>(0);
  const triggerActivatedRef = useRef(false);
  const lastTriggerTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read persisted theme
    const stored = localStorage.getItem("theme");
    const initialDark = stored === "dark";
    isDarkRef.current = initialDark;
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);

    let width = 0;
    let height = 0;

    function getAnchorX() {
      return width - ANCHOR_OFFSET_X;
    }

    function init() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;

      const points: Point[] = [];
      const sticks: Stick[] = [];
      const anchorX = getAnchorX();
      const anchorY = -5;

      for (let i = 0; i < SEGMENT_COUNT; i++) {
        const y = anchorY + i * SEGMENT_LENGTH;
        points.push({ x: anchorX, y, oldX: anchorX, oldY: y, pinned: i === 0 });
      }

      for (let i = 0; i < SEGMENT_COUNT - 1; i++) {
        sticks.push({ p1: points[i], p2: points[i + 1], length: SEGMENT_LENGTH });
      }

      pointsRef.current = points;
      sticksRef.current = sticks;
    }

    function update() {
      const points = pointsRef.current;
      const sticks = sticksRef.current;
      const mouse = mouseRef.current;

      for (const p of points) {
        if (p.pinned) {
          p.x = getAnchorX();
          p.y = -5;
          continue;
        }

        let vx = (p.x - p.oldX) * FRICTION;
        let vy = (p.y - p.oldY) * FRICTION;
        if (vy < 0) vy *= 0.75;

        p.oldX = p.x;
        p.oldY = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }

      const handle = points[points.length - 1];

      if (mouse.active) {
        const dx = handle.x - mouse.x;
        const dy = handle.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) {
          mouse.targetPoint = handle;
        }
      }

      if (mouse.active && mouse.targetPoint) {
        mouse.targetPoint.x = mouse.x;
        mouse.targetPoint.y = mouse.y;
      } else {
        mouse.targetPoint = null;
      }

      for (let j = 0; j < ITERATIONS; j++) {
        for (const s of sticks) {
          const dx = s.p2.x - s.p1.x;
          const dy = s.p2.y - s.p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = s.length - dist;
          const percent = diff / dist / 2;
          const ox = dx * percent;
          const oy = dy * percent;

          if (!s.p1.pinned) { s.p1.x -= ox; s.p1.y -= oy; }
          if (!s.p2.pinned) { s.p2.x += ox; s.p2.y += oy; }
        }
      }

      // Threshold trigger
      if (handle.y > TRIGGER_Y && !triggerActivatedRef.current) {
        const now = Date.now();
        if (now - lastTriggerTimeRef.current > DEBOUNCE_MS) {
          const next = !isDarkRef.current;
          isDarkRef.current = next;
          document.documentElement.classList.toggle("dark", next);
          localStorage.setItem("theme", next ? "dark" : "light");
          setIsDark(next);
          triggerActivatedRef.current = true;
          lastTriggerTimeRef.current = now;
        }
      } else if (handle.y < REARM_Y) {
        triggerActivatedRef.current = false;
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      const points = pointsRef.current;
      const dark = isDarkRef.current;

      ctx!.beginPath();
      ctx!.strokeStyle = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.8)";
      ctx!.lineWidth = 1.5;
      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";

      ctx!.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx!.lineTo(points[i].x, points[i].y);
      }
      ctx!.stroke();

      const h = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(h.y - prev.y, h.x - prev.x) - Math.PI / 2;

      ctx!.save();
      ctx!.translate(h.x, h.y);
      ctx!.rotate(angle);
      ctx!.fillStyle = dark ? "#ffffff" : "#000000";
      ctx!.beginPath();
      ctx!.roundRect(-3, 0, 6, 24, 1);
      ctx!.fill();
      ctx!.restore();
    }

    function loop() {
      update();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    function updateMouse(e: MouseEvent | TouchEvent) {
      const ev = "touches" in e ? e.touches[0] : e;
      mouseRef.current.x = ev.clientX;
      mouseRef.current.y = ev.clientY;
    }

    function updateCursor(e: MouseEvent) {
      const handle = pointsRef.current[pointsRef.current.length - 1];
      if (!handle) return;
      const dx = handle.x - e.clientX;
      const dy = handle.y - e.clientY;
      const near = Math.sqrt(dx * dx + dy * dy) < 70;
      document.body.style.cursor = mouseRef.current.active && mouseRef.current.targetPoint
        ? "grabbing"
        : near ? "grab" : "";
    }

    const onMouseDown = (e: MouseEvent) => { mouseRef.current.active = true; updateMouse(e); updateCursor(e); };
    const onMouseMove = (e: MouseEvent) => { updateMouse(e); updateCursor(e); };
    const onMouseUp = (e: MouseEvent) => { mouseRef.current.active = false; mouseRef.current.targetPoint = null; updateCursor(e); };
    const onTouchStart = (e: TouchEvent) => { mouseRef.current.active = true; updateMouse(e); };
    const onTouchMove = (e: TouchEvent) => { updateMouse(e); };
    const onTouchEnd = () => { mouseRef.current.active = false; mouseRef.current.targetPoint = null; };
    const onResize = () => init();

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp as EventListener);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    init();
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp as EventListener);
      document.body.style.cursor = "";
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* Lamp core — tight bright spot */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(circle at calc(100% - 50px) 0px, rgba(255,245,200,0.4) 0%, rgba(255,210,120,0.1) 12%, transparent 30%)",
          pointerEvents: "none",
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.7s ease",
          zIndex: 11,
        }}
      />
      {/* Lamp glow — wider warm spread */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(circle at calc(100% - 50px) 0px, rgba(255,225,140,0.6) 0%, rgba(255,180,70,0.25) 9%, rgba(255,130,30,0.08) 22%, rgba(255,100,20,0.01) 40%, transparent 60%)",
          pointerEvents: "none",
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.6s ease",
          zIndex: 10,
        }}
      />
      {/* Rope canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          background: "transparent",
        }}
      />
    </>
  );
}
