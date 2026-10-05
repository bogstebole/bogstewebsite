import Link from "next/link";
import { Logo } from "@/components/ui/logo";

/**
 * Frame shared by the Dayside pages: the way home at the top, the credits and
 * the privacy link at the bottom. The App Store links to both pages, so they
 * have to read as one small site of their own.
 */
export function DaysideShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingInline: 24,
        paddingBottom: 48,
        fontFamily: "var(--font-geist-sans), sans-serif",
        boxSizing: "border-box",
      }}
    >
      <header style={{ width: "100%", maxWidth: 960, paddingBlock: 24 }}>
        <Link href="/" aria-label="Back to home" style={{ display: "inline-flex" }}>
          <Logo />
        </Link>
      </header>

      <main style={{ width: "100%", maxWidth: 960, flex: 1 }}>{children}</main>

      <footer
        style={{
          width: "100%",
          maxWidth: 960,
          marginTop: 80,
          paddingTop: 24,
          borderTop: "1px solid var(--color-border-soft)",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 24px",
          fontSize: 12,
          lineHeight: "18px",
          color: "var(--color-text-muted)",
        }}
      >
        <Link href="/dayside" style={{ color: "inherit" }}>
          Dayside
        </Link>
        <Link href="/dayside/privacy" style={{ color: "inherit" }}>
          Privacy policy
        </Link>
        <span>Imagery: NASA GIBS. Borders: Natural Earth.</span>
        <Link href="/" style={{ color: "inherit", marginLeft: "auto" }}>
          Made by Bogdan
        </Link>
      </footer>
    </div>
  );
}
