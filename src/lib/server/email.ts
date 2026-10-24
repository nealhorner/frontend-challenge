import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

// Lazy singleton — defers instantiation (and reading the key) to first use so
// the module is safe to import during build analysis when the key is empty.
// Optional at build time; runtime errors are handled by the callers.
let _resend: Resend | undefined;
const getResend = () => (_resend ??= new Resend(env.RESEND_API_KEY ?? ''));

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
  const { error } = await getResend().emails.send({
    from: env.EMAIL_FROM ?? '',
    to,
    subject,
    html
  });
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
