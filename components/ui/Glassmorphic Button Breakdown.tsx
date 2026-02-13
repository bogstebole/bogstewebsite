"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./GlassButton.module.css";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Leading icon element */
  iconLeft?: ReactNode;
  /** Trailing icon element */
  iconRight?: ReactNode;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ children, loading = false, iconLeft, iconRight, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          ${styles.glassBtn}
          ${loading ? styles.loading : ""}
          ${className ?? ""}
        `}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        <span className={styles.label}>{children}</span>
        {iconRight && <span className={styles.icon}>{iconRight}</span>}
        {loading && <span className={styles.spinner} aria-hidden="true" />}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export default GlassButton;
