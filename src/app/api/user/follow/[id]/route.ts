import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const cookieStore = await cookies();
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

    const { id: rawId } = await context.params;

    if (!rawId) {
      return NextResponse.json({ message: "Missing userID" }, { status: 400 });
    }

    const id = Number(rawId);

    const targetUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
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
