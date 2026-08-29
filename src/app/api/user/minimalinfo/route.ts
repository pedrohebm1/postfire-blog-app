import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authorization");

  if (!token || !verifyToken(token.value)) {
    return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });
  }

  const payload: any = decodeToken(token.value);
  const user = await getUserByUsername(payload.username);
  
  if (user) {
    const userInfo = {
      id: user.id,
      email: user.email, 
      username: user.username, 
      picture: user.picture
    }
    
    return NextResponse.json({userInfo: userInfo}, {status: 200});
  }
}