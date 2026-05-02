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
        alignItems: "center",
        gap: 24,
        padding: "0 24px",
        marginTop: 32,
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
        <div style={labelStyle}>Latest Writing_</div>
        <div style={{ display: "flex", flex: 1, gap: 2, opacity: 0.2 }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              style={{ backgroundColor: "var(--color-divider)", flex: 1, height: 1 }}
            />
          ))}
        </div>
      </div>

      <SubstackCard
        title={post.title}
        date={post.dateText}
        time={post.timeText}
        href={post.link}
        image={post.image}
      />
    </div>
  );
}
