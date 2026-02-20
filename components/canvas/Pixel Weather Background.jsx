import { useState, useEffect, useRef } from "react";

// Each "pixel" in the cloud stamps is this many screen pixels
const PS = 4;
// Particle movement grid
const GRID = PS;

// ─── Cloud bitmap templates ──────────────────────────────────────────────────
// 0 = empty, 1 = base white, 2 = highlight (brighter), 3 = shadow (blue-grey)
// Multiple templates for variety

const CLOUD_TEMPLATES = [
  // Large puffy — 20×10
  [
    "00000011110000000000",
    "00001111111100000000",
    "00011111111111000000",
    "01111111111111100000",
    "11111111111111110000",
    "11111111111111111000",
    "33311111111111111100",
    "33333111111111111110",
    "03333311111111111110",
    "00333333333333333300",
  ],
  // Medium round — 16×8
  [
    "0000011110000000",
    "0001111111100000",
    "0111111111111000",
    "1111111111111100",
    "1111111111111110",
    "3311111111111110",
    "3333111111111100",
    "0333333333333000",
  ],
  // Wide flat — 22×7
  [
    "0000001111100000000000",
    "0001111111111110000000",
    "0111111111111111100000",
    "1111111111111111111000",
    "1111111111111111111100",
    "3333111111111111111100",
    "0333333333333333333300",
  ],
  // Small puff — 12×6
  [
    "000011110000",
    "001111111100",
    "011111111110",
    "111111111110",
    "331111111100",
    "033333333000",
  ],
  // Tall chunky — 14×9
  [
    "00001111100000",
    "00111111110000",
    "01111111111000",
    "11111111111100",
    "11111111111110",
    "11111111111110",
    "33111111111100",
    "33331111111000",
    "03333333330000",
  ],
];

// Colour palettes per weather state: [base, highlight, shadow]
const CLOUD_PALETTES = {
  clear_day:     [[255,255,255], [255,255,255], [188,210,228]],
  clear_night:   [[80, 95, 140], [100,115,160], [45, 55, 90]],
  partly_cloudy: [[248,252,255], [255,255,255], [185,208,228]],
  overcast:      [[195,205,215], [210,218,225], [145,160,175]],
  rain:          [[130,145,160], [150,162,175], [95, 108,122]],
  heavy_rain:    [[90, 100,115], [108,118,132], [60, 68, 82]],
  snow:          [[228,235,242], [242,246,250], [172,192,210]],
  fog:           [[200,212,220], [215,224,230], [155,170,182]],
  thunderstorm:  [[65, 72, 92],  [82, 90, 110], [38, 44, 60]],
};

// Pre-render a cloud template to an offscreen canvas at a given scale & palette
function makeCloudCanvas(templateIdx, palette, alpha) {
  const tmpl = CLOUD_TEMPLATES[templateIdx];
  const rows = tmpl.length;
  const cols = tmpl[0].length;
  const oc   = document.createElement("canvas");
  oc.width   = cols * PS;
  oc.height  = rows * PS;
  const ctx  = oc.getContext("2d");

  const [base, hi, sh] = palette;

  tmpl.forEach((row, ry) => {
    for (let cx = 0; cx < row.length; cx++) {
      const v = row[cx];
      if (v === "0") continue;
      let [r, g, b] = v === "2" ? hi : v === "3" ? sh : base;
      // slight inner highlight on top-left of base pixels
      if (v === "1") {
        const above = ry > 0 ? tmpl[ry - 1][cx] : "0";
        const left  = cx > 0 ? row[cx - 1]       : "0";
        if (above === "0" || left === "0") { [r,g,b] = hi; }
      }
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(cx * PS, ry * PS, PS, PS);
    }
  });
  return oc;
}

