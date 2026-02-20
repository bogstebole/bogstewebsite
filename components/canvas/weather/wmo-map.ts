export type WeatherState =
  | "clear_day"
  | "clear_night"
  | "partly_cloudy"
  | "overcast"
  | "rain"
  | "heavy_rain"
  | "snow"
  | "fog"
  | "thunderstorm";

/**
 * Maps a WMO weather interpretation code + is_day flag to one of the 9 canvas states.
 * WMO codes: https://open-meteo.com/en/docs#weathervariables
 */
export function mapWMOToState(code: number, isDay: boolean): WeatherState {
  // Clear
  if (code === 0 || code === 1) return isDay ? "clear_day" : "clear_night";
  // Partly cloudy
  if (code === 2) return "partly_cloudy";
  // Overcast
  if (code === 3) return "overcast";
  // Fog
  if (code === 45 || code === 48) return "fog";
  // Light drizzle / light rain / light showers → rain
  if (
    code === 51 || code === 53 ||
    code === 56 ||
    code === 61 || code === 63 ||
    code === 66 ||
    code === 80 || code === 81
  ) return "rain";
  // Dense drizzle / heavy rain / violent showers / freezing heavy → heavy_rain
  if (
    code === 55 || code === 57 ||
    code === 65 || code === 67 ||
    code === 82
  ) return "heavy_rain";
  // Snow
  if (
    code === 71 || code === 73 || code === 75 ||
    code === 77 ||
    code === 85 || code === 86
  ) return "snow";
  // Thunderstorm
  if (code === 95 || code === 96 || code === 99) return "thunderstorm";

  // Fallback — use time of day
  return isDay ? "clear_day" : "clear_night";
}
