import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_WEBSITE_ROUTES = ["/dashboard", "/profile", "/account", "/settings"];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const isApiPath = pathname.startsWith("/api");
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/auth");
  const isStaticAsset = pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/uploads");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // 1. Check Protected User Routes in Website
  const isProtectedRoute = PROTECTED_WEBSITE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dragon-studios-super-secret-auth-key-2026",
    });
    const sessionToken = req.cookies.get("dragon_session")?.value || req.cookies.get("dragon_auth_token")?.value;

    if (!token && !sessionToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Construct Security Response Headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};
