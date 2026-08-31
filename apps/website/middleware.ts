import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dragon-studios-super-secret-auth-key-2026";

  const token = await getToken({ req, secret });

  const isDragonIdCompleted = Boolean(token?.dragonIdSetupCompleted || token?.hasCompletedDragonId);
  const hasCompletedWelcome = Boolean(token?.hasCompletedWelcome);

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Protected routes boundary (requires active session AND completed Dragon ID)
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (!isDragonIdCompleted) {
      const destUrl = hasCompletedWelcome
        ? new URL("/dragon-id/setup", req.url)
        : new URL("/welcome", req.url);
      return NextResponse.redirect(destUrl);
    }
  }

  // 2. /welcome boundary: Incomplete users only. Completed users redirect to /dashboard.
  if (pathname === "/welcome") {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isDragonIdCompleted) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 3. /dragon-id/setup boundary: Unauthenticated -> /login. Completed -> /dashboard.
  if (pathname === "/dragon-id/setup" || pathname.startsWith("/dragon-id/")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isDragonIdCompleted) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // 4. /auth/verify-email boundary: Allow unverified users to verify OTP
  if (pathname === "/auth/verify-email" || pathname === "/auth/verify-otp") {
    // If user is already fully verified and session is active, redirect to destination
    const isEmailVerified = Boolean((token as any)?.emailVerified || (token as any)?.otpVerified);
    if (token && isEmailVerified) {
      const destUrl = isDragonIdCompleted
        ? new URL("/dashboard", req.url)
        : hasCompletedWelcome
        ? new URL("/dragon-id/setup", req.url)
        : new URL("/welcome", req.url);
      return NextResponse.redirect(destUrl);
    }
    // Allow pending/unverified user to access verification page
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/profile/:path*",
    "/profile",
    "/settings/:path*",
    "/settings",
    "/welcome",
    "/dragon-id/:path*",
    "/dragon-id/setup",
    "/auth/verify-email",
  ],
};

