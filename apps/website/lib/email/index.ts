import nodemailer from "nodemailer";
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
 * Enterprise Email Dispatcher Service
 */
export async function sendEnterpriseEmail(params: TicketEmailParams): Promise<{
  success: boolean;
  internalSent: boolean;
  customerSent: boolean;
  error?: string;
}> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const studioEmail = getStudioEmail();
  const senderEmail = getSenderEmail();

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP credentials not fully configured in process.env. Email dispatch bypassed silently.");
    return {
      success: false,
      internalSent: false,
      customerSent: false,
      error: "SMTP credentials unconfigured",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Dispatch Internal Studio Notification Email
    let internalSent = false;
    try {
      await transporter.sendMail({
        from: `"Dragon Studios Operations" <${senderEmail}>`,
        to: studioEmail,
        replyTo: params.email.trim(),
        subject: `[${params.ticketId}] ${params.category || "General"} | ${params.subject.trim()}`,
        html: renderInternalEmailHtml(params),
      });
      internalSent = true;
    } catch (err) {
      console.error("Internal Email Dispatch Error:", err);
    }

    // 2. Dispatch Customer Confirmation Email
    let customerSent = false;
    try {
      await transporter.sendMail({
        from: `"Dragon Studios Command" <${senderEmail}>`,
        to: params.email.trim(),
        replyTo: studioEmail,
        subject: `Dragon Studios — Support Request Received [${params.ticketId}]`,
        html: renderCustomerEmailHtml(params),
      });
      customerSent = true;
    } catch (err) {
      console.error("Customer Email Dispatch Error:", err);
    }

    return {
      success: internalSent || customerSent,
      internalSent,
      customerSent,
    };
  } catch (error: any) {
    console.error("Nodemailer Transporter Error:", error);
    return {
      success: false,
      internalSent: false,
      customerSent: false,
      error: error.message,
    };
  }
}

/**
 * Dispatch Admin Reply Email to Customer
 */
export async function sendAdminReplyEmail(params: AdminReplyEmailParams): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const studioEmail = getStudioEmail();
  const senderEmail = getSenderEmail();

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP unconfigured for Admin Reply Email.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"${params.adminName} (Dragon Studios Support)" <${senderEmail}>`,
      to: params.customerEmail.trim(),
      replyTo: studioEmail,
      subject: `RE: Update on Ticket [${params.ticketId}]`,
      html: renderAdminReplyEmailHtml(params),
    });

    return true;
  } catch (err) {
    console.error("Admin Reply Email Dispatch Error:", err);
    return false;
  }
}

export { renderInternalEmailHtml, renderCustomerEmailHtml, renderAdminReplyEmailHtml } from "./templates";
