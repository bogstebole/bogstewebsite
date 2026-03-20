"use client";

import { useEffect, useRef, useState } from "react";
import { Water } from "@paper-design/shaders-react";
import { Logo } from "@/components/ui/logo";
import { useTheme } from "@/components/providers/theme-provider";

const GLASS_CARD_SHADOW = [
  "#FFFFFF -2px 2px 2px 1px inset",
  "#00000069 -1px -3px 3px -2px inset",
  "#000000D6 2px 1px 4px -4px inset",
  "#FFFFFF 0px 0px 7px 4px inset",
  "#00000040 0px -9px 14px 4px inset",
  "#0000001A -2px -3px 5px 3px inset",
  "#FFFFFF 0px 20px 8px -9px inset",
  "#0000001A 0px 45px 26px -9px inset",
  "#00000003 0px 27px 8px",
  "#00000003 0px 17px 6px",
  "#0000000D 0px 10px 6px",
  "#0000001A 0px 4px 4px",
  "#0000001A 0px 1px 3px",
].join(", ");

/* const GLASS_CARDS = [
  { label: "Dress Up", image: "/images/puffer.png",  tx: 3.782,   ty: 3,      rotate: "1.72deg"   },
  { label: "Vorli",    image: "/images/receipt.png", tx: 62.782,  ty: 20,     rotate: "354deg"    },
  { label: "Uslss Nts",image: "/images/notes.png",   tx: 145.782, ty: 0,      rotate: "6deg"      },
  { label: "Zoun",     image: "/images/globe.png",   tx: 207.987, ty: 14.182, rotate: "358.79deg" },
]; */

const POOL_ITEMS = [
  { label: "Dress Up", image: "/images/notes.png",   tx: 162.823, ty: 156.559, rotate: "339.17deg", width: 31, transformOrigin: "0% 0%" },
  { label: "Vorli",    image: "/images/receipt.png", tx: 244.5,   ty: 156,     rotate: "0deg",      width: 32, transformOrigin: undefined },
];

const TYPEWRITER_PHRASES = [
  "Product Designer",
  "Design Engineer",
  "Or whatever the industry says",
];

type TypewriterPhase = "typing" | "pause" | "deleting" | "next";

function useTypewriter() {
  const [displayText, setDisplayText] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const phase = useRef<TypewriterPhase>("typing");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const phrase = TYPEWRITER_PHRASES[phraseIndex.current];

      if (phase.current === "typing") {
        setIsIdle(false);
        charIndex.current += 1;
        setDisplayText(phrase.slice(0, charIndex.current));
        if (charIndex.current >= phrase.length) {
          phase.current = "pause";
          setIsIdle(true);
          timer = setTimeout(tick, 1800);
        } else {
          timer = setTimeout(tick, 60);
        }
      } else if (phase.current === "pause") {
        phase.current = "deleting";
        setIsIdle(false);
        timer = setTimeout(tick, 40);
      } else if (phase.current === "deleting") {
        charIndex.current -= 1;
        setDisplayText(phrase.slice(0, charIndex.current));
        if (charIndex.current <= 0) {
          phase.current = "next";
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 40);
        }
      } else {
        phraseIndex.current = (phraseIndex.current + 1) % TYPEWRITER_PHRASES.length;
        phase.current = "typing";
        timer = setTimeout(tick, 60);
      }
    }

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  return { displayText, isIdle };
}


