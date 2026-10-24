"use client";

import { useActionState } from "react";
import glass from "@/components/ui/GlassButton.module.css";
import { unlockTripUp, type UnlockState } from "@/app/tripup/actions";
import styles from "./tripup.module.css";

/** The only thing /tripup shows until the password is accepted. */
export function PasswordGate() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(unlockTripUp, {});
  return (
    <section className={styles.gate}>
      <h1 className={styles.title}>
        TripUp
        <span className={styles.titleRest}>: this case study is private. Enter the password.</span>
      </h1>
      <form action={action} className={styles.gateForm}>
        <label htmlFor="tripup-password" className={styles.mono}>
          Password
        </label>
        <div className={styles.gateRow}>
          <input
            id="tripup-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            aria-invalid={!!state.error}
            aria-describedby={state.error ? "tripup-password-error" : undefined}
            className={styles.gateInput}
          />
          <button type="submit" disabled={pending} className={`${glass.glassBtn} ${glass.sizeM}`}>
            {pending ? "Checking…" : "Open"}
          </button>
        </div>
        <p id="tripup-password-error" role="alert" className={styles.gateError}>
          {state.error ?? ""}
        </p>
      </form>
    </section>
  );
}
