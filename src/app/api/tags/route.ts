import { NextRequest, NextResponse } from "next/server";
import { getTags, createTag } from "@/lib/data";

export async function GET() {
  try {
    const tags = getTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTag = createTag({
      name: body.name,
      color: body.color,
    });
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