// Build a scene-worth of cloud descriptors (stable per state)
function buildClouds(state, W, H) {
  const cfg = CLOUD_CONFIGS[state];
  const palette = CLOUD_PALETTES[state];
  return Array.from({ length: cfg.count }, (_, i) => {
    const seed    = i * 137 + state.length * 31;
    const tmplIdx = seed % CLOUD_TEMPLATES.length;
    const tmpl    = CLOUD_TEMPLATES[tmplIdx];
    const cw      = tmpl[0].length * PS;
    const ch      = tmpl.length    * PS;
    const startX  = ((seed * 73) % (W + cw)) - cw;
    const y       = H * (0.02 + (seed % 7) * 0.07);
    const speed   = cfg.speed * (0.6 + (i % 4) * 0.2);
    const stamp   = makeCloudCanvas(tmplIdx, palette, cfg.opacity);
    return { x: startX, y, w: cw, h: ch, speed, stamp };
  });
}

const CLOUD_CONFIGS = {
  clear_day:     { count: 3, opacity: 0.82, speed: 8  },
  clear_night:   { count: 2, opacity: 0.65, speed: 4  },
  partly_cloudy: { count: 5, opacity: 0.85, speed: 11 },
  overcast:      { count: 8, opacity: 0.78, speed: 5  },
  rain:          { count: 6, opacity: 0.88, speed: 7  },
  heavy_rain:    { count: 7, opacity: 0.92, speed: 10 },
  snow:          { count: 5, opacity: 0.75, speed: 3  },
  fog:           { count: 4, opacity: 0.60, speed: 2  },
  thunderstorm:  { count: 8, opacity: 0.95, speed: 14 },
};

// ─── Main config ─────────────────────────────────────────────────────────────

const CONFIG = {
  clear_day:     { tint: null,                              sun: { x:0.15, y:0.13, r:18, color:"#FFE566", glowColor:"rgba(255,224,80,0.22)", rays:true  }, stars:null, moon:null, particles:null, fog:null, lightning:null },
  clear_night:   { tint:{color:"rgba(5,8,28,0.38)"},        sun:null, stars:{count:80}, moon:{x:0.78,y:0.13,r:14}, particles:null, fog:null, lightning:null },
  partly_cloudy: { tint: null,                              sun: { x:0.18, y:0.11, r:13, color:"#FFE066", glowColor:"rgba(255,220,80,0.16)", rays:false }, stars:null, moon:null, particles:null, fog:null, lightning:null },
  overcast:      { tint:{color:"rgba(100,118,138,0.22)"},   sun:null, stars:null, moon:null, particles:null, fog:null, lightning:null },
  rain:          { tint:{color:"rgba(50,70,98,0.28)"},      sun:null, stars:null, moon:null, particles:{type:"rain",  count:140, rgba:[70,100,140],  vx:-0.6, vy:4.5, alphaRange:[0.55,0.82], w:1, h:6}, fog:null, lightning:null },
  heavy_rain:    { tint:{color:"rgba(28,42,62,0.42)"},      sun:null, stars:null, moon:null, particles:{type:"rain",  count:240, rgba:[55, 85, 125],  vx:-1.2, vy:7,   alphaRange:[0.50,0.78], w:1, h:8}, fog:null, lightning:null },
  snow:          { tint:{color:"rgba(185,208,225,0.12)"},   sun:null, stars:null, moon:null, particles:{type:"snow",  count:110, rgba:[228,242,252], vx:0,    vy:0.9, alphaRange:[0.45,0.85], w:2, h:2}, fog:null, lightning:null },
  fog:           { tint:{color:"rgba(160,182,198,0.18)"},   sun:null, stars:null, moon:null, particles:null, fog:{layers:5, rgba:[195,212,222], baseAlpha:0.2}, lightning:null },
  thunderstorm:  { tint:{color:"rgba(15,22,40,0.52)"},      sun:null, stars:null, moon:null, particles:{type:"rain",  count:220, rgba:[80,105,135],  vx:-1.5, vy:8,   alphaRange:[0.22,0.48], w:1, h:9}, fog:null, lightning:{enabled:true} },
};

