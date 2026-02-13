/** Figma reference canvas dimensions */
const FIGMA_W = 1440;
const FIGMA_H = 1024;

/** Convert a Figma X coordinate to a viewport-relative percentage */
export function figmaX(px: number): number {
  return (px / FIGMA_W) * 100;
}

/** Convert a Figma Y coordinate to a viewport-relative percentage */
export function figmaY(px: number): number {
  return (px / FIGMA_H) * 100;
}

/** Convert a Figma width to a viewport-relative percentage */
export function figmaW(px: number): number {
  return (px / FIGMA_W) * 100;
}

/** Convert a Figma height to a viewport-relative percentage */
export function figmaH(px: number): number {
  return (px / FIGMA_H) * 100;
}
