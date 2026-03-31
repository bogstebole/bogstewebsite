"use client";

import { PaperTexture } from "@paper-design/shaders-react";

const NOTES = [
  "Deep dive into things that tickle your passion",
  "Don't be a fckn shit!",
  'Start with "What if..."',
  "Be respectful, listen, share...",
  "Respect yourself and your work, but be open to criticism...",
  "Be introspective",
  "Be humble",
  "Be honest",
];

// Logo SVG extracted from the Paper Design file
function PaperLogo({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * (48 / 40)}
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <filter
          id="paper-logo-filter"
          x="-5.007e-06"
          y="-0.471"
          width="39.719"
          height="48.215"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.056" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.113" />
          <feGaussianBlur stdDeviation="1.056" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow"
            result="effect2_dropShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.113" />
          <feGaussianBlur stdDeviation="1.056" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0 0.251 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow"
            result="effect3_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
      <g filter="url(#paper-logo-filter)">
        <path
          d="M27.423 11.66C27.424 11.738 27.43 11.832 27.436 11.941C27.658 11.929 27.88 11.915 28.102 11.904C28.431 11.886 28.8 11.876 28.985 11.847L30.162 11.667L30.203 12.855C30.206 12.95 30.213 13.062 30.221 13.189C30.342 13.184 30.462 13.18 30.578 13.179L31.613 13.171L31.642 14.207C31.643 14.265 31.646 14.342 31.65 14.436C31.695 14.431 31.736 14.427 31.773 14.421L32.963 14.204L33.017 15.412C33.02 15.485 33.027 15.595 33.035 15.725C33.158 15.72 33.279 15.717 33.394 15.716L34.429 15.711L34.454 16.747C34.468 17.275 34.491 17.803 34.522 18.331C34.619 18.326 34.715 18.319 34.809 18.316L35.8 18.288L35.891 19.275C35.964 20.059 35.993 20.924 36.031 21.658L36.236 25.622L36.428 29.323L36.49 30.42C36.511 30.806 36.528 31.2 36.531 31.564L36.541 32.623L35.481 32.63C35.412 32.63 35.34 32.634 35.266 32.637C35.278 32.933 35.287 33.192 35.307 33.437C35.318 33.567 35.327 33.795 35.332 33.873C35.34 33.999 35.349 34.065 35.357 34.098L35.655 35.334L34.386 35.401C34.281 35.407 34.168 35.413 34.052 35.419C34.058 35.524 34.065 35.629 34.07 35.733L34.13 36.886L32.977 36.843C32.922 36.841 32.867 36.842 32.812 36.842C32.816 36.878 32.819 36.906 32.824 36.928L33.1 38.148L31.851 38.215C31.745 38.221 31.632 38.228 31.516 38.235C31.522 38.339 31.529 38.444 31.534 38.549L31.595 39.708L30.434 39.658C30.366 39.655 30.285 39.657 30.19 39.66C30.196 39.729 30.201 39.79 30.209 39.841L30.404 41.14L29.093 41.052C28.846 41.035 28.431 41.055 27.916 41.091C27.806 41.099 27.692 41.106 27.575 41.115L27.6 41.813L16.107 42.41L16.05 41.711C15.468 41.737 14.89 41.767 14.402 41.823L13.237 41.956L13.226 40.785C13.226 40.707 13.216 40.621 13.21 40.518C12.663 40.545 12.113 40.577 11.651 40.625L10.579 40.734L10.491 39.659C10.483 39.551 10.477 39.443 10.47 39.336C10.417 39.341 10.368 39.346 10.325 39.353L9.173 39.542L9.1 38.377C9.093 38.273 9.088 38.17 9.083 38.066C9.001 38.074 8.926 38.083 8.861 38.093L7.71 38.28L7.638 37.116C7.602 36.546 7.571 35.974 7.544 35.403C7.464 35.41 7.386 35.418 7.308 35.427L6.136 35.566L6.129 34.385C6.126 33.993 6.098 33.572 6.067 33.109C6.06 33.005 6.054 32.899 6.047 32.791L5.792 32.805L4.735 32.862L4.135 21.323L5.185 21.262C5.262 21.258 5.348 21.252 5.442 21.246C5.441 21.237 5.442 21.228 5.441 21.22L5.353 19.537L5.294 18.424L6.41 18.426C6.486 18.426 6.571 18.424 6.664 18.42C6.659 18.357 6.654 18.297 6.647 18.245L6.489 17.1L7.645 17.046C7.741 17.041 7.859 17.035 7.988 17.027C7.982 16.92 7.977 16.813 7.972 16.705L7.923 15.573L9.055 15.603C9.109 15.604 9.167 15.602 9.231 15.6C9.227 15.551 9.225 15.507 9.218 15.467L9.025 14.31L10.196 14.239C10.297 14.233 10.41 14.225 10.531 14.217C10.524 14.122 10.517 14.035 10.507 13.963L10.35 12.818L11.504 12.763C11.942 12.742 12.542 12.701 13.127 12.67C13.122 12.566 13.116 12.461 13.112 12.356L13.062 11.23L14.189 11.254C14.818 11.268 15.687 11.198 16.433 11.16L20.417 10.953L24.15 10.758C24.841 10.722 25.676 10.702 26.228 10.629L27.405 10.473L27.423 11.66Z"
          fill="#12A49D"
          stroke="#FFFFFF"
          strokeWidth="2.113"
        />
        <path
          d="M13.483 3.224L13.512 4.306C13.545 5.522 13.63 6.792 13.695 8.049L13.696 8.057C13.759 9.491 13.842 10.924 13.946 12.355L14.019 13.369L13.01 13.481C12.394 13.549 11.603 13.565 11.069 13.591L11.069 13.59L7.06 13.799C6.337 13.837 5.477 13.857 4.876 13.927L3.758 14.057L3.222 3.757L13.483 3.224Z"
          fill="#FBB716"
          stroke="#FFFFFF"
          strokeWidth="2.113"
        />
      </g>
    </svg>
  );
}

