import { NextRequest, NextResponse } from "next/server";

function getBackendUrl(): string {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000"
  ).replace(/\/$/, "");
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ detail: "Missing domain parameter" }, { status: 400 });
  }

  const backendUrl = getBackendUrl();
  const endpoint = `${backendUrl}/scan?domain=${encodeURIComponent(domain)}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const payload = await res.json().catch(() => ({ detail: "Scan failed" }));
    return NextResponse.json(payload, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "Backend scanner is unavailable. Please try again." },
      { status: 502 },
    );
  }
}
