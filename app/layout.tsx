import type { Metadata } from "next";
import { geistSans, geistMono, inter, silkscreen, jetbrainsMono, specialElite } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boule's Portfolio",
  description:
    "An interactive portfolio that challenges design conformity — pixel art meets high-end shaders meets retro game aesthetics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${silkscreen.variable} ${jetbrainsMono.variable} ${specialElite.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
