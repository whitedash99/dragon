import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@dragon/shared-db";
import { sendEmail } from "@dragon/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      jobTitle,
      department,
      applicantName,
      applicantEmail,
      phone,
      country,
      portfolioUrl,
      linkedinUrl,
      primarySkill,
      experience,
      whyJoin,
      relevantProjects,
      resumeUrl,
      note,
    } = body;

    if (!applicantName || !applicantEmail || !portfolioUrl || !jobTitle) {
      return NextResponse.json(
        { success: false, error: "Name, email, portfolio URL, and target position are required." },
        { status: 400 }
      );
    }

    const cleanEmail = applicantEmail.trim().toLowerCase();

    // Prevent duplicate active applications for the same email
    const existingActive = await prisma.teamApplication.findFirst({
      where: {
        applicantEmail: cleanEmail,
        status: { in: ["PENDING", "UNDER_REVIEW", "MORE_INFORMATION"] },
      },
    });

    if (existingActive) {
      return NextResponse.json(
        { success: false, error: `An active application (${existingActive.applicationNumber || "under review"}) for ${cleanEmail} is already being evaluated.` },
        { status: 400 }
      );
    }

    // Generate sequential Application Number (DRG-APP-2026-00001)
    const count = await prisma.teamApplication.count();
    const applicationNumber = `DRG-APP-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

    // 1. Create TeamApplication in Neon PostgreSQL
    const application = await prisma.teamApplication.create({
      data: {
        applicationNumber,
        jobId: jobId || "general",
        jobTitle: jobTitle.trim(),
        department: department || "Engineering",
        applicantName: applicantName.trim(),
        applicantEmail: cleanEmail,
        phone: phone ? phone.trim() : null,
        country: country ? country.trim() : "Global / Remote",
        portfolioUrl: portfolioUrl.trim(),
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null,
        primarySkill: primarySkill ? primarySkill.trim() : "Core Engine Architecture",
        experience: experience ? experience.trim() : "Senior",
        whyJoin: whyJoin ? whyJoin.trim() : null,
        relevantProjects: relevantProjects ? relevantProjects.trim() : null,
        resumeUrl: resumeUrl ? resumeUrl.trim() : null,
        note: note ? note.trim() : null,
        status: "PENDING",
      },
    });

    // Log real analytics event for Owner Data Command Center
    await prisma.analyticsEvent.create({
      data: {
        event: "CAREER_APPLICATION",
        category: "Recruitment",
        userEmail: cleanEmail,
        metadata: JSON.stringify({ applicationNumber, jobTitle: application.jobTitle, department: application.department }),
      },
    }).catch((e: unknown) => console.warn("Analytics event logging warning:", e));

    // 2. Create Real Owner Notification in Database
    await prisma.notification.create({
      data: {
        recipient: "Owner",
        title: "New Team Application Submitted",
        message: `${applicantName} applied for ${jobTitle} (${applicationNumber}).`,
        type: "TEAM_APPLICATION",
      },
    }).catch(() => null);

    // 3. Send Owner Alert via Resend
    await sendEmail({
      to: "dragonstudiosofficial01@gmail.com",
      subject: `[Team Application ${applicationNumber}] New Candidate: ${applicantName} (${jobTitle})`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 600px; margin: 0 auto;">
          <div style="font-size: 20px; font-weight: 900; color: #38bdf8; margin-bottom: 16px;">
            DRAGON STUDIOS — NEW TEAM APPLICATION (${applicationNumber})
          </div>
          <p style="font-size: 14px; color: #e4e4e7;">Candidate <strong>${applicantName}</strong> has submitted an application for <strong>${jobTitle}</strong> (${department || "Engineering"}).</p>
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #a1a1aa;">
            <div><strong>Email:</strong> ${cleanEmail}</div>
            <div><strong>Location:</strong> ${country || "Remote"}</div>
            <div><strong>Skill:</strong> ${primarySkill || "Engine Architecture"}</div>
            <div><strong>Experience:</strong> ${experience || "Senior"}</div>
            <div><strong>Portfolio:</strong> <a href="${portfolioUrl}" style="color: #38bdf8;">${portfolioUrl}</a></div>
            ${linkedinUrl ? `<div><strong>LinkedIn/GitHub:</strong> <a href="${linkedinUrl}" style="color: #38bdf8;">${linkedinUrl}</a></div>` : ""}
          </div>
          <p style="font-size: 13px; color: #d4d4d8;">Review, approve, or request more information in the <a href="http://localhost:4000/team-key-portal" style="color: #ffffff; font-weight: bold;">Dragon Team Key Portal</a>.</p>
        </div>
      `,
    }).catch((e) => console.warn("Resend owner notification warning:", e));

    // 4. Send Applicant Confirmation Email
    await sendEmail({
      to: cleanEmail,
      subject: `Application Confirmation ${applicationNumber} — Dragon Studios`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #09090b; color: #ffffff; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffffff; font-weight: 900;">Application Received</h2>
          <p style="font-size: 14px; color: #d4d4d8;">Hello <strong>${applicantName}</strong>,</p>
          <p style="font-size: 14px; color: #d4d4d8;">Your application for <strong>${jobTitle}</strong> has been registered with reference <strong>${applicationNumber}</strong>.</p>
          <p style="font-size: 13px; color: #a1a1aa; margin-top: 20px;">You can track your status anytime at <a href="http://localhost:3000/careers/status?app=${applicationNumber}" style="color: #38bdf8;">Application Status Portal</a>.</p>
        </div>
      `,
    }).catch((e) => console.warn("Resend confirmation warning:", e));

    // 5. Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: "system",
        userEmail: cleanEmail,
        action: "APPLICATION_CREATED",
        resource: "PUBLIC_CAREERS",
        details: `Candidate ${applicantName} (${cleanEmail}) applied for ${jobTitle} [Ref: ${applicationNumber}].`,
      },
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      message: "Team application submitted successfully.",
      applicationId: application.id,
      applicationNumber,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appNumber = searchParams.get("appNumber");
    const email = searchParams.get("email");

    if (appNumber || email) {
      const whereCondition: Record<string, unknown> = {};
      if (appNumber && email) {
        whereCondition.AND = [
          { applicationNumber: appNumber.trim() },
          { applicantEmail: email.trim().toLowerCase() },
        ];
      } else if (appNumber) {
        whereCondition.applicationNumber = appNumber.trim();
      } else if (email) {
        whereCondition.applicantEmail = email.trim().toLowerCase();
      }

      const application = await prisma.teamApplication.findFirst({
        where: whereCondition,
      });

      if (!application) {
        return NextResponse.json({ success: false, error: "Application record not found matching the provided details." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        application: {
          applicationNumber: application.applicationNumber,
          applicantName: application.applicantName,
          jobTitle: application.jobTitle,
          department: application.department,
          status: application.status,
          createdAt: application.createdAt,
        },
      });
    }

    const applications = await prisma.teamApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
