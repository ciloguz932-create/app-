import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

const PUBLIC_PAGES = new Set(["/", "/login", "/register", "/pricing", "/leaderboard", "/offline"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // APIs: public ones pass through; protected ones are authorized in their handlers
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Logged-in users skip marketing/auth pages
  if (session && (pathname === "/" || pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (PUBLIC_PAGES.has(pathname)) {
    return NextResponse.next();
  }

  // Everything else requires a session
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optimistic admin gate (re-verified server-side in the page)
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon|apple-icon|manifest\\.webmanifest|sw\\.js|icons/|.*\\.(?:svg|png|jpg|jpeg|webp|mp3)).*)",
  ],
};
