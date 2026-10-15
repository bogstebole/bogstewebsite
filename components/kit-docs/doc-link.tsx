"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useReviewBase } from "@/hooks/useReviewBase";
import { docsHref } from "./nav";

/**
 * A link to another docs page, by its path in `nav.ts` (`"components/tool"`,
 * `"theming#tokens"`). Stays inside the `/dive` review copy when read there.
 */
export function DocLink({ to, children }: { to: string; children: ReactNode }) {
  const base = useReviewBase();
  const [path, hash] = to.split("#");
  return <Link href={`${docsHref(base, path)}${hash ? `#${hash}` : ""}`}>{children}</Link>;
}
