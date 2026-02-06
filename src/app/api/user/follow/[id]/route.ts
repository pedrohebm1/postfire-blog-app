import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: any } }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("Authorization");

    if (!token || !verifyToken(token.value)) {
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 401 }
      );
    }

    const payload: any = decodeToken(token.value);
    const user = await getUserByUsername(payload.username);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!params.id) {
      return NextResponse.json({ message: "Missing userID" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (targetUser.id === user?.id) {
      return NextResponse.json(
        { message: "Action unauthorized" },
        { status: 401 }
      );
    }

    const isFollowing = await prisma.user.findFirst({
      where: {
        id: user?.id,
        following: {
          some: {
            id: targetUser.id,
          },
        },
      },
    });

    if (isFollowing) {
      await prisma.user.update({
        where: { id: user?.id },
        data: {
          following: {
            disconnect: { id: targetUser.id },
          },
        },
      });

      return NextResponse.json(
        { isFollowing: false },
        { status: 200 }
      );
    } else {
      await prisma.user.update({
        where: { id: user?.id },
        data: {
          following: {
            connect: { id: targetUser.id },
          },
        },
      });

      return NextResponse.json(
        { isFollowing: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
  }
}
