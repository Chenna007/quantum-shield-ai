import { NextRequest, NextResponse } from "next/server";

function getBackendUrl(): string | null {
  const configured = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, "");

  // Local development fallback only.
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:8000";
  }

  return null;
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ detail: "Missing domain parameter" }, { status: 400 });
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) {
    return NextResponse.json(
      {
        detail:
          "Backend URL is not configured. Set BACKEND_API_URL (or NEXT_PUBLIC_API_URL) in Vercel Environment Variables.",
      },
      { status: 500 },
    );
  }

  const endpoint = `${backendUrl}/scan?domain=${encodeURIComponent(domain)}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const raw = await res.text();
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      payload = {
        detail:
          raw?.trim() || `Upstream backend returned non-JSON response (status ${res.status}).`,
      };
    }

    return NextResponse.json(payload, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        detail: `Backend scanner is unavailable at ${backendUrl}. Verify backend deployment and Vercel env vars.`,
      },
      { status: 502 },
    );
  }
}
