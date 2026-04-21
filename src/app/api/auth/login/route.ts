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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    // Set session cookie
    response.cookies.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
