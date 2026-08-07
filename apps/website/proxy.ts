import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Determine if request is hitting the Admin Domain (e.g. admin.dragonstudios.com or admin.localhost:3000)
  const isAdminDomain = hostname.startsWith("admin.") || hostname.includes("admin.localhost");
  const isAdminPath = pathname.startsWith("/admin");
  const isApiPath = pathname.startsWith("/api");
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/auth");
  const isStaticAsset = pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/uploads");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // 1. Domain-based routing: Rewrites admin.dragonstudios.com root requests to /admin
  if (isAdminDomain && !isAdminPath && !isApiPath && !isAuthPath) {
    url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Security Guard for Admin routes
  if (isAdminDomain || isAdminPath) {
    const sessionToken = req.cookies.get("dragon_session")?.value || req.cookies.get("dragon_auth_token")?.value;

    // Allow public access to /login or /auth pages if trying to log into Admin
    if (!sessionToken && !isAuthPath && !isApiPath) {
      // In production/development, redirect unauthenticated admin visitors to /login
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Construct Security Response Headers
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' http://localhost:* http://127.0.0.1:* https://*.dragonstudios.com"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
};
