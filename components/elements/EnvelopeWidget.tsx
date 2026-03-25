"use client";

import { forwardRef, memo } from "react";

interface EnvelopeWidgetProps {
  onClick?: () => void;
}

const EnvelopeWidgetBase = forwardRef<HTMLDivElement, EnvelopeWidgetProps>(
  function EnvelopeWidgetBase({ onClick }, ref) {
    return (
      <div
        ref={ref}
        onClick={onClick}
        style={{
          backgroundColor: "#e4e3de",
          borderRadius: 3,
          boxShadow:
            "42px 25px 14px 0px rgba(0,0,0,0), 27px 16px 12px 0px rgba(0,0,0,0.02), 15px 9px 11px 0px rgba(0,0,0,0.08), 7px 4px 8px 0px rgba(0,0,0,0.14), 2px 1px 4px 0px rgba(0,0,0,0.16)",
          cursor: "pointer",
          flexShrink: 0,
          height: 24,
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.2s ease",
          width: 34,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.15) rotate(9deg)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "";
        }}
      >
        {/* Left fold — z 0 */}
        <div style={{ height: "100%", left: 0, position: "absolute", top: 0, width: "38.03%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-left.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Right fold — z 0 */}
        <div style={{ height: "100%", position: "absolute", right: 0, top: 0, width: "37.68%", zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-right.svg" style={{ display: "block", height: "100%", width: "100%" }} />
        </div>
        {/* Bottom fold — z 1 */}
        <div style={{ height: "75.5%", left: "-1.06%", position: "absolute", top: "30.4%", width: "102.82%", zIndex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/images/envelope-bottom.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
        </div>
        {/* Top fold — z 2 */}
        <div style={{ height: "69.6%", left: 0, position: "absolute", top: 0, width: "100%", zIndex: 2 }}>
          <div style={{ bottom: "-5.02%", left: "-0.7%", position: "absolute", right: "-0.7%", top: "-3.79%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" src="/images/envelope-top.svg" style={{ display: "block", height: "100%", maxWidth: "none", width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }
);

export const EnvelopeWidget = memo(EnvelopeWidgetBase);