interface NotesToSelfProps {
  /** Width of the envelope in px — paper scales to match */
  envelopeWidth: number;
}

export function NotesToSelf({ envelopeWidth }: NotesToSelfProps) {
  // Original design: 435 × 264px
  const scale = envelopeWidth / 435;
  const w = envelopeWidth;
  const h = 264 * scale;

  const logoSize = Math.round(21 * scale);
  const labelSize = Math.max(8, Math.round(12 * scale));
  const noteSize = Math.max(6, Math.round(8 * scale));
  const gap = Math.round(16 * scale);
  const padding = Math.round(16 * scale);
  const labelLineHeight = Math.round(16 * scale);

  return (
    <div
      style={{
        boxShadow:
          "#78787803 0px 42px 13px, #78787803 0px 27px 10px, #7878780D 0px 15px 8px, #78787817 0px 6px 6px, #7878781A 0px 2px 4px",
        boxSizing: "border-box",
        height: `${h}px`,
        position: "relative",
        width: `${w}px`,
      }}
    >
      {/* Paper texture layer */}
      <PaperTexture
        contrast={0.3}
        roughness={0.4}
        fiber={0.3}
        fiberSize={0.2}
        crumples={0.3}
        crumpleSize={0.35}
        folds={0.65}
        foldCount={5}
        fade={0}
        drops={0}
        seed={5.8}
        scale={0.6}
        fit="cover"
        colorBack="#00000000"
        colorFront="#FFFFFF"
        style={{
          backgroundColor: "#E3E3E3",
          height: `${h}px`,
          left: 0,
          position: "absolute",
          top: 0,
          width: `${w}px`,
        }}
      />

      {/* Content layer — multiply blend so text looks printed onto paper */}
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          height: `${h}px`,
          left: 0,
          mixBlendMode: "multiply",
          paddingBlock: `${padding}px`,
          paddingInline: `${padding}px`,
          position: "absolute",
          top: 0,
          width: `${Math.round(340 * scale)}px`,
        }}
      >
        <PaperLogo size={logoSize} />

        <div
          style={{
            alignItems: "start",
            alignSelf: "stretch",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              color: "#434343",
              fontFamily: '"JetBrains Mono", system-ui, sans-serif',
              fontSize: `${labelSize}px`,
              fontWeight: 300,
              lineHeight: `${labelLineHeight}px`,
            }}
          >
            Note to self
          </div>
        </div>

        <div
          style={{
            boxSizing: "border-box",
            color: "#434343CC",
            fontFamily: '"JetBrains Mono", system-ui, sans-serif',
            fontSize: `${noteSize}px`,
            fontWeight: 300,
            lineHeight: "150%",
            whiteSpace: "pre-wrap",
            width: `${Math.round(298 * scale)}px`,
          }}
        >
          {NOTES.map((note, i) => (
            <span key={i}>
              {i + 1}. {note}
              {i < NOTES.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
