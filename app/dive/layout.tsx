import type { Metadata } from "next";

// A review-only copy of the portfolio for Dive Club. It is public but unlisted:
// kept out of search, and nothing on the public site links to it.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* React lifts an async script into <head>, so the tag ships in the served
          HTML. data-path keeps the widget to /dive and the pages under it. */}
      <script src="https://inflight.co/widget.js" data-org="aius9qpt" data-path="/dive" async></script>
      {children}
    </>
  );
}
