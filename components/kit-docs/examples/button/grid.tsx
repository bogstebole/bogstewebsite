"use client";

import { Button, type ButtonSize, type ButtonVariant } from "inline-chat-kit";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "outline", "ghost", "glass"];
const SIZES: { size: ButtonSize; height: number }[] = [
  { size: "xs", height: 24 },
  { size: "s", height: 28 },
  { size: "m", height: 32 },
  { size: "l", height: 40 },
  { size: "xl", height: 48 },
];

const caption = { fontFamily: "var(--ick-font-mono)", fontSize: 11, color: "var(--ick-ink-faint)" };

/** Every variant at every size. Secondary is transparent until it is hovered. */
export default function ButtonGrid() {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `72px repeat(${SIZES.length}, auto)`,
          alignItems: "center",
          justifyItems: "start",
          gap: "16px 20px",
          width: "max-content",
          margin: "0 auto",
        }}
      >
        <span />
        {SIZES.map(({ size, height }) => (
          <span key={size} style={caption}>
            {size} · {height}px
          </span>
        ))}
        {VARIANTS.map((variant) => (
          <Row key={variant} variant={variant} />
        ))}
      </div>
    </div>
  );
}

function Row({ variant }: { variant: ButtonVariant }) {
  return (
    <>
      <span style={caption}>{variant}</span>
      {SIZES.map(({ size }) => (
        <Button key={size} variant={variant} size={size}>
          Send
        </Button>
      ))}
    </>
  );
}
