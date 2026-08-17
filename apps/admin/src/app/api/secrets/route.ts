import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "BREAK_GLASS", "OWNER"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Secrets Vault access is restricted to Executive Leadership." }, { status: 403 });
    }

    // Default system secrets metadata initial population if empty
    const count = await prisma.secretVault.count();
    if (count === 0) {
      await prisma.secretVault.createMany({
        data: [
          { name: "Neon PostgreSQL Database", category: "Neon", keyName: "DATABASE_URL", maskedValue: "postgresql://neondb_owner:npg_PL...neon.tech", createdById: auth.user.id },
          { name: "Resend Email Service API Key", category: "Resend", keyName: "RESEND_API_KEY", maskedValue: "re_SAR55rST_...3D2W", createdById: auth.user.id },
          { name: "Google OAuth Client ID", category: "Google OAuth", keyName: "GOOGLE_CLIENT_ID", maskedValue: "519609865712-...apps.googleusercontent.com", createdById: auth.user.id },
          { name: "Google OAuth Client Secret", category: "Google OAuth", keyName: "GOOGLE_CLIENT_SECRET", maskedValue: "GOCSPX-XCda...FX", createdById: auth.user.id },
          { name: "NextAuth Master JWT Secret", category: "NextAuth", keyName: "NEXTAUTH_SECRET", maskedValue: "e36ad16fcd54...acc95f9c", createdById: auth.user.id },
          { name: "Vercel Production Deployment Token", category: "Vercel", keyName: "VERCEL_TOKEN", maskedValue: "vcel_sec_...88f", createdById: auth.user.id },
          { name: "GitHub Enterprise API Token", category: "GitHub", keyName: "GITHUB_PAT", maskedValue: "ghp_88x...99q", createdById: auth.user.id },
          { name: "Cloudflare Edge Tunnel Key", category: "Cloudflare", keyName: "CLOUDFLARE_TUNNEL_KEY", maskedValue: "cf_tkn_...001", createdById: auth.user.id },
          { name: "Stripe Billing Production Key", category: "Stripe", keyName: "STRIPE_SECRET_KEY", maskedValue: "sk_live_...99z", isConfigured: false, createdById: auth.user.id },
        ],
      }).catch((e: unknown) => console.warn("Secret seed warning:", e));
    }

    const secrets = await prisma.secretVault.findMany({
      orderBy: { category: "asc" },
      include: {
        rotations: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "VIEW_SECRETS_VAULT",
        resource: "SECRETS_VAULT",
        details: `Viewed Secrets Vault metadata by ${auth.user.role}`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    return NextResponse.json({ success: true, secrets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "BREAK_GLASS", "OWNER"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Secret rotation requires Founder or Co-Founder privileges." }, { status: 403 });
    }

    const body = await req.json();
    const { secretId, maskedValue, reason } = body;

    if (!secretId || !maskedValue) {
      return NextResponse.json({ success: false, error: "secretId and maskedValue are required" }, { status: 400 });
    }

    const updated = await prisma.secretVault.update({
      where: { id: secretId },
      data: {
        maskedValue,
        lastRotated: new Date(),
        isConfigured: true,
      },
    });

    await prisma.secretRotationLog.create({
      data: {
        secretId,
        rotatedBy: auth.user.email,
        reason: reason || "Scheduled key rotation",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "ROTATE_SECRET_KEY",
        resource: updated.name,
        details: `Rotated secret key [${updated.keyName}] (${updated.category}). Reason: ${reason || "Key rotation"}`,
      },
    });

    return NextResponse.json({ success: true, message: `Secret [${updated.name}] rotated successfully.`, secret: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
