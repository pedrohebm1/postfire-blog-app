// app/lib/auth.ts
import { cookies } from "next/headers";
import { verifyToken, decodeToken } from "@/app/lib/jwt"; // Adjust imports to match your setup
import { getUserByUsername } from "@/app/lib/jwt";

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("Authorization")?.value;

    if (!token || !verifyToken(token)) {
      return null;
    }

    const payload: any = decodeToken(token);
    const user = await getUserByUsername(payload.username);

    if (user) {
      user.hash = "";
      return user;
    }
  } catch (error) {
    console.error("Error retrieving session user:", error);
  }

  return null;
}