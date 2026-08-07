import type { ContactReplyPayload } from '@dragon/types';

export function buildContactReplyHtml(payload: ContactReplyPayload): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; }
          .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
          .header { font-size: 20px; font-weight: bold; color: #38bdf8; margin-bottom: 16px; }
          .body { font-size: 16px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 16px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Dragon Studios Support Response</div>
          <div class="body">${payload.message}</div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Dragon Studios. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendContactReplyEmail(payload: ContactReplyPayload): Promise<{ success: boolean; messageId?: string }> {
  console.log(`[Email Service] Sending reply to ${payload.toEmail} for contact ${payload.contactId}`);
  const html = buildContactReplyHtml(payload);
  // In production, nodemailer or resend handles the dispatch using process.env
  return { success: true, messageId: `msg_${Date.now()}` };
}
