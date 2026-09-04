"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * How many overlays are open right now.
 *
 * A module store rather than context: the modals that need to report in are
 * portalled to body, so they sit outside whatever provider the page renders,
 * and the canvas that has to react to them is above that portal rather than
 * below it. A count, not a flag, because two overlays can be open at once, and the
 * first one to close must not un-dim the page for the other.
 */
let openCount = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** True while any overlay is open. Server renders as false. */
export function useOverlayOpen() {
  return useSyncExternalStore(
    subscribe,
    () => openCount > 0,
    () => false
  );
}

/** Counts an overlay in for as long as it is open. */
export function useRegisterOverlay(open: boolean) {
  useEffect(() => {
    if (!open) return;
    openCount += 1;
    emit();
    return () => {
      openCount = Math.max(0, openCount - 1);
      emit();
    };
  }, [open]);
}
