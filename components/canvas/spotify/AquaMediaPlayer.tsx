"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SpotifyTrack } from "./useSpotifyRecent";

interface AquaMediaPlayerProps {
  track: SpotifyTrack;
  onClose: () => void;
}

const PREVIEW_DURATION = 30; // seconds

export function AquaMediaPlayer({ track, onClose }: AquaMediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!track.previewUrl) return;

    const audio = new Audio(track.previewUrl);
    audioRef.current = audio;

    function onTimeUpdate() {
      if (audio.currentTime >= PREVIEW_DURATION) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        return;
      }
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / PREVIEW_DURATION) * 100);
    }

    function onEnded() {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, [track.previewUrl]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function handleClose() {
    audioRef.current?.pause();
    onClose();
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="pointer-events-auto select-none"
      style={{
        position: "fixed",
        bottom: 28,
        left: 364,
        width: 280,
        borderRadius: 16,
        background: "linear-gradient(180deg, #e8e8ea 0%, #d4d4d8 30%, #c8c8cc 100%)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
        overflow: "hidden",
        fontFamily: `"SF Mono", "SFMono-Regular", monospace`,
        zIndex: 50,
      }}
    >
      {/* Glossy highlight layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 100%)",
          borderRadius: "16px 16px 0 0",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", padding: 16 }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #ff6b6b, #cc2222)",
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "rgba(0,0,0,0.6)",
            fontWeight: "bold",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Album art + track info */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {track.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumArt}
              alt="Album art"
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                objectFit: "cover",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                background: "linear-gradient(135deg, #aaa, #888)",
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#1a1a1a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: 2,
                fontFamily: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`,
              }}
            >
              {track.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#555",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`,
              }}
            >
              {track.artist}
            </div>
          </div>
        </div>

        {/* Play/pause + time */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
        >
          <button
            onClick={togglePlay}
            disabled={!track.previewUrl}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: track.previewUrl
                ? "radial-gradient(circle at 40% 35%, #5a9eff, #0055cc)"
                : "radial-gradient(circle at 40% 35%, #aaa, #888)",
              border: "1px solid rgba(0,0,0,0.2)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.3)",
              cursor: track.previewUrl ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <rect x="2" y="1" width="3" height="10" rx="1" />
                <rect x="7" y="1" width="3" height="10" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <path d="M3 1.5L10.5 6 3 10.5z" />
              </svg>
            )}
          </button>
          <span style={{ fontSize: 9, color: "#555", letterSpacing: "0.04em" }}>
            {formatTime(currentTime)} / {formatTime(PREVIEW_DURATION)}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: "rgba(0,0,0,0.15)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #2a8cff, #0055cc)",
              borderRadius: 2,
              transition: "width 0.1s linear",
            }}
          />
        </div>

        {!track.previewUrl && (
          <div
            style={{
              marginTop: 8,
              fontSize: 9,
              color: "#888",
              textAlign: "center",
              fontFamily: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`,
            }}
          >
            No preview available
          </div>
        )}
      </div>
    </motion.div>
  );
}
