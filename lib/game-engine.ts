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
  warpState: "idle" | "shivering" | "warping_in" | "warped" | "warping_out" | "headbutt_sprint" | "headbutt_jump" | "headbutt_falling";
  warpTimer: number;
  /** Y offset the character needs to reach for headbutt (negative = upward) */
  headbuttTargetY?: number;
  /** Target X position for sprint phase */
  sprintTargetX?: number;
  /** Current sprint speed (px/frame) */
  sprintSpeed?: number;
  /** Computed gravity for headbutt jump/fall (varies by height) */
  headbuttGravity?: number;
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
    warpState: "idle",
    warpTimer: 0,
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
    warpState, warpTimer,
  } = state;

  // Handle warping states - lock movement
  if (warpState !== "idle") {
    warpTimer++;

    if (warpState === "shivering") {
      // Chromatic aberration shiver — auto-transition to warping_in
      if (warpTimer >= CHARACTER.SHIVER_DURATION) {
        warpState = "warping_in";
        warpTimer = 0;
      }
    } else if (warpState === "warping_in") {
      // warping_in stays active — GameCanvas decides when to transition
      // via onAllConsumed callback from the particle system.
      // Safety cap to prevent infinite warp:
      if (warpTimer >= CHARACTER.WARP_MAX_DURATION) {
        warpState = "warped";
        warpTimer = 0;
      }
    } else if (warpState === "warping_out") {
      // warping_out stays active — GameCanvas decides when to transition
      // via onAllConsumed callback from the particle system (integration complete).
      // Safety cap:
      if (warpTimer >= CHARACTER.WARP_MAX_DURATION) {
        warpState = "idle";
        warpTimer = 0;
      }
    } else if (warpState === "headbutt_sprint") {
      // Sprint to directly below the icon, then jump straight up
      const sprintTarget = state.sprintTargetX ?? x;
      const sprintDx = sprintTarget - x;
      const sprintDir = Math.sign(sprintDx);
      const currentSpeed = state.sprintSpeed ?? CHARACTER.SPEED;
      const newSpeed = Math.min(currentSpeed + CHARACTER.SPRINT_ACCEL, CHARACTER.SPRINT_MAX_SPEED);

      // Snap to target if we'd overshoot this frame
      if (Math.abs(sprintDx) <= newSpeed) {
        x = sprintTarget;
        const targetY = state.headbuttTargetY ?? -100;
        const apexFrames = CHARACTER.HEADBUTT_APEX_FRAMES;
        // Dynamic gravity: guarantees reaching targetY in exactly apexFrames
        const hbGravity = (2 * Math.abs(targetY)) / (apexFrames * apexFrames);
        const jumpVel = -hbGravity * apexFrames;
        return {
          x, y: 0, velocityY: jumpVel, isJumping: true, isWalking: false,
          direction: sprintDir >= 0 ? "right" : "left",
          walkFrame, breathTimer: breathTimer + 1, blinkTimer, isBlinking,
          warpState: "headbutt_jump", warpTimer: 0,
          headbuttTargetY: state.headbuttTargetY,
          sprintTargetX: state.sprintTargetX,
          sprintSpeed: newSpeed,
          headbuttGravity: hbGravity,
        };
      }

      x += sprintDir * newSpeed;
      direction = sprintDir > 0 ? "right" : "left";
      walkFrame += CHARACTER.SPRINT_WALK_RATE;
      isWalking = true;

      // Safety cap
      if (warpTimer >= CHARACTER.HEADBUTT_DURATION) {
        return {
          x, y: 0, velocityY: 0, isJumping: false, isWalking: false, direction,
          walkFrame, breathTimer, blinkTimer, isBlinking,
          warpState: "idle", warpTimer: 0,
        };
      }

      return {
        x, y: 0, velocityY: 0, isJumping: false, isWalking: true, direction,
        walkFrame, breathTimer: breathTimer + 1, blinkTimer, isBlinking,
        warpState, warpTimer,
        headbuttTargetY: state.headbuttTargetY,
        sprintTargetX: state.sprintTargetX,
        sprintSpeed: newSpeed,
      };
    } else if (warpState === "headbutt_jump") {
      // Straight up — no horizontal movement, dynamic headbutt gravity
      const hbGrav = state.headbuttGravity ?? CHARACTER.GRAVITY;
      velocityY += hbGrav;
      y += velocityY;

      // Safety cap
      if (warpTimer >= CHARACTER.HEADBUTT_DURATION) {
        return {
          x, y: 0, velocityY: 0, isJumping: false, isWalking: false, direction,
          walkFrame, breathTimer, blinkTimer, isBlinking,
          warpState: "idle", warpTimer: 0,
        };
      }

      // Do NOT auto-transition — GameCanvas detects peak (velocityY >= 0) and sets headbutt_falling
      return {
        x, y, velocityY, isJumping: true, isWalking: false, direction,
        walkFrame, breathTimer: breathTimer + 1, blinkTimer, isBlinking,
        warpState, warpTimer,
        headbuttTargetY: state.headbuttTargetY,
        sprintTargetX: state.sprintTargetX,
        sprintSpeed: state.sprintSpeed,
        headbuttGravity: state.headbuttGravity,
      };
    } else if (warpState === "headbutt_falling") {
      // Continue dynamic headbutt gravity until landing
      const hbGrav = state.headbuttGravity ?? CHARACTER.GRAVITY;
      velocityY += hbGrav;
      y += velocityY;

      if (y >= 0) {
        return {
          x, y: 0, velocityY: 0, isJumping: false, isWalking: false, direction,
          walkFrame, breathTimer: breathTimer + 1, blinkTimer, isBlinking,
          warpState: "idle", warpTimer: 0,
        };
      }

      return {
        x, y, velocityY, isJumping: true, isWalking: false, direction,
        walkFrame, breathTimer: breathTimer + 1, blinkTimer, isBlinking,
        warpState, warpTimer,
        headbuttTargetY: state.headbuttTargetY,
        sprintTargetX: state.sprintTargetX,
        sprintSpeed: state.sprintSpeed,
        headbuttGravity: state.headbuttGravity,
      };
    }

    // Non-headbutt warp states: cancel jump and lock position
    y = 0;
    velocityY = 0;
    isJumping = false;

    return {
      x, y, velocityY, isJumping, isWalking: false, direction,
      walkFrame, breathTimer, blinkTimer, isBlinking,
      warpState, warpTimer,
    };
  }

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
    warpState, warpTimer,
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
