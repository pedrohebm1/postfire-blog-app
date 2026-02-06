// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: "Unlogged successfully" });

  res.cookies.set("Authorization", "", {
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0),
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_DOMAIN : undefined,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
