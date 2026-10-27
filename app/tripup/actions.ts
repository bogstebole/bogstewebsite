"use server";

import { redirect } from "next/navigation";
import { grantTripUpAccess } from "@/lib/tripup-access";

export interface UnlockState {
  error?: string;
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** The password form's action: right password, the page opens; wrong, an inline error. */
export async function unlockTripUp(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const attempt = formData.get("password");
  if (typeof attempt !== "string" || attempt.length === 0) {
    return { error: "Enter the password." };
  }
  if (!(await grantTripUpAccess(attempt))) {
    // A short pause on every miss makes guessing slow.
    await wait(600);
    return { error: "That's not it. Try again." };
  }
  redirect("/tripup");
}
