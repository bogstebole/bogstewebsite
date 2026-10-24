import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // /tripup reads its sealed content from disk at request time (lib/tripup-content.ts),
  // so the files have to ship with those routes.
  outputFileTracingIncludes: {
    "/tripup": ["./content/tripup/**/*"],
    "/tripup/**": ["./content/tripup/**/*"],
  },
  // Self-hosted fonts never change in place (a new font gets a new file name),
  // so they cache like next/font's did.
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Every inline-chat-kit docs page is also markdown at its own address plus
  // `.md`, which is what agents read. Served by the route under /md.
  async rewrites() {
    return [
      { source: "/inline-chat-experience.md", destination: "/inline-chat-experience/md" },
      { source: "/inline-chat-experience/:path(.+)\\.md", destination: "/inline-chat-experience/md/:path" },
    ];
  },
};

export default nextConfig;
