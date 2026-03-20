"use client";

import { useState } from "react";
import { useSpotify } from "./useSpotify";
import styles from "./turntable.module.css";

const SPEEDS = {
  "33": { duration: "2s",    label: "33\u2153 RPM" },
  "45": { duration: "1.33s", label: "45 RPM" },
  "78": { duration: "0.77s", label: "78 RPM" },
} as const;

type Speed = keyof typeof SPEEDS;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VintageTurntable() {
  const [speed, setSpeed] = useState<Speed>("33");
  const { currentTrack, isPlaying, progress, duration, play, pause } = useSpotify();

  // Stable dust particles — lazy state initializer runs once, avoids re-render impurity
  const [dustParticles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 120 + Math.random() * 200,
      top:  80  + Math.random() * 200,
      duration: `${(3 + Math.random() * 4).toFixed(2)}s`,
      delay:    `${(Math.random() * 5).toFixed(2)}s`,
    }))
  );

  // ── VFD display values ──────────────────────────────────────────────────
  const elapsed = (progress / 100) * duration; // seconds

  const vfdTrackNum = currentTrack ? "SPOTIFY" : "TRK — —";
  const vfdTime     = formatTime(elapsed);

  let vfdTitleText: string;
  if (!currentTrack) {
    vfdTitleText = "\u2014 \u2014 \u2014\u00a0\u00a0INSERT RECORD\u00a0\u00a0\u2014 \u2014 \u2014";
  } else if (!isPlaying) {
    vfdTitleText = "\u2014 \u2014 \u2014\u00a0\u00a0PAUSED\u00a0\u00a0\u2014 \u2014 \u2014";
  } else {
    vfdTitleText = `${currentTrack.artist.toUpperCase()}  \u00b7  ${currentTrack.name.toUpperCase()}`;
  }

  const titleClass = [
    styles.vfdTitle,
    isPlaying && currentTrack ? styles.scrolling : "",
    !isPlaying && currentTrack ? styles.blinking : "",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Record spin duration driven by speed selector ───────────────────────
  const spinStyle = { "--spin-duration": SPEEDS[speed].duration } as React.CSSProperties;

  return (
    <div className={styles.plinth}>
      {/* Gloss overlay */}
      <div className={styles.plinthGloss} />

      {/* Corner screws */}
      <div className={`${styles.screw} ${styles.screwTl}`} />
      <div className={`${styles.screw} ${styles.screwTr}`} />
      <div className={`${styles.screw} ${styles.screwBl}`} />
      <div className={`${styles.screw} ${styles.screwBr}`} />

      {/* ── Platter + Record ────────────────────────────────────────────── */}
      <div className={styles.platterWrap}>
        <div className={styles.platter}>
          <div
            className={`${styles.record} ${isPlaying ? styles.playing : ""}`}
            style={spinStyle}
          >
            <div className={styles.recordVinyl} />
            <div className={styles.recordLabel}>
              <div className={styles.labelBrand}>Velvet</div>
              <div className={styles.labelTitle}>
                Side A<br />33⅓
              </div>
              <div className={styles.labelHole} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tonearm ─────────────────────────────────────────────────────── */}
      <div className={styles.tonearmBase} />
      <div className={`${styles.tonearm} ${isPlaying ? styles.overRecord : ""}`}>
        <div className={styles.tonearmBody} />
        <div className={styles.headshell}>
          <div className={styles.stylus} />
        </div>
      </div>

      {/* ── Unified Control Panel ────────────────────────────────────────── */}
      <div className={styles.controlPanel}>

        {/* VFD display */}
        <div className={styles.vfdRow}>
          <div className={styles.vfdScreen}>
            <div className={styles.vfdTopRow}>
              <div className={styles.vfdTrackNum}>{vfdTrackNum}</div>
              <div className={styles.vfdTime}>{vfdTime}</div>
            </div>

            <div className={styles.vfdTitleWrap}>
              <div className={titleClass}>{vfdTitleText}</div>
            </div>

            <div className={styles.vfdBottomRow}>
              <div className={styles.vfdProgressWrap}>
                <div
                  className={styles.vfdProgressBar}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className={styles.vfdRpmLabel}>{SPEEDS[speed].label}</div>
            </div>
          </div>
        </div>

        <div className={styles.panelRowDivider} />

        {/* Transport | Speed | Status */}
        <div className={styles.controlsRow}>

          {/* Transport */}
          <div className={styles.transportSection}>
            <span className={styles.sectionLabel}>Transport</span>
            <div className={styles.transportButtons}>
              <button className={styles.btnPause} onClick={pause} aria-label="Pause">
                <svg width="13" height="13" viewBox="0 0 13 13">
                  <rect x="2" y="1" width="3" height="11" rx="1" fill="rgba(200,160,50,0.7)" />
                  <rect x="8" y="1" width="3" height="11" rx="1" fill="rgba(200,160,50,0.7)" />
                </svg>
              </button>
              <button className={styles.btnPlay} onClick={play} aria-label="Play">
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <polygon
                    points="3,2 14,8 3,14"
                    fill="#3a2804"
                    stroke="rgba(255,220,80,0.4)"
                    strokeWidth="0.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.panelDivider} />

          {/* Speed */}
          <div className={styles.speedSection}>
            <span className={styles.sectionLabel}>Speed</span>
            <div className={styles.speedButtons}>
              {(["33", "45", "78"] as Speed[]).map((s) => (
                <button
                  key={s}
                  className={`${styles.speedBtn} ${speed === s ? styles.active : ""}`}
                  onClick={() => setSpeed(s)}
                >
                  {s === "33" ? "33\u2153" : s}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panelDivider} />

          {/* Status */}
          <div className={styles.statusSection}>
            <span className={styles.sectionLabel}>Status</span>
            <div className={styles.ledGroup}>
              <div className={styles.ledRow}>
                <div className={`${styles.ledDot} ${styles.red}`} />
                <div className={styles.ledLabel}>Power</div>
              </div>
              <div className={styles.ledRow}>
                <div
                  className={`${styles.ledDot} ${styles.green} ${isPlaying ? styles.on : ""}`}
                />
                <div className={styles.ledLabel}>Playing</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dust particles */}
      {dustParticles.map((d) => (
        <div
          key={d.id}
          className={styles.dust}
          style={{
            left: d.left,
            top: d.top,
            "--anim-duration": d.duration,
            "--anim-delay": d.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
