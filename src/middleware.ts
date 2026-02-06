import { NextRequest, NextResponse } from "next/server";
import { authFetch } from "@/app/lib/authFetch";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("Authorization")?.value.toString() || null;
  if (!token) return NextResponse.redirect(new URL('/signin', req.url));
  let sessionUser = token ? await authFetch(token) : null;

  if (!sessionUser) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

export const config = {
    matcher: ['/post/create', '/post/edit', '/settings'],
}