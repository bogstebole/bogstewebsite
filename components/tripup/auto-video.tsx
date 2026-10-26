"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, Volume2, VolumeX } from "lucide-react";
import glass from "@/components/ui/GlassButton.module.css";
import styles from "./tripup.module.css";

/**
 * A muted clip that loops while it's on screen and pauses when it leaves.
 * Until it comes near the screen it's only its poster, so a page with twenty
 * clips doesn't fetch them all at once. With reduced motion it never plays by
 * itself: the poster stays, with controls to play it. An HEVC copy, when there
 * is one, is used wherever the browser can play it; elsewhere `src` is.
 * With `sound`, buttons in the corner turn the sound on and off and open the
 * video full screen: with its controls on a desktop, in the system player on
 * an iPhone, and with the sound on. Neither starts it over.
 */

// Safari on iPhone can't put an element full screen, only a video, its way.
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
export function AutoVideo({
  src: h264,
  hevcSrc,
  poster,
  label,
  style,
  sound = false,
}: {
  src: string;
  hevcSrc?: string;
  poster?: string;
  label: string;
  style?: React.CSSProperties;
  sound?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const pick = (el: HTMLVideoElement) => (hevcSrc && el.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const src = hevcSrc && video.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The buttons follow the video: sound changed in its own controls, and
    // its controls gone again once it leaves full screen.
    const syncSound = () => setMuted(video.muted);
    const leftFullscreen = () => {
      if (document.fullscreenElement !== video) video.controls = reduced;
    };
    const leftIOSPlayer = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("volumechange", syncSound);
    document.addEventListener("fullscreenchange", leftFullscreen);
    video.addEventListener("webkitendfullscreen", leftIOSPlayer);
    const unlisten = () => {
      video.removeEventListener("volumechange", syncSound);
      document.removeEventListener("fullscreenchange", leftFullscreen);
      video.removeEventListener("webkitendfullscreen", leftIOSPlayer);
    };

    if (reduced) {
      video.controls = true;
      video.preload = "metadata";
      video.src = src;
      return unlisten;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) video.src = src;
          video.play().catch(() => {});
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
  }, [h264, hevcSrc]);

  const video = <video ref={ref} poster={poster} loop muted playsInline preload="none" aria-label={label} style={style} />;
  if (!sound) return video;

  // Sound on or off where the video is; it never starts over.
  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    if (el.muted) {
      if (!el.getAttribute("src")) el.src = pick(el);
      el.muted = false;
      el.play().catch(() => {});
    } else {
      el.muted = true;
    }
    setMuted(el.muted);
  };

  const openFullscreen = () => {
    const el: IOSVideo | null = ref.current;
    if (!el) return;
    if (!el.getAttribute("src")) el.src = pick(el);
    el.muted = false;
    setMuted(false);
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

  return (
    <>
      {video}
      <div className={styles.videoButtons}>
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
