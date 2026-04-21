import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
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

function saveUsers(users: User[]): void {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const users = getUsers();

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      password, // In production, this should be hashed
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });

    // Set session cookie
    response.cookies.set("session", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
