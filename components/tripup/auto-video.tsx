"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import glass from "@/components/ui/GlassButton.module.css";
import styles from "./tripup.module.css";

/**
 * A muted clip that loops while it's on screen and pauses when it leaves.
 * Until it comes near the screen it's only its poster, so a page with twenty
 * clips doesn't fetch them all at once. With reduced motion it never plays by
 * itself: the poster stays, with controls to play it. An HEVC copy, when there
 * is one, is used wherever the browser can play it; elsewhere `src` is.
 *
 * With `player`, a bar along the bottom plays and pauses it, moves it back or
 * forward, turns the sound on and off and opens it full screen: with its
 * controls on a desktop, in the system player on an iPhone, and with the sound
 * on. None of them starts it over, and once it's paused by hand, scrolling
 * back to it doesn't start it again. The bar stays hidden until it's wanted:
 * while the mouse is over the video, while one of its controls has keyboard
 * focus, or for a moment after a tap on a touch screen. It sits above the
 * captions burned into the video, so it never covers one. With reduced motion
 * the bar is the only set of controls, not the browser's own on top of it.
 */

// Safari on iPhone can't put an element full screen, only a video, its way.
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const clock = (s: number) => {
  const whole = Math.max(0, Math.floor(s));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
};

export function AutoVideo({
  src: h264,
  hevcSrc,
  poster,
  label,
  style,
  player = false,
}: {
  src: string;
  hevcSrc?: string;
  poster?: string;
  label: string;
  style?: React.CSSProperties;
  player?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const pausedByHand = useRef(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // A touch screen has no hover: a tap wakes the bar for a while
  const [awake, setAwake] = useState(false);
  const sleepTimer = useRef<number | undefined>(undefined);
  const pick = (el: HTMLVideoElement) => (hevcSrc && el.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264);

  useEffect(() => () => window.clearTimeout(sleepTimer.current), []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const src = hevcSrc && video.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The bar follows the video, whatever changed it: its own controls in
    // full screen included. Those controls go again once it leaves full screen.
    const syncSound = () => setMuted(video.muted);
    const syncPlaying = () => setPlaying(!video.paused);
    const syncTime = () => setTime(video.currentTime);
    const syncDuration = () => setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    const leftFullscreen = () => {
      if (document.fullscreenElement !== video) video.controls = reduced && !player;
    };
    const leftIOSPlayer = () => {
      if (!pausedByHand.current) video.play().catch(() => {});
    };
    const events: [string, () => void][] = [
      ["volumechange", syncSound],
      ["play", syncPlaying],
      ["pause", syncPlaying],
      ["timeupdate", syncTime],
      ["durationchange", syncDuration],
      ["webkitendfullscreen", leftIOSPlayer],
    ];
    for (const [name, fn] of events) video.addEventListener(name, fn);
    document.addEventListener("fullscreenchange", leftFullscreen);
    const unlisten = () => {
      for (const [name, fn] of events) video.removeEventListener(name, fn);
      document.removeEventListener("fullscreenchange", leftFullscreen);
    };

    if (reduced) {
      video.controls = !player;
      video.preload = "metadata";
      video.src = src;
      return unlisten;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) video.src = src;
          if (!pausedByHand.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      unlisten();
    };
  }, [h264, hevcSrc, player]);

  // Shows the bar on a touch screen, and hides it again 2.5 s after the last touch.
  const wake = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;   // a mouse has hover (tripup.module.css)
    setAwake(true);
    window.clearTimeout(sleepTimer.current);
    sleepTimer.current = window.setTimeout(() => setAwake(false), 2500);
  };

  const video = (
    <video
      ref={ref}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      aria-label={label}
      style={style}
      onPointerDown={player ? wake : undefined}
    />
  );
  if (!player) return video;

  const ready = (el: HTMLVideoElement) => {
    if (!el.getAttribute("src")) el.src = pick(el);
  };

  const togglePlay = () => {
    const el = ref.current;
    if (!el) return;
    ready(el);
    if (el.paused) {
      pausedByHand.current = false;
      el.play().catch(() => {});
    } else {
      pausedByHand.current = true;
      el.pause();
    }
  };

  const seek = (to: number) => {
    const el = ref.current;
    if (el) el.currentTime = to;
  };

  // Sound on or off where the video is; it never starts over.
  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    ready(el);
    el.muted = !el.muted;
    if (!el.muted && el.paused && !pausedByHand.current) el.play().catch(() => {});
  };

  const openFullscreen = () => {
    const el: IOSVideo | null = ref.current;
    if (!el) return;
    ready(el);
    el.muted = false;
    pausedByHand.current = false;
    el.play().catch(() => {});
    if (el.requestFullscreen) {
      el.controls = true;
      el.requestFullscreen().catch(() => {
        el.controls = false;
      });
    } else {
      el.webkitEnterFullscreen?.();
    }
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <>
      {video}
      <div
        className={styles.videoBar}
        data-awake={awake ? "" : undefined}
        onPointerDown={wake}
        onPointerMove={wake}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className={`${glass.glassBtn} ${styles.videoButton}`}
        >
          {playing ? <Pause size={20} aria-hidden /> : <Play size={20} aria-hidden />}
        </button>
        <div className={styles.videoTrack}>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            disabled={!duration}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Position in the video"
            aria-valuetext={`${clock(time)} of ${clock(duration)}`}
            className={styles.videoSeek}
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
          />
          <span className={styles.videoTime} aria-hidden>
            {clock(time)} / {clock(duration)}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          aria-pressed={!muted}
          className={`${glass.glassBtn} ${styles.videoButton}`}
        >
          {muted ? <VolumeX size={20} aria-hidden /> : <Volume2 size={20} aria-hidden />}
        </button>
        <button
          type="button"
          onClick={openFullscreen}
          aria-label="Watch full screen"
          className={`${glass.glassBtn} ${styles.videoButton}`}
        >
          <Maximize2 size={20} aria-hidden />
        </button>
      </div>
    </>
  );
}
