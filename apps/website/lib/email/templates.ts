import { siteConfig } from "@/lib/site";

export interface TicketEmailParams {
  ticketId: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  category: string;
  subject: string;
  message: string;
  priority: string;
  clientIp?: string;
  clientCountry?: string;
  browser?: string;
  status?: string;
  slaTarget?: string;
  queueName?: string;
  attachments?: string[];
  createdAt?: string | Date;
}

export interface AdminReplyEmailParams {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  adminName: string;
  replyMessage: string;
  status: string;
}

/**
 * Returns configured studio support email from env or siteConfig fallback
 */
export function getStudioEmail(): string {
  return process.env.CONTACT_EMAIL || siteConfig.email || "dragonstudiosofficial01@gmail.com";
}

/**
 * Returns configured sender address from env or siteConfig fallback
 */
export function getSenderEmail(): string {
  return process.env.SMTP_USER || getStudioEmail();
}

/**
 * Enterprise Base Layout Wrapper (Stripe / OpenAI / Apple / Rockstar quality)
 */
function wrapEnterpriseEmail(title: string, bodyContent: string): string {
  const currentYear = new Date().getFullYear();
  const studioName = siteConfig.name;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: dark;
      supported-color-schemes: dark;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #030304 !important;
      color: #e2e8f0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    a { color: #f43f5e; text-decoration: none; }
    .btn-primary:hover { background-color: #e11d48 !important; border-color: #f43f5e !important; }
    .btn-secondary:hover { background-color: #1e293b !important; border-color: #475569 !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #030304; color: #e2e8f0;">
  <!-- Outer Table -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030304; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" max-width="640" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; background-color: #0a0a0f; border: 1px solid #1e1e2d; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7);">
          
          <!-- ═══ ENTERPRISE BRAND HEADER ═══ -->
          <tr>
            <td style="padding: 28px 36px; background: linear-gradient(180deg, #120d14 0%, #0a0a0f 100%); border-bottom: 1px solid #1e1e2d;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #e11d48, #9f1239); border-radius: 8px; width: 34px; height: 34px; text-align: center; vertical-align: middle; font-weight: 900; font-size: 14px; color: #ffffff; letter-spacing: -0.5px;">
                          DS
                        </td>
                        <td style="padding-left: 12px;">
                          <span style="font-size: 16px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; display: block; line-height: 1;">${studioName}</span>
                          <span style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #f43f5e; text-transform: uppercase; display: block; margin-top: 4px;">ENTERPRISE SUPPORT DESK</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; font-family: monospace; letter-spacing: 1px; color: #64748b; background-color: #161622; border: 1px solid #27273a; padding: 4px 10px; border-radius: 20px;">
                      OFFICIAL DISPATCH
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          ${bodyContent}

          <!-- ═══ ENTERPRISE FOOTER ═══ -->
          <tr>
            <td style="padding: 28px 36px; background-color: #060609; border-top: 1px solid #181824; text-align: center;">
              <p style="margin: 0; font-size: 12px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px;">
                ${studioName} Inc. • Digital Frontier Command Center
              </p>
              <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Confidential Automated Dispatch • Powered by Dragon Engine Architecture
              </p>
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="${siteConfig.url}/privacy" style="font-size: 11px; color: #64748b; text-decoration: underline;">Privacy Policy</a>
                  </td>
                  <td style="color: #334155; font-size: 11px;">•</td>
                  <td style="padding: 0 8px;">
                    <a href="${siteConfig.url}/terms" style="font-size: 11px; color: #64748b; text-decoration: underline;">Terms of Service</a>
                  </td>
                  <td style="color: #334155; font-size: 11px;">•</td>
                  <td style="padding: 0 8px;">
                    <a href="${siteConfig.url}/contact" style="font-size: 11px; color: #64748b; text-decoration: underline;">Support Center</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 14px 0 0 0; font-size: 10px; font-family: monospace; color: #475569;">
                © ${currentYear} ${studioName}. All rights reserved.
              </p>
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
 * Render Status Timeline Indicator Bar
 */
function renderTimelineHtml(status: string = "OPEN"): string {
  const steps = [
    { label: "RECEIVED", active: true },
    { label: "IN PROGRESS", active: status === "IN_PROGRESS" || status === "RESOLVED" || status === "CLOSED" },
    { label: "RESOLVED", active: status === "RESOLVED" || status === "CLOSED" },
  ];

  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 16px;">
    <tr>
      ${steps
        .map(
          (step) => `
        <td width="33%" align="center" style="vertical-align: top;">
          <div style="height: 4px; background-color: ${step.active ? "#f43f5e" : "#1e1e2e"}; border-radius: 2px; margin-bottom: 8px;"></div>
          <span style="font-size: 9px; font-weight: 800; font-family: monospace; letter-spacing: 0.5px; color: ${
            step.active ? "#f43f5e" : "#475569"
          }; text-transform: uppercase; display: block;">
            ${step.label}
          </span>
        </td>
      `
        )
        .join("")}
    </tr>
  </table>`;
}

/**
 * 1. Render Internal Operations Dispatch Email (For Studio Team)
 */
export function renderInternalEmailHtml(data: TicketEmailParams): string {
  const safeMessage = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  const priorityColor = data.priority === "HIGH" || data.priority === "CRITICAL" ? "#ef4444" : "#e2e8f0";
  const slaTarget = data.slaTarget || (data.priority === "HIGH" ? "< 4 Hours" : "< 24 Hours");
  const queueName = data.queueName || data.category || "General Operations";
  const replySubject = encodeURIComponent(`RE: [${data.ticketId}] ${data.subject}`);

  const bodyContent = `
    <!-- STATUS & METADATA STRIP -->
    <tr>
      <td style="padding: 24px 36px; background-color: #12121c; border-bottom: 1px solid #1e1e2d;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="25%">
              <span style="display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">TICKET ID</span>
              <span style="font-size: 13px; font-weight: 900; font-family: monospace; color: #f43f5e;">${data.ticketId}</span>
            </td>
            <td width="25%">
              <span style="display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">PRIORITY</span>
              <span style="font-size: 12px; font-weight: 900; color: ${priorityColor};">${data.priority}</span>
            </td>
            <td width="25%">
              <span style="display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">TARGET SLA</span>
              <span style="font-size: 12px; font-weight: 800; color: #fbbf24; font-family: monospace;">${slaTarget}</span>
            </td>
            <td width="25%" align="right">
              <span style="display: block; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">QUEUE</span>
              <span style="font-size: 12px; font-weight: 800; color: #38bdf8;">${queueName}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SENDER & DEVICE METADATA CARD -->
    <tr>
      <td style="padding: 28px 36px 16px 36px;">
        <span style="font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: #f43f5e; text-transform: uppercase; display: block; margin-bottom: 12px;">
          INBOUND SENDER SPECIFICATIONS
        </span>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: separate; border-spacing: 0 8px;">
          <tr>
            <td width="32%" style="font-size: 12px; color: #64748b; font-weight: 600;">Customer Name</td>
            <td width="68%" style="font-size: 13px; color: #ffffff; font-weight: 700;">${data.name}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; font-weight: 600;">Direct Email</td>
            <td style="font-size: 13px; color: #f43f5e; font-weight: 700; font-family: monospace;">
              <a href="mailto:${data.email}" style="color: #f43f5e; text-decoration: none;">${data.email}</a>
            </td>
          </tr>
          ${data.company ? `
          <tr>
            <td style="font-size: 12px; color: #64748b; font-weight: 600;">Organization</td>
            <td style="font-size: 13px; color: #ffffff; font-weight: 600;">${data.company}</td>
          </tr>
          ` : ""}
          ${data.phone ? `
          <tr>
            <td style="font-size: 12px; color: #64748b; font-weight: 600;">Phone Line</td>
            <td style="font-size: 13px; color: #ffffff; font-weight: 600;">${data.phone}</td>
          </tr>
          ` : ""}
          <tr>
            <td style="font-size: 12px; color: #64748b; font-weight: 600;">Subject Line</td>
            <td style="font-size: 13px; color: #ffffff; font-weight: 700;">${data.subject}</td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #64748b; font-weight: 600;">Geo IP & Location</td>
            <td style="font-size: 12px; color: #94a3b8; font-family: monospace;">${data.clientCountry || "Global"} (${data.clientIp || "127.0.0.1"})</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- MESSAGE CONTENT BOX -->
    <tr>
      <td style="padding: 16px 36px 28px 36px;">
        <span style="font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: #f43f5e; text-transform: uppercase; display: block; margin-bottom: 12px;">
          TRANSMISSION BODY
        </span>
        <div style="padding: 20px; background-color: #050508; border: 1px solid #1e1e2d; border-radius: 12px; font-size: 13px; line-height: 1.7; color: #cbd5e1; font-family: monospace;">
          ${safeMessage}
        </div>
      </td>
    </tr>

    <!-- ACTION BUTTONS BAR -->
    <tr>
      <td style="padding: 0 36px 32px 36px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="48%">
              <a href="mailto:${data.email}?subject=${replySubject}" class="btn-primary" style="display: block; text-align: center; padding: 14px 20px; background-color: #f43f5e; color: #ffffff; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(244,63,94,0.3);">
                REPLY DIRECTLY VIA EMAIL
              </a>
            </td>
            <td width="4%"></td>
            <td width="48%">
              <a href="${siteConfig.url}/admin/tickets" class="btn-secondary" style="display: block; text-align: center; padding: 14px 20px; background-color: #141420; color: #ffffff; border: 1px solid #28283d; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 8px;">
                OPEN CRM DASHBOARD
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return wrapEnterpriseEmail(`[${data.ticketId}] New Ticket - ${data.subject}`, bodyContent);
}

/**
 * 2. Render Customer Confirmation Email (For Inbound Senders)
 */
export function renderCustomerEmailHtml(data: TicketEmailParams): string {
  const studioEmail = getStudioEmail();
  const timelineHtml = renderTimelineHtml(data.status || "OPEN");

  const bodyContent = `
    <!-- MAIN GREETING -->
    <tr>
      <td style="padding: 36px 36px 20px 36px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
          SUPPORT REQUEST RECEIVED
        </h1>
        <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
          Hello <strong style="color: #ffffff;">${data.name}</strong>, thank you for contacting <strong style="color: #ffffff;">${siteConfig.name}</strong>. Your support ticket has been created under reference <strong style="color: #f43f5e; font-family: monospace;">[${data.ticketId}]</strong>.
        </p>

        <!-- STATUS TIMELINE -->
        <div style="margin-top: 24px; padding: 20px; background-color: #0e0e17; border: 1px solid #1e1e2d; border-radius: 12px;">
          <span style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block;">STATUS TRACKING</span>
          ${timelineHtml}
        </div>
      </td>
    </tr>

    <!-- RECEIPT SPECIFICATION CARD -->
    <tr>
      <td style="padding: 0 36px 24px 36px;">
        <div style="padding: 20px; background-color: #12121c; border: 1px solid #1e1e2d; border-radius: 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: separate; border-spacing: 0 10px;">
            <tr>
              <td width="38%" style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Ticket Reference</td>
              <td width="62%" style="font-size: 13px; font-weight: 900; color: #f43f5e; font-family: monospace;">${data.ticketId}</td>
            </tr>
            <tr>
              <td style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Category</td>
              <td style="font-size: 13px; font-weight: 700; color: #ffffff;">${data.category}</td>
            </tr>
            <tr>
              <td style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Subject</td>
              <td style="font-size: 13px; font-weight: 600; color: #cbd5e1;">${data.subject}</td>
            </tr>
            <tr>
              <td style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Estimated Response</td>
              <td style="font-size: 12px; font-weight: 800; color: #34d399; font-family: monospace;">Within 24 business hours</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- CUSTOMER ACTIONS BAR -->
    <tr>
      <td style="padding: 0 36px 32px 36px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="48%">
              <a href="mailto:${studioEmail}?subject=RE:%20[${data.ticketId}]" class="btn-primary" style="display: block; text-align: center; padding: 14px 20px; background-color: #f43f5e; color: #ffffff; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(244,63,94,0.3);">
                REPLY TO TICKET
              </a>
            </td>
            <td width="4%"></td>
            <td width="48%">
              <a href="${siteConfig.url}/contact" class="btn-secondary" style="display: block; text-align: center; padding: 14px 20px; background-color: #141420; color: #ffffff; border: 1px solid #28283d; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 8px;">
                VISIT SUPPORT CENTER
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return wrapEnterpriseEmail(`Support Request Received [${data.ticketId}]`, bodyContent);
}

/**
 * 3. Render Admin Response Email (Dispatched to Customer when Admin Replies in CRM)
 */
export function renderAdminReplyEmailHtml(params: AdminReplyEmailParams): string {
  const safeReply = params.replyMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  const studioEmail = getStudioEmail();

  const bodyContent = `
    <!-- MAIN RESPONSE HEADER -->
    <tr>
      <td style="padding: 36px 36px 20px 36px;">
        <span style="font-size: 11px; font-weight: 900; letter-spacing: 1.5px; color: #f43f5e; text-transform: uppercase; display: block; margin-bottom: 8px;">
          NEW UPDATE ON TICKET [${params.ticketId}]
        </span>
        <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
          RE: ${params.subject}
        </h1>
        <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
          Hello <strong style="color: #ffffff;">${params.customerName}</strong>, our support team representative <strong style="color: #ffffff;">${params.adminName}</strong> has posted an update to your ticket.
        </p>
      </td>
    </tr>

    <!-- ADMIN REPLY CONTENT BOX -->
    <tr>
      <td style="padding: 0 36px 28px 36px;">
        <div style="padding: 22px; background-color: #0c121e; border: 1px solid #1e293b; border-left: 4px solid #f43f5e; border-radius: 12px; font-size: 14px; line-height: 1.7; color: #f8fafc;">
          ${safeReply}
        </div>
      </td>
    </tr>

    <!-- ACTIONS BAR -->
    <tr>
      <td style="padding: 0 36px 32px 36px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td width="100%">
              <a href="mailto:${studioEmail}?subject=RE:%20[${params.ticketId}]" class="btn-primary" style="display: block; text-align: center; padding: 14px 20px; background-color: #f43f5e; color: #ffffff; font-size: 12px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 15px rgba(244,63,94,0.3);">
                REPLY TO THIS UPDATE
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  return wrapEnterpriseEmail(`Update on Ticket [${params.ticketId}]`, bodyContent);
}
