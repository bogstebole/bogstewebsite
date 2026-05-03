"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import glassStyles from "@/components/ui/GlassButton.module.css";

type Props = {
  title: string;
  date: string;
  time: string;
  href: string;
  image: string | null;
};

const CARD_SHADOW_REST =
  "0px 15px 2px rgba(107,107,107,0), 0px 10px 2px rgba(107,107,107,0.01), 0px 5px 1.5px rgba(107,107,107,0.05), 0px 2px 1px rgba(107,107,107,0.09), 0px 1px 0.5px rgba(107,107,107,0.1)";

const CARD_SHADOW_HOVER =
  "0px 130px 18px rgba(0,0,0,0), 0px 83px 16.5px rgba(0,0,0,0.01), 0px 47px 14px rgba(0,0,0,0.05), 0px 21px 10.5px rgba(0,0,0,0.09), 0px 5px 5.5px rgba(0,0,0,0.1)";

const CARD_SHADOW_PRESS =
  "0px 6px 1px rgba(107,107,107,0), 0px 4px 1px rgba(107,107,107,0.01), 0px 2px 1px rgba(107,107,107,0.04), 0px 1px 0.5px rgba(107,107,107,0.06), 0px 0.5px 0.25px rgba(107,107,107,0.07)";

const dateStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontWeight: 400,
  fontSize: 10,
  lineHeight: 1.3,
  letterSpacing: "-0.04em",
  color: "#888",
  whiteSpace: "nowrap",
};

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function SubstackIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="#FF6719"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, position: "relative", zIndex: 1 }}
    >
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

function CTA({
  hovered,
  fullWidth,
  onPressStart,
  mobile = false,
}: {
  hovered: boolean;
  fullWidth: boolean;
  onPressStart: (e: React.SyntheticEvent) => void;
  mobile?: boolean;
}) {
  const [btnPressed, setBtnPressed] = useState(false);
  const showLabel = hovered || fullWidth;

  const handlePressStart = (e: React.SyntheticEvent) => {
    setBtnPressed(true);
    onPressStart(e);
  };
  const handlePressEnd = () => {
    setBtnPressed(false);
  };

  return (
    <motion.span
      animate={{ gap: showLabel ? "8px" : "0px" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        glassStyles.glassBtn,
        glassStyles.sizeXs,
        !mobile && glassStyles.ghost,
        hovered && glassStyles.hovered,
        btnPressed && glassStyles.pressed,
      )}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      style={
        fullWidth
          ? {
              width: "100%",
              display: "flex",
              boxSizing: "border-box",
              height: mobile ? 44 : undefined,
              borderRadius: mobile ? 9999 : undefined,
              fontSize: mobile ? "0.875rem" : undefined,
            }
          : {}
      }
    >
      <SubstackIcon />
      <AnimatePresence initial={false}>
        {showLabel && (
          <motion.span
            key="read-label"
            initial={fullWidth ? false : { opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Read
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}

export function SubstackCard({ title, date, time, href, image }: Props) {
  const [hovered, setHovered] = useState(false);
  const [cardPressed, setCardPressed] = useState(false);
  const { isMobile } = useBreakpoint();

  const restingRotate = isMobile ? 0 : 1.33;
  const targetRotate = hovered || cardPressed ? 0 : restingRotate;
  const targetScale = cardPressed ? 0.99 : 1;
  const targetShadow = cardPressed
    ? CARD_SHADOW_PRESS
    : hovered
      ? CARD_SHADOW_HOVER
      : CARD_SHADOW_REST;

  const clearPress = () => setCardPressed(false);
  const stopCardPress = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setCardPressed(false);
      }}
      onMouseDown={() => setCardPressed(true)}
      onMouseUp={clearPress}
      onTouchStart={() => setCardPressed(true)}
      onTouchEnd={clearPress}
      onTouchCancel={clearPress}
      animate={{
        rotate: targetRotate,
        scale: targetScale,
        boxShadow: targetShadow,
      }}
      transition={{
        rotate: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
        boxShadow: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
        gap: isMobile ? 10 : 12,
        padding: 8,
        borderRadius: 24,
        border: "1px solid #ffffff",
        background: "linear-gradient(180deg, #ffffff 0%, #f4f4f4 100%)",
        width: "100%",
        textDecoration: "none",
        cursor: "pointer",
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          width: isMobile ? "100%" : 77,
          height: isMobile ? undefined : 58,
          aspectRatio: isMobile ? "16 / 9" : undefined,
          borderRadius: 16,
          backgroundColor: "#d9d9d9",
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          flex: isMobile ? "0 0 auto" : 1,
          minWidth: 0,
          width: isMobile ? "100%" : undefined,
          padding: isMobile ? "2px 8px 0 8px" : "0 8px 0 0",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 1.3,
            letterSpacing: "-0.04em",
            color: "#434343",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...dateStyle }}>
            <span>{date}</span>
            <span>-</span>
            <span>{time}</span>
          </div>
          {!isMobile && (
            <CTA hovered={hovered} fullWidth={false} onPressStart={stopCardPress} />
          )}
        </div>
      </div>

      {isMobile && (
        <div style={{ width: "100%" }}>
          <CTA
            hovered={false}
            fullWidth={true}
            mobile={true}
            onPressStart={stopCardPress}
          />
        </div>
      )}
    </motion.a>
  );
}
