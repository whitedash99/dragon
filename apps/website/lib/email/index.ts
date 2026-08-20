import { getResendClient } from "./resend";
import { 
  renderCustomerResendEmail, 
  renderAdminResendEmail 
} from "./resend-templates";
import { 
  getSenderEmail, 
  getStudioEmail, 
  renderInternalEmailHtml, 
  renderCustomerEmailHtml, 
  renderAdminReplyEmailHtml,
  TicketEmailParams, 
  AdminReplyEmailParams 
} from "./templates";

/**
 * Returns the owner/admin notification email address.
 * Priority: OWNER_NOTIFICATION_EMAIL > CONTACT_EMAIL > siteConfig fallback
 */
function getOwnerEmail(): string {
  return (
    process.env.OWNER_NOTIFICATION_EMAIL?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    getStudioEmail()
  );
}

/**
 * Returns the FROM email address for Resend.
 * Priority: EMAIL_FROM > DEFAULT_FROM_EMAIL > onboarding@resend.dev (sandbox)
 */
function getFromEmail(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.DEFAULT_FROM_EMAIL?.trim() ||
    "onboarding@resend.dev"
  );
}

/**
 * Enterprise Email Dispatcher Service
 * 
 * Resend is the primary and only email provider.
 * 
 * IMPORTANT: When using Resend sandbox (onboarding@resend.dev),
 * emails can ONLY be delivered to the Resend account owner's email.
 * Customer confirmation emails will fail in sandbox mode — this is expected.
 * Only the admin/owner notification email will succeed.
 */
