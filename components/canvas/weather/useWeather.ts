"use client";

import { useState, useEffect } from "react";
import { mapWMOToState, type WeatherState } from "./wmo-map";

// Belgrade coordinates — always show the owner's city regardless of visitor location
const LAT = 44.8176;
const LNG = 20.4633;

const API_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LNG}` +
  `&current=temperature_2m,weather_code,is_day` +
  `&timezone=Europe%2FBelgrade`;

const CACHE_KEY = "bgste_weather_v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export interface WeatherData {
  condition: WeatherState;
  tempC: number;
  isDay: boolean;
  loading: boolean;
}

function timeBasedDefault(): WeatherState {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 20 ? "clear_day" : "clear_night";
}

interface CacheEntry {
  data: Omit<WeatherData, "loading">;
  timestamp: number;
}

export function useWeather(): WeatherData {
  const [state, setState] = useState<WeatherData>({
    condition: timeBasedDefault(),
    tempC: 0,
    isDay: new Date().getHours() >= 6 && new Date().getHours() < 20,
    loading: true,
  });

  useEffect(() => {
    // Try cache first
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const entry: CacheEntry = JSON.parse(raw);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setState({ ...entry.data, loading: false });
          return;
        }
      }
    } catch {
      // Ignore malformed cache
    }

    // Fetch live data
    fetch(API_URL)
      .then((r) => r.json())
      .then((json) => {
        const { temperature_2m, weather_code, is_day } = json.current as {
          temperature_2m: number;
          weather_code: number;
          is_day: number;
        };
        const isDay = is_day === 1;
        const result: Omit<WeatherData, "loading"> = {
          condition: mapWMOToState(weather_code, isDay),
          tempC: Math.round(temperature_2m),
          isDay,
        };
        setState({ ...result, loading: false });
        try {
          const entry: CacheEntry = { data: result, timestamp: Date.now() };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        } catch {
          // sessionStorage unavailable — no-op
        }
      })
      .catch(() => {
        // Silently fall back to time-based default, just clear loading
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return state;
}