export function V2Canvas() {
  const { isDark } = useTheme();
  const { displayText, isIdle } = useTypewriter();

  const primaryColor = isDark ? "#d0d0d0" : "#000000";
  const primary80 = isDark ? "rgba(208,208,208,0.80)" : "rgba(0,0,0,0.80)";
  const primary70 = isDark ? "rgba(208,208,208,0.70)" : "rgba(0,0,0,0.70)";
  const primary40 = isDark ? "rgba(208,208,208,0.40)" : "rgba(0,0,0,0.40)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: isDark ? "#111" : "#fff",
      }}
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* ── Intro text block ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 95,
          transform: "translateX(-50%)",
          width: 355,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Logo />

        {/* Water shader icon */}
        <div
          style={{
            marginTop: 24,
            width: 48,
            height: 48,
            flexShrink: 0,
            borderRadius: 16,
            overflow: "clip",
            backdropFilter: "blur(1px)",
            boxShadow:
              "#FFFFFF -2px 2px 2px 1px inset, #00000069 -1px -3px 3px -2px inset, #000000D6 2px 1px 4px -4px inset, #FFFFFF 0px 0px 7px 4px inset, #00000040 0px -9px 14px 4px inset, #0000001A -2px -3px 5px 3px inset, #FFFFFF 0px 20px 8px -9px inset, #0000001A 0px 34px 10px -9px inset, #00000003 0px 27px 8px, #00000003 0px 17px 6px, #0000000D 0px 10px 6px, #0000001A 0px 4px 4px, #0000001A 0px 1px 3px",
          }}
        >
          <Water
            speed={1}
            size={1}
            highlights={0.07}
            layering={0.73}
            edges={1}
            waves={0.46}
            caustic={0.15}
            scale={0.54}
            fit="contain"
            image="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KM43617TW5JDA9KV97W8XJ8Z.png"
            colorBack="#00000000"
            colorHighlight="#FFFFFF"
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
          />
        </div>

        {/* Name block */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontSize: 15,
              lineHeight: "18px",
              letterSpacing: "-0.02em",
              color: primaryColor,
            }}
          >
            Hey You
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 500,
              fontSize: 20,
              lineHeight: "24px",
              letterSpacing: "-0.02em",
              color: primaryColor,
            }}
          >
            I&apos;m Bogdan
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "16px",
              letterSpacing: "-0.02em",
              color: primary70,
            }}
          >
            v33.3.18
          </div>
        </div>

        {/* Role row */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "18px",
          }}
        >
          <span style={{ color: primary40 }}>
            {displayText}
            <span
              style={{
                color: primary80,
                animation: isIdle ? "blink 1s step-end infinite" : "none",
              }}
            >
              |
            </span>
          </span>
        </div>

        {/* Body text */}
        <p
          style={{
            marginTop: 12,
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "18px",
            color: primary80,
            textAlign: "center",
            whiteSpace: "pre-wrap",
          }}
        >
          I build things that feel considered — from iOS apps to interactive
          web experiences. This site is a deliberate rejection of one-style
          portfolio design.
        </p>

      </div>

      {/* ── Glass cards ── */}
      {/* ── Pool ── */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 603,
            height: 337,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "#00000033 -4px 4px 8px",
          }}
        >
          {/* Water shader — animated pool surface */}
          <Water
            speed={0.28}
            size={0.01}
            highlights={0.06}
            layering={0}
            edges={0.58}
            waves={0.05}
            caustic={0}
            scale={0.93}
            fit="cover"
            image="https://workers.paper.design/file-assets/01KM2PRGZVJ24AH6QP30SA1ZFC/01KM5BCACYB6D00EJHTVG5P7MV.png"
            colorBack="#00000000"
            colorHighlight="#FFFFFF"
            style={{ backgroundColor: "#138FCD00", height: 337, left: 10, position: "absolute", top: 0, width: 590 }}
          />
          {/* Pool photo overlay — sits above the water shader */}
          <div
            style={{
              backgroundImage: "url(/images/pool-side.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: 24,
              height: 337,
              left: "50%",
              position: "absolute",
              top: 0,
              translate: "-50%",
              width: 603,
              zIndex: 1,
            }}
          />
          {/* Floating project icons */}
          {POOL_ITEMS.map((item) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.label}
              src={item.image}
              alt={item.label}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                translate: `${item.tx}px ${item.ty}px`,
                rotate: item.rotate,
                transformOrigin: item.transformOrigin,
                width: item.width,
                height: 32,
                borderRadius: 6,
                objectFit: "cover" as const,
                boxShadow: "#00000033 0px 6px 3px",
                zIndex: 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