export async function sendEnterpriseEmail(params: TicketEmailParams): Promise<{
  success: boolean;
  internalSent: boolean;
  customerSent: boolean;
  error?: string;
}> {
  const resend = getResendClient();
  const fromEmail = getFromEmail();
  const ownerEmail = getOwnerEmail();
  const trackingUrl = params.trackingUrl || `${process.env.NEXTAUTH_URL || "https://dragonstudios.com"}/support/${params.ticketId}`;

  const isSandbox = fromEmail === "onboarding@resend.dev";

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🚀 DRAGON STUDIOS — EMAIL DISPATCH ENGINE");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`📧 FROM:           ${fromEmail}`);
  console.log(`📧 OWNER TO:       ${ownerEmail}`);
  console.log(`📧 CUSTOMER TO:    ${params.email}`);
  console.log(`🎫 TICKET:         ${params.ticketId}`);
  console.log(`🔑 API KEY:        ${process.env.RESEND_API_KEY?.trim() ? "✅ Present (" + process.env.RESEND_API_KEY.trim().substring(0, 10) + "...)" : "❌ MISSING"}`);
  console.log(`🏖️  SANDBOX MODE:   ${isSandbox ? "YES — can only send to account owner email" : "NO — custom domain"}`);
  console.log("═══════════════════════════════════════════════════════════════");

  if (!resend) {
    const errorMsg = "RESEND_API_KEY is not configured. No emails will be sent.";
    console.error(`❌ ${errorMsg}`);
    return { success: false, internalSent: false, customerSent: false, error: errorMsg };
  }

  // Admin recipients array: guarantees both owner emails receive the alert
  const adminRecipients = Array.from(
    new Set([
      "dragonstudiosofficial01@gmail.com",
      "whitedash99@gmail.com",
      ownerEmail.toLowerCase().trim(),
    ].filter(Boolean))
  );

  const formattedFrom = fromEmail.includes("<") ? fromEmail : `Dragon Studios <${fromEmail}>`;

  let customerSent = false;
  let internalSent = false;
  const errors: string[] = [];

  // ─────────────────────────────────────────────────────
  // 1. ADMIN/OWNER NOTIFICATION EMAIL (INDIVIDUAL RECIPIENT DISPATCH)
  // ─────────────────────────────────────────────────────
  // Sending individually ensures that Resend sandbox multi-recipient 403 error is avoided
  for (const recipient of adminRecipients) {
    try {
      console.log(`\n📨 Sending ADMIN notification to: ${recipient}`);
      
      const adminRes = await resend.emails.send({
        from: formattedFrom,
        to: [recipient],
        replyTo: params.email.trim(),
        subject: `🚨 [${params.ticketId}] ${params.category || "General"} | ${params.subject.trim()}`,
        html: renderAdminResendEmail({
          ticketId: params.ticketId,
          name: params.name,
          email: params.email,
          company: params.company,
          phone: params.phone,
          category: params.category,
          subject: params.subject,
          message: params.message,
          priority: params.priority,
          status: params.status || "OPEN",
          estimatedResponse: params.slaTarget,
          trackingUrl,
          clientIp: params.clientIp,
          clientCountry: params.clientCountry,
          browser: params.browser,
          createdAt: params.createdAt || new Date(),
        }),
      });

      if (adminRes.data?.id) {
        internalSent = true;
        console.log(`✅ ADMIN email DELIVERED to ${recipient} — Resend ID: ${adminRes.data.id}`);
      } else if (adminRes.error) {
        const errMsg = `Resend API error for ${recipient}: ${adminRes.error.name} — ${adminRes.error.message}`;
        console.error(`❌ ADMIN email to ${recipient} FAILED: ${errMsg}`);
        errors.push(errMsg);
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error(`❌ ADMIN email EXCEPTION for ${recipient}: ${errMsg}`);
      errors.push(`Admin dispatch exception for ${recipient}: ${errMsg}`);
    }
  }

  // ─────────────────────────────────────────────────────
  // 2. CUSTOMER CONFIRMATION EMAIL
  // ─────────────────────────────────────────────────────
  try {
    console.log(`\n📨 Sending CUSTOMER confirmation to: ${params.email}`);

    const customerRes = await resend.emails.send({
      from: formattedFrom,
      to: [params.email.trim()],
      subject: `Support Request Received [${params.ticketId}] — Dragon Studios`,
      html: renderCustomerResendEmail({
        ticketId: params.ticketId,
        name: params.name,
        email: params.email,
        company: params.company,
        phone: params.phone,
        category: params.category,
        subject: params.subject,
        message: params.message,
        priority: params.priority,
        status: params.status || "OPEN",
        estimatedResponse: params.slaTarget,
        trackingUrl,
        clientIp: params.clientIp,
        clientCountry: params.clientCountry,
        browser: params.browser,
        createdAt: params.createdAt || new Date(),
      }),
    });

    if (customerRes.data?.id) {
      customerSent = true;
      console.log(`✅ CUSTOMER email DELIVERED — Resend ID: ${customerRes.data.id}`);
    } else if (customerRes.error) {
      const errMsg = `Resend API error: ${customerRes.error.name} — ${customerRes.error.message}`;
      console.error(`❌ CUSTOMER email FAILED: ${errMsg}`);
      errors.push(errMsg);
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error(`❌ CUSTOMER email EXCEPTION: ${errMsg}`);
    errors.push(`Customer dispatch exception: ${errMsg}`);
  }

  // ─────────────────────────────────────────────────────
  // 3. FINAL STATUS REPORT
  // ─────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📊 EMAIL DISPATCH REPORT");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`🎫 Ticket:      ${params.ticketId}`);
  console.log(`📧 Admin:       ${internalSent ? "✅ DELIVERED" : "❌ FAILED"}`);
  console.log(`📧 Customer:    ${customerSent ? "✅ DELIVERED" : "❌ FAILED"}`);
  if (errors.length > 0) {
    console.log(`⚠️  Errors:      ${errors.join(" | ")}`);
  }
  console.log("═══════════════════════════════════════════════════════════════\n");

  return {
    success: internalSent || customerSent,
    internalSent,
    customerSent,
    error: errors.length > 0 ? errors.join(" | ") : undefined,
  };
}

/**
 * Dispatch Admin Reply Email to Customer via Resend
 */
export async function sendAdminReplyEmail(params: AdminReplyEmailParams): Promise<boolean> {
  const resend = getResendClient();
  const fromEmail = getFromEmail();

  if (!resend) {
    console.error("[sendAdminReplyEmail] RESEND_API_KEY not configured");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: `${params.adminName} (Dragon Studios Support) <${fromEmail}>`,
      to: [params.customerEmail.trim()],
      replyTo: getOwnerEmail(),
      subject: `RE: Update on Ticket [${params.ticketId}]`,
      html: renderAdminReplyEmailHtml(params),
    });

    if (result.data?.id) {
      console.log(`✅ Admin reply email sent — Resend ID: ${result.data.id}`);
      return true;
    } else if (result.error) {
      console.error(`❌ Admin reply email failed: ${result.error.name} — ${result.error.message}`);
      return false;
    }

    return false;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Admin Reply Email Exception: ${errMsg}`);
    return false;
  }
}

export { renderInternalEmailHtml, renderCustomerEmailHtml, renderAdminReplyEmailHtml } from "./templates";
