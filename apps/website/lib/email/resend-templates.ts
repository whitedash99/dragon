export interface TicketEmailPayload {
  ticketId: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  category: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  estimatedResponse?: string | null;
  trackingUrl: string;
  clientIp?: string | null;
  clientCountry?: string | null;
  browser?: string | null;
  os?: string | null;
  createdAt: string | Date;
}

/**
 * Render Customer Confirmation HTML Email (Responsive Dark Theme Game Studio Styling)
 */
export function renderCustomerResendEmail(data: TicketEmailPayload): string {
  const year = new Date().getFullYear();

  const priorityColor =
    data.priority === "CRITICAL" || data.priority === "EMERGENCY"
      ? "#ef4444"
      : data.priority === "HIGH"
      ? "#f97316"
      : "#3b82f6";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dragon Studios Support Ticket Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070709; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #0e0e12; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 40px; background: linear-gradient(135deg, #1b0c09 0%, #0e0e12 100%); border-bottom: 1px solid rgba(223, 80, 51, 0.2); text-align: center;">
              <div style="font-size: 24px; font-weight: 800; tracking: 0.1em; color: #ffffff; text-transform: uppercase;">
                🐉 DRAGON <span style="color: #df5033;">STUDIOS</span>
              </div>
              <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px;">
                Enterprise Player Support & LiveOps Command
              </div>
            </td>
          </tr>

          <!-- HERO BANNER -->
          <tr>
            <td style="padding: 32px 40px 16px 40px;">
              <h1 style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0;">
                Support Request Received
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #9ca3af; margin: 0;">
                Hello <strong style="color: #ffffff;">${escapeHtml(data.name)}</strong>,<br>
                Thank you for contacting Dragon Studios. Your support ticket has been registered in our database and routed to our dedicated engineering and LiveOps team.
              </p>
            </td>
          </tr>

          <!-- TICKET SUMMARY CARD -->
          <tr>
            <td style="padding: 16px 40px;">
              <div style="background-color: #14141b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Ticket Identifier</span><br>
                      <span style="font-size: 18px; font-weight: 800; color: #df5033; font-family: monospace;">${escapeHtml(data.ticketId)}</span>
                    </td>
                    <td style="padding-bottom: 12px;" align="right">
                      <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Priority</span><br>
                      <span style="font-size: 12px; font-weight: 700; color: ${priorityColor}; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; border: 1px solid ${priorityColor}40;">
                        ${escapeHtml(data.priority)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                      <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Category</span><br>
                      <span style="font-size: 14px; color: #e5e7eb; font-weight: 600;">${escapeHtml(data.category)}</span>
                    </td>
                    <td style="padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.05);" align="right">
                      <span style="font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Estimated Response</span><br>
                      <span style="font-size: 14px; color: #10b981; font-weight: 600;">${escapeHtml(data.estimatedResponse || "Within 24 Hours")}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- MESSAGE CONTENT SNIPPET -->
          <tr>
            <td style="padding: 16px 40px;">
              <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-bottom: 8px;">Submitted Subject & Inquiry</div>
              <div style="background-color: #14141b; border-left: 3px solid #df5033; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; color: #d1d5db;">
                <strong style="color: #ffffff; display: block; margin-bottom: 6px;">${escapeHtml(data.subject)}</strong>
                ${escapeHtml(data.message)}
              </div>
            </td>
          </tr>

          <!-- ACTION BUTTON -->
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <a href="${data.trackingUrl}" target="_blank" style="display: inline-block; background-color: #df5033; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 15px rgba(223, 80, 51, 0.4); text-transform: uppercase; letter-spacing: 1px;">
                Track Ticket Status & Reply &rarr;
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 32px 40px; background-color: #09090d; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">
                Need to add more context? Reply directly to this email or update your ticket via the tracking portal.
              </p>
              <p style="font-size: 11px; color: #4b5563; margin: 0;">
                &copy; ${year} Dragon Studios Interactive Inc. All rights reserved. Built with Neon PostgreSQL & Resend.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Render Admin Internal Notification HTML Email
 */
export function renderAdminResendEmail(data: TicketEmailPayload): string {
  const year = new Date().getFullYear();
  const adminDashboardUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin.dragonstudios.com";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEW SUPPORT TICKET DISPATCHED</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070709; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 640px; background-color: #0e0e12; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- ADMIN HEADER -->
          <tr>
            <td style="padding: 24px 40px; background: linear-gradient(135deg, #2b0b06 0%, #0e0e12 100%); border-bottom: 1px solid rgba(239, 68, 68, 0.3);">
              <div style="font-size: 12px; font-weight: 800; color: #ef4444; text-transform: uppercase; letter-spacing: 2px;">
                🚨 INTERNAL ALERT — INBOUND SUPPORT TICKET
              </div>
              <div style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                Ticket ${escapeHtml(data.ticketId)}
              </div>
            </td>
          </tr>

          <!-- DETAILS GRID -->
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af; width: 130px;"><strong>Customer:</strong></td>
                  <td style="padding: 6px 0; color: #ffffff;">${escapeHtml(data.name)} &lt;${escapeHtml(data.email)}&gt;</td>
                </tr>
                ${data.company ? `<tr><td style="padding: 6px 0; color: #9ca3af;"><strong>Company:</strong></td><td style="padding: 6px 0; color: #ffffff;">${escapeHtml(data.company)}</td></tr>` : ""}
                ${data.phone ? `<tr><td style="padding: 6px 0; color: #9ca3af;"><strong>Phone:</strong></td><td style="padding: 6px 0; color: #ffffff;">${escapeHtml(data.phone)}</td></tr>` : ""}
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;"><strong>Category:</strong></td>
                  <td style="padding: 6px 0; color: #38bdf8; font-weight: 600;">${escapeHtml(data.category)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;"><strong>Priority:</strong></td>
                  <td style="padding: 6px 0; color: #f97316; font-weight: 700;">${escapeHtml(data.priority)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;"><strong>Client IP & Location:</strong></td>
                  <td style="padding: 6px 0; color: #d1d5db;">${escapeHtml(data.clientIp || "127.0.0.1")} (${escapeHtml(data.clientCountry || "Global")})</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;"><strong>Device Environment:</strong></td>
                  <td style="padding: 6px 0; color: #d1d5db;">${escapeHtml(data.browser || "Web")} on ${escapeHtml(data.os || "OS")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #9ca3af;"><strong>Created Time:</strong></td>
                  <td style="padding: 6px 0; color: #d1d5db;">${new Date(data.createdAt).toUTCString()}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PAYLOAD BLOCK -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <div style="background-color: #14141b; border: 1px solid rgba(255, 255, 255, 0.08); padding: 16px; border-radius: 8px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; margin-bottom: 6px;">Subject</div>
                <div style="font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">${escapeHtml(data.subject)}</div>
                <div style="font-size: 11px; text-transform: uppercase; color: #6b7280; margin-bottom: 6px;">Message Body</div>
                <div style="font-size: 13px; line-height: 1.6; color: #d1d5db; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
              </div>
            </td>
          </tr>

          <!-- OPEN DASHBOARD BUTTON -->
          <tr>
            <td style="padding: 0 40px 32px 40px; text-align: center;">
              <a href="${adminDashboardUrl}/crm" target="_blank" style="display: inline-block; background-color: #df5033; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
                Open Ticket in Admin Dashboard &rarr;
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 40px; background-color: #09090d; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; font-size: 11px; color: #4b5563;">
              Dragon Studios Enterprise Operations Center &bull; Automated Dispatch
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
