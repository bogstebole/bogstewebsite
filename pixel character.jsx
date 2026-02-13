import { useState, useEffect, useRef, useCallback } from "react";

// 32x48 pixel character data - each row is 32 pixels wide
// Colors: 0=transparent, 1=cap dark, 2=cap main, 3=skin, 4=eye, 5=beard dark, 6=beard main, 7=shirt dark, 8=shirt main, 9=pants dark, A=pants main, B=shoe dark, C=shoe main
const PALETTE = {
  "0": "transparent",
  "1": "#1a1a2e",  // cap dark
  "2": "#2d3a6e",  // cap main  
  "3": "#e8b88a",  // skin
  "4": "#1a1a1a",  // eyes
  "5": "#3d2b1f",  // beard dark
  "6": "#5c3d2e",  // beard main
  "7": "#2a4a3a",  // shirt dark
  "8": "#3d6b52",  // shirt main
  "9": "#1a1a2e",  // pants dark
  "A": "#2a2a4e",  // pants main
  "B": "#1a1a1a",  // shoe dark
  "C": "#3a3a3a",  // shoe main
  "D": "#c49a6c",  // skin shadow
  "E": "#4a3528",  // beard mid
  "F": "#243555",  // cap highlight
};

// Idle frame - 32 wide x 48 tall
const IDLE_FRAME = [
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000000000000000000000000",
  "00000000000112222211000000000000",
  "00000000001222222222100000000000",
  "00000000012222222222210000000000",
  "00000000122222222222221000000000",
  "00000000122222222222221000000000",
  "00000001111111111111111111100000",
  "00000001111111111111111111100000",
  "00000000011133333333110000000000",
  "00000000001333333333100000000000",
  "00000000013333333333310000000000",
  "00000000013304333043310000000000",
  "00000000013333333333310000000000",
  "00000000001333333333100000000000",
  "00000000001335666533100000000000",
  "00000000000156666651000000000000",
  "00000000001566666665100000000000",
  "00000000015666666666510000000000",
  "00000000056666EE66666500000000000",
  "0000000005666EEEE6666500000000000",
  "00000000566666666666650000000000",
  "00000000056666666666500000000000",
  "00000000005666666665000000000000",
  "00000000000788888870000000000000",
  "00000000007888888887000000000000",
  "00000000078888888888700000000000",
  "00000000788888888888870000000000",
  "00000007888888888888887000000000",
  "00000078887888888878887000000000",
  "00000078870788888707887000000000",
  "00000007700788888700770000000000",
  "00000000000788888700000000000000",
  "00000000000799999700000000000000",
  "0000000000099AAAA99000000000000",
  "000000000009AAAAAA9000000000000",
  "00000000009AAAAAAAA900000000000",
  "00000000009AAAAAAAA900000000000",
  "0000000000AAAAAAAAAA00000000000",
  "0000000000AA99AA99AA00000000000",
  "0000000000990000009900000000000",
  "0000000000990000009900000000000",
  "000000000099000000990000000000",
  "00000000009B000000B90000000000",
  "0000000000BBB0000BBB0000000000",
  "0000000000CCC0000CCC0000000000",
];

// Walk frame 1 - legs apart
const WALK_FRAME_1 = [...IDLE_FRAME];

// Walk frame 2 - legs together  
const WALK_FRAME_2 = [...IDLE_FRAME];

// We'll modify legs programmatically in the render

const PIXEL_SIZE = 4;
const CHAR_W = 32;
const CHAR_H = 48;
const GROUND_Y = 380;
const CANVAS_W = 800;

