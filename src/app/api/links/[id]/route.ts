import { NextRequest, NextResponse } from "next/server";
import { getLinkById, updateLink, deleteLink, incrementUsageCount } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const link = getLinkById(id);
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    return NextResponse.json(link);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Handle usage count increment
    if (body.action === "incrementUsage") {
      const link = incrementUsageCount(id);
      if (!link) {
        return NextResponse.json({ error: "Link not found" }, { status: 404 });
      }
      return NextResponse.json(link);
    }

    // Regular update
    const updatedLink = updateLink(id, body);
    if (!updatedLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    return NextResponse.json(updatedLink);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const success = deleteLink(id);
    if (!success) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
