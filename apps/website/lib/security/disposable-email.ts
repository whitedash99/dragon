/**
 * Disposable & Suspicious Email Domain Security Shield
 */

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "trashmail.com",
  "dispostable.com",
  "yopmail.com",
  "sharklasers.com",
  "getnada.com",
  "crazymailing.com",
  "throwawaymail.com",
  "tempail.com",
  "fakeinbox.com",
  "mailnesia.com",
  "maildrop.cc",
  "boun.cr",
  "0815.ru",
  "10minutemail.net",
  "20mail.it",
  "33mail.com",
  "mytemp.email",
  "mohmal.com",
  "burnermail.io",
  "temp-mail.org",
  "dropmail.me",
  "inboxalias.com",
]);

export interface EmailSecurityResult {
  isValid: boolean;
  isDisposable: boolean;
  reason?: string;
}

export function validateEmailSecurity(email: string): EmailSecurityResult {
  if (!email || typeof email !== "string") {
    return { isValid: false, isDisposable: false, reason: "Email string required" };
  }

  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, isDisposable: false, reason: "Invalid email syntax format" };
  }

  const domain = clean.split("@")[1];
  if (!domain) {
    return { isValid: false, isDisposable: false, reason: "Invalid email domain" };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      isDisposable: true,
      reason: "Disposable or temporary email services are prohibited for enterprise security.",
    };
  }

  return { isValid: true, isDisposable: false };
}
