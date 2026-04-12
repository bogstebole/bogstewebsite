const GLASS_SHADOW = [
  "#FFFFFF -2px 2px 2px 1px inset",
  "#00000069 -1px -3px 3px -2px inset",
  "#000000D6 2px 1px 4px -4px inset",
  "#FFFFFF 0px 0px 7px 4px inset",
  "#00000040 0px -9px 14px 4px inset",
  "#0000001A -2px -3px 5px 3px inset",
  "#FFFFFF 0px 20px 8px -9px inset",
  "#0000001A 0px 34px 10px -9px inset",
  "#00000003 0px 27px 8px",
  "#00000003 0px 17px 6px",
  "#0000000D 0px 10px 6px",
  "#0000001A 0px 4px 4px",
  "#0000001A 0px 1px 3px",
].join(", ");

interface ProjectTagProps {
  label: string;
  /**
   * - "light"  — white bg, dark text, JetBrains Mono (project list)
   * - "dark"   — charcoal bg, light text, Inter (detail cards)
   * - "glass"  — morphs between light and glass-pill based on `active`
   */
  variant?: "light" | "dark" | "glass";
  /** Only used for "glass" variant — enables the glass-morphic pill style */
  active?: boolean;
  /** Optional leading icon node (e.g. App Store icon) */
  icon?: React.ReactNode;
}

export function ProjectTag({ label, variant = "light", active = false, icon }: ProjectTagProps) {
  if (variant === "glass") {
    return (
      <div
        style={{
          alignItems: "center",
          backgroundColor: active ? "transparent" : "var(--color-bg-surface)",
          backdropFilter: active ? "blur(1px)" : undefined,
          WebkitBackdropFilter: active ? "blur(1px)" : undefined,
          borderRadius: active ? 999 : 4,
          boxShadow: active ? GLASS_SHADOW : "none",
          display: "flex",
          flexShrink: 0,
          gap: icon ? 4 : 0,
          height: 18,
          justifyContent: "center",
          paddingLeft: icon ? 4 : 8,
          paddingRight: 8,
          transition: "background-color 0.25s ease, border-radius 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0, transition: "filter 0.25s ease" }}>
            {icon}
          </span>
        )}
        <span
          style={{
            color: active ? "var(--color-text-ui)" : "var(--color-text-tag)",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: 10,
            letterSpacing: "-0.04em",
            transition: "color 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    );
  }

  const isDark = variant === "dark";

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: isDark ? "var(--color-bg-tag-inverted)" : "var(--color-bg-surface)",
        borderRadius: isDark ? 6 : 4,
        display: "flex",
        height: isDark ? undefined : 18,
        paddingBlock: isDark ? 4 : 3,
        paddingInline: isDark ? 8 : 7,
      }}
    >
      <span
        style={{
          color: isDark ? "var(--color-text-tag-inverted)" : "var(--color-text-tag)",
          fontFamily: isDark
            ? '"Inter", system-ui, sans-serif'
            : '"JetBrains Mono", system-ui, sans-serif',
          fontSize: 10,
          letterSpacing: isDark ? undefined : "0.03em",
          lineHeight: isDark ? 1.4 : "12px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
