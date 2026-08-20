import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAdmin } from "@dragon/auth";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/users",
  "/settings",
  "/cms",
  "/crm",
  "/games",
  "/media",
  "/analytics",
  "/ai",
  "/knowledge",
  "/marketing",
  "/api-platform",
  "/automation",
  "/notifications",
  "/security",
  "/developer",
  "/performance",
  "/deployments",
  "/editor",
  "/communication",
  "/secrets",
  "/terminal",
  "/data-control",
  "/devices",
  "/audit",
  "/identity",
  "/domains",
  "/access",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0. Redirect public signup to secure login gateway
  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const adminCookie = req.cookies.get("dragon_admin_session")?.value;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dragon-studios-super-secret-auth-key-2026",
  });

  const isAuthenticated = !!adminCookie || !!token;
  const userRole = (token?.role as string) || (adminCookie ? "ADMIN" : "USER");

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Redirect unauthenticated users attempting to access protected admin routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Check Role Authorization for Admin Panel
  if (isProtectedRoute && token && !canAccessAdmin(userRole)) {
    const unauthorizedUrl = new URL("/login", req.url);
    unauthorizedUrl.searchParams.set("error", "UnauthorizedAdminAccess");
    return NextResponse.redirect(unauthorizedUrl);
  }

  // 3. Redirect authenticated users attempting to access /login to /dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const response = NextResponse.next();

  // 4. Inject Production Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/cms/:path*",
    "/crm/:path*",
    "/games/:path*",
    "/media/:path*",
    "/analytics/:path*",
    "/ai/:path*",
    "/knowledge/:path*",
    "/marketing/:path*",
    "/api-platform/:path*",
    "/automation/:path*",
    "/notifications/:path*",
    "/security/:path*",
    "/developer/:path*",
    "/performance/:path*",
    "/deployments/:path*",
    "/editor/:path*",
    "/communication/:path*",
    "/secrets/:path*",
    "/terminal/:path*",
    "/data-control/:path*",
    "/devices/:path*",
    "/audit/:path*",
    "/identity/:path*",
    "/domains/:path*",
    "/access/:path*",
    "/login",
    "/signup",
  ],
};
