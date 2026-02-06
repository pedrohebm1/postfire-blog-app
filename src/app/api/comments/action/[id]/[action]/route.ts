import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function handleLikeAction(commentaryId: number, userId: number) {
  const commentary = await prisma.commentary.findUnique({
    where: { id: commentaryId },
    select: { id: true, userLikes: { select: { id: true } } },
  });

  if (!commentary) {
    return NextResponse.json(
      { message: "Commentary not found" },
      { status: 404 }
    );
  }

  const isLiking = commentary.userLikes.some((like) => like.id === userId);
  await prisma.commentary.update({
    where: { id: commentaryId },
    data: {
      userLikes: isLiking
        ? { disconnect: { id: userId } }
        : { connect: { id: userId } },
    },
  });

  return NextResponse.json({ isLiking: !isLiking }, { status: 201 });
}

const MAX_COMMENT_DEPTH = 3;

async function handleCommentAction(
  postId: number,
  content: string,
  userId: number,
  parentCommentId?: number
) {
  if (!content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 400 }
    );
  }

  let depth = 0;

  if (parentCommentId) {
    const parentCommentary = await prisma.commentary.findUnique({
      where: { id: parentCommentId },
      select: { depth: true },
    });

    if (!parentCommentary) {
      return NextResponse.json(
        { message: "Parent commentary not found" },
        { status: 404 }
      );
    }

    depth = parentCommentary.depth + 1;

    if (depth >= MAX_COMMENT_DEPTH) {
      return NextResponse.json(
        { message: "Nested comments beyond the allowed depth are not allowed" },
        { status: 400 }
      );
    }
  }

  const newCommentary = await prisma.commentary.create({
    data: {
      postId,
      content,
      parentCommentId: parentCommentId || null,
      author_id: userId,
      depth: depth,
    },
  });

  return NextResponse.json(
    { message: "Comment created", commentary: newCommentary },
    { status: 201 }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: any; action: any } }
) {
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

    const { id, action } = params;
    const commentaryId = Number(id);

    if (!id || !action) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["like", "comment"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    if (action === "like") {
      return handleLikeAction(commentaryId, user.id);
    } else if (action === "comment") {
      let body;

      try {
        body = await req.json();
      } catch {
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
      }

      const { content, commentaryid, postId } = body;

      if (!content || !postId) {
        return NextResponse.json(
          { message: "Content and postId are required" },
          { status: 400 }
        );
      }

      return handleCommentAction(
        Number(postId),
        content,
        user.id,
        commentaryid
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: any } }
) {
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

    const { id } = params;
    const commentaryId = Number(id);

    if (!id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const commentary = await prisma.commentary.findUnique({
      where: { id: commentaryId },
      select: {
        id: true,
        author_id: true,
        subcommentaries: { select: { id: true } },
        depth: true,
        parentCommentId: true,
        post: {
          select: { author_id: true },
        },
        parentComment: {
          select: {
            isDeletedContent: true,
          },
        },
      },
    });

    if (commentary?.author_id !== user.id) {
      if (commentary?.post.author_id !== user.id) {
        return NextResponse.json(
          { message: "Unauthorized action" },
          { status: 403 }
        );
      }
    }

    // Avoid orphaned parent commentaries
    if (
      commentary?.depth === 1 &&
      commentary.parentCommentId &&
      commentary.parentComment &&
      commentary?.parentComment.isDeletedContent === true &&
      commentary?.subcommentaries.length === 0
    ) {
      await prisma.commentary.delete({
        where: { id: commentary.parentCommentId },
      });
    }

    if (commentary?.subcommentaries.length > 0) {
      await prisma.commentary.update({
        where: { id: commentaryId },
        data: {
          content: "[Deleted commentary]",
          isDeletedContent: true,
        },
      });
    } else {
      await prisma.commentary.delete({ where: { id: commentaryId } });
    }

    return NextResponse.json(
      { message: "Commentary deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
