"use client";

import { useState, useEffect } from "react";

export interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt: string | null;
  previewUrl: string | null;
  trackUrl: string;
}

interface CachedResult {
  track: SpotifyTrack | null;
  timestamp: number;
}

const CACHE_KEY = "spotify-recent";
const CACHE_TTL = 60_000; // 60 seconds, matching server cache

export function useSpotifyRecent() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      // Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as CachedResult;
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            setTrack(parsed.track);
            setLoading(false);
            return;
          }
        }
      } catch {
        // sessionStorage may be unavailable — continue to fetch
      }

      try {
        const res = await fetch("/api/spotify/recently-played");
        const data = (await res.json()) as { track: SpotifyTrack | null };
        setTrack(data.track);
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ track: data.track, timestamp: Date.now() })
        );
      } catch {
        setTrack(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRecent();
  }, []);

  return { track, loading };
}
