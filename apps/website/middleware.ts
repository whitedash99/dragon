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

  const isEmailVerified = Boolean((token as any)?.emailVerified || (token as any)?.otpVerified);
  const isDragonIdCompleted = Boolean((token as any)?.dragonIdSetupCompleted || (token as any)?.hasCompletedDragonId);
  const hasCompletedWelcome = Boolean((token as any)?.hasCompletedWelcome);

  const isVerifyRoute = pathname === "/auth/verify-otp" || pathname === "/auth/verify-email";
  const isWelcomeRoute = pathname === "/welcome";
  const isDragonIdRoute = pathname === "/dragon-id/setup" || pathname.startsWith("/dragon-id/");
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isProfileRoute = pathname === "/profile" || pathname.startsWith("/profile/");
  const isSettingsRoute = pathname === "/settings" || pathname.startsWith("/settings/");
  const isProtectedPlayRoute = pathname.startsWith("/games/play/");

  const isProtectedRoute = isDashboardRoute || isProfileRoute || isSettingsRoute || isProtectedPlayRoute;

  // ═══════════════════════════════════════════════════════════════════════
  // 1. UNAUTHENTICATED USERS
  // ═══════════════════════════════════════════════════════════════════════
  if (!token) {
    if (isProtectedRoute || isWelcomeRoute || isDragonIdRoute) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Allow public access to /auth/verify-otp only if pending email cookie is present or direct load
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 2. AUTHENTICATED BUT EMAIL OTP NOT VERIFIED (MANDATORY GATE 1)
  // ═══════════════════════════════════════════════════════════════════════
  if (!isEmailVerified) {
    // If not already on verification page, redirect to /auth/verify-otp
    if (!isVerifyRoute) {
      const verifyUrl = new URL("/auth/verify-otp", req.url);
      return NextResponse.redirect(verifyUrl);
    }
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. FULLY OTP VERIFIED USERS
  // ═══════════════════════════════════════════════════════════════════════

  // If already verified and trying to access verify page, redirect to correct stage
  if (isVerifyRoute) {
    if (!hasCompletedWelcome) {
      return NextResponse.redirect(new URL("/welcome", req.url));
    }
    if (!isDragonIdCompleted) {
      return NextResponse.redirect(new URL("/dragon-id/setup", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // A. WELCOME STAGE GUARD
  if (isWelcomeRoute) {
    if (isDragonIdCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (hasCompletedWelcome) {
      return NextResponse.redirect(new URL("/dragon-id/setup", req.url));
    }
    return NextResponse.next();
  }

  // B. DRAGON ID SETUP STAGE GUARD
  if (isDragonIdRoute) {
    if (!hasCompletedWelcome) {
      return NextResponse.redirect(new URL("/welcome", req.url));
    }
    if (isDragonIdCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // C. DASHBOARD & PROTECTED ROUTES GUARD
  if (isProtectedRoute) {
    if (!hasCompletedWelcome) {
      return NextResponse.redirect(new URL("/welcome", req.url));
    }
    if (!isDragonIdCompleted) {
      return NextResponse.redirect(new URL("/dragon-id/setup", req.url));
    }
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
    "/auth/verify-otp",
    "/auth/verify-email",
    "/games/play/:path*",
  ],
};


