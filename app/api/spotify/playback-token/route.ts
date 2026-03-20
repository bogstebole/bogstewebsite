import { NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
  error?: string;
}

async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as SpotifyTokenResponse;
  if (!data.access_token) {
    throw new Error(data.error ?? "Failed to get access token");
  }
  return data.access_token;
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ token: null });
  }

  try {
    const token = await getAccessToken(clientId, clientSecret, refreshToken);
    return NextResponse.json(
      { token },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ token: null });
  }
}
