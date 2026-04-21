import { NextRequest, NextResponse } from "next/server";
import { deleteTag } from "@/lib/data";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const success = deleteTag(id);
    if (!success) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}
