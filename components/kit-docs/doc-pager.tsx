"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReviewBase } from "@/hooks/useReviewBase";
import { DOCS_PAGES, docsHref } from "./nav";
import styles from "./docs.module.css";

/** Previous and next, in sidebar order. */
export function DocPager({ path }: { path: string }) {
  const base = useReviewBase();
  const index = DOCS_PAGES.findIndex((page) => page.path === path);
  const prev = index > 0 ? DOCS_PAGES[index - 1] : null;
  const next = index >= 0 && index < DOCS_PAGES.length - 1 ? DOCS_PAGES[index + 1] : null;

  return (
    <nav className={styles.pager} aria-label="Pagination">
      {prev ? (
        <Link href={docsHref(base, prev.path)} className={styles.pagerLink}>
          <ArrowLeft size={14} aria-hidden />
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={docsHref(base, next.path)} className={styles.pagerLink} data-next>
          {next.title}
          <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </nav>
  );
}
