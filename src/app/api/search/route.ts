import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

const range = 10;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "posts";
  const lastId = parseInt(searchParams.get("lastId") || "0", 10);

  if (!query || !category) {
    return NextResponse.json({ message: "Invalid parameters" }, { status: 400 });
  }

  let data;

  if (category === "users") {
    data = await prisma.user.findMany({
      where: {
        username: { contains: query, mode: "insensitive" },
      },
      take: range,
      skip: lastId ? 1 : 0,
      cursor: lastId ? { id: lastId } : undefined,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        username: true,
        picture: true,
        description: true
      }
    });
    return NextResponse.json({ Users: data }, { status: 200 });
  } else {
    data = await prisma.post.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
      take: range,
      skip: lastId ? 1 : 0,
      cursor: lastId ? { id: lastId } : undefined,
      orderBy: {
        id: "asc",
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ Posts: data }, { status: 200 });
  }
}