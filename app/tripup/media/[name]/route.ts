import { hasTripUpAccess } from "@/lib/tripup-access";
import { loadTripUpMedia } from "@/lib/tripup-content";

// The case study's pictures and videos: decrypted on the way out, and only for
// someone who has unlocked /tripup. Never cached by the browser or a CDN.

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
};

// One answer stays under Vercel's 4.5 MB response limit; a video is fetched in parts.
const MAX_CHUNK = 4 * 1024 * 1024;

const PRIVATE = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await hasTripUpAccess())) {
    return new Response("This case study is private.", { status: 401, headers: PRIVATE });
  }

  const { name } = await params;
  const file = await loadTripUpMedia(name);
  if (!file) return new Response("Not found.", { status: 404, headers: PRIVATE });

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const headers = {
    ...PRIVATE,
    "Content-Type": TYPES[ext] ?? "application/octet-stream",
    "Accept-Ranges": "bytes",
  };
  const total = file.length;

  // Byte ranges, which video players use (Safari won't play a video without them).
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range")?.trim() ?? "");
  if (range && (range[1] || range[2])) {
    let start: number;
    let end: number;
    if (range[1]) {
      start = Number(range[1]);
      end = range[2] ? Math.min(Number(range[2]), total - 1) : total - 1;
    } else {
      start = Math.max(0, total - Number(range[2]));
      end = total - 1;
    }
    if (start >= total || start > end) {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${total}` } });
    }
    end = Math.min(end, start + MAX_CHUNK - 1);
    return new Response(new Uint8Array(file.subarray(start, end + 1)), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${total}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(new Uint8Array(file), { headers: { ...headers, "Content-Length": String(total) } });
}