// ─── Rendering ───────────────────────────────────────────────────────────────

function render(ctx, W, H, state, t, clouds, particles, lightning) {
  ctx.clearRect(0, 0, W, H);
  const cfg = CONFIG[state];

  if (cfg.tint) {
    ctx.fillStyle = cfg.tint.color;
    ctx.fillRect(0, 0, W, H);
  }

  // Stars
  if (cfg.stars) {
    for (let i = 0; i < cfg.stars.count; i++) {
      const sx = Math.floor(((i * 139 + 17) % W)          / GRID) * GRID;
      const sy = Math.floor(((i * 103 + 11) % (H * 0.82)) / GRID) * GRID;
      const twinkle = Math.sin(t * 0.0014 + i * 0.72) > 0.45;
      ctx.globalAlpha = twinkle ? 0.92 : 0.38 + (i % 7) * 0.07;
      ctx.fillStyle   = "#E8E4CC";
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  // Moon
  if (cfg.moon) {
    const { x, y, r } = cfg.moon;
    const mx = W * x, my = H * y;
    const halo = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 2.6);
    halo.addColorStop(0, "rgba(220,215,180,0.16)");
    halo.addColorStop(1, "rgba(220,215,180,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(mx - r*3, my - r*3, r*6, r*6);
    ctx.beginPath(); ctx.arc(mx, my, r, 0, Math.PI*2);
    ctx.fillStyle = "#DDD9B8"; ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(mx + r*0.35, my, r*0.88, 0, Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.92)"; ctx.fill();
    ctx.restore();
  }

  // Sun
  if (cfg.sun) {
    const { x, y, r, color, glowColor, rays } = cfg.sun;
    const sx = W * x, sy = H * y;
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.8);
    glow.addColorStop(0, glowColor); glow.addColorStop(1, "rgba(255,220,80,0)");
    ctx.fillStyle = glow; ctx.fillRect(sx-r*4, sy-r*4, r*8, r*8);
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    if (rays) {
      for (let i = 0; i < 8; i++) {
        const angle = (i/8)*Math.PI*2 + t*0.00028;
        const d0 = r+6, d1 = r+13;
        for (let d = d0; d < d1; d += GRID) {
          const rx = Math.floor((sx+Math.cos(angle)*d)/GRID)*GRID;
          const ry = Math.floor((sy+Math.sin(angle)*d)/GRID)*GRID;
          ctx.globalAlpha = 0.55*(1-(d-d0)/(d1-d0));
          ctx.fillStyle = color;
          ctx.fillRect(rx, ry, PS, PS);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  // Clouds — draw pre-rendered stamps, position snapped to GRID
  clouds.forEach(cloud => {
    const qx = Math.floor(cloud.x / GRID) * GRID;
    const qy = Math.floor(cloud.y / GRID) * GRID;
    ctx.drawImage(cloud.stamp, qx, qy);
  });

  // Fog — static layered haze, no movement
  if (cfg.fog) {
    const [r, g, b] = cfg.fog.rgba;
    // Dense ground-level haze rising from bottom
    const bot = ctx.createLinearGradient(0, H * 0.55, 0, H);
    bot.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    bot.addColorStop(0.5, `rgba(${r},${g},${b},0.10)`);
    bot.addColorStop(1,   `rgba(${r},${g},${b},0.18)`);
    ctx.fillStyle = bot;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
    // Mid-level haze band
    const mid = ctx.createLinearGradient(0, H * 0.25, 0, H * 0.65);
    mid.addColorStop(0,   `rgba(${r},${g},${b},0)`);
    mid.addColorStop(0.5, `rgba(${r},${g},${b},0.07)`);
    mid.addColorStop(1,   `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = mid;
    ctx.fillRect(0, H * 0.25, W, H * 0.4);
    // Very faint upper veil
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.4);
    top.addColorStop(0, `rgba(${r},${g},${b},0.04)`);
    top.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, H * 0.4);
  }

  // Lightning
  if (cfg.lightning?.enabled && lightning.active) {
    ctx.save();
    ctx.strokeStyle = "rgba(232,234,160,0.9)";
    ctx.lineWidth   = 1.5;
    ctx.shadowColor = "#E8EAA0"; ctx.shadowBlur = 8;
    ctx.beginPath();
    let bx = lightning.x, by = H*0.04;
    ctx.moveTo(bx, by);
    while (by < H*0.72) {
      bx += (lightning.seed[Math.floor(by/12) % lightning.seed.length]-0.5)*18;
      bx  = Math.max(20, Math.min(W-20, bx));
      by += 12; ctx.lineTo(bx, by);
    }
    ctx.stroke(); ctx.restore();
    ctx.globalAlpha = lightning.opacity*0.14;
    ctx.fillStyle   = "rgba(220,225,100,1)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // Particles
  particles.forEach(p => {
    const qx = Math.floor(p.x/GRID)*GRID;
    const qy = Math.floor(p.y/GRID)*GRID;
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.fillRect(qx, qy, p.w, p.h);
  });
  ctx.globalAlpha = 1;
}

// ─── Particles ───────────────────────────────────────────────────────────────

function spawnParticles(state, W, H) {
  const c = CONFIG[state]?.particles;
  if (!c) return [];
  return Array.from({ length: c.count }, () => {
    const alpha = c.alphaRange[0] + Math.random()*(c.alphaRange[1]-c.alphaRange[0]);
    return {
      x: Math.random()*W, y: Math.random()*H,
      vx: c.vx+(Math.random()-0.5)*0.4,
      vy: c.vy*(0.7+Math.random()*0.6),
      alpha,
      color: `rgba(${c.rgba[0]},${c.rgba[1]},${c.rgba[2]},${alpha.toFixed(2)})`,
      w: c.w, h: c.h,
      drift: Math.random()*Math.PI*2,
      type: c.type,
    };
  });
}

function tickParticles(particles, W, H) {
  return particles.map(p => {
    let { x, y, vx, vy, drift, type } = p;
    if (type === "snow") { drift += 0.016; x += vx+Math.sin(drift)*0.38; } else { x += vx; }
    y += vy;
    if (y > H+12) { y = -10; x = Math.random()*W; }
    if (x < -10)  x = W+10;
    if (x > W+10) x = -10;
    return { ...p, x, y, drift };
  });
}

// ─── Demo backgrounds ────────────────────────────────────────────────────────

const DEMO_BGS = [
  { label: "Dark",  bg: "#0E1117" },
  { label: "Photo", bg: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800') center/cover" },
  { label: "Light", bg: "#E8EEF3" },
  { label: "Warm",  bg: "#1A1208" },
];

// ─── Component ───────────────────────────────────────────────────────────────

const STATES = [
  { id: "clear_day",     label: "Clear Day"     },
  { id: "clear_night",   label: "Clear Night"   },
  { id: "partly_cloudy", label: "Partly Cloudy" },
  { id: "overcast",      label: "Overcast"      },
  { id: "rain",          label: "Rain"          },
  { id: "heavy_rain",    label: "Heavy Rain"    },
  { id: "snow",          label: "Snow"          },
  { id: "fog",           label: "Fog"           },
  { id: "thunderstorm",  label: "Thunderstorm"  },
];

export default function PixelWeather() {
  const canvasRef    = useRef(null);
  const stateRef     = useRef("clear_day");
  const cloudsRef    = useRef([]);
  const particlesRef = useRef([]);
  const rafRef       = useRef(null);
  const ltRef        = useRef({ active:false, x:0, opacity:0, timer:80, seed:[] });

  const [activeState, setActiveState] = useState("clear_day");
  const [activeBg,    setActiveBg]    = useState(0);

  // Re-build clouds + particles when state changes
  useEffect(() => {
    stateRef.current = activeState;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    cloudsRef.current    = buildClouds(activeState, W, H);
    particlesRef.current = spawnParticles(activeState, W, H);
    ltRef.current        = { active:false, x:0, opacity:0, timer:60+Math.random()*120, seed:[] };
  }, [activeState]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    cloudsRef.current    = buildClouds(stateRef.current, W, H);
    particlesRef.current = spawnParticles(stateRef.current, W, H);

    const loop = (ts) => {
      // Scroll clouds
      cloudsRef.current = cloudsRef.current.map(c => {
        let x = c.x + c.speed * 0.01;
        if (x > W + c.w) x = -c.w;
        return { ...c, x };
      });

      particlesRef.current = tickParticles(particlesRef.current, W, H);

      const lt = ltRef.current;
      if (stateRef.current === "thunderstorm") {
        lt.timer--;
        if (lt.timer <= 0) {
          lt.active=true; lt.x=W*(0.15+Math.random()*0.7);
          lt.opacity=1; lt.timer=80+Math.random()*180;
          lt.seed=Array.from({length:80},()=>Math.random());
        }
        if (lt.active) { lt.opacity-=0.06; if(lt.opacity<=0){lt.active=false;lt.opacity=0;} }
      }

      render(canvas.getContext("2d"), W, H, stateRef.current, ts, cloudsRef.current, particlesRef.current, lt);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const btn = (active) => ({
    background: active ? "#1E2D3D" : "transparent",
    color:      active ? "#90BDD4" : "#3A4D5A",
    border:     active ? "1px solid #2E5570" : "1px solid #181E26",
    padding: "4px 11px", fontSize: "10px",
    fontFamily: "'Courier New', monospace",
    letterSpacing: "0.07em", cursor: "pointer",
    textTransform: "uppercase", transition: "all 0.12s",
  });

  return (
    <div style={{
      width:"100vw", height:"100vh", background:"#06080D",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Courier New', monospace", gap:"18px",
    }}>
      {/* Preview */}
      <div style={{
        position:"relative", width:640, height:360, overflow:"hidden",
        boxShadow:"0 0 0 1px #181E28, 0 24px 80px rgba(0,0,0,0.85)",
      }}>
        <div style={{
          position:"absolute", inset:0,
          background: DEMO_BGS[activeBg].bg,
          transition:"background 0.5s ease",
        }} />
        <canvas ref={canvasRef} width={640} height={360} style={{ position:"absolute", inset:0, display:"block" }} />
        <div style={{
          position:"absolute", bottom:10, right:10,
          background:"rgba(0,0,0,0.48)", backdropFilter:"blur(4px)",
          color:"#6A8898", fontSize:"9px", letterSpacing:"0.15em",
          padding:"3px 8px", textTransform:"uppercase",
          border:"1px solid rgba(255,255,255,0.05)",
        }}>
          {STATES.find(s => s.id === activeState)?.label}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:"28px", alignItems:"flex-start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          <div style={{ color:"#252C34", fontSize:"9px", letterSpacing:"0.15em" }}>WEATHER</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", maxWidth:"360px" }}>
            {STATES.map(ws => (
              <button key={ws.id} onClick={() => setActiveState(ws.id)} style={btn(activeState === ws.id)}>
                {ws.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          <div style={{ color:"#252C34", fontSize:"9px", letterSpacing:"0.15em" }}>BACKGROUND</div>
          <div style={{ display:"flex", gap:"4px" }}>
            {DEMO_BGS.map((b, i) => (
              <button key={i} onClick={() => setActiveBg(i)} style={btn(activeBg === i)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ color:"#161C22", fontSize:"9px", letterSpacing:"0.15em" }}>
        PIXEL ART CLOUDS · {PS}px GRID · TRANSPARENT OVERLAY
      </div>
    </div>
  );
}
