import type { Metadata } from "next";
import { geistSans, geistMono, inter, silkscreen, jetbrainsMono, specialElite } from "@/lib/fonts";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boule's Portfolio",
  description:
    "An interactive portfolio that challenges design conformity — pixel art meets high-end shaders meets retro game aesthetics.",
  metadataBase: new URL("https://bogste.com"),
  openGraph: {
    title: "Boule's Portfolio",
    description:
      "An interactive portfolio that challenges design conformity — pixel art meets high-end shaders meets retro game aesthetics.",
    url: "https://bogste.com",
    siteName: "Boule's Portfolio",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Boule's Portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boule's Portfolio",
    description:
      "An interactive portfolio that challenges design conformity — pixel art meets high-end shaders meets retro game aesthetics.",
    images: ["/images/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${silkscreen.variable} ${jetbrainsMono.variable} ${specialElite.variable} antialiased`}
      >
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
