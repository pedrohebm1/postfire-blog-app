import { fileUploadS3 } from "@/app/lib/amazons3";
import { ProcessImageFromBuffer } from "@/app/lib/imageProcessing";
import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import postValidation from "@/app/lib/validations/postValidation";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "crypto";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
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

    const { id: rawId } = await context.params;

    const formData = await req.formData();

    if (!rawId) {
      return NextResponse.json(
        { message: "Invalid parameters" },
        { status: 404 }
      );
    }

    const id = Number(rawId);

    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (user.id !== post.author_id) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const title = formData.get("title") as string | null;
    const summary = formData.get("summary") as string | null;
    const content = formData.get("content") as string | null;
    const bannerImage = formData.get("bannerimage") as File | null;
    const allowComments = formData.get("allowcomments")
      ? formData.get("allowcomments") === "true"
        ? true
        : false
      : (null as Boolean | null);

    const validation = postValidation({
      title,
      summary,
      content,
      bannerImage,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.errors },
        { status: 400 }
      );
    }

    let fileUrl = null;
    if (bannerImage) {
      const arrayBuffer = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const detectedType = await fileTypeFromBuffer(buffer);

      if (!detectedType) {
        return NextResponse.json(
          { message: "Security Error: Invalid or malicious image format detected." },
          { status: 400 }
        );
      }

      const optimizedBuffer = await ProcessImageFromBuffer({
        buffer: buffer,
        width: 1024,
        height: 512,
        fit: "cover",
        quality: 70,
      });

      const fileExtension = detectedType.ext;
      const generatedName = `${randomUUID()}.${fileExtension}`

      fileUrl = await fileUploadS3(
        optimizedBuffer,
        bannerImage.name,
        bannerImage.type
      );
    }

    const sanitizedContent = sanitizeHtml(content || "");

    await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title ? title : post.title,
        content: content ? content : sanitizedContent,
        summary: summary ? summary : post.summary,
        bannerImage: fileUrl ? fileUrl : post.bannerImage,
        allowCommentaries:
          allowComments != null
            ? Boolean(allowComments)
            : post.allowCommentaries,
      },
    });

    return NextResponse.json(
      { id: post.id, message: "Updated successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
