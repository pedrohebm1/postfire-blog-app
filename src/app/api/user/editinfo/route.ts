import { deleteFileS3, fileUploadS3 } from "@/app/lib/amazons3";
import { ProcessImageFromBuffer } from "@/app/lib/imageProcessing";
import { decodeToken, getUserByUsername, verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 401 }
      );
    }

    if (!verifyToken(token.value)) {
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

    const bio = formData.get("bio") as string | null;
    const socialgithub = formData.get("socialgithub") as string | null;
    const socialwebsite = formData.get("socialwebsite") as string | null;
    const socialinstagram = formData.get("socialinstagram") as string | null;
    const socialtwitter = formData.get("socialtwitter") as string | null;
    const picture = formData.get("picture") as File | null;
    const bannerimage = formData.get("bannerimage") as File | null;

    if (picture && user.picture) {
      console.log("deleted user picture");
      const key = user.picture.split("/").pop();
      if (key) {
        await deleteFileS3(key);
      }
    }

    if (bannerimage && user.userBanner) {
      console.log("deleted user banner");
      const key = user.userBanner.split("/").pop();
      if (key) {
        await deleteFileS3(key);
      }
    }

    let bannerUrl = null;
    let pictureUrl = null;

    if (picture != null) {
      const arrayBuffer = await picture.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const optimizedBuffer = await ProcessImageFromBuffer({
        buffer,
        width: 300,
        height: 300,
        fit: "cover",
        quality: 80,
      });

      pictureUrl = await fileUploadS3(
        optimizedBuffer,
        picture.name,
        "image/webp"
      );

      if (!pictureUrl) {
        return NextResponse.json(
          { message: "Failed to upload profile picture" },
          { status: 500 }
        );
      }
    }

    if (bannerimage != null) {
      const arrayBuffer = await bannerimage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const optimizedBuffer = await ProcessImageFromBuffer({
        buffer: buffer,
        width: 1200,
        height: 600,
        fit: "cover",
        quality: 100,
      });

      bannerUrl = await fileUploadS3(
        optimizedBuffer,
        bannerimage.name,
        "image/webp"
      );

      if (!bannerUrl) {
        return NextResponse.json(
          { message: "Failed to upload banner image" },
          { status: 500 }
        );
      }
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        bio: bio ? bio : user.bio,
        picture: pictureUrl ? pictureUrl : user.picture,
        userBanner: bannerUrl ? bannerUrl : user.userBanner,
        socialGithub: socialgithub ? socialgithub : user.socialGithub,
        socialTwitter: socialtwitter ? socialtwitter : user.socialTwitter,
        socialInstagram: socialinstagram
          ? socialinstagram
          : user.socialInstagram,
        socialWebsite: socialwebsite ? socialwebsite : user.socialWebsite,
      },
    });

    return NextResponse.json(
      { message: "Updated successfully." },
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
