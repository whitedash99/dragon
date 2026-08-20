import { NextRequest, NextResponse } from "next/server";
import { recordSecurityAudit } from "@/lib/auth/security";

/**
 * Public registration is PERMANENTLY DISABLED on Dragon Studios Admin OS.
 * All administrator accounts MUST be provisioned via single-use Owner invitations.
 */
export async function POST(req: NextRequest) {
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

  await recordSecurityAudit({
    userEmail: "anonymous",
    action: "PUBLIC_REGISTRATION_BLOCKED",
    resource: "AUTH_GATEWAY",
    details: `Blocked public registration attempt from ${ipAddress}`,
    severity: "HIGH",
    ipAddress,
  });

  return NextResponse.json(
    {
      success: false,
      error: "403 Forbidden: Public registration is disabled. Administrator access is strictly by cryptographic invitation only.",
    },
    { status: 403 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "403 Forbidden: Public registration is disabled.",
    },
    { status: 403 }
  );
}
