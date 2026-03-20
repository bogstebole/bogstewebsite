// TEMPORARY — delete after obtaining refresh token
// Usage: visit http://localhost:3000/api/spotify/auth in your browser
import { NextResponse } from "next/server";

export function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "SPOTIFY_CLIENT_ID not set in .env.local" }, { status: 500 });
  }

  const redirectUri = "http://localhost:3000/api/spotify/callback";
  const scope = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
  ].join(" ");

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(url.toString());
}
