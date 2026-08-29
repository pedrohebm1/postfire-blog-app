import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
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

    const { content } = await req.json();
    const { id: rawId } = await context.params;
    const postId = Number(rawId);

    if (!postId || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.allowCommentaries === false) {
      return NextResponse.json(
        { message: "Commentaries are not allowed for this post" },
        { status: 403 }
      );
    }

    await prisma.commentary.create({
      data: {
        content,
        postId: postId,
        author_id: user.id,
      },
    });

    return NextResponse.json(
      { message: "Commentary successfully created" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
