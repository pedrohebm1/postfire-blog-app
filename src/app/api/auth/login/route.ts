// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/client";
import bcrypt from "bcrypt";
import { generateToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ Message: "Invalid parameters" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { username } });

  if (!user || !bcrypt.compareSync(password, user.hash)) {
    return NextResponse.json({ Message: "Incorrect username or password" }, { status: 400 });
  }

  const token = generateToken({ username, hashPassword: user.hash }, 1296000);

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("Authorization", token, {
    httpOnly: true,
    maxAge: 1296000,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_DOMAIN : undefined,
  });

  return res;
}
