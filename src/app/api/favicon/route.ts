import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.origin;

    // Try multiple favicon sources
    const faviconUrls = [
      `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`,
      `${domain}/favicon.ico`,
      `${domain}/favicon.png`,
      `${domain}/apple-touch-icon.png`,
    ];

    // Return Google's favicon service URL (most reliable)
    return NextResponse.json({
      favicon: faviconUrls[0],
      alternatives: faviconUrls.slice(1),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid URL" },
      { status: 400 }
    );
  }
}
