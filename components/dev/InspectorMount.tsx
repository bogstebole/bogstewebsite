"use client";

import dynamic from "next/dynamic";

// Visual QA inspector — dev-only mount. The package references HTMLElement at
// module top-level (web-component class), which crashes during Next SSR, so it
// must load browser-only via dynamic import with ssr: false.
const InspectorRoot = dynamic(
  () => import("visual-qa-inspector/react").then((m) => m.InspectorRoot),
  { ssr: false }
);

export function InspectorMount() {
  return <InspectorRoot />;
}
