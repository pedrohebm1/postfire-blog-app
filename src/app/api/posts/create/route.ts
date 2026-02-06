import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";
import validatePost from "@/app/lib/validations/postValidation";
import { cookies } from "next/headers";
import { fileUploadS3 } from "@/app/lib/amazons3";
import { ProcessImageFromBuffer } from "@/app/lib/imageProcessing";
import sanitizeHtml from 'sanitize-html';

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const summary = formData.get("summary") as string | null;
    const content = formData.get("content") as string | null;
    const bannerImage = formData.get("bannerImage") as File | null;
    const allowComments = formData.get("allowcomments") === "true";

    console.log(title, summary, content, bannerImage, content);
    if (!title || !summary || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { valid, errors } = validatePost({
      title,
      summary,
      content,
      bannerImage,
    });

    if (!valid) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    let fileUrl = null;
    if (bannerImage) {
      const arrayBuffer = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const optimizedBuffer = await ProcessImageFromBuffer({
        buffer,
        width: 1024,
        height: 512,
        fit: "cover",
        quality: 70,
      });

      fileUrl = await fileUploadS3(
        optimizedBuffer,
        bannerImage.name,
        bannerImage.type
      );
    }

    const sanitizedContent = await sanitizeHtml(content)

    const post = await prisma.post.create({
      data: {
        title: title,
        content: sanitizedContent,
        summary: summary,
        bannerImage: fileUrl,
        allowCommentaries: allowComments,
        author_id: user.id,
      },
    });
    return NextResponse.json({ id: post.id }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
