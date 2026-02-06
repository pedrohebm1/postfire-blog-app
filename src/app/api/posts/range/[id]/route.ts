import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, route: { params: { id: string } }) {
  try {
    const id: number = Number(route.params.id);

    if (isNaN(id) || id < 0) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const postCount = await prisma.post.count();

    const pageSize = 10;
    const page = id === 0 ? Math.ceil(postCount / pageSize) : Math.ceil(id / pageSize);

    const posts = await prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        author_id: true,
        bannerImage: true,
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({ Posts: posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}