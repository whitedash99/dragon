import { Resend } from "resend";

/**
 * Resend Client — initialized lazily with trimmed API key
 * to prevent trailing whitespace from causing auth failures.
 */
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim() || "";
  return new Resend(apiKey);
}

// Export getter function
export { getResendClient };

// Export fallback object with getter properties for backwards compatibility
export const resend = {
  get emails() {
    return getResendClient().emails;
  },
  get batch() {
    return getResendClient().batch;
  },
  get domains() {
    return getResendClient().domains;
  },
  get apiKeys() {
    return getResendClient().apiKeys;
  },
  get audiences() {
    return getResendClient().audiences;
  },
  get contacts() {
    return getResendClient().contacts;
  },
};