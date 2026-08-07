import { NextRequest, NextResponse } from "next/server";

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
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get("dragon_admin_session")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Redirect unauthenticated users attempting to access protected routes to /login
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users attempting to access /login to /dashboard
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
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
    "/login",
  ],
};