export default function PixelCharacterPrototype() {
  const canvasRef = useRef(null);
  const characterRef = useRef({
    x: 400,
    targetX: 400,
    y: GROUND_Y,
    velocityY: 0,
    isJumping: false,
    facing: 1, // 1 = right, -1 = left
    walkFrame: 0,
    walkTimer: 0,
    isMoving: false,
    breathOffset: 0,
    breathTimer: 0,
    idleTimer: 0,
    blinkTimer: 0,
    isBlinking: false,
  });
  const mouseRef = useRef({ x: 400, y: 300 });
  const keysRef = useRef({ space: false });
  const animFrameRef = useRef(null);

  const drawPixel = useCallback((ctx, x, y, color, size = PIXEL_SIZE) => {
    if (color === "transparent") return;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }, []);

  const drawCharacter = useCallback((ctx, char) => {
    const frame = IDLE_FRAME;
    const offsetX = char.x - (CHAR_W * PIXEL_SIZE) / 2;
    const offsetY = char.y - CHAR_H * PIXEL_SIZE;
    
    // Breathing animation - subtle vertical shift
    const breathY = Math.sin(char.breathTimer * 0.03) * 1.5;
    
    // Determine walk cycle leg positions
    const walkCycle = Math.floor(char.walkFrame) % 4;
    
    for (let row = 0; row < CHAR_H; row++) {
      const line = frame[row];
      if (!line) continue;
      
      for (let col = 0; col < CHAR_W; col++) {
        let colorKey = line[col];
        if (!colorKey || colorKey === "0") continue;
        
        // Blink effect - replace eyes with skin during blink
        if (colorKey === "4" && char.isBlinking) {
          colorKey = "3";
        }
        
        const color = PALETTE[colorKey];
        if (!color || color === "transparent") continue;
        
        let px = offsetX + col * PIXEL_SIZE;
        let py = offsetY + row * PIXEL_SIZE + breathY;
        
        // Walking leg animation - modify leg rows
        if (char.isMoving && row >= 42 && row <= 47) {
          const legOffset = row >= 42 && row <= 47;
          if (legOffset) {
            const isLeftLeg = col < 16;
            const step = Math.sin(char.walkFrame * 0.3);
            if (isLeftLeg) {
              px += step * 3;
            } else {
              px -= step * 3;
            }
          }
        }
        
        // Flip horizontally if facing left
        if (char.facing === -1) {
          px = char.x + (char.x - px) - PIXEL_SIZE;
        }
        
        drawPixel(ctx, px, py, color);
      }
    }
    
    // Shadow under character
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(
      char.x,
      GROUND_Y + 4,
      CHAR_W * PIXEL_SIZE * 0.35,
      6,
      0, 0, Math.PI * 2
    );
    ctx.fill();
  }, [drawPixel]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const char = characterRef.current;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "#0a0a12");
    bgGrad.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw ground line
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 8);
    ctx.lineTo(canvas.width, GROUND_Y + 8);
    ctx.stroke();
    
    // Pixelated ground details
    for (let x = 0; x < canvas.width; x += 16) {
      if (Math.sin(x * 0.1) > 0.3) {
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fillRect(x, GROUND_Y + 8, 8, 4);
      }
    }
    
    // Movement - follow mouse X
    const dx = mouseRef.current.x - char.x;
    const speed = 3.5;
    const deadzone = 8;
    
    if (Math.abs(dx) > deadzone) {
      char.isMoving = true;
      char.facing = dx > 0 ? 1 : -1;
      const moveAmount = Math.sign(dx) * Math.min(speed, Math.abs(dx) * 0.08);
      char.x += moveAmount;
      char.walkFrame += 0.15;
      char.walkTimer++;
    } else {
      char.isMoving = false;
      char.walkFrame = 0;
    }
    
    // Keep in bounds
    const halfW = (CHAR_W * PIXEL_SIZE) / 2;
    char.x = Math.max(halfW + 10, Math.min(canvas.width - halfW - 10, char.x));
    
    // Jump physics
    if (keysRef.current.space && !char.isJumping) {
      char.isJumping = true;
      char.velocityY = -12;
    }
    
    if (char.isJumping) {
      char.velocityY += 0.6; // gravity
      char.y += char.velocityY;
      if (char.y >= GROUND_Y) {
        char.y = GROUND_Y;
        char.isJumping = false;
        char.velocityY = 0;
      }
    }
    
    // Breathing & idle
    char.breathTimer++;
    char.idleTimer++;
    
    // Blinking
    char.blinkTimer++;
    if (char.blinkTimer > 180 + Math.random() * 120) {
      char.isBlinking = true;
      if (char.blinkTimer > 185 + Math.random() * 10) {
        char.isBlinking = false;
        char.blinkTimer = 0;
      }
    }
    
    // Draw character
    drawCharacter(ctx, char);
    
    // Draw cursor indicator
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(mouseRef.current.x, GROUND_Y + 8);
    ctx.lineTo(mouseRef.current.x, GROUND_Y + 20);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Small triangle indicator
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(mouseRef.current.x - 4, GROUND_Y + 20);
    ctx.lineTo(mouseRef.current.x + 4, GROUND_Y + 20);
    ctx.lineTo(mouseRef.current.x, GROUND_Y + 14);
    ctx.fill();
    
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [drawCharacter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = CANVAS_W;
    canvas.height = 460;
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      mouseRef.current.x = (e.clientX - rect.left) * scaleX;
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };
    
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = true;
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        keysRef.current.space = false;
      }
    };
    
    const handleClick = () => {
      if (!characterRef.current.isJumping) {
        characterRef.current.isJumping = true;
        characterRef.current.velocityY = -11;
      }
    };
    
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    animFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameLoop]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      padding: "20px",
    }}>
      <div style={{
        marginBottom: "24px",
        textAlign: "center",
      }}>
        <h1 style={{
          color: "#fff",
          fontSize: "14px",
          fontWeight: 400,
          letterSpacing: "4px",
          textTransform: "uppercase",
          opacity: 0.4,
          margin: "0 0 8px 0",
        }}>
          PIXEL BOULE
        </h1>
        <p style={{
          color: "#fff",
          fontSize: "11px",
          opacity: 0.2,
          margin: 0,
        }}>
          32×48 • move cursor to walk • click or space to jump
        </p>
      </div>
      
      <div style={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "800px",
            maxWidth: "100%",
            height: "auto",
            imageRendering: "pixelated",
            cursor: "none",
          }}
        />
      </div>
      
      <div style={{
        marginTop: "20px",
        display: "flex",
        gap: "24px",
        alignItems: "center",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            background: PALETTE["2"],
            borderRadius: "2px",
          }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>cap</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            background: PALETTE["6"],
            borderRadius: "2px",
          }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>beard</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            background: PALETTE["8"],
            borderRadius: "2px",
          }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>shirt</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            background: PALETTE["A"],
            borderRadius: "2px",
          }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>pants</span>
        </div>
      </div>
    </div>
  );
}
