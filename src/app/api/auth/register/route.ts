import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/app/lib/jwt";
import validateCredentials from "@/app/lib/validations/userRegisterValidation";

interface Data {
  username: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const { username, email, password }: Data = await req.json();

  if (!email || !email || !password) {
    return NextResponse.json(
      { Message: "Invalid parameters" },
      { status: 400 }
    );
  }

  const { valid } = validateCredentials({ username, email, password });

  if (!valid) {
    return NextResponse.json(
      { Message: "Invalid parameters" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: username.trim(),
        hash: hashedPassword.trim(),
        email: email.trim(),
      },
    });

    const token = generateToken({ username, hashedPassword }, 1296000);

    const cookieStore = await cookies();

    await cookieStore.set("Authorization", token, {
      httpOnly: true,
      maxAge: 1296000,
      domain: process.env.NEXT_PUBLIC_DOMAIN,
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ success: true, message: "User registered" }, { status: 201 });
  } else {
    return NextResponse.json(
      { Message: "User already exists" },
      { status: 409 }
    );
  }
}
