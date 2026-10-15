"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "inline-chat-kit";
import { Logo } from "@/components/ui/logo";
import { useReviewBase } from "@/hooks/useReviewBase";
import { DOCS_NAV, DOCS_ROOT, docsHref } from "./nav";
import { OnThisPage } from "./on-this-page";
import { readDocsTheme, writeDocsTheme, type DocsTheme } from "./theme";
import styles from "./docs.module.css";

/**
 * The frame around every docs page: a header with the way into the demo, the
 * sidebar, and the "On this page" list. The page itself is `children`.
 *
 * The theme is the kit's own: `data-theme` on the root element, which every
 * `--ick-` token answers to. So a preview on the page turns dark with the
 * page rather than needing to be told. This site's own dark mode is a class,
 * `.dark`; it is lifted for the visit, like the demo does, and put back on the
 * way out.
 */
export function DocsShell({ version, children }: { version: string; children: ReactNode }) {
  const base = useReviewBase();
  const pathname = usePathname();
  const [theme, setTheme] = useState<DocsTheme>("light");
  const [menuOpen, setMenuOpen] = useState(false);

  /* The stored choice was already put on the root by the inline script in the
     layout, before the first paint; this only brings the toggle in line. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading storage that the server cannot see
    setTheme(readDocsTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    if (wasDark) root.classList.remove("dark");
    return () => {
      delete root.dataset.theme;
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  /* Held, not just set. A `ChatExperience` left to keep its own theme clears
     `data-theme` when it mounts. On a docs page that shows one, that would
     drop the whole page to the system preference while the toggle still said
     otherwise. The page owns the attribute here, so it puts it back. */
  useEffect(() => {
    const root = document.documentElement;
    const hold = () => {
      if (root.dataset.theme !== theme) root.dataset.theme = theme;
    };
    hold();
    const observer = new MutationObserver(hold);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [theme]);

  // A link followed from the open menu closes it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closing on navigation
    setMenuOpen(false);
  }, [pathname]);

  const current = pathname.slice(`${base}${DOCS_ROOT}`.length).replace(/^\//, "");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    writeDocsTheme(next);
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="docs-sidebar"
          >
            {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>

          <div className={styles.brand}>
            <Link href={base || "/"} className={styles.brandLogo} aria-label="Back to home">
              <Logo />
            </Link>
            <Link href={docsHref(base, "")} className={styles.brandName}>
              inline-chat-kit
            </Link>
            <span className={styles.version}>v{version}</span>
          </div>

          <nav className={styles.headerNav} aria-label="Project">
            <a
              className={styles.headerLink}
              href="https://github.com/bogstebole/chat-experience"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className={styles.headerLink}
              href="https://www.npmjs.com/package/inline-chat-kit"
              target="_blank"
              rel="noreferrer"
            >
              npm
            </a>
            <Button
              variant="ghost"
              size="s"
              icon={theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
              aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
              onClick={toggleTheme}
            />
            <Link href={docsHref(base, "demo")} className={styles.demoLink}>
              Try the demo
            </Link>
          </nav>
        </div>
      </header>

      <div className={styles.body}>
        <aside id="docs-sidebar" className={styles.sidebar} data-open={menuOpen || undefined}>
          <nav aria-label="Documentation">
            {DOCS_NAV.map((group) => (
              <div key={group.title} className={styles.navGroup}>
                <span className={styles.navGroupTitle}>{group.title}</span>
                <ul>
                  {group.items.map((item) => {
                    const active = item.path === current;
                    return (
                      <li key={item.path}>
                        <Link
                          href={docsHref(base, item.path)}
                          className={styles.navLink}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        {menuOpen && <div className={styles.scrim} onClick={() => setMenuOpen(false)} aria-hidden />}

        <main className={styles.main}>{children}</main>

        <OnThisPage key={pathname} />
      </div>
    </div>
  );
}
