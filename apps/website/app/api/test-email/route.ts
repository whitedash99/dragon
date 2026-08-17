import { NextResponse } from "next/server";
import { sendEnterpriseEmail } from "@/lib/email";

export async function GET() {
  try {
    const result = await sendEnterpriseEmail({
      ticketId: "DRG-TEST-VERIFY",
      name: "Dragon Developer",
      email: "dragonstudiosofficial01@gmail.com",
      company: "Dragon Studios",
      phone: "+91 98765 43210",
      category: "Pipeline Verification",
      subject: "Verification Test — Contact to Resend Email Pipeline",
      message: "This email confirms that the Dragon Studios Resend email integration is 100% operational, fully logged, and delivered directly to the owner inbox.",
      priority: "HIGH",
      status: "OPEN",
      slaTarget: "Immediate",
      trackingUrl: "http://localhost:3000/support/DRG-TEST-VERIFY",
      clientIp: "127.0.0.1",
      clientCountry: "India",
      browser: "Google Chrome",
      os: "Windows OS",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: result.success,
      internalSent: result.internalSent,
      customerSent: result.customerSent,
      error: result.error || null,
      message: result.success
        ? "Email pipeline verified! Email successfully dispatched via Resend."
        : "Email dispatch failed. See error details.",
    });
  } catch (error: any) {
    console.error("Test Email API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
