export const SITE_METADATA = {
  title: "Boule's Portfolio",
  description:
    "An interactive portfolio that challenges design conformity — pixel art meets high-end shaders meets retro game aesthetics.",
  url: "https://bogste.com",
} as const;

/** Canvas / viewport dimensions for the game canvas */
export const CANVAS = {
  /** Ground line Y position as percentage from top (Figma: y=864 of 1024) */
  GROUND_Y: 84.4,
} as const;

/** Pixel character constants (matches 32x48 sprite from prototype) */
export const CHARACTER = {
  /** Walking speed (max px per frame) */
  SPEED: 3.5,
  /** Sprite grid dimensions */
  SPRITE_COLS: 32,
  SPRITE_ROWS: 48,
  /** Size of each pixel in the sprite */
  PIXEL_SIZE: 4,
  /** Jump velocity */
  JUMP_VELOCITY: -12,
  /** Gravity acceleration */
  GRAVITY: 0.6,
} as const;

/** Figma-derived element positions (x, y in Figma pixels on 1440x1024 canvas) */
export const FIGMA_POSITIONS = {
  /** Cloud group positions (top of canvas) */
  clouds: [
    { x: 170, y: 36 },
    { x: 520, y: 48 },
    { x: 880, y: 40 },
    { x: 1200, y: 55 },
  ],
  /** Character ground shadow */
  characterShadow: { x: 657, y: 864 },
  /** Portal ground shadow */
  portalShadow: { x: 1266, y: 864 },
  /** Portal position — on the ground line */
  portal: { x: 1200, y: 790 },
  /** Project icons cluster — scattered, free-form, slightly overlapping */
  projects: {
    weather: { x: 824, y: 333, size: 48 },
    zouns: { x: 900, y: 340, size: 48 },
    uselessNote: { x: 880, y: 356, size: 48 },
    scanspend: { x: 944, y: 350, size: 48 },
    label: { x: 860, y: 415 },
  },
  /** Work cluster */
  work: {
    contentSnare: { x: 300, y: 420, size: 55 },
    fynnio: { x: 281, y: 475, size: 48 },
    label: { x: 280, y: 510 },
  },
  /** Header */
  header: {
    logo: { x: 400, y: 32 },
    clock: { x: 900, y: 38 },
    toggle: { x: 1010, y: 26 },
  },
} as const;

/** Interactive element zone definitions — positions along the ground line */
export const INTERACTION_ZONES: InteractionZone[] = [
  {
    id: "portal",
    type: "door",
    x: 87.9,
    label: "Portal",
  },
  {
    id: "projects-cluster",
    type: "block",
    x: 61.4,
    label: "Projects",
  },
  {
    id: "work-cluster",
    type: "door",
    x: 23.2,
    label: "Work",
  },
];

export interface InteractionZone {
  id: string;
  type: "door" | "block";
  /** X position as percentage of canvas width */
  x: number;
  label: string;
}
