import { NextRequest, NextResponse } from "next/server";
import { getCategories, getCategoriesByType, createCategory, reorderCategories } from "@/lib/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as "work" | "personal" | null;

  try {
    const categories = type ? getCategoriesByType(type) : getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "reorder") {
      reorderCategories(body.orderedIds);
      return NextResponse.json({ ok: true });
    }

    const newCategory = createCategory({
      name: body.name,
      type: body.type,
      order: body.order || 0,
      color: body.color,
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
