import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteFileS3 } from "@/app/lib/amazons3";

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const id = Number(params.id)

    const cookieStore = cookies();
    const token = cookieStore.get("Authorization");

    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 401 });
    }

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

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        author: true,
        bannerImage: true
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (user.id != post.author.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    if (post.bannerImage) {
      const key = post.bannerImage.split("/").pop();
      if (key){
      await deleteFileS3(key);}
    }

    await prisma.commentary.deleteMany({
      where: {
        postId: Number(id)
      }
    })
    
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(
      { message: "Post Deleted Successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
