import { CHARACTER } from "./constants";
import { clamp } from "./utils";

export interface CharacterState {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isWalking: boolean;
  direction: "left" | "right";
  walkFrame: number;
  breathTimer: number;
  blinkTimer: number;
  isBlinking: boolean;
}

export function createInitialState(canvasWidth: number): CharacterState {
  return {
    x: canvasWidth / 2,
    y: 0,
    velocityY: 0,
    isJumping: false,
    isWalking: false,
    direction: "right",
    walkFrame: 0,
    breathTimer: 0,
    blinkTimer: 0,
    isBlinking: false,
  };
}

/**
 * Update character position based on cursor X target.
 * Character moves linearly left/right only (like Mario).
 */
export function updateCharacter(
  state: CharacterState,
  targetX: number,
  canvasWidth: number
): CharacterState {
  const dx = targetX - state.x;
  const deadZone = 8;
  const halfW = (CHARACTER.SPRITE_COLS * CHARACTER.PIXEL_SIZE) / 2;
  let {
    x, y, velocityY, isJumping, isWalking, direction,
    walkFrame, breathTimer, blinkTimer, isBlinking,
  } = state;

  // Horizontal movement toward cursor (smooth easing like prototype)
  if (Math.abs(dx) > deadZone) {
    const moveAmount = Math.sign(dx) * Math.min(CHARACTER.SPEED, Math.abs(dx) * 0.08);
    x = clamp(x + moveAmount, halfW + 10, canvasWidth - halfW - 10);
    isWalking = true;
    direction = dx > 0 ? "right" : "left";
    walkFrame += 0.15;
  } else {
    isWalking = false;
    walkFrame = 0;
  }

  // Vertical: gravity and jump
  if (isJumping) {
    velocityY += CHARACTER.GRAVITY;
    y += velocityY;
    if (y >= 0) {
      y = 0;
      velocityY = 0;
      isJumping = false;
    }
  }

  // Breathing
  breathTimer++;

  // Blinking
  blinkTimer++;
  if (blinkTimer > 180 + Math.random() * 120) {
    isBlinking = true;
    if (blinkTimer > 185 + Math.random() * 10) {
      isBlinking = false;
      blinkTimer = 0;
    }
  }

  return {
    x, y, velocityY, isJumping, isWalking, direction,
    walkFrame, breathTimer, blinkTimer, isBlinking,
  };
}

/** Trigger a jump if the character is on the ground */
export function jump(state: CharacterState): CharacterState {
  if (state.isJumping) return state;
  return {
    ...state,
    isJumping: true,
    velocityY: CHARACTER.JUMP_VELOCITY,
  };
}

/**
 * Check if the character is within interaction range of a zone.
 * Returns the zone id if in range, null otherwise.
 */
export function checkInteractionZone(
  characterX: number,
  canvasWidth: number,
  zones: { id: string; x: number }[],
  threshold = 40
): string | null {
  for (const zone of zones) {
    const zonePixelX = (zone.x / 100) * canvasWidth;
    if (Math.abs(characterX - zonePixelX) < threshold) {
      return zone.id;
    }
  }
  return null;
}
