import SunCalc from 'suncalc';

export interface SunShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  opacity: number;
  color: string;
  isDay: boolean;
  azimuth: number;   // radians, SunCalc convention (0 = South, π/2 = West)
  altitude: number;  // radians, 0 = horizon, π/2 = zenith
}

export function computeSunShadow(lat: number, lng: number, date: Date): SunShadow {
  const pos = SunCalc.getPosition(date, lat, lng);
  const { altitude, azimuth } = pos;

  if (altitude <= 0) {
    return { offsetX: 0, offsetY: 0, blur: 0, opacity: 0, color: 'rgba(20,15,15,0)', isDay: false, azimuth: 0, altitude: 0 };
  }

  const halfPi = Math.PI / 2;
  const altNorm = altitude / halfPi;

  const length = 36 * (1 - altNorm);
  const offsetX = Math.sin(azimuth) * length;
  const offsetY = -Math.cos(azimuth) * length * 0.4;
  const blur = 3 + (1 - altNorm) * 14;
  const opacity = 0.08 + 0.32 * Math.sin(altNorm * Math.PI);

  // Warm tint at golden hour (altitude < 15° = π/12)
  const goldenThreshold = Math.PI / 12;
  const warmth = Math.min(1, Math.max(0, 1 - altitude / goldenThreshold));
  const r = Math.round(20 + warmth * 35);
  const g = Math.round(15 + warmth * 8);
  const b = 15;
  const color = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;

  return { offsetX, offsetY, blur, opacity, color, isDay: true, azimuth, altitude };
}
