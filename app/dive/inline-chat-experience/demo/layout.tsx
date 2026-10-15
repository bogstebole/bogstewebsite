import type { Viewport } from "next";

export { default, metadata } from "../../../inline-chat-experience/demo/layout";

// Segment config is read from this file itself, so it is stated here rather than re-exported.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
