"use client";

import { useEffect, useRef, useState } from 'react';
import { computeSunShadow, SunShadow } from '@/lib/sun-shadow';

const DEFAULT_LAT = 44.787;
const DEFAULT_LNG = 20.457;

export function useSunShadow(dateOverride?: Date): SunShadow {
  const coordsRef = useRef({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
  const [shadow, setShadow] = useState<SunShadow>(() =>
    computeSunShadow(DEFAULT_LAT, DEFAULT_LNG, dateOverride ?? new Date())
  );

  // Recompute immediately when dateOverride changes
  useEffect(() => {
    if (dateOverride !== undefined) {
      const { lat, lng } = coordsRef.current;
      setShadow(computeSunShadow(lat, lng, dateOverride));
    }
  }, [dateOverride]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        coordsRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setShadow(computeSunShadow(coordsRef.current.lat, coordsRef.current.lng, dateOverride ?? new Date()));
      },
      () => { /* stay at default */ }
    );

    // Only auto-update every minute when not in override mode
    if (dateOverride !== undefined) return;
    const interval = setInterval(() => {
      const { lat, lng } = coordsRef.current;
      setShadow(computeSunShadow(lat, lng, new Date()));
    }, 60_000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return shadow;
}
