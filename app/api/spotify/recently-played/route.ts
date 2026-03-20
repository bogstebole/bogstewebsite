import { NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifyTrackItem {
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string; width: number; height: number }>;
    };
    preview_url: string | null;
    external_urls: { spotify: string };
  };
}

interface SpotifyRecentlyPlayedResponse {
  items: SpotifyTrackItem[];
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
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
  });

  const data = (await response.json()) as SpotifyTokenResponse;
  return data.access_token;
}

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  // Graceful no-op if env vars aren't configured yet
  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ track: null });
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = (await response.json()) as SpotifyRecentlyPlayedResponse;
    const item = data.items?.[0];

    if (!item) {
      return NextResponse.json({ track: null });
    }

    const track = {
      name: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      albumArt: item.track.album.images[0]?.url ?? null,
      previewUrl: item.track.preview_url,
      trackUrl: item.track.external_urls.spotify,
    };

    return NextResponse.json(
      { track },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" } }
    );
  } catch {
    return NextResponse.json({ track: null });
  }
}
