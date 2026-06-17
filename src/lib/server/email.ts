import { Resend } from 'resend';

// Optional at build time — runtime errors are handled by the callers.
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const EMAIL_FROM = process.env.EMAIL_FROM ?? '';

// Lazy singleton — defers instantiation to first call so the module is safe
// to import during build analysis when RESEND_API_KEY may be empty.
let _resend: Resend | undefined;
const getResend = () => (_resend ??= new Resend(RESEND_API_KEY));

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { error } = await getResend().emails.send({ from: EMAIL_FROM, to, subject, html });
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
