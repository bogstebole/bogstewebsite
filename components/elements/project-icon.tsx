"use client";

const ICON_SHADOW = '0 12px 3px 0 rgba(0,0,0,0), 0 8px 3px 0 rgba(0,0,0,0.01), 0 4px 3px 0 rgba(0,0,0,0.05), 0 2px 2px 0 rgba(0,0,0,0.09), 0 0 1px 0 rgba(0,0,0,0.10)';

interface ProjectIconProps {
  color: string;
  size: number;
  label: string;
  videoSrc?: string;
}

export function ProjectIcon({ color, size, label, videoSrc }: ProjectIconProps) {
  return (
    <div
      className="relative cursor-pointer transition-transform duration-200 hover:scale-110"
      style={{ width: size, height: size }}
      title={label}
    >
      <div
        className="w-full h-full rounded-xl overflow-hidden relative"
        style={{
          background: color,
          boxShadow: ICON_SHADOW,
        }}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* Shimmer fallback */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            />
            <svg
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: size * 0.35,
                height: size * 0.35,
                opacity: 0.5,
              }}
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,0.8)"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
