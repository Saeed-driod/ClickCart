import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function getMiddlewareAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXTAUTH_SECRET environment variable must be set in production.");
    }
    throw new Error("NEXTAUTH_SECRET environment variable is required.");
  }
  return secret;
}

const AUTH_SECRET = getMiddlewareAuthSecret();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret: AUTH_SECRET });
    const isVerifiedAdmin =
      token && token.role === "ADMIN" && token.sessionVersion === "v2";

    if (pathname === "/admin/login") {
      if (isVerifiedAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!isVerifiedAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
