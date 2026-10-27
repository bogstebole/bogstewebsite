import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// The TripUp case study (/tripup) sits behind one shared password.
// The password lives only in the TRIPUP_PASSWORD environment variable
// (.env.local here, the project's settings on Vercel), never in the code.
// Without it, the page stays locked: nobody can get in.

export const TRIPUP_COOKIE = "tripup_access";
const COOKIE_PATH = "/tripup";
const MAX_AGE_S = 30 * 24 * 60 * 60;

const configuredPassword = (): string | null => {
  const value = process.env.TRIPUP_PASSWORD;
  return value && value.length > 0 ? value : null;
};

/**
 * What the cookie holds: a signature derived from the password, not the
 * password itself. Changing the password invalidates every cookie.
 */
const accessToken = (password: string) =>
  createHmac("sha256", password).update("tripup-case-study:access:v1").digest("hex");

/** Constant-time comparison of two strings of any length. */
const sameSecret = (a: string, b: string) =>
  timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

/** Whether this request may see the case study. */
export async function hasTripUpAccess(): Promise<boolean> {
  const password = configuredPassword();
  if (!password) return false;
  const cookie = (await cookies()).get(TRIPUP_COOKIE)?.value;
  return !!cookie && sameSecret(cookie, accessToken(password));
}

/** Checks a typed password; when it's right, sets the access cookie. */
export async function grantTripUpAccess(attempt: string): Promise<boolean> {
  const password = configuredPassword();
  if (!password || !sameSecret(attempt, password)) return false;
  (await cookies()).set(TRIPUP_COOKIE, accessToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: MAX_AGE_S,
  });
  return true;
}
