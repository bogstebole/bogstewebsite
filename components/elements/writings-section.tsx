"use client";

import { SubstackCard } from "@/components/ui/substack-card";
import type { SubstackPost } from "@/lib/substack";

type Props = {
  post: SubstackPost;
};

const labelStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  fontFamily: '"JetBrains Mono", system-ui, sans-serif',
  fontSize: 10,
  letterSpacing: "0.1em",
  lineHeight: "12px",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

export function WritingsSection({ post }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: "0 24px",
        marginTop: 32,
        width: "100%",
      }}
    >
      <div style={labelStyle}>Latest Writing_</div>

      <SubstackCard
        title={post.title}
        date={post.dateText}
        time={post.timeText}
        href={post.link}
      />
    </div>
  );
}
