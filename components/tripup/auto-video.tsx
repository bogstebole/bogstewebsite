"use client";

import { useEffect, useRef } from "react";

/**
 * A muted clip that loops while it's on screen and pauses when it leaves.
 * Until it comes near the screen it's only its poster, so a page with twenty
 * clips doesn't fetch them all at once. With reduced motion it never plays by
 * itself: the poster stays, with controls to play it. An HEVC copy, when there
 * is one, is used wherever the browser can play it; elsewhere `src` is.
 */
export function AutoVideo({
  src: h264,
  hevcSrc,
  poster,
  label,
  style,
}: {
  src: string;
  hevcSrc?: string;
  poster?: string;
  label: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

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

  return <video ref={ref} poster={poster} loop muted playsInline preload="none" aria-label={label} style={style} />;
}
