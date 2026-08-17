import { getAuthenticatedUser } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export async function requireProtectedOwner(): Promise<
  | { authorized: false; response: NextResponse; auth: null | unknown; user: null }
  | { authorized: true; response: null; auth: unknown; user: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUser>>>["user"] }
> {
  const auth = await getAuthenticatedUser();

  if (!auth || !auth.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Authentication required. Please sign in to DIP." },
        { status: 401 }
      ),
      auth: null,
      user: null,
    };
  }

  const user = auth.user;
  const isOwnerRole = user.role === "OWNER";
  const isProtected = Boolean(user.isProtected);
  const isActive = Boolean(user.isActive) && !user.isDeleted;

  if (!isOwnerRole || !isProtected || !isActive) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "ACCESS DENIED: Data Command Center requires a protected OWNER account.",
        },
        { status: 403 }
      ),
      auth,
      user: null,
    };
  }

  return {
    authorized: true,
    response: null,
    auth,
    user,
  };
}
