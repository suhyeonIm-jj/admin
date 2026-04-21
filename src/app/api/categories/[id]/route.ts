import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/data";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = updateCategory(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const success = deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
