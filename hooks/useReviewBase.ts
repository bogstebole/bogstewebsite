"use client";

import { usePathname } from "next/navigation";

/** Where the review copy of the site lives. */
export const REVIEW_BASE = "/dive";

/**
 * "/dive" on the review copy, "" on the public site. Prefix it to an internal
 * href so a link followed inside the review stays inside the review.
 */
export function useReviewBase(): string {
  const pathname = usePathname();
  return pathname === REVIEW_BASE || pathname.startsWith(`${REVIEW_BASE}/`) ? REVIEW_BASE : "";
}
