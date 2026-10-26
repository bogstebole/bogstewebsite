"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import glass from "@/components/ui/GlassButton.module.css";
import styles from "./tripup.module.css";

/**
 * A muted clip that loops while it's on screen and pauses when it leaves.
 * Until it comes near the screen it's only its poster, so a page with twenty
 * clips doesn't fetch them all at once. With reduced motion it never plays by
 * itself: the poster stays, with controls to play it. An HEVC copy, when there
 * is one, is used wherever the browser can play it; elsewhere `src` is.
 * With `sound`, a button in the corner turns the sound on and off.
 */
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

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    const src = hevcSrc && video.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      video.preload = "metadata";
      video.src = src;
      return;
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
    return () => observer.disconnect();
  }, [h264, hevcSrc]);

  const video = <video ref={ref} poster={poster} loop muted playsInline preload="none" aria-label={label} style={style} />;
  if (!sound) return video;

  // Sound on or off where the video is; it never starts over.
  const toggleSound = () => {
    const el = ref.current;
    if (!el) return;
    if (el.muted) {
      if (!el.getAttribute("src")) el.src = hevcSrc && el.canPlayType('video/mp4; codecs="hvc1"') ? hevcSrc : h264;
      el.muted = false;
      el.play().catch(() => {});
    } else {
      el.muted = true;
    }
    setMuted(el.muted);
  };

  return (
    <>
      {video}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!muted}
        className={`${glass.glassBtn} ${styles.soundButton}`}
      >
        {muted ? <VolumeX size={20} aria-hidden /> : <Volume2 size={20} aria-hidden />}
      </button>
    </>
  );
}
