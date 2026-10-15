"use client";

import { useEffect, useState } from "react";
import styles from "./docs.module.css";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * The page's own headings, read from the page once it is on screen, with the
 * one being read marked. Keyed by pathname in the shell, so a new page starts
 * a new list rather than updating the old one.
 */
export function OnThisPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("[data-doc-article] h2[id], [data-doc-article] h3[id]")
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the headings are only known once rendered
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H3" ? 3 : 2,
      }))
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -70% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return <div className={styles.toc} aria-hidden />;

  return (
    <nav className={styles.toc} aria-label="On this page">
      <span className={styles.tocTitle}>On this page</span>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
