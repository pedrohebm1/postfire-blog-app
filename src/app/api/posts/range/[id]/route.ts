import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { id: rawId } = await context.params;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id < 0) {
      return NextResponse.json(
        { message: "Invalid page" },
        { status: 400 }
      );
    }

    const pageSize = 10;
    const totalPosts = await prisma.post.count();
    const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

    const page = id === 0 ? 1 : id;

    const posts = await prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author_id: true,
        bannerImage: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      posts,
      page,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}