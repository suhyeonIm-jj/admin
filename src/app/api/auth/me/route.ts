import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types";

const usersPath = path.join(process.cwd(), "data", "users.json");

function getUsers(): User[] {
  try {
    const data = fs.readFileSync(usersPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const users = getUsers();
    const user = users.find((u) => u.id === sessionId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
