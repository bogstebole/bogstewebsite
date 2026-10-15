import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Demo · inline-chat-kit",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
