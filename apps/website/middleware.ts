import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolvePlayerEntryState } from "@/lib/auth-decision-engine";
import { INSTALLATION_COOKIE_NAME } from "@/lib/installation";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dragon-studios-super-secret-auth-key-2026";

  const token = await getToken({ req, secret });
  const installationCookie = req.cookies.get(INSTALLATION_COOKIE_NAME)?.value || null;

  const isVerifyRoute = pathname === "/auth/verify-otp" || pathname === "/auth/verify-email";
  const isWelcomeRoute = pathname === "/welcome";
  const isDragonIdRoute = pathname === "/dragon-id/setup" || pathname.startsWith("/dragon-id/");
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isProfileRoute = pathname === "/profile" || pathname.startsWith("/profile/");
  const isSettingsRoute = pathname === "/settings" || pathname.startsWith("/settings/");
  const isProtectedPlayRoute = pathname.startsWith("/games/play/");

  const isProtectedRoute = isDashboardRoute || isProfileRoute || isSettingsRoute || isProtectedPlayRoute;

  // Resolve Authoritative State
  const decision = resolvePlayerEntryState({
    token: token as any,
    installationCookie,
  });

  // 1. Unauthenticated Users
  if (decision.state === "UNAUTHENTICATED") {
    if (isProtectedRoute || isWelcomeRoute || isDragonIdRoute) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Authenticated But OTP Pending
  if (decision.state === "OTP_REQUIRED") {
    if (!isVerifyRoute) {
      return NextResponse.redirect(new URL("/auth/verify-otp", req.url));
    }
    return NextResponse.next();
  }

  // 3. Welcome Required (Brand new account OR Fresh browser reset)
  if (decision.state === "WELCOME_REQUIRED") {
    if (isVerifyRoute || isDashboardRoute || isDragonIdRoute || isProfileRoute || isSettingsRoute) {
      return NextResponse.redirect(new URL("/welcome", req.url));
    }
    return NextResponse.next();
  }

  // 4. Dragon ID Setup Required
  if (decision.state === "DRAGON_ID_SETUP") {
    if (isVerifyRoute || isDashboardRoute || isWelcomeRoute || isProfileRoute || isSettingsRoute) {
      return NextResponse.redirect(new URL("/dragon-id/setup", req.url));
    }
    return NextResponse.next();
  }

  // 5. Fully Authenticated Player (Account Complete + Trusted Browser Installation)
  if (decision.state === "AUTHENTICATED") {
    if (isVerifyRoute || isWelcomeRoute || isDragonIdRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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



