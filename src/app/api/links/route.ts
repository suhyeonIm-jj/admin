import { NextRequest, NextResponse } from "next/server";
import { getLinks, getLinksByType, createLink, reorderLinks } from "@/lib/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as "work" | "personal" | null;

  try {
    const links = type ? getLinksByType(type) : getLinks();
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a reorder request
    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      reorderLinks(body.orderedIds);
      return NextResponse.json({ success: true });
    }

    // Create new link
    const newLink = createLink({
      title: body.title,
      url: body.url,
      favicon: body.favicon || "",
      description: body.description || "",
      memo: body.memo || "",
      tags: body.tags || [],
      category: body.category,
      isPinned: body.isPinned || false,
      isFavorite: body.isFavorite || false,
      usageCount: 0,
      order: body.order || 0,
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
