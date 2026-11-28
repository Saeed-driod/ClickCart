import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "clickcart_secret_key_123456789";

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
