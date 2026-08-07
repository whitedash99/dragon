import { siteConfig } from "@/lib/site";
import { getSenderEmail, getStudioEmail } from "./templates";
import nodemailer from "nodemailer";

export interface SendVerificationEmailParams {
  name: string;
  email: string;
  subject: string;
  token: string;
  verifyUrl: string;
}

/**
 * Renders HTML template for Email Verification
 */
export function renderVerificationEmailHtml(params: SendVerificationEmailParams): string {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Email Ownership — Dragon Studios</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #030304;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: #f43f5e; text-decoration: none; }
    .btn:hover { background-color: #e11d48 !important; border-color: #f43f5e !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #030304; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030304; padding: 40px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0a0a0f; border: 1px solid #1e1e2d; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="padding: 28px 36px; background: linear-gradient(180deg, #120d14 0%, #0a0a0f 100%); border-bottom: 1px solid #1e1e2d; text-align: center;">
              <span style="font-size: 20px; font-weight: 900; letter-spacing: 3px; color: #ffffff; text-transform: uppercase;">DRAGON <span style="color: #f43f5e;">STUDIOS</span></span>
              <span style="display: block; font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #64748b; margin-top: 4px; text-transform: uppercase;">EMAIL OWNERSHIP VERIFICATION</span>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
                CONFIRM YOUR TRANSMISSION
              </h1>
              
              <p style="margin: 16px 0 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Hello <strong style="color: #ffffff;">${params.name}</strong>, we received a contact dispatch request for subject <strong style="color: #ffffff;">&quot;${params.subject}&quot;</strong>.
              </p>

              <p style="margin: 12px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                To protect against unauthorized ticket creation, please confirm your email ownership by clicking the button below. Once verified, your inquiry will be assigned a Ticket ID and processed immediately by our command center.
              </p>

              <!-- VERIFY ACTION BUTTON -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="${params.verifyUrl}" class="btn" style="display: inline-block; padding: 16px 36px; background-color: #f43f5e; color: #ffffff; font-size: 13px; font-weight: 900; letter-spacing: 1.5px; uppercase text-decoration: none; border-radius: 8px; box-shadow: 0 4px 20px rgba(244,63,94,0.4); border: 1px solid #fb7185;">
                  VERIFY EMAIL & CREATE TICKET
                </a>
              </div>

              <!-- SECURITY NOTICE -->
              <div style="margin-top: 28px; padding: 16px; background-color: #12121c; border: 1px solid #1e1e2d; border-radius: 10px; font-size: 11px; color: #64748b; line-height: 1.5;">
                <strong style="color: #fbbf24; font-family: monospace; uppercase">SECURITY SPECIFICATION:</strong>
                <ul style="margin: 6px 0 0 0; padding-left: 16px; color: #94a3b8;">
                  <li>This verification link is valid for <strong>24 hours</strong>.</li>
                  <li>This link may only be used once.</li>
                  <li>If you did not initiate this request, no ticket will be created.</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 11px; color: #475569; word-break: break-all;">
                If the button above does not work, copy and paste this link into your browser:<br>
                <a href="${params.verifyUrl}" style="color: #f43f5e;">${params.verifyUrl}</a>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 24px 36px; background-color: #060609; border-top: 1px solid #181824; text-align: center; font-size: 11px; color: #64748b;">
              <p style="margin: 0;">© ${currentYear} ${siteConfig.name}. Enterprise Communication Gateway.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Dispatcher for Verification Email
 */
export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP credentials not configured for verification email.");
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
      from: `"Dragon Studios Security" <${getSenderEmail()}>`,
      to: params.email.trim(),
      replyTo: getStudioEmail(),
      subject: `Verify Email Ownership — [Dragon Studios]`,
      html: renderVerificationEmailHtml(params),
    });

    return true;
  } catch (err) {
    console.error("Verification Email Send Error:", err);
    return false;
  }
}
