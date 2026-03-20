"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Spotify Web Playback SDK types ──────────────────────────────────────────

interface SpotifyArtist {
  name: string;
  uri: string;
}

interface SpotifySDKTrack {
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: Array<{ url: string; width: number; height: number }>;
  };
  uri: string;
}

interface SpotifyPlaybackState {
  paused: boolean;
  position: number; // ms
  duration: number; // ms
  track_window: {
    current_track: SpotifySDKTrack;
  };
}

interface SpotifyPlayerError {
  message: string;
}

interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(
    event: "player_state_changed",
    cb: (state: SpotifyPlaybackState | null) => void
  ): boolean;
  addListener(
    event: "ready" | "not_ready",
    cb: (data: { device_id: string }) => void
  ): boolean;
  addListener(
    event:
      | "initialization_error"
      | "authentication_error"
      | "account_error"
      | "playback_error",
    cb: (err: SpotifyPlayerError) => void
  ): boolean;
  removeListener(event: string): boolean;
  getCurrentState(): Promise<SpotifyPlaybackState | null>;
  pause(): Promise<void>;
  resume(): Promise<void>;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// ── Public types ─────────────────────────────────────────────────────────────

export interface SpotifyTrackInfo {
  name: string;
  artist: string;
  albumArt: string | null;
  uri: string;
}

export interface UseSpotifyReturn {
  currentTrack: SpotifyTrackInfo | null;
  isPlaying: boolean;
  progress: number; // 0–100
  duration: number; // seconds
  play: () => void;
  pause: () => void;
  isReady: boolean;
  error: string | null;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/spotify/playback-token");
    const data = (await res.json()) as { token: string | null };
    return data.token;
  } catch {
    return null;
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSpotify(): UseSpotifyReturn {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<SpotifyPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Snapshot of position at the last SDK state event, used for interpolation
  const lastStateRef = useRef<{
    position: number;
    timestamp: number;
    paused: boolean;
  }>({ position: 0, timestamp: 0, paused: true });

  const startProgressInterval = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      const { position, timestamp, paused } = lastStateRef.current;
      if (!paused) {
        setPositionMs(position + (Date.now() - timestamp));
      }
    }, 500);
  }, []);

  const stopProgressInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStateChange = useCallback(
    (state: SpotifyPlaybackState | null) => {
      if (!state) {
        setIsPlaying(false);
        stopProgressInterval();
        return;
      }

      const sdkTrack = state.track_window.current_track;
      setCurrentTrack({
        name: sdkTrack.name,
        artist: sdkTrack.artists.map((a) => a.name).join(", "),
        albumArt: sdkTrack.album.images[0]?.url ?? null,
        uri: sdkTrack.uri,
      });
      setDurationMs(state.duration);
      setPositionMs(state.position);
      setIsPlaying(!state.paused);

      lastStateRef.current = {
        position: state.position,
        timestamp: Date.now(),
        paused: state.paused,
      };

      if (!state.paused) {
        startProgressInterval();
      } else {
        stopProgressInterval();
      }
    },
    [startProgressInterval, stopProgressInterval]
  );

  const initPlayer = useCallback(async () => {
    const token = await fetchToken();
    if (!token) {
      setError("Spotify not configured — add env vars and re-auth with streaming scope.");
      return;
    }

    const player = new window.Spotify.Player({
      name: "Bogste's Turntable",
      getOAuthToken: (cb) => {
        fetchToken().then((fresh) => {
          if (fresh) cb(fresh);
        });
      },
      volume: 0.8,
    });

    player.addListener("ready", () => {
      setIsReady(true);
    });

    player.addListener("not_ready", () => {
      setIsReady(false);
    });

    player.addListener("initialization_error", ({ message }) => {
      setError(`Init: ${message}`);
    });

    player.addListener("authentication_error", ({ message }) => {
      setError(`Auth: ${message} — re-run /api/spotify/auth to get a token with streaming scope.`);
    });

    player.addListener("account_error", ({ message }) => {
      setError(`Account: ${message} — Spotify Premium required for Web Playback SDK.`);
    });

    player.addListener("player_state_changed", handleStateChange);

    await player.connect();
    playerRef.current = player;
  }, [handleStateChange]);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      initPlayer();
    };

    if (!document.getElementById("spotify-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.Spotify) {
      // initPlayer is async — setState calls happen in callbacks, not synchronously
      // eslint-disable-next-line react-hooks/set-state-in-effect
      initPlayer();
    }

    return () => {
      stopProgressInterval();
      playerRef.current?.disconnect();
    };
  }, [initPlayer, stopProgressInterval]);

  const play = useCallback(() => {
    playerRef.current?.resume().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause().catch(() => {});
  }, []);

  const progress = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;
  const duration = durationMs / 1000;

  return { currentTrack, isPlaying, progress, duration, play, pause, isReady, error };
}
