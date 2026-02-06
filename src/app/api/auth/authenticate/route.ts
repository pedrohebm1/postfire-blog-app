import { decodeToken, verifyToken } from "@/app/lib/jwt";
import { getUserByUsername } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("Authorization")?.value;
    const headerToken = req.headers.get("Authorization");

    const token = headerToken || cookieToken;

    if (!token) {
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 401 }
      );
    }

    if (!verifyToken(token)) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const payload: any = decodeToken(token);
    let user = await getUserByUsername(payload.username);

    if (user) {
      user.hash = "";
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 401 }
    );
  }
}
