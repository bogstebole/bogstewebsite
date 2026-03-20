// TEMPORARY — delete after obtaining refresh token
// Copy the "refresh_token" from the JSON response into .env.local as SPOTIFY_REFRESH_TOKEN
import { NextRequest, NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token?: string;
  refresh_token?: string;
  error?: string;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET not set in .env.local" },
      { status: 500 }
    );
  }

  const redirectUri = "http://localhost:3000/api/spotify/callback";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = (await response.json()) as SpotifyTokenResponse;

  // Return plaintext so the refresh_token is easy to copy
  return new Response(
    JSON.stringify(data, null, 2),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
