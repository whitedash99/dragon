import type { ContactReplyPayload } from '@dragon/types';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  type?: string;
  template?: string;
  ticketId?: string;
}

export function buildContactReplyHtml(payload: ContactReplyPayload): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #050508; color: #f8fafc; padding: 32px; }
          .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 32px; border: 1px solid #1e293b; }
          .logo { font-size: 20px; font-weight: 900; color: #ff1e4b; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
          .header { font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 16px; }
          .body { font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; margin-bottom: 24px; }
          .footer { font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 16px; text-align: center; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">DRAGON STUDIOS</div>
          <div class="header">Support Ticket Response</div>
          <div class="body">${payload.message}</div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Dragon Studios Enterprise Mail Platform. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export function buildOwnerContactAlertHtml(contact: {
  ticketNumber: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  ipAddress?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #030305; color: #ffffff; padding: 32px; }
          .card { max-width: 640px; margin: 0 auto; background: #0f172a; border-radius: 20px; padding: 32px; border: 1px solid #334155; }
          .badge { display: inline-block; background: #ff1e4b; color: #ffffff; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; }
          .title { font-size: 24px; font-weight: 900; margin-top: 16px; margin-bottom: 8px; }
          .field { font-size: 12px; font-family: monospace; color: #94a3b8; margin-bottom: 4px; }
          .val { font-size: 14px; color: #ffffff; font-weight: 700; margin-bottom: 16px; }
          .msg-box { background: #020617; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-top: 16px; }
          .btn { display: inline-block; background: #ff1e4b; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 12px; padding: 12px 24px; border-radius: 12px; text-transform: uppercase; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">HIGH PRIORITY CONTACT INBOUND</span>
          <div class="title">New Customer Inbound Inquiry</div>
          
          <div class="field">TICKET NUMBER</div>
          <div class="val">${contact.ticketNumber}</div>

          <div class="field">SENDER NAME & EMAIL</div>
          <div class="val">${contact.name} (${contact.email})</div>

          <div class="field">SUBJECT</div>
          <div class="val">${contact.subject}</div>

          <div class="field">MESSAGE CONTENT</div>
          <div class="msg-box">${contact.message}</div>

          <a href="http://localhost:4000/crm" class="btn">Open Ticket in Admin OS</a>
        </div>
      </body>
    </html>
  `;
}

export function buildCustomerContactConfirmationHtml(name: string, ticketNumber: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #030305; color: #ffffff; padding: 32px; }
          .card { max-width: 600px; margin: 0 auto; background: #090d16; border-radius: 20px; padding: 32px; border: 1px solid #1e293b; }
          .logo { font-size: 20px; font-weight: 900; color: #ff1e4b; letter-spacing: 2px; }
          .header { font-size: 22px; font-weight: 800; margin-top: 16px; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
          .ticket-box { background: #020617; border: 1px solid #ff1e4b/40; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 13px; color: #38bdf8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">DRAGON STUDIOS</div>
          <div class="header">We Received Your Message, ${name}!</div>
          <div class="text">Thank you for reaching out to Dragon Studios Enterprise Support. Our team has received your message and generated a support ticket.</div>
          <div class="ticket-box">TRACKING TICKET: ${ticketNumber}</div>
          <div class="text" style="margin-top:20px; font-size:12px;">Estimated Response Time: Within 2 to 4 business hours.</div>
        </div>
      </body>
    </html>
  `;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string; forwardedToOwner?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const rawFrom = process.env.EMAIL_FROM?.trim() || process.env.DEFAULT_FROM_EMAIL?.trim() || "onboarding@resend.dev";
  const fromAddress = rawFrom.includes("<") ? rawFrom : `Dragon Studios <${rawFrom}>`;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || "dragonstudiosofficial01@gmail.com";

  if (!apiKey || apiKey.includes("placeholder")) {
    console.error("[@dragon/email] RESEND_API_KEY is unconfigured or missing");
    return { success: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from || fromAddress,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    const data = await res.json();
    if (res.ok && data.id) {
      console.log(`✅ [@dragon/email] Email sent via Resend — ID: ${data.id} | To: ${payload.to}`);
      return { success: true, messageId: data.id };
    } else {
      const errMsg = data.message || data.name || JSON.stringify(data);
      console.warn(`⚠️ [@dragon/email] Primary delivery note: ${errMsg}`);

      // Handle Resend unverified testing domain restriction by forwarding to owner email
      if (
        (res.status === 403 || String(errMsg).includes("testing emails to your own email address")) &&
        payload.to.toLowerCase().trim() !== ownerEmail.toLowerCase().trim()
      ) {
        console.log(`📡 [@dragon/email] Forwarding delivery for ${payload.to} to registered Resend owner ${ownerEmail}...`);
        const fallbackRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: payload.from || fromAddress,
            to: [ownerEmail],
            subject: `[DISPATCH FOR ${payload.to}] ${payload.subject}`,
            html: `
              <div style="background:#02040A; color:#ffffff; font-family:sans-serif; padding:24px; border-radius:16px; border:1px solid rgba(0,229,255,0.4);">
                <div style="font-size:11px; font-family:monospace; color:#00E5FF; margin-bottom:12px;">
                  ⚠️ DISPATCH DESTINATION: ${payload.to}
                </div>
                ${payload.html}
              </div>
            `,
          }),
        });

        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.id) {
          console.log(`✅ [@dragon/email] Successfully delivered dispatch to owner address: ${ownerEmail} (ID: ${fallbackData.id})`);
          return { success: true, messageId: fallbackData.id, forwardedToOwner: true };
        }
      }

      return { success: false, error: errMsg };
    }
  } catch (e: any) {
    console.error("[@dragon/email] Exception sending email:", e);
    return { success: false, error: e?.message || String(e) };
  }
}

export async function sendOwnerNotificationEmail(subject: string, details: string) {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL?.trim() || process.env.CONTACT_EMAIL?.trim() || "dragonstudiosofficial01@gmail.com";
  const html = `
    <div style="background:#050508; color:#fff; font-family:sans-serif; padding:32px; border-radius:16px;">
      <h2 style="color:#ff1e4b;">🚨 Executive Notification</h2>
      <h3>${subject}</h3>
      <p style="color:#cbd5e1; font-size:14px; line-height:1.6;">${details}</p>
      <p style="color:#64748b; font-size:11px; margin-top:24px;">Dragon Studios Enterprise Mail Platform</p>
    </div>
  `;
  return sendEmail({ to: ownerEmail, subject: `[EXECUTIVE ALERT] ${subject}`, html, type: "OWNER_ALERT" });
}

export async function sendContactReplyEmail(payload: ContactReplyPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = buildContactReplyHtml(payload);
  return sendEmail({ to: payload.toEmail, subject: "Support Response - Dragon Studios", html, type: "SUPPORT_REPLY" });
}

export async function sendNewDeviceAlertEmail(to: string, deviceDetails: { ip: string; browser: string; time: string }) {
  const html = `
    <div style="background:#050508; color:#fff; font-family:sans-serif; padding:32px; border-radius:16px;">
      <h2 style="color:#ff1e4b;">⚠️ New Device Login Detected</h2>
      <p>A new hardware device logged into your Dragon Studios Executive Account.</p>
      <ul>
        <li><b>IP Address:</b> ${deviceDetails.ip}</li>
        <li><b>Browser / User Agent:</b> ${deviceDetails.browser}</li>
        <li><b>Timestamp:</b> ${deviceDetails.time}</li>
      </ul>
      <p style="color:#94a3b8; font-size:12px;">If this was not you, please trigger Emergency Lockdown immediately in Admin OS Security Center.</p>
    </div>
  `;
  return sendEmail({ to, subject: "🚨 Security Alert: New Device Login to Dragon Studios", html, type: "SECURITY_ALERT" });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = `
    <div style="background:#050508; color:#fff; font-family:sans-serif; padding:32px; border-radius:16px;">
      <h2 style="color:#ff1e4b;">Password Reset Request</h2>
      <p>Click the button below to reset your Dragon Studios account password.</p>
      <a href="${resetUrl}" style="display:inline-block; background:#ff1e4b; color:#fff; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:bold; margin-top:16px;">Reset Credential Password</a>
    </div>
  `;
  return sendEmail({ to, subject: "Reset Password - Dragon Studios", html, type: "PASSWORD_RESET" });
}

export async function sendTeamInviteEmail(to: string, inviteUrl: string, role: string) {
  const html = `
    <div style="background:#050508; color:#fff; font-family:sans-serif; padding:32px; border-radius:16px;">
      <h2 style="color:#ff1e4b;">Dragon Admin OS Invitation</h2>
      <p>You have been invited to join Dragon Studios as <b>${role}</b>.</p>
      <a href="${inviteUrl}" style="display:inline-block; background:#ff1e4b; color:#fff; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:bold; margin-top:16px;">Accept Staff Invitation</a>
    </div>
  `;
  return sendEmail({ to, subject: "Invitation to join Dragon Studios", html, type: "TEAM_INVITATION" });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <div style="background:#050508; color:#fff; font-family:sans-serif; padding:32px; border-radius:16px;">
      <h2 style="color:#ff1e4b;">Welcome to Dragon Studios, ${name}!</h2>
      <p>Your executive staff account has been activated successfully.</p>
    </div>
  `;
  return sendEmail({ to, subject: "Welcome to Dragon Studios", html, type: "WELCOME" });
}

export function buildOtpEmailHtml(otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #02040A; color: #f8fafc; padding: 32px 16px; margin: 0; }
          .container { max-width: 540px; margin: 0 auto; background: #03091D; border-radius: 24px; padding: 40px 32px; border: 1px solid rgba(0, 229, 255, 0.35); box-shadow: 0 0 40px rgba(0, 229, 255, 0.15); text-align: center; }
          .logo { font-size: 20px; font-weight: 900; color: #00E5FF; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; font-family: monospace; }
          .header { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
          .subtext { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
          .otp-card { background: #02050E; border: 2px solid #00E5FF; border-radius: 16px; padding: 24px 16px; margin-bottom: 24px; box-shadow: 0 0 30px rgba(0, 229, 255, 0.25); }
          .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #00E5FF; font-family: monospace; margin: 0; }
          .notice { font-size: 12px; color: #64748b; font-family: monospace; line-height: 1.5; margin-bottom: 24px; }
          .footer { font-size: 11px; color: #475569; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; text-align: center; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">DRAGON GAMING STUDIOS</div>
          <div class="header">Your Verification Code</div>
          <div class="subtext">Use the 6-digit security code below to verify your Dragon ID and access the Dragon Command Center.</div>
          <div class="otp-card">
            <div class="otp-code">${otp}</div>
          </div>
          <div class="notice">
            ⏳ This verification code expires in <strong>10 minutes</strong>.<br>
            If you did not attempt to sign in, you can safely ignore this email.
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Dragon Gaming Studios. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendOtpVerificationEmail(to: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = buildOtpEmailHtml(otp);
  return sendEmail({
    to,
    subject: "Your Dragon Gaming Studios verification code",
    html,
    type: "OTP_VERIFICATION"
  });
}

